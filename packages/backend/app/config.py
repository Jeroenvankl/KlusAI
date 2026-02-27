from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Google AI (Gemini)
    GOOGLE_AI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # Legacy (kept for reference, no longer used)
    ANTHROPIC_API_KEY: str = ""

    # Database (SQLite for dev, PostgreSQL for prod)
    DATABASE_URL: str = "sqlite+aiosqlite:///./klusai.db"

    # SAM Model
    SAM_MODEL_PATH: str = "./data/models/mobile_sam.pt"
    SAM_MODEL_TYPE: str = "vit_t"

    # File uploads
    UPLOAD_DIR: str = "./uploads"
    MAX_IMAGE_SIZE: int = 10_000_000  # 10MB

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    class Config:
        env_file = ".env"


settings = Settings()
