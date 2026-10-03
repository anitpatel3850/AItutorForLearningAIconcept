import os
from pathlib import Path
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Search for .env in current dir, backend/, or project root
root_dir = Path(__file__).resolve().parent.parent.parent
backend_dir = Path(__file__).resolve().parent.parent

for env_path in [backend_dir / ".env", root_dir / ".env"]:
    if env_path.exists():
        load_dotenv(env_path)

class Settings(BaseSettings):
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "") or os.getenv("OPENAI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    AI_MODEL: str = os.getenv("AI_MODEL", "gemini-3.5-flash-lite")
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://127.0.0.1:27017")
    MONGODB_DATABASE: str = os.getenv("MONGODB_DATABASE", "ai_quest")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "ai-quest-secret-key-atlas-2026")

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
