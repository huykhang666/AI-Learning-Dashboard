from pydantic import BaseModel
from typing import List, Optional, Dict

class ChatRequest(BaseModel):
    session_id: str
    query: str
    history: Optional[List[Dict[str, str]]] = []
class IngestRequest(BaseModel):
    session_id: str
    transcript: str