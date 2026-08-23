import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Social Media Content Analyzer API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Gemini API key (optional - fallback engine used if missing)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # SQLite Database Path
    DB_PATH: str = os.getenv("DB_PATH", os.path.join(os.path.dirname(os.path.dirname(__file__)), "analyzer.db"))
    
    # CORS setup
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "*"]

settings = Settings()
