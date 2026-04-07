from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import video_router, chat_router

try:
    from transformers import GPT2Tokenizer
    if not hasattr(GPT2Tokenizer, "additional_special_tokens"):
        setattr(GPT2Tokenizer, "additional_special_tokens", property(lambda self: []))
    if not hasattr(GPT2Tokenizer, "additional_special_tokens_ids"):
        setattr(GPT2Tokenizer, "additional_special_tokens_ids", property(lambda self: []))
    print("🚀 [HỆ THỐNG] Đã vá lỗi Tokenizer thành công!")
except Exception as e:
    print(f"⚠️ [CẢNH BÁO] Fix Tokenizer: {e}")

app = FastAPI(
    title="AI Learning Hub",
    description="Backend AI hỗ trợ bóc băng video và Chatbot RAG",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(video_router.router)
app.include_router(chat_router.router)

@app.get("/")
async def root():
    return {
        "status": "Online",
        "message": "AI Service đang vít ga cực mạnh!",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    # Khang nhớ chạy file này từ folder ai-service nhé
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)