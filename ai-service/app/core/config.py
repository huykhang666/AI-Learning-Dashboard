import os
from dotenv import load_dotenv

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
load_dotenv(os.path.join(base_dir, ".env"))

class Settings:
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY")
    JAVA_URL: str = "http://localhost:8080/api/v1/jobs"
    WHISPER_MODEL: str = "base"
 
    STORAGE_PATH: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../storage"))

    def __init__(self):
        if not os.path.exists(self.STORAGE_PATH):
            os.makedirs(self.STORAGE_PATH)

settings = Settings()