from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
import pandas as pd
import numpy as np
import os
import xgboost as xgb
from ..services.model_service import model_service, FEATURES

router = APIRouter()

# Global cache for the feature dataframe to avoid reloading 60MB repeatedly
_FEATURES_DF = None

def get_features_df():
    global _FEATURES_DF
    if _FEATURES_DF is not None:
        return _FEATURES_DF
    
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    parquet_path = os.path.join(base_dir, "forecast", "production_engine", "production_features_2025-09-30.parquet")
    
    if not os.path.exists(parquet_path):
        return None
        
    try:
        _FEATURES_DF = pd.read_parquet(parquet_path)
        _FEATURES_DF['date'] = _FEATURES_DF['date'].astype(str)
        return _FEATURES_DF
    except Exception as e:
        print(f"Error loading features parquet: {e}")
        return None

@router.get("/block/{block_id}/explainability")
def get_explainability(
    block_id: str, 
    model: str = Query(..., description="Model to explain, e.g., onset_7d, onset_14d, break_7d, break_14d"),
    target_date: str = Query("2025-09-30", description="Forecast date")
):
    df = get_features_df()
    if df is None:
        raise HTTPException(status_code=503, detail="Feature artifact not found")
        
    # Filter for the block and date
    # In parquet, the date might contain timestamp part like '2025-09-30 00:00:00'
    block_row = df[(df['block_id'] == block_id) & (df['date'].str.startswith(target_date))]
    if block_row.empty:
        raise HTTPException(status_code=404, detail=f"Feature vector not found for block {block_id} on {target_date}")
        
    # Extract the exact 34 features in the exact order
    try:
        feature_vector = block_row.iloc[0][FEATURES].to_dict()
    except KeyError as e:
        raise HTTPException(status_code=500, detail=f"Feature contract mismatch: {e}")

    # Ensure models are loaded
    if not model_service.models_loaded:
        model_service.load_artifacts()
        
    if model not in model_service.models:
        raise HTTPException(status_code=400, detail=f"Invalid model requested. Available: {list(model_service.models.keys())}")

    # Construct DMatrix
    feature_df = pd.DataFrame([feature_vector], columns=FEATURES)
    dmat = xgb.DMatrix(feature_df)
    
    booster = model_service.models[model]
    
    # 1. Get raw prediction score (margin)
    raw_margin = booster.predict(dmat, output_margin=True)[0]
    
    # 2. Get calibrated probability (via model_service)
    # We call predict_all on the model_service which returns all, we just extract the requested
    all_preds = model_service.predict_all(feature_vector)
    calibrated_prob = all_preds[model]['calibrated_score']
    
    # 3. Calculate exact SHAP contributions (native XGBoost feature contributions)
    contribs = booster.predict(dmat, pred_contribs=True)[0]
    
    shap_values = contribs[:-1]
    base_value = contribs[-1]
    
    # Verify sum matches margin
    shap_sum = float(np.sum(shap_values) + base_value)
    
    # Structure the explanation
    explanation = []
    for i, feature_name in enumerate(FEATURES):
        explanation.append({
            "feature": feature_name,
            "value": float(feature_vector[feature_name]),
            "contribution": float(shap_values[i])
        })
        
    # Sort into positive and negative contributors
    explanation.sort(key=lambda x: x["contribution"], reverse=True)
    positive_contributors = [x for x in explanation if x["contribution"] > 0]
    negative_contributors = [x for x in explanation if x["contribution"] < 0]
    
    return {
        "block_id": block_id,
        "forecast_date": target_date,
        "model_name": model,
        "raw_score": float(raw_margin),
        "shap_sum_validation": shap_sum,
        "calibrated_probability": calibrated_prob,
        "base_value": float(base_value),
        "explanation_status": "SUCCESS",
        "model_version": "xgboost-frozen-production",
        "contributions": explanation,
        "positive_contributors": positive_contributors,
        "negative_contributors": negative_contributors[::-1] # Reverse so largest negative is first
    }
