import os
import json
import re
import whisper
import httpx
from groq import Groq 
from fastapi import APIRouter, UploadFile, File, Query
from app.core.config import settings
from app.services.rag_service import RAGService 

router = APIRouter(prefix="/ai", tags=["Video"])
client = Groq(api_key=settings.GROQ_API_KEY)
model_whisper = whisper.load_model(settings.WHISPER_MODEL)
rag_service = RAGService()

def get_video_id(url):
    video_id = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11}).*", url)
    return video_id.group(1) if video_id else None

def get_youtube_transcript(url):
    try:
        video_id = get_video_id(url)
        if not video_id: return None
        from youtube_transcript_api import YouTubeTranscriptApi
        transcript_list = YouTubeTranscriptApi().fetch(video_id, languages=['vi', 'en'])
        return " ".join([t.text for t in transcript_list])
    except Exception as e:
        print(f"Lỗi YouTube: {str(e)}")
        return None

async def report_progress(job_id: int, percent: int):
    if job_id:
        try:
            async with httpx.AsyncClient() as client_http:
                url = f"{settings.JAVA_URL}/update-progress/{job_id}"
                await client_http.patch(url, params={"value": percent})
        except Exception as e:
            print(f"Lỗi kết nối Java: {str(e)}") 

@router.post("/process-video")
async def process_video(file: UploadFile = File(None), youtube_url: str = Query(None), job_id: int = Query(None)):
    temp_file = None
    transcript = ""
    try:
        await report_progress(job_id, 5)
        if youtube_url:
            transcript = get_youtube_transcript(youtube_url)
            if not transcript: return {"error": "Lỗi lấy transcript YT"}
            await report_progress(job_id, 40) 
        elif file and file.filename:
            temp_file = f"temp_{file.filename.replace(' ', '_')}"
            with open(temp_file, "wb") as buffer: buffer.write(await file.read())
            await report_progress(job_id, 30)
            result = model_whisper.transcribe(temp_file, fp16=False, language="vi")
            transcript = result.get("text", "").strip()
        
        # Groq Analysis
        await report_progress(job_id, 70)
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system", 
                    "content": (
                        "Bạn là trợ lý học tập chuyên nghiệp. "
                        "Hãy phân tích nội dung bài giảng và trả về định dạng JSON chuẩn xác với các key sau: "
                        "'summary' (viết một đoạn tóm tắt nội dung bài học), "
                        "'key_points' (danh sách các ý chính quan trọng nhất), "
                        "'keywords' (danh sách các từ khóa chuyên môn). "
                        "Lưu ý: Tất cả giá trị phải bằng tiếng Việt và bắt buộc phải trả về JSON."
                    )
                },
                {"role": "user", "content": f"Nội dung bài học: {transcript}"}
            ],
            model="llama-3.3-70b-versatile", 
            response_format={"type": "json_object"}
        )
        analysis = json.loads(chat_completion.choices[0].message.content)

        rag_service.ingest_transcript(str(job_id), transcript)

        await report_progress(job_id, 100)
        return {"status": "success", "transcript": transcript, "analysis": analysis}
    finally:
        if temp_file and os.path.exists(temp_file): os.remove(temp_file)