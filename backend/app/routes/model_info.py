from fastapi import APIRouter
from ..services.model_service import model_service, FEATURES

router = APIRouter()

@router.get("/model-info")
def model_info():
    return {
        "models": ["Onset 7-Day", "Onset 14-Day", "Break 7-Day", "Break 14-Day"],
        "feature_count": len(FEATURES),
        "calibration_method": "Isotonic regression",
        "thresholds": model_service.thresholds,
        "model_version": "baseline-2024"
    }
