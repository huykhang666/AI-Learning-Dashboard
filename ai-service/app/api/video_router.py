import os
import json
import re
import time
import math
import httpx
import subprocess
from groq import Groq
from fastapi import APIRouter, UploadFile, File, Query, HTTPException
from app.core.config import settings
from app.services.rag_service import RAGService
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, TranscriptsDisabled
from pydantic import BaseModel, Field
from typing import List

# --- 📝 ĐỊNH NGHĨA SCHEMAS CHO QUIZ ---
class SingleQuizSchema(BaseModel):
    question: str = Field(description="Nội dung câu hỏi trắc nghiệm bám sát vào nội dung bản ghi chữ của bài học.")
    options: List[str] = Field(description="Mảng chứa đúng 4 lựa chọn phương án trả lời (A, B, C, D).")
    correct_index: int = Field(description="Chỉ số index của đáp án chính xác trong mảng options (giá trị từ 0 đến 3).")
    explanation: str = Field(description="Giải thích chi tiết lý do tại sao đáp án đó lại đúng dựa vào nội dung bài học.")

class QuizGenerationRequest(BaseModel):
    transcript: str

# ─────────────────────────────────────────────
# CONSTANTS
# ─────────────────────────────────────────────
GROQ_MAX_BYTES   = 24 * 1024 * 1024   
CHUNK_DURATION_S = 10 * 60           
GROQ_RETRY       = 3                  
GROQ_RETRY_DELAY = 3                

FILLER_WORDS = {
    "à", "à à", "ờ", "ừm", "ừ", "hmmm", "vâng", "dạ",
    "uh", "um", "ừ ừ", "hmm", "hm", "ừ à", "à ừm", "ờ ờ",
    "à ừ", "ờ ừ"
}

_PREFERRED_LANGS = ["vi", "en", "en-US"]

# ─────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────

def _extract_video_id(url: str) -> str | None:
    match = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11}).*", url)
    return match.group(1) if match else None

def _format_timestamp(seconds: int) -> str:
    m, s = divmod(seconds, 60)
    return f"[{m:02d}:{s:02d}]"

def _normalize_path(raw: str) -> str:
    """Chuẩn hoá path từ URL-encoded / Windows mixed slash sang path hệ thống."""
    from urllib.parse import unquote
    path = unquote(raw)          # giải mã %20, %C6%B0, …
    path = path.replace("\\", os.sep).replace("/", os.sep)
    return path

def _resolve_upload_path(raw_url: str) -> str | None:
    """
    Thử nhiều base dir phổ biến để tìm đúng file upload.
    Trả về đường dẫn tuyệt đối nếu tìm thấy, None nếu không.
    """
    clean = _normalize_path(raw_url.lstrip("/\\"))

    candidates = [
        clean,                                                        # tuyệt đối hoặc cwd
        os.path.join(os.getcwd(), clean),
        os.path.join(os.path.dirname(os.getcwd()), clean),
        os.path.join(os.path.dirname(os.getcwd()), "backend", clean),
        # Windows: ổ C:\Users\... thường được mount ở root khi chạy uvicorn
        os.path.abspath(clean),
    ]

    # Thêm thư mục uploads cạnh project nếu path bắt đầu bằng "uploads"
    if clean.startswith("uploads"):
        for base in [os.getcwd(), os.path.dirname(os.getcwd())]:
            candidates.append(os.path.join(base, clean))

    for p in candidates:
        if os.path.isfile(p):
            print(f"[INFO] Tìm thấy file tại: {p}")
            return p

    print(f"[ERROR] Không tìm thấy file upload. Đã thử:\n" + "\n".join(candidates))
    return None


def _get_audio_duration_s(path: str) -> float:
    """Dùng ffprobe để lấy thời lượng file (giây). Trả 0 nếu lỗi."""
    try:
        result = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", path],
            capture_output=True, text=True, timeout=15
        )
        return float(result.stdout.strip())
    except Exception:
        return 0.0


def _compress_to_mp3(src: str, dst: str, bitrate: str = "64k") -> bool:
    """Convert/compress file sang MP3 bitrate thấp để giảm dung lượng."""
    try:
        subprocess.run(
            ["ffmpeg", "-y", "-i", src,
             "-vn", "-ar", "16000", "-ac", "1", "-ab", bitrate, dst],
            check=True, capture_output=True, timeout=300
        )
        return True
    except Exception as e:
        print(f"[ERROR] ffmpeg compress thất bại: {e}")
        return False


def _split_audio(src: str, chunk_s: int = CHUNK_DURATION_S) -> list[str]:
    """
    Split file audio thành các chunk <= chunk_s giây bằng ffmpeg segment.
    Trả về danh sách path các chunk tạm.
    """
    base = os.path.splitext(src)[0]
    pattern = f"{base}_chunk_%03d.mp3"
    try:
        subprocess.run(
            ["ffmpeg", "-y", "-i", src,
             "-f", "segment", "-segment_time", str(chunk_s),
             "-vn", "-ar", "16000", "-ac", "1", "-ab", "64k",
             pattern],
            check=True, capture_output=True, timeout=600
        )
        chunks = sorted([
            f for f in os.listdir(os.path.dirname(src) or ".")
            if re.match(r".+_chunk_\d{3}\.mp3$", f)
        ])
        # Trả về full path
        dir_ = os.path.dirname(src)
        return [os.path.join(dir_, c) if dir_ else c for c in chunks]
    except Exception as e:
        print(f"[ERROR] ffmpeg split thất bại: {e}")
        return [src]   # fallback: dùng file gốc


# ─────────────────────────────────────────────
# VIDEO SERVICE
# ─────────────────────────────────────────────

class VideoService:
    def __init__(self):
        print("--- [INFO] Khởi tạo Groq Client cho dịch vụ Speech-to-Text ---")
        self.groq_client = Groq(api_key=settings.GROQ_API_KEY)

    # ── Groq transcribe với retry ──────────────────────────────────────────

    def _call_groq_text(self, file_path: str, attempt: int = 0) -> str:
        """Gọi Groq text transcription với retry."""
        try:
            with open(file_path, "rb") as f:
                resp = self.groq_client.audio.transcriptions.create(
                    file=f,
                    model="whisper-large-v3",
                    language="vi",
                    response_format="text"
                )
            return (resp or "").strip()
        except Exception as e:
            if attempt < GROQ_RETRY - 1:
                print(f"[WARN] Groq text lỗi (lần {attempt+1}), retry sau {GROQ_RETRY_DELAY}s: {e}")
                time.sleep(GROQ_RETRY_DELAY)
                return self._call_groq_text(file_path, attempt + 1)
            print(f"[ERROR] Groq text thất bại sau {GROQ_RETRY} lần: {e}")
            return ""

    def _call_groq_verbose(self, file_path: str, time_offset: int = 0, attempt: int = 0) -> tuple[str, list]:
        """Gọi Groq verbose_json transcription với retry và time_offset cho chunk."""
        try:
            with open(file_path, "rb") as f:
                resp = self.groq_client.audio.transcriptions.create(
                    file=f,
                    model="whisper-large-v3",
                    language="vi",
                    response_format="verbose_json"
                )

            parts, segments = [], []
            if hasattr(resp, "segments") and resp.segments:
                for seg in resp.segments:
                    try:
                        text_val  = seg.get("text", "").strip()
                        start_sec = int(seg.get("start", 0)) + time_offset
                    except (AttributeError, TypeError):
                        text_val  = getattr(seg, "text", "").strip()
                        start_sec = int(getattr(seg, "start", 0)) + time_offset

                    if not text_val:
                        continue

                    m, s = divmod(start_sec, 60)
                    parts.append(f"[{m:02d}:{s:02d}] {text_val}")
                    segments.append({"time": start_sec, "content": text_val})
            else:
                text_val = getattr(resp, "text", "").strip()
                if text_val:
                    parts.append(f"[00:00] {text_val}")
                    segments.append({"time": time_offset, "content": text_val})

            return "\n".join(parts), segments

        except Exception as e:
            if attempt < GROQ_RETRY - 1:
                print(f"[WARN] Groq verbose lỗi (lần {attempt+1}), retry sau {GROQ_RETRY_DELAY}s: {e}")
                time.sleep(GROQ_RETRY_DELAY)
                return self._call_groq_verbose(file_path, time_offset, attempt + 1)
            print(f"[ERROR] Groq verbose thất bại sau {GROQ_RETRY} lần: {e}")
            return "", []

    # ── Prepare audio (compress + split nếu cần) ──────────────────────────

    def _prepare_audio_chunks(self, src: str) -> list[tuple[str, int]]:
        """
        Trả về list[(chunk_path, time_offset_s)].
        - Nếu file nhỏ hơn giới hạn → trả về chính file gốc (nếu đã là mp3/wav)
          hoặc convert sang mp3 trước.
        - Nếu file lớn → compress rồi split.
        """
        ext = os.path.splitext(src)[1].lower()
        is_audio = ext in (".mp3", ".wav", ".m4a", ".ogg", ".flac", ".webm")

        # Bước 1: Đảm bảo có file mp3 để gửi Groq
        compressed = src.replace(ext, "_compressed.mp3") if is_audio else src + "_compressed.mp3"
        
        if not _compress_to_mp3(src, compressed):
            # ffmpeg không khả dụng hoặc thất bại → thử gửi file gốc
            compressed = src

        size = os.path.getsize(compressed)
        print(f"[INFO] Kích thước sau compress: {size / 1024 / 1024:.1f} MB")

        if size <= GROQ_MAX_BYTES:
            return [(compressed, 0)]

        # Bước 2: File vẫn lớn → split
        print(f"[INFO] File > 24 MB, tiến hành split mỗi {CHUNK_DURATION_S//60} phút...")
        chunks = _split_audio(compressed, CHUNK_DURATION_S)

        if not chunks:
            return [(compressed, 0)]

        # Tính time_offset cho từng chunk
        result = []
        offset = 0
        for chunk in chunks:
            result.append((chunk, offset))
            offset += CHUNK_DURATION_S
        return result

    # ── Public transcribe methods ──────────────────────────────────────────

    def transcribe_video(self, file_path: str) -> str:
        """Simple text transcription (dùng khi verbose thất bại)."""
        chunks = self._prepare_audio_chunks(file_path)
        texts = []
        for chunk_path, _ in chunks:
            texts.append(self._call_groq_text(chunk_path))
        return " ".join(filter(None, texts)).strip()

    def transcribe_video_verbose(self, file_path: str) -> tuple[str, list]:
        """
        Verbose transcription trả về (full_text_with_timestamps, segments).
        Tự động compress + split nếu file quá lớn.
        Fallback sang text nếu verbose thất bại.
        """
        chunks = self._prepare_audio_chunks(file_path)

        all_parts:    list[str]  = []
        all_segments: list[dict] = []

        for chunk_path, offset in chunks:
            parts, segs = self._call_groq_verbose(chunk_path, time_offset=offset)

            if not parts:
                # Verbose thất bại → fallback sang text cho chunk này
                print(f"[WARN] Verbose thất bại cho chunk {chunk_path}, dùng text fallback.")
                text = self._call_groq_text(chunk_path)
                if text:
                    m, s = divmod(offset, 60)
                    parts = f"[{m:02d}:{s:02d}] {text}"
                    segs  = [{"time": offset, "content": text}]

            if parts:
                all_parts.append(parts if isinstance(parts, str) else "\n".join(parts))
            all_segments.extend(segs)

        # Dọn chunk tạm
        for chunk_path, _ in chunks:
            if "_chunk_" in chunk_path or "_compressed" in chunk_path:
                try:
                    os.remove(chunk_path)
                except Exception:
                    pass

        return "\n".join(all_parts), all_segments

    # ── YouTube helpers ────────────────────────────────────────────────────

    def get_video_id(self, url):
        return _extract_video_id(url)

    def download_audio(self, url: str) -> str | None:
        output_path = "/tmp/audio_%(id)s.mp3"
        cookies_path = "/app/cookies.txt"
        cmd = ["yt-dlp", "-x", "--audio-format", "mp3", "--audio-quality", "0", "-o", output_path]
        if os.path.exists(cookies_path):
            cmd += ["--cookies", cookies_path]
        cmd.append(url)
        try:
            subprocess.run(cmd, check=True, capture_output=True, timeout=300)
            video_id = self.get_video_id(url)
            return f"/tmp/audio_{video_id}.mp3"
        except Exception as e:
            print(f"[ERROR] Download audio thất bại: {e}")
            return None

    async def report_progress(self, job_id: int, percent: int):
        await _report_progress(job_id, percent)


# ─────────────────────────────────────────────
# YOUTUBE TRANSCRIPT
# ─────────────────────────────────────────────

_yta = YouTubeTranscriptApi()

def get_youtube_transcript(url: str) -> tuple[str | None, list | None]:
    video_id = _extract_video_id(url)
    if not video_id:
        return None, None

    try:
        try:
            raw_transcript = _yta.fetch(video_id, languages=_PREFERRED_LANGS)
        except Exception:
            raw_transcript = _yta.list(video_id).find_transcript(_PREFERRED_LANGS).fetch()

        formatted_parts: list[str]  = []
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


# ─────────────────────────────────────────────
# PROGRESS REPORTER
# ─────────────────────────────────────────────

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


# ─────────────────────────────────────────────
# AI ANALYSIS & QUIZ
# ─────────────────────────────────────────────

groq_client   = Groq(api_key=settings.GROQ_API_KEY)
video_service = VideoService()
rag_service   = RAGService()

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


def _generate_quiz_from_ai(transcript: str) -> list:
    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "Bạn là một chuyên gia thiết kế học liệu giáo dục tinh nhuệ.\n"
                    "NHIỆM VỤ: Phân tích transcript video bài giảng và trả về một danh sách các câu hỏi trắc nghiệm dưới dạng JSON.\n\n"
                    "YÊU CẦU ĐỊNH DẠNG ĐẦU RA (Mảng JSON chứa đúng trường):\n"
                    "{\n"
                    '  "quizzes": [\n'
                    "    {\n"
                    '      "question": "Nội dung câu hỏi trắc nghiệm dựa trên bài học?",\n'
                    '      "options": ["Phương án A", "Phương án B", "Phương án C", "Phương án D"],\n'
                    '      "correct_index": 1,\n'
                    '      "explanation": "Giải thích chi tiết tại sao phương án ở index này lại đúng..."\n'
                    "    }\n"
                    "  ]\n"
                    "}\n\n"
                    "QUY TẮC NGHIÊM NGẶT:\n"
                    "1. Chỉ trả về đối tượng JSON có thuộc tính 'quizzes' là một mảng, không giải thích gì thêm ngoài JSON.\n"
                    "2. Mỗi câu hỏi bắt buộc phải có đúng 4 phần tử trong mảng 'options'.\n"
                    "3. Trường 'correct_index' phải là một số nguyên từ 0 đến 3.\n"
                    "4. Hãy tạo từ 3 đến 5 câu hỏi chất lượng cao bám sát nội dung bài học.\n"
                    "5. Viết hoàn toàn bằng tiếng Việt chuẩn."
                ),
            },
            {
                "role": "user",
                "content": f"Dựa trên đoạn văn bản ghi chữ sau, hãy tạo bộ câu hỏi trắc nghiệm:\n{transcript}",
            },
        ],
    )
    try:
        data = json.loads(response.choices[0].message.content)
        return data.get("quizzes", [])
    except (json.JSONDecodeError, TypeError) as e:
        print(f"[WARN] Không thể parse JSON bộ Quiz từ Groq: {e}")
        return []


# ─────────────────────────────────────────────
# ROUTER
# ─────────────────────────────────────────────

router = APIRouter(prefix="/ai", tags=["Video"])


@router.post("/process-video")
async def process_video(
    file: UploadFile = File(None),
    youtube_url: str = Query(None),
    job_id: int = Query(None),
):
    temp_file:     str | None = None
    transcript:    str        = ""
    timeline_data: list       = []

    try:
        await _report_progress(job_id, 5)

        # ── Phân loại input ──────────────────────────────────────────────
        is_local_file = (
            youtube_url and (
                "uploads" in youtube_url
                or youtube_url.endswith(".mp4")
                or youtube_url.endswith(".mp3")
                or youtube_url.startswith("/")
                or (len(youtube_url) > 2 and youtube_url[1] == ":")   # Windows C:\...
            )
        )

        # ── Nhánh 1: YouTube URL thật ─────────────────────────────────────
        if youtube_url and not is_local_file:
            transcript, timeline_data = get_youtube_transcript(youtube_url)

            if not transcript:
                await _report_progress(job_id, 15)
                audio_path = video_service.download_audio(youtube_url)
                if audio_path:
                    transcript, timeline_data = video_service.transcribe_video_verbose(audio_path)
                if not transcript:
                    await _report_progress(job_id, -1)
                    return {"error": "Không thể xử lý video YouTube này."}

            await _report_progress(job_id, 40)

        # ── Nhánh 2: File upload hoặc path local ─────────────────────────
        elif (file and file.filename) or is_local_file:

            if is_local_file:
                resolved = _resolve_upload_path(youtube_url)
                if not resolved:
                    await _report_progress(job_id, -1)
                    return {
                        "status":  "error",
                        "message": f"Không tìm thấy file tại đường dẫn: {youtube_url}"
                    }
                temp_file = resolved   # KHÔNG xoá file này sau khi dùng

            else:
                safe_name = re.sub(r"[^\w.\-]", "_", file.filename)
                temp_file = os.path.join("/tmp", f"temp_{safe_name}")
                with open(temp_file, "wb") as buf:
                    buf.write(await file.read())

            await _report_progress(job_id, 30)
            transcript, timeline_data = video_service.transcribe_video_verbose(temp_file)
            await _report_progress(job_id, 40)

        else:
            return {"error": "Cần cung cấp youtube_url hoặc file upload."}

        # ── Kiểm tra transcript rỗng ──────────────────────────────────────
        if not transcript or not transcript.strip():
            await _report_progress(job_id, -1)
            return {
                "status":  "error",
                "message": "Transcript rỗng – không thể phân tích bài giảng."
            }

        # ── Phân tích & RAG ───────────────────────────────────────────────
        await _report_progress(job_id, 70)
        analysis = _analyse_transcript(transcript)
        analysis["summary_json"] = json.dumps(timeline_data, ensure_ascii=False)

        rag_service.ingest_transcript(str(job_id), transcript)
        await _report_progress(job_id, 100)

        return {
            "status":    "success",
            "transcript": transcript,
            "analysis":   analysis,
        }

    finally:
        # Chỉ xoá file TẠM do chúng ta tự tạo (upload từ client), KHÔNG xoá file gốc
        if (
            temp_file
            and os.path.exists(temp_file)
            and os.path.basename(temp_file).startswith("temp_")
        ):
            try:
                os.remove(temp_file)
            except Exception:
                pass


@router.post("/generate-quiz", response_model=List[SingleQuizSchema])
async def generate_quiz(payload: QuizGenerationRequest):
    if not payload.transcript or not payload.transcript.strip():
        raise HTTPException(status_code=400, detail="Nội dung transcript trống không thể tạo câu hỏi.")
    try:
        quizzes = _generate_quiz_from_ai(payload.transcript)
        return quizzes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi hệ thống AI sinh Quiz: {str(e)}")