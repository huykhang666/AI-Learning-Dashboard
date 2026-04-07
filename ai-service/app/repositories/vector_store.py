import os
from langchain_community.vectorstores import Chroma
from app.core.config import settings

class VectorStoreRepository:
    def __init__(self, embeddings):
        self.embeddings = embeddings
        self.storage_path = settings.STORAGE_PATH

    def add_texts(self, session_id: str, texts: list):
        # Đảm bảo session_id là string và tạo đường dẫn
        persist_dir = os.path.join(self.storage_path, str(session_id))
        
        # Chroma tự động tạo folder nếu chưa có
        vector_db = Chroma.from_texts(
            texts=texts,
            embedding=self.embeddings,
            persist_directory=persist_dir
        )
        # Không cần gọi .persist() ở các bản Chroma mới, nó tự lưu rồi
        return vector_db

    def get_relevant_documents(self, session_id: str, query: str, k: int = 3):
        persist_dir = os.path.join(self.storage_path, str(session_id))
        
        # Nếu chưa có dữ liệu cho bài học này thì trả về list rỗng
        if not os.path.exists(persist_dir):
            print(f"⚠️ Cảnh báo: Không tìm thấy folder lưu trữ tại {persist_dir}")
            return []

        # Load DB lên để search kiến thức
        vector_db = Chroma(
            persist_directory=persist_dir, 
            embedding_function=self.embeddings
        )
        return vector_db.similarity_search(query, k=k)