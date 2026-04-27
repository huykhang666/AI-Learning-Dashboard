import os
import logging
from app.core.config import settings
from app.utils.text_splitter import TextSplitter
from app.repositories.vector_store import VectorStoreRepository
from app.core.embeddings import embeddings

logger = logging.getLogger(__name__)

class RAGService:
    def __init__(self):
        self.embeddings = embeddings
        self.repository = VectorStoreRepository(self.embeddings)

    def ingest_transcript(self, session_id: str, text: str):
        chunks = TextSplitter.split(text)
        self.repository.add_texts(str(session_id), chunks)
        return True

    def search_context(self, session_id: str, query: str):
        query = query.strip().lower()
        storage_path = os.path.join(settings.STORAGE_PATH, str(session_id))

        logger.info(f"Tìm dữ liệu tại: {storage_path} | query: {query}")

        try:
            docs = self.repository.get_relevant_documents(
                str(session_id),
                query,
                k=3
            )

            if not docs:
                logger.warning("Không tìm thấy context phù hợp")
                return ""

            return "\n".join([d.page_content for d in docs])

        except Exception as e:
            logger.exception("Lỗi RAG")
            raise e