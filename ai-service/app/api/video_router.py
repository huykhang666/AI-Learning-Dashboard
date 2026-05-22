import os
import json
import re
import httpx
from groq import Groq
from fastapi import APIRouter, UploadFile, File, Query
from app.core.config import settings
from app.services.rag_service import RAGService
from app.services.video_service import VideoService  # Thêm import service chuẩn vào đây
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, TranscriptsDisabled

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
    Pipeline siêu nhẹ, siêu nhanh nhờ đẩy hoàn toàn việc tính toán lên Groq Cloud API.
    """
    temp_file: str | None = None
    transcript:    str  = ""
    timeline_data: list = []

    try:
        await _report_progress(job_id, 5)

        # --- Bước 1: Lấy transcript ---
        if youtube_url:
            transcript, timeline_data = get_youtube_transcript(youtube_url)

            if not transcript:
                # Không có phụ đề → Fallback nhờ VideoService tải và bắn lên Groq Whisper API
                await _report_progress(job_id, 15)
                
                # Gọi sang hàm xử lý bằng Groq API siêu nhẹ của video_service
                transcript = video_service.transcribe_video(youtube_url) # Hoặc xử lý tải tuỳ logic local của bạn
                
                # Giả lập timeline data rỗng nếu bóc từ API thô không theo mốc thời gian chi tiết
                timeline_data = [{"time": 0, "content": transcript}]
                
                if not transcript:
                    await _report_progress(job_id, -1)
                    return {"error": "Không thể xử lý video này."}

            await _report_progress(job_id, 40)

        elif file and file.filename:
            safe_name = re.sub(r"[^\w.\-]", "_", file.filename)
            temp_file = f"temp_{safe_name}"

            with open(temp_file, "wb") as buf:
                buf.write(await file.read())

            await _report_progress(job_id, 30)
            
            # Gọi trực tiếp qua video_service để bóc băng file upload bằng Groq API
            transcript = video_service.transcribe_video(temp_file)
            timeline_data = [{"time": 0, "content": transcript}]
            
            await _report_progress(job_id, 40)

        else:
            return {"error": "Cần cung cấp youtube_url hoặc file upload."}

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
        if temp_file and os.path.exists(temp_file):
            os.remove(temp_file)