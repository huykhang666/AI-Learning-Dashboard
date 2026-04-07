from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from app.core.config import settings
from app.core.constants import CHAT_PROMPT_TEMPLATE

class LLMService:
    def __init__(self):
        self.llm = ChatGroq(
            model_name="llama-3.3-70b-versatile",
            groq_api_key=settings.GROQ_API_KEY,
            temperature=0.7 
        )

    def get_answer(self, context: str, query: str, history: list = None):
        # 1. Khởi tạo danh sách tin nhắn với System Prompt (Luôn ở đầu)
        # Đảm bảo CHAT_PROMPT_TEMPLATE trong constants.py có biến {context}
        messages = [
            SystemMessage(content=CHAT_PROMPT_TEMPLATE.format(context=context))
        ]
        
        # 2. Thêm lịch sử hội thoại vào giữa (nếu có)
        if history:
            for msg in history:
                if msg.get("role") == "user": # Dùng .get để tránh lỗi Key
                    messages.append(HumanMessage(content=msg["content"]))
                elif msg.get("role") == "assistant" or msg.get("role") == "ai":
                    messages.append(AIMessage(content=msg["content"]))
        
        # 3. Thêm câu hỏi mới nhất của User vào cuối
        messages.append(HumanMessage(content=query))
        
        # 4. Gọi AI và trả về nội dung
        response = self.llm.invoke(messages)
        return response.content