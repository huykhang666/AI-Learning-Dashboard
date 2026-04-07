from pydantic import BaseModel
from typing import Optional, Any

class ChatResponse(BaseModel):
    answer: str
    status: str = "success"
    session_id: Optional[str] = None

class IngestResponse(BaseModel):
    message: str
    status: str = "success"
    session_id: str