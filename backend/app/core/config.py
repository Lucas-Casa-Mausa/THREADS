from pydantic import field_validator
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://threads:threads123@localhost:5432/threads"

    # Security — SECRET_KEY must be supplied via environment (no default).
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    # App
    PROJECT_NAME: str = "THREADS API"
    VERSION: str = "1.0.0"
    DEBUG: bool = False

    @field_validator("SECRET_KEY")
    @classmethod
    def _validate_secret_key(cls, v: str) -> str:
        if len(v) < 32:
            raise ValueError(
                "SECRET_KEY must be at least 32 characters. "
                "Generate one with: openssl rand -hex 32"
            )
        weak = {"your-secret-key-here-change-in-production", "changeme", "secret"}
        if v in weak:
            raise ValueError("SECRET_KEY is using a known weak/default value.")
        return v

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
