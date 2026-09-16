from fastapi import APIRouter
from ..services.model_service import model_service, FEATURES

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "models_loaded": model_service.models_loaded,
        "feature_count": len(FEATURES)
    }
