import os
from app.core.config import settings
from app.utils.text_splitter import TextSplitter
from app.repositories.vector_store import VectorStoreRepository
from langchain_community.embeddings import HuggingFaceEmbeddings

class RAGService:
    def __init__(self):
     
        self.embeddings = HuggingFaceEmbeddings(
            model_name="all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'}
        )
      
        self.repository = VectorStoreRepository(self.embeddings)

    def ingest_transcript(self, session_id: str, text: str):
    
        chunks = TextSplitter.split(text)
      
        self.repository.add_texts(str(session_id), chunks)
        return True

    def search_context(self, session_id: str, query: str):
 
        docs = self.repository.get_relevant_documents(str(session_id), query, k=3)
        
        if not docs:
            return "" 
      
        return "\n".join([d.page_content for d in docs])