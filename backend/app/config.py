import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MODELS_DIR: str = os.getenv("MODELS_DIR", "models")
    CALIBRATORS_DIR: str = os.getenv("CALIBRATORS_DIR", "calibrators_final")
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "*").split(",")
    
settings = Settings()
