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

# Khởi tạo một lần ở module level để tái sử dụng, tránh tốn chi phí mỗi request
groq_client = Groq(api_key=settings.GROQ_API_KEY)
model_whisper = whisper.load_model(settings.WHISPER_MODEL)
rag_service = RAGService()

# v1.x+: YouTubeTranscriptApi phải dùng qua instance, không còn là static class nữa
_yta = YouTubeTranscriptApi()

# Thứ tự ưu tiên ngôn ngữ khi lấy transcript
_PREFERRED_LANGS = ["vi", "en", "en-US"]


def _extract_video_id(url: str) -> str | None:
    """Trích xuất video ID từ URL YouTube."""
    match = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11}).*", url)
    return match.group(1) if match else None


def _format_timestamp(seconds: int) -> str:
    """Chuyển số giây thành chuỗi [mm:ss]."""
    m, s = divmod(seconds, 60)
    return f"[{m:02d}:{s:02d}]"


def get_youtube_transcript(url: str) -> tuple[str | None, list | None]:
    """
    Lấy transcript từ YouTube, ưu tiên tiếng Việt rồi đến tiếng Anh.
    """
    video_id = _extract_video_id(url)
    if not video_id:
        return None, None

    try:
        # CỐ GẮNG LẤY DỮ LIỆU THÔ
        try:
            raw_transcript = _yta.fetch(video_id, languages=_PREFERRED_LANGS)
        except Exception:
            # Fallback nếu không tìm thấy ngôn ngữ ưu tiên
            raw_transcript = _yta.list(video_id).find_transcript(_PREFERRED_LANGS).fetch()

        formatted_parts = []
        timeline_data = []

        # DUYỆT QUA TỪNG SNIPPET
        for snippet in raw_transcript:
            # DÙNG TRY-EXCEPT ĐỂ TỰ ĐỘNG NHẬN DIỆN OBJECT HOẶC DICT
            try:
                # 1. Thử dùng ngoặc vuông (Dictionary) - Thường gặp ở bản mới
                start_sec = int(snippet['start'])
                text_val = snippet['text']
            except (TypeError, KeyError):
                # 2. Nếu lỗi thì dùng dấu chấm (Object)
                start_sec = int(snippet.start)
                text_val = snippet.text

            clean_text = text_val.replace("\n", " ")

            # Format cho tab Transcript [mm:ss]
            formatted_parts.append(f"{_format_timestamp(start_sec)} {clean_text}")
            
            # Lưu vào mảng Timeline cho Java
            timeline_data.append({"time": start_sec, "content": clean_text})

        # Log ra terminal để Khang dễ nhìn khi test
        print(f"✅ [SUCCESS] Đã trích xuất {len(timeline_data)} mốc thời gian cho video {video_id}")
        
        return "\n".join(formatted_parts), timeline_data

    except Exception as e:
        # Nếu vào đây thì timeline_data sẽ là None -> dẫn đến null ở JSON
        print(f"❌ Lỗi nghiêm trọng khi lấy transcript YouTube [{video_id}]: {e}")
        return None, None


async def _report_progress(job_id: int | None, percent: int) -> None:
    """
    Gửi cập nhật tiến trình về Java backend.
    Dùng timeout 5s để tránh treo request khi Java chậm hoặc chưa khởi động.
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
        print(f"⚠️ Timeout khi gọi Java progress API (job_id={job_id}, {percent}%)")
    except Exception as e:
        print(f"⚠️ Không thể cập nhật tiến trình (job_id={job_id}): {e}")


def _transcribe_with_whisper(file_path: str) -> tuple[str, list]:
    """
    Phiên âm file audio/video bằng Whisper, trả về văn bản có mốc thời gian.

    Returns:
        (formatted_text, timeline_data)
    """
    result = model_whisper.transcribe(file_path, fp16=False, language="vi")

    formatted_parts = []
    timeline_data = []

    # Duyệt qua từng đoạn phiên âm, lấy thời gian bắt đầu và nội dung
    for segment in result.get("segments", []):
        start_sec = int(segment["start"])
        text = segment["text"].strip()

        # Format hiển thị dạng [mm:ss] cho tab Transcript
        formatted_parts.append(f"{_format_timestamp(start_sec)} {text}")

        # Lưu dữ liệu timeline để gửi về Java
        timeline_data.append({"time": start_sec, "content": text})

    return "\n".join(formatted_parts), timeline_data


def _analyse_transcript(transcript: str) -> dict:
    """
    Dùng Groq LLM phân tích nội dung transcript, trả về JSON gồm
    summary, key_points và keywords bằng tiếng Việt.
    """
    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "Bạn là trợ lý học tập chuyên nghiệp. "
                    "Phân tích nội dung bài giảng và trả về JSON với các key: "
                    "'summary' (tóm tắt tổng quan), "
                    "'key_points' (danh sách ý chính quan trọng), "
                    "'keywords' (danh sách từ khóa chuyên môn). "
                    "Tất cả giá trị phải bằng tiếng Việt."
                ),
            },
            {"role": "user", "content": f"Nội dung bài học:\n{transcript}"},
        ],
    )
    return json.loads(response.choices[0].message.content)


@router.post("/process-video")
async def process_video(
    file: UploadFile = File(None),
    youtube_url: str = Query(None),
    job_id: int = Query(None),
):
    """
    Xử lý video từ YouTube URL hoặc file upload.
    Pipeline: lấy transcript → phân tích AI → lưu RAG → cập nhật tiến trình.
    """
    temp_file: str | None = None
    transcript = ""
    timeline_data = []

    try:
        await _report_progress(job_id, 5)

        if youtube_url:
            transcript, timeline_data = get_youtube_transcript(youtube_url)
            if not transcript:
                return {"error": "Không thể lấy transcript từ YouTube URL này."}
            await _report_progress(job_id, 40)

        elif file and file.filename:
            # Lưu file tạm, tránh ký tự đặc biệt trong tên file
            safe_name = re.sub(r"[^\w.\-]", "_", file.filename)
            temp_file = f"temp_{safe_name}"

            with open(temp_file, "wb") as buf:
                buf.write(await file.read())

            await _report_progress(job_id, 30)
            transcript, timeline_data = _transcribe_with_whisper(temp_file)

        else:
            return {"error": "Cần cung cấp youtube_url hoặc file upload."}

        # --- Bước 2: Phân tích nội dung bằng AI ---
        await _report_progress(job_id, 70)
        analysis = _analyse_transcript(transcript)

        # Đính kèm timeline vào payload gửi về Java
        analysis["summary_json"] = json.dumps(timeline_data, ensure_ascii=False)

        # --- Bước 3: Lưu transcript vào RAG để phục vụ hỏi đáp ---
        rag_service.ingest_transcript(str(job_id), transcript)

        await _report_progress(job_id, 100)

        return {
            "status": "success",
            "transcript": transcript,
            "analysis": analysis,
        }

    finally:
        # Dọn dẹp file tạm dù xử lý thành công hay thất bại
        if temp_file and os.path.exists(temp_file):
            os.remove(temp_file)