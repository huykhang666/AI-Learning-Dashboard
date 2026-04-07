from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.core.constants import CHUNK_SIZE, CHUNK_OVERLAP

class TextSplitter:
    @staticmethod
    def split(text: str):
    
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHUNK_SIZE,
            chunk_overlap=CHUNK_OVERLAP,
            length_function=len,
            separators=["\n\n", "\n", ". ", "? ", "! ", ", ", " ", ""]
        )
        return splitter.split_text(text)