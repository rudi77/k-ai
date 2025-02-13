from pydantic_settings import BaseSettings
from typing import List
import secrets

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ENCRYPTION_KEY: str = secrets.token_urlsafe(32)  # For Fernet encryption

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    # OpenAI
    OPENAI_API_KEY: str

    # File Storage
    UPLOAD_DIR: str = "uploads"

    class Config:
        env_file = ".env"

settings = Settings() 