import os
import json
import re
import httpx
from groq import Groq
from fastapi import APIRouter, UploadFile, File, Query
from app.core.config import settings
from app.services.rag_service import RAGService
from app.services.video_service import VideoService  
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, TranscriptsDisabled

import re
import httpx
import os
import subprocess
from groq import Groq
from app.core.config import settings
from youtube_transcript_api import YouTubeTranscriptApi

class VideoService:
    def __init__(self):
        print("--- [INFO] Khởi tạo Groq Client cho dịch vụ Speech-to-Text ---")
        self.groq_client = Groq(api_key=settings.GROQ_API_KEY)

    def get_video_id(self, url):
        video_id = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11}).*", url)
        return video_id.group(1) if video_id else None

    def download_audio(self, url: str) -> str:
        """Download audio từ YouTube bằng yt-dlp"""
        output_path = "/tmp/audio_%(id)s.mp3"
        cookies_path = "/app/cookies.txt"
        
        cmd = [
            "yt-dlp",
            "-x", "--audio-format", "mp3",
            "--audio-quality", "0",
            "-o", output_path,
        ]
        
        if os.path.exists(cookies_path):
            cmd += ["--cookies", cookies_path]
        
        cmd.append(url)
        
        try:
            subprocess.run(cmd, check=True, capture_output=True)
            video_id = self.get_video_id(url)
            return f"/tmp/audio_{video_id}.mp3"
        except Exception as e:
            print(f"Lỗi download audio: {e}")
            return None

    def get_youtube_transcript(self, url):
        try:
            video_id = self.get_video_id(url)
            if not video_id: return None
            transcript_list = YouTubeTranscriptApi().fetch(video_id, languages=['vi', 'en'])
            return " ".join([t.text for t in transcript_list])
        except Exception as e:
            print(f"Không lấy được phụ đề YouTube: {str(e)}")
            return None

    async def report_progress(self, job_id: int, percent: int):
        if job_id:
            try:
                async with httpx.AsyncClient(timeout=5.0) as client_http:
                    url = f"{settings.JAVA_URL}/update-progress/{job_id}"
                    await client_http.patch(url, params={"value": percent})
            except Exception as e:
                print(f"Lỗi kết nối Java: {str(e)}")

    def transcribe_video(self, file_path: str):
        try:
            print(f"--- [INFO] Đang gửi file {file_path} lên Groq API để transribe... ---")
            with open(file_path, "rb") as file:
                response = self.groq_client.audio.transcriptions.create(
                    file=file,
                    model="whisper-large-v3",
                    language="vi",
                    response_format="text"
                )
            return response.strip()
        except Exception as e:
            print(f"Lỗi khi gọi Groq Whisper API: {str(e)}")
            return ""

router = APIRouter(prefix="/ai", tags=["Video"])

# Singleton clients - ĐÃ XOÁ BỎ MODEL WHISPER LOCAL NẶNG NỀ
groq_client   = Groq(api_key=settings.GROQ_API_KEY)
video_service = VideoService()  # Khởi tạo đối tượng xử lý video thông qua Groq API
rag_service   = RAGService()
_yta          = YouTubeTranscriptApi()

_PREFERRED_LANGS = ["vi", "en", "en-US"]

FILLER_WORDS = {
    "à", "à à", "ờ", "ừm", "ừ", "hmmm", "vâng", "dạ",
    "uh", "um", "ừ ừ", "hmm", "hm", "ừ à", "à ừm", "ờ ờ",
    "à ừ", "ờ ừ"
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _extract_video_id(url: str) -> str | None:
    match = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11}).*", url)
    return match.group(1) if match else None


def _format_timestamp(seconds: int) -> str:
    m, s = divmod(seconds, 60)
    return f"[{m:02d}:{s:02d}]"


# ---------------------------------------------------------------------------
# Lấy transcript từ YouTube API (video có phụ đề)
# ---------------------------------------------------------------------------

def get_youtube_transcript(url: str) -> tuple[str | None, list | None]:
    video_id = _extract_video_id(url)
    if not video_id:
        return None, None

    try:
        try:
            raw_transcript = _yta.fetch(video_id, languages=_PREFERRED_LANGS)
        except Exception:
            raw_transcript = _yta.list(video_id).find_transcript(_PREFERRED_LANGS).fetch()

        formatted_parts: list[str] = []
        timeline_data:   list[dict] = []

        for snippet in raw_transcript:
            try:
                start_sec = int(snippet["start"])
                text_val  = snippet["text"]
            except (TypeError, KeyError):
                start_sec = int(snippet.start)
                text_val  = snippet.text

            clean_text = text_val.replace("\n", " ").strip()
            normalized = (
                clean_text.lower()
                    .replace(".", "").replace(",", "")
                    .replace("!", "").replace("?", "")
                    .strip()
            )
            if normalized in FILLER_WORDS or len(normalized) < 2:
                continue

            formatted_parts.append(f"{_format_timestamp(start_sec)} {clean_text}")
            timeline_data.append({"time": start_sec, "content": clean_text})

        print(f"[SUCCESS] YouTube transcript: {len(timeline_data)} đoạn — {video_id}")
        return "\n".join(formatted_parts), timeline_data

    except (NoTranscriptFound, TranscriptsDisabled):
        print(f"[WARN] Video {video_id} không có phụ đề → fallback sang Groq API")
        return None, None
    except Exception as e:
        print(f"[ERROR] Lấy transcript thất bại [{video_id}]: {e}")
        return None, None


# ---------------------------------------------------------------------------
# Progress reporting
# ---------------------------------------------------------------------------

async def _report_progress(job_id: int | None, percent: int) -> None:
    if not job_id:
        return
    try:
        async with httpx.AsyncClient(timeout=5.0) as http:
            await http.patch(
                f"{settings.JAVA_URL}/update-progress/{job_id}",
                params={"value": percent},
            )
    except httpx.TimeoutException:
        print(f"[WARN] Timeout progress API (job_id={job_id}, {percent}%)")
    except Exception as e:
        print(f"[WARN] Không thể cập nhật tiến trình (job_id={job_id}): {e}")


# ---------------------------------------------------------------------------
# AI analysis
# ---------------------------------------------------------------------------

def _analyse_transcript(transcript: str) -> dict:
    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "Bạn là một chuyên gia phân tích bài giảng cao cấp.\n"
                    "NHIỆM VỤ: Phân tích transcript và trả về kết quả dưới dạng JSON hợp lệ.\n\n"
                    "YÊU CẦU OUTPUT (JSON):\n"
                    "{\n"
                    '  "summary": "Đoạn văn tóm tắt toàn bộ nội dung bài giảng...",\n'
                    '  "key_points": ["Điểm chính 1", "Điểm chính 2", "Điểm chính 3"],\n'
                    '  "keywords": ["từ khóa 1", "từ khóa 2", "từ khóa 3"]\n'
                    "}\n\n"
                    "QUY TẮC:\n"
                    "1. Chỉ trả về JSON, không giải thích thêm.\n"
                    "2. 'summary' là một đoạn văn 8–10 câu tóm tắt toàn bộ nội dung bài giảng.\n"
                    "3. 'key_points' là mảng 5–7 điểm chính quan trọng nhất của bài giảng.\n"
                    "4. 'keywords' là mảng 5–10 từ khóa chuyên môn xuất hiện trong bài.\n"
                    "5. Viết tiếng Việt, viết hoa đầu câu.\n"
                    "6. BẮT BUỘC trả về đúng định dạng JSON với đủ 3 field."
                ),
            },
            {
                "role": "user",
                "content": f"Hãy phân tích transcript sau và trả về JSON:\n{transcript}",
            },
        ],
    )

    try:
        return json.loads(response.choices[0].message.content)
    except (json.JSONDecodeError, TypeError) as e:
        print(f"[WARN] Không thể parse JSON từ Groq: {e}")
        return {"summary": "", "key_points": [], "keywords": []}


# ---------------------------------------------------------------------------
# Route handler
# ---------------------------------------------------------------------------

@router.post("/process-video")
async def process_video(
    file: UploadFile = File(None),
    youtube_url: str = Query(None),
    job_id: int = Query(None),
):
    """
    Pipeline xử lý thông minh: Tự động phân biệt Link YouTube thật và File cục bộ truyền sai param,
    hỗ trợ tự động chuyển đổi đường dẫn mượt mà trên cả Windows local lẫn Linux Production.
    """
    temp_file: str | None = None
    transcript:    str  = ""
    timeline_data: list = []

    try:
        await _report_progress(job_id, 5)

        # CỨU NGUY: Nếu Java truyền nhầm đường dẫn file cục bộ vào tham số youtube_url
        is_local_file_path = youtube_url and ("uploads" in youtube_url or youtube_url.endswith(".mp4") or youtube_url.startswith("/"))

        # --- Bước 1: Lấy transcript ---
        if youtube_url and not is_local_file_path:
            # ĐÚNG LUỒNG: Xử lý link YouTube thật sự
            transcript, timeline_data = get_youtube_transcript(youtube_url)

            if not transcript:
                await _report_progress(job_id, 15)
                
                audio_path = video_service.download_audio(youtube_url)
                if audio_path:
                    transcript = video_service.transcribe_video(audio_path)
                else:
                    transcript = ""
                
                timeline_data = [{"time": 0, "content": transcript}]
                
                if not transcript:
                    await _report_progress(job_id, -1)
                    return {"error": "Không thể xử lý video này."}

            await _report_progress(job_id, 40)

        elif (file and file.filename) or is_local_file_path:
            # ĐÚNG LUỒNG: Xử lý file upload cục bộ
            if is_local_file_path:
                # ÉP ĐƯỜNG DẪN WINDOWS: Loại bỏ tất cả dấu gạch chéo ở đầu chuỗi
                clean_path = youtube_url.lstrip("/")
                
                # Lấy đường dẫn thư mục cha (Thư mục chứa cả ai-service và backend Java của đồ án)
                # Đoạn này giúp Python lùi lại 1 cấp thư mục để tìm sang mục 'uploads' của Java
                current_dir = os.getcwd()
                project_root = os.path.dirname(current_dir)
                possible_path_1 = os.path.join(current_dir, clean_path)
                possible_path_2 = os.path.join(project_root, clean_path)
                possible_path_3 = os.path.join(project_root, "backend", clean_path) # Thử nếu ní đặt tên thư mục java là backend

                if os.path.exists(possible_path_1):
                    temp_file = possible_path_1
                elif os.path.exists(possible_path_2):
                    temp_file = possible_path_2
                elif os.path.exists(possible_path_3):
                    temp_file = possible_path_3
                else:
                    # Fallback cuối cùng: Ép đường dẫn tuyệt đối tương đối
                    temp_file = os.path.abspath(clean_path)
            else:
                safe_name = re.sub(r"[^\w.\-]", "_", file.filename)
                temp_file = f"temp_{safe_name}"
                with open(temp_file, "wb") as buf:
                    buf.write(await file.read())

            await _report_progress(job_id, 30)
            
            # Gọi trực tiếp sang Groq API để bóc băng file video cục bộ
            transcript = video_service.transcribe_video(temp_file)
            timeline_data = [{"time": 0, "content": transcript}]
            
            await _report_progress(job_id, 40)

        else:
            return {"error": "Cần cung cấp youtube_url hoặc file upload."}

        # 🚀 CHÈN ĐOẠN NÀY VÀO ĐỂ CỨU NGUY CHROMADB KHÔNG BỊ NỔ TUNG:
        if not transcript or transcript.strip() == "":
            await _report_progress(job_id, -1)
            return {
                "status": "error", 
                "message": f"Không tìm thấy file tại đường dẫn '{temp_file}' hoặc bóc băng thất bại, transcript rỗng không thể nạp vào RAG."
            }

        # --- Bước 2: Groq phân tích ---
        await _report_progress(job_id, 70)
        analysis = _analyse_transcript(transcript)
        analysis["summary_json"] = json.dumps(timeline_data, ensure_ascii=False)

        # --- Bước 3: Nạp vào RAG ---
        rag_service.ingest_transcript(str(job_id), transcript)
        await _report_progress(job_id, 100)

        return {
            "status":      "success",
            "transcript": transcript,
            "analysis":   analysis,
        }

    finally:
        # Chỉ xóa file tạm nếu nó là file do FastAPI sinh ra (bắt đầu bằng temp_), tránh xóa nhầm file upload gốc của Java
        if temp_file and os.path.exists(temp_file) and os.path.basename(temp_file).startswith("temp_"):
            os.remove(temp_file)