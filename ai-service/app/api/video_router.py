import os
import json
import re
import whisper
import httpx
from groq import Groq
from fastapi import APIRouter, UploadFile, File, Query
from app.core.config import settings
from app.services.rag_service import RAGService
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, TranscriptsDisabled

router = APIRouter(prefix="/ai", tags=["Video"])

# ---------------------------------------------------------------------------
# Khởi tạo singleton clients ở module-level để tái sử dụng giữa các request,
# tránh overhead khi load model / tạo kết nối mỗi lần gọi API.
# ---------------------------------------------------------------------------
groq_client = Groq(api_key=settings.GROQ_API_KEY)
model_whisper = whisper.load_model(settings.WHISPER_MODEL)
rag_service = RAGService()

# v1.x+: YouTubeTranscriptApi phải dùng qua instance, không còn là static class nữa
_yta = YouTubeTranscriptApi()

# Thứ tự ưu tiên ngôn ngữ khi lấy transcript
_PREFERRED_LANGS = ["vi", "en", "en-US"]


# ---------------------------------------------------------------------------
# Utility helpers
# ---------------------------------------------------------------------------

def _extract_video_id(url: str) -> str | None:
    """Trích xuất video ID (11 ký tự) từ các dạng URL YouTube phổ biến."""
    match = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11}).*", url)
    return match.group(1) if match else None


def _format_timestamp(seconds: int) -> str:
    """Chuyển đổi số giây thành chuỗi [mm:ss] để hiển thị trên tab Transcript."""
    m, s = divmod(seconds, 60)
    return f"[{m:02d}:{s:02d}]"


# ---------------------------------------------------------------------------
# Transcript extraction
# ---------------------------------------------------------------------------

FILLER_WORDS = {
    "à", "à à", "ờ", "ừm", "ừ", "hmmm", "vâng", "dạ",
    "uh", "um", "ừ ừ", "hmm", "hm", "ừ à", "à ừm", "ờ ờ"
}

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

            # Lọc filler words
            normalized = (
                clean_text.lower()
                    .replace(".", "")
                    .replace(",", "")
                    .replace("!", "")
                    .replace("?", "")
                    .strip()
            )
            if normalized in FILLER_WORDS or len(normalized) < 2:
                continue

            formatted_parts.append(f"{_format_timestamp(start_sec)} {clean_text}")
            timeline_data.append({"time": start_sec, "content": clean_text})

        print(f"[SUCCESS] Đã trích xuất {len(timeline_data)} mốc thời gian cho video {video_id}")
        return "\n".join(formatted_parts), timeline_data

    except Exception as e:
        print(f"[ERROR] Không thể lấy transcript cho video [{video_id}]: {e}")
        return None, None


# ---------------------------------------------------------------------------
# Progress reporting
# ---------------------------------------------------------------------------

async def _report_progress(job_id: int | None, percent: int) -> None:
    """
    Gửi cập nhật tiến trình về Java backend qua PATCH request.

    Timeout cứng 5 s để tránh treo pipeline khi Java backend phản hồi chậm.
    Mọi lỗi đều được bắt và ghi log, không để exception lan ra ngoài.
    """
    if not job_id:
        return

    try:
        async with httpx.AsyncClient(timeout=5.0) as http:
            await http.patch(
                f"{settings.JAVA_URL}/update-progress/{job_id}",
                params={"value": percent},
            )
    except httpx.TimeoutException:
        print(f"[WARN] Timeout khi gọi Java progress API (job_id={job_id}, {percent}%)")
    except Exception as e:
        print(f"[WARN] Không thể cập nhật tiến trình (job_id={job_id}): {e}")


# ---------------------------------------------------------------------------
# Whisper transcription
# ---------------------------------------------------------------------------
def _transcribe_with_whisper(file_path: str) -> tuple[str, list]:
    result = model_whisper.transcribe(
        file_path, 
        fp16=False, 
        language="vi",
        initial_prompt="Chào mừng các bạn đến với bài giảng hôm nay." 
    )

    formatted_parts: list[str] = []
    timeline_data:   list[dict] = []
    
    FILLER_WORDS = {
        "à", "à à", "ờ", "ừm", "ừ", "hmmm", "vâng", "dạ",
        "uh", "um", "ừ ừ", "à ừ", "ờ ừ", "hmm", "hm",
        "ừ à", "à ừm", "ờ ờ"
    }

    for segment in result.get("segments", []):
        start_sec = int(segment["start"])
        text      = segment["text"].strip()

        # Chuẩn hoá để so sánh
        clean_text = (
            text.lower()
                .replace(".", "")
                .replace(",", "")
                .replace("!", "")
                .replace("?", "")
                .strip()
        )
        
        if start_sec < 10:
            print(f"DEBUG raw: {repr(text)}")
            print(f"DEBUG clean: {repr(clean_text)}")
            print(f"DEBUG in set: {clean_text in FILLER_WORDS}")

        # Lọc toàn bộ video, không chỉ 5 giây đầu
        if clean_text in FILLER_WORDS:
            print(f"DEBUG: Lọc filler word: '{text}' lúc {start_sec}s")
            continue

        # Lọc segment quá ngắn (dưới 2 ký tự)
        if len(clean_text) < 2:
            continue

        formatted_parts.append(f"{_format_timestamp(start_sec)} {text}")
        timeline_data.append({"time": start_sec, "content": text})

    return "\n".join(formatted_parts), timeline_data

# ---------------------------------------------------------------------------
# AI analysis
# ---------------------------------------------------------------------------

def _analyse_transcript(transcript: str) -> dict:
    """
    Gửi transcript lên Groq LLM để tổng hợp nội dung bài giảng.

    Tên các field trong JSON response được giữ đúng theo convention snake_case
    để khớp với @JsonProperty trong Java DTO (AiAnalysisResponse.AnalysisData):
        - summary    → String
        - key_points → List<String>
        - keywords   → List<String>

    Returns:
        dict chứa summary, key_points, keywords.
        Trả về dict với các giá trị mặc định nếu LLM response không hợp lệ.
    """
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

    raw = response.choices[0].message.content

    # Guard: đảm bảo caller luôn nhận được dict hợp lệ dù LLM trả về nội dung lỗi.
    # key_points và keywords giữ nguyên kiểu List[str] để Java deserialize đúng kiểu.
    try:
        return json.loads(raw)
    except (json.JSONDecodeError, TypeError) as e:
        print(f"[WARN] Không thể parse JSON từ Groq response: {e}")
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
    Endpoint xử lý video từ YouTube URL hoặc file upload.

    Pipeline:
        1. Lấy transcript (YouTube API hoặc Whisper).
        2. Phân tích nội dung bằng Groq LLM → trả về summary, key_points, keywords.
        3. Nạp transcript vào RAG để phục vụ hỏi đáp sau này.
        4. Báo cáo tiến trình về Java backend theo từng bước.
    """
    temp_file: str | None = None
    transcript:    str  = ""
    timeline_data: list = []

    try:
        await _report_progress(job_id, 5)

        # ------------------------------------------------------------------
        # Bước 1: Lấy transcript
        # ------------------------------------------------------------------
        if youtube_url:
            transcript, timeline_data = get_youtube_transcript(youtube_url)
            if not transcript:
                return {"error": "Không thể lấy transcript từ YouTube URL này."}
            await _report_progress(job_id, 40)

        elif file and file.filename:
            # Chuẩn hoá tên file để tránh path-traversal và ký tự đặc biệt
            safe_name = re.sub(r"[^\w.\-]", "_", file.filename)
            temp_file = f"temp_{safe_name}"

            with open(temp_file, "wb") as buf:
                buf.write(await file.read())

            await _report_progress(job_id, 30)
            transcript, timeline_data = _transcribe_with_whisper(temp_file)

        else:
            return {"error": "Cần cung cấp youtube_url hoặc file upload."}

        # ------------------------------------------------------------------
        # Bước 2: Phân tích nội dung bằng AI
        # ------------------------------------------------------------------
        await _report_progress(job_id, 70)
        analysis = _analyse_transcript(transcript)

        # Đính kèm timeline (dạng JSON string) vào payload trả về Java.
        # Field này map sang @JsonProperty("summary_json") trong AnalysisData.
        analysis["summary_json"] = json.dumps(timeline_data, ensure_ascii=False)

        # ------------------------------------------------------------------
        # Bước 3: Nạp transcript vào vector store để phục vụ RAG Q&A
        # ------------------------------------------------------------------
        rag_service.ingest_transcript(str(job_id), transcript)

        await _report_progress(job_id, 100)

        return {
            "status":     "success",
            "transcript": transcript,
            "analysis":   analysis,
        }

    finally:
        # Dọn dẹp file tạm dù pipeline thành công hay thất bại
        if temp_file and os.path.exists(temp_file):
            os.remove(temp_file)