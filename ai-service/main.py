import os
import whisper
import json
from fastapi import FastAPI, UploadFile, File
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

client = OpenAI(api_key=os.getenv("AI_API_KEY"))

print("--- Đang nạp model AI Whisper... ---")
model = whisper.load_model("base")
print("--- Đã nạp xong model! Sẵn sàng bóc băng ---")

@app.post("/ai/process-video")
async def process_video(file: UploadFile = File(...)):
    # Bước A: Lưu file video tạm thời để AI đọc
    temp_name = f"temp_{file.filename}"
    with open(temp_name, "wb") as buffer:
        buffer.write(await file.read())

    try:
        # Bước B: Whisper bóc băng âm thanh thành văn bản (Speech-to-Text)
        print(f"--- Đang bóc băng file: {file.filename} ---")
        result = model.transcribe(temp_name)
        transcript = result["text"]

        # Bước C: Gửi văn bản sang GPT-4o-mini để tóm tắt & lấy ý chính
        print("--- Đang nhờ GPT tóm tắt nội dung bài giảng ---")
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system", 
                    "content": "Bạn là chuyên gia giáo dục. Hãy tóm tắt transcript bài giảng sau thành JSON gồm: "
                               "'summary' (đoạn văn tóm tắt khoảng 3-5 câu) và "
                               "'key_points' (một mảng các chuỗi chứa các ý chính quan trọng). Trả về JSON thuần."
                },
                {"role": "user", "content": transcript}
            ],
            response_format={ "type": "json_object" }
        )

        # Trả kết quả về cho Spring Boot
        return {
            "fileName": file.filename,
            "transcript": transcript,
            "analysis": json.loads(response.choices[0].message.content)
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}
        
    finally:
        if os.path.exists(temp_name):
            os.remove(temp_name)

if __name__ == "__main__":
    import uvicorn
    # Chạy server ở cổng 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)