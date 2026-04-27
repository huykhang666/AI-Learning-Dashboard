from fastapi import APIRouter
from app.schemas.request import ChatRequest, IngestRequest
from app.services.rag_service import RAGService
from app.services.llm_service import LLMService

router = APIRouter(prefix="/ai", tags=["Chatbot"])

rag_service = RAGService()
llm_service = LLMService()

@router.post("/chat")
async def chat(request: ChatRequest):
    context = rag_service.search_context(request.session_id, request.query)
    print("DEBUG context:", context)

    if not context:
        return {"answer": "Không tìm thấy dữ liệu liên quan"}

    answer = llm_service.get_answer(context, request.query, request.history)
    print("DEBUG answer:", answer)

    if not answer:
        return {"answer": "AI không trả lời được"}

    return {"answer": answer}