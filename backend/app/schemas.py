from pydantic import BaseModel, Field
from typing import List

class PredictionFeatures(BaseModel):
    rainfall_mm: float
    rain_3d: float
    rain_5d: float
    rain_7d: float
    rain_15d: float
    rain_30d: float
    rain_days_7d: float
    dry_days_7d: float
    rain_days_15d: float
    dry_days_15d: float
    consecutive_dry_days: float
    u925: float
    v925: float
    speed925: float
    u850: float
    v850: float
    speed850: float
    wind_shear: float
    rh925: float
    rh850: float
    dmi: float
    RMM1: float
    RMM2: float
    phase: float
    amplitude: float
    oni: float
    day_of_year: float
    month: float
    monsoon_day: float
    olr: float
    olr_3d_mean: float
    olr_5d_mean: float
    olr_climatology: float
    olr_anomaly: float

class BatchPredictionRequest(BaseModel):
    block_ids: List[str]
    features: List[PredictionFeatures]
