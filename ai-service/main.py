import os
import json
import re
import whisper
import httpx
from groq import Groq 
from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from dotenv import load_dotenv

try:

    from transformers import GPT2Tokenizer
    if not hasattr(GPT2Tokenizer, "additional_special_tokens"):
        setattr(GPT2Tokenizer, "additional_special_tokens", property(lambda self: []))
    if not hasattr(GPT2Tokenizer, "additional_special_tokens_ids"):
        setattr(GPT2Tokenizer, "additional_special_tokens_ids", property(lambda self: []))
    print("Đã vá lỗi Tokenizer thành công!")
except Exception as e:
    print(f"Cảnh báo Fix Tokenizer: {e}")

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
JAVA_URL = "http://localhost:8080/api/v1/jobs"

app = FastAPI()

# --- LOAD MODEL WHISPER  ---
print("Đang tải model Whisper (Base)...")
model_whisper = whisper.load_model("base")

def get_video_id(url):
    video_id = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11}).*", url)
    return video_id.group(1) if video_id else None

def get_youtube_transcript(url):
    try:
        video_id = get_video_id(url)
        if not video_id: return None
            
        print(f"[DEBUG] Đang bóc băng Video ID: {video_id}")
        
        from youtube_transcript_api import YouTubeTranscriptApi
        ytt_api = YouTubeTranscriptApi() 
        
        transcript_list = ytt_api.fetch(video_id, languages=['vi', 'en'])
        
        full_transcript = " ".join([t.text for t in transcript_list])
        
        return full_transcript
        
    except Exception as e:
        print(f"Lỗi thực tế từ YouTube: {type(e).__name__} - {str(e)}")
        return None
#--BÁO CÁO TIẾN ĐỘ VỀ JAVA---
async def report_progress(job_id: int, percent: int):
    if job_id:
        try:
            async with httpx.AsyncClient() as client_http:
                url = f"http://localhost:8080/api/v1/jobs/update-progress/{job_id}"
                response = await client_http.patch(url, params={"value": percent})
                
                if response.status_code != 200:
                    print(f"Java báo lỗi {response.status_code}: {response.text}") 
                else:
                    print(f"Java OK: {percent}%")
        except Exception as e:
            print(f"Lỗi kết nối Java: {type(e).__name__} - {str(e)}") 

@app.post("/ai/process-video")
async def process_video(
    file: UploadFile = File(None), 
    youtube_url: str = Query(None),
    job_id: int = Query(None)
):
    print(f"\n[BẮT ĐẦU] Job ID: {job_id} | YouTube: {youtube_url}")
    
    temp_file = None
    transcript = ""

    try:
        # 1. Báo cáo khởi động (5%)
        print(f"[Job {job_id}] Đang báo progress 5% về Java...")
        await report_progress(job_id, 5)
        
        # --- NHÁNH 1: XỬ LÝ YOUTUBE ---
        if youtube_url:
            print(f"[Job {job_id}] Đang lấy transcript từ YouTube...")
            transcript = get_youtube_transcript(youtube_url)
            
            if not transcript:
                print(f"[Job {job_id}] Lỗi: Không lấy được transcript từ YouTube.")
                return {"error": "Video YouTube này không có phụ đề hoặc bị chặn."}
            
            print(f"[Job {job_id}] Lấy transcript YT thành công! (Dài: {len(transcript)} ký tự)")
            await report_progress(job_id, 40) 

        # --- NHÁNH 2: XỬ LÝ FILE (WHISPER) ---
        elif file and file.filename:
            temp_file = f"temp_{file.filename.replace(' ', '_')}"
            print(f"[Job {job_id}] Đang lưu file tạm: {temp_file}")
            
            with open(temp_file, "wb") as buffer:
                buffer.write(await file.read())

            await report_progress(job_id, 30)
            print(f"[Job {job_id}] Whisper đang bóc băng...")
            
        
            result = model_whisper.transcribe(temp_file, fp16=False, language="vi")
            transcript = result.get("text", "").strip()
            print(f"[Job {job_id}] Whisper hoàn tất!")

        else:
            print(f"[Job {job_id}] Không nhận được file hay URL.")
            return {"error": "Vui lòng cung cấp file video hoặc link YouTube hợp lệ."}

        # --- KIỂM TRA TRANSCRIPT TRƯỚC KHI QUA AI ---
        if not transcript or len(transcript) < 5:
            return {"error": "Nội dung trích xuất quá ngắn hoặc trống."}

        # 3. GROQ: PHÂN TÍCH (70%)
        print(f"[Job {job_id}] Đang gửi sang Groq (Llama 3)...")
        await report_progress(job_id, 70)
        
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system", 
                    "content": (
                        "Bạn là trợ lý học tập chuyên nghiệp. "
                        "Hãy phân tích nội dung và trả về JSON chuẩn gồm các trường: "
                        "'summary' (tóm tắt bài học ngắn gọn), "
                        "'key_points' (danh sách các ý chính, mỗi ý một dòng), "
                        "và 'keywords' (danh sách từ khóa phân loại). "
                        "Tất cả nội dung phải bằng tiếng Việt."
                    )
                },
                {"role": "user", "content": f"Nội dung bài học: {transcript}"}
            ],
            model="llama-3.3-70b-versatile", 
            response_format={"type": "json_object"}
        )

        analysis = json.loads(chat_completion.choices[0].message.content)
        print(f"[Job {job_id}] Groq phân tích xong!")

        # 4. HOÀN TẤT (100%)
        await report_progress(job_id, 100)
        print(f"[Job {job_id}] XỬ LÝ HOÀN TẤT VÀ TRẢ VỀ KẾT QUẢ!")
        
        return {
            "status": "success",
            "transcript": transcript,
            "analysis": analysis
        }

    except Exception as e:
        print(f"[LỖI HỆ THỐNG] Job {job_id}: {str(e)}")
        # Cố gắng báo lỗi về Java nếu được
        await report_progress(job_id, 0)
        return {"error": f"Lỗi xử lý server Python: {str(e)}"}
    
    finally:
        # Xóa file tạm an toàn
        if temp_file and os.path.exists(temp_file):
            print(f"Đang xóa file tạm: {temp_file}")
            os.remove(temp_file)
if __name__ == "__main__":
    import uvicorn
    # Chạy trên port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)