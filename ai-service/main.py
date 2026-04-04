import os
import json
import re
import whisper
from groq import Groq 
from fastapi import FastAPI, UploadFile, File, HTTPException
from dotenv import load_dotenv

try:
    from transformers import GPT2Tokenizer
    if not hasattr(GPT2Tokenizer, "additional_special_tokens"):
        setattr(GPT2Tokenizer, "additional_special_tokens", property(lambda self: []))
    if not hasattr(GPT2Tokenizer, "additional_special_tokens_ids"):
        setattr(GPT2Tokenizer, "additional_special_tokens_ids", property(lambda self: []))
    print("✅ Đã vá lỗi Tokenizer thành công!")
except Exception as e:
    print(f"⚠️ Cảnh báo Fix Tokenizer: {e}")

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()

# --- LOAD MODEL WHISPER (DÙNG BẢN BASE ĐA NGÔN NGỮ) ---
print("🚀 Đang tải model Whisper (Base)...")
model_whisper = whisper.load_model("base")

@app.post("/ai/process-video")
async def process_video(file: UploadFile = File(...)):

    temp_file = f"temp_{file.filename.replace(' ', '_')}"
    try:
        # Lưu file video tạm từ Java gửi sang
        with open(temp_file, "wb") as buffer:
            buffer.write(await file.read())

        print(f"🎧 Whisper đang bóc băng file: {file.filename}")
        
        # BÓC BĂNG - Dùng FFmpeg bóc ra text

        result = model_whisper.transcribe(temp_file, fp16=False, language="vi", task="transcribe")
        transcript = result.get("text", "").strip()

        if not transcript:
            return {"error": "Không trích xuất được âm thanh từ video. Kiểm tra lại file video."}

        print("🧠 Groq (Llama 3) đang phân tích và tóm tắt...")
        
       
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
                {"role": "user", "content": f"Dưới đây là nội dung bài học: {transcript}"}
            ],
       
            model="llama-3.3-70b-versatile", 
            response_format={"type": "json_object"}
        )

        # Trích xuất JSON từ Groq
        analysis_content = chat_completion.choices[0].message.content
        analysis = json.loads(analysis_content)

        print("✅ Xử lý hoàn tất!")
        return {
            "status": "success",
            "transcript": transcript,
            "analysis": analysis
        }

    except Exception as e:
        print(f"❌ Lỗi: {str(e)}")
        return {"error": str(e)}
    
    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)

if __name__ == "__main__":
    import uvicorn
    # Chạy trên port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)