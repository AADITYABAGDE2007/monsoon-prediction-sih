from fastapi import APIRouter, HTTPException
from ..schemas import PredictionFeatures, BatchPredictionRequest
from ..services.model_service import model_service

router = APIRouter()

@router.post("/predict")
def predict_single(features: PredictionFeatures):
    if not model_service.models_loaded:
        raise HTTPException(status_code=503, detail="Models not loaded")
        
    try:
        return model_service.predict_all(features.model_dump())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/predict/batch")
def predict_batch(request: BatchPredictionRequest):
    if not model_service.models_loaded:
        raise HTTPException(status_code=503, detail="Models not loaded")
        
    try:
        features_list = [f.model_dump() for f in request.features]
        batch_preds = model_service.predict_batch(features_list)
        
        results = []
        for block_id, preds in zip(request.block_ids, batch_preds):
            results.append({"block_id": block_id, "predictions": preds})
            
        return {"batch_results": results}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
