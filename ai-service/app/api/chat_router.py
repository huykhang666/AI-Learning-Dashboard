from fastapi import APIRouter
from app.schemas.request import ChatRequest, IngestRequest
from app.services.rag_service import RAGService
from app.services.llm_service import LLMService

router = APIRouter(prefix="/ai", tags=["Chatbot"])

rag_service = RAGService()
llm_service = LLMService()

@router.post("/chat")
async def chat(request: ChatRequest):
    # Tự động ingest transcript nếu có gửi lên và database RAG của session_id chưa được khởi tạo
    if request.transcript:
        import os
        from app.core.config import settings
        persist_dir = os.path.join(settings.STORAGE_PATH, str(request.session_id))
        if not os.path.exists(persist_dir) or not os.listdir(persist_dir):
            print(f"🚀 [Chatbot] Ingesting transcript dynamically for session/lesson {request.session_id}...")
            rag_service.ingest_transcript(request.session_id, request.transcript)

    context = rag_service.search_context(request.session_id, request.query)
    print("DEBUG context:", context)

    # Cho phép chạy tiếp tục ngay cả khi không tìm thấy context (sử dụng kiến thức chung của LLM)
    if not context:
        context = ""

    answer = llm_service.get_answer(context, request.query, request.history)
    print("DEBUG answer:", answer)

    if not answer:
        return {"answer": "AI không trả lời được"}

    return {"answer": answer}