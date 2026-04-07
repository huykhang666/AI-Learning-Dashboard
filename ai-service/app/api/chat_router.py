from fastapi import APIRouter
from app.schemas.request import ChatRequest, IngestRequest
from app.services.rag_service import RAGService
from app.services.llm_service import LLMService

router = APIRouter(prefix="/ai", tags=["Chatbot"])

rag_service = RAGService()
llm_service = LLMService()

@router.post("/ingest")
async def ingest(request: IngestRequest):
    rag_service.ingest_transcript(request.session_id, request.transcript)
    return {"message": "Success"}

@router.post("/chat")
async def chat(request: ChatRequest):
    context = rag_service.search_context(request.session_id, request.query)
    answer = llm_service.get_answer(context, request.query, request.history)
    return {"answer": answer}