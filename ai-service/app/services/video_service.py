import re
import httpx
from groq import Groq
from app.core.config import settings
from youtube_transcript_api import YouTubeTranscriptApi

class VideoService:
    def __init__(self):
        # Không tải model local nữa, chuyển sang gọi Client của Groq thông qua API Key
        print("--- [INFO] Khởi tạo Groq Client cho dịch vụ Speech-to-Text ---")
        self.groq_client = Groq(api_key=settings.GROQ_API_KEY)

    def get_video_id(self, url):
        # Regex thông minh để lấy Video ID từ mọi định dạng link YouTube
        video_id = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11}).*", url)
        return video_id.group(1) if video_id else None

    def get_youtube_transcript(self, url):
        try:
            video_id = self.get_video_id(url)
            if not video_id: return None
            
            # Ưu tiên tiếng Việt, sau đó đến tiếng Anh
            transcript_list = YouTubeTranscriptApi().fetch(video_id, languages=['vi', 'en'])
            return " ".join([t.text for t in transcript_list])
        except Exception as e:
            print(f"Không lấy được phụ đề YouTube: {str(e)}")
            return None

    async def report_progress(self, job_id: int, percent: int):
        if job_id:
            try:
                # Sử dụng timeout ngắn để không làm chậm quá trình bóc băng nếu Java bị treo
                async with httpx.AsyncClient(timeout=5.0) as client_http:
                    url = f"{settings.JAVA_URL}/update-progress/{job_id}"
                    await client_http.patch(url, params={"value": percent})
                    print(f"Đã báo tiến độ {percent}% về Java.")
            except Exception as e:
                print(f"Lỗi kết nối Java: {str(e)}")

    def transcribe_video(self, file_path: str):
        """
        Gửi file audio/video trực tiếp lên Groq Cloud để bóc băng bằng Whisper-Large-v3.
        Server Railway không tốn một giọt RAM nào để tính toán!
        """
        try:
            print(f"--- [INFO] Đang gửi file {file_path} lên Groq API để transribe... ---")
            with open(file_path, "rb") as file:
                response = self.groq_client.audio.transcriptions.create(
                    file=file,
                    model="whisper-large-v3", 
                    language="vi",            
                    response_format="text"    
                )
            return response.strip()
        except Exception as e:
            print(f"Lỗi khi gọi Groq Whisper API: {str(e)}")
            return ""