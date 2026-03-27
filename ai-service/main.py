import os
import json
import re
import whisper
from groq import Groq 
from fastapi import FastAPI, UploadFile, File, HTTPException
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()
model_whisper = whisper.load_model("base")

def extract_json(text: str):
    try:
        match = re.search(r'\{.*\}', text, re.DOTALL)
        return json.loads(match.group()) if match else {"summary": text, "key_points": []}
    except: return {"summary": text, "key_points": []}

@app.post("/ai/process-video")
async def process_video(file: UploadFile = File(...)):
    temp_file = f"temp_{file.filename}"
    try:
        with open(temp_file, "wb") as buffer:
            buffer.write(await file.read())

        print(f"🎧 Whisper đang bóc băng...")
        result = model_whisper.transcribe(temp_file, fp16=False)
        transcript = result.get("text", "").strip()

        print("🧠 Groq (Llama 3) đang tóm tắt...")
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "Bạn là trợ lý học tập. Trả về JSON gồm 'summary' và 'key_points' bằng tiếng Việt."},
                {"role": "user", "content": transcript}
            ],
            model="qwen/qwen3-32b", 
            response_format={"type": "json_object"}
        )

        analysis = json.loads(chat_completion.choices[0].message.content)

        return {
            "status": "success",
            "transcript": transcript,
            "analysis": analysis
        }
    except Exception as e:
        return {"error": str(e)}
    finally:
        if os.path.exists(temp_file): os.remove(temp_file)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)