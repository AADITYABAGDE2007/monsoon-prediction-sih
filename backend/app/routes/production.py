from fastapi import APIRouter, HTTPException
import pandas as pd
import os

router = APIRouter()

# Global cache for production dataframe
_PRODUCTION_DF = None

def get_production_df():
    global _PRODUCTION_DF
    if _PRODUCTION_DF is not None:
        return _PRODUCTION_DF
    
    # Locate the parquet
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    parquet_path = os.path.join(base_dir, "forecast", "risk", "risk_alert_forecast_2025-09-30.parquet")
    
    if not os.path.exists(parquet_path):
        return None
        
    try:
        _PRODUCTION_DF = pd.read_parquet(parquet_path)
        # Convert Timestamp to string
        _PRODUCTION_DF['date'] = _PRODUCTION_DF['date'].astype(str)
        # Filter to the latest target date
        _PRODUCTION_DF = _PRODUCTION_DF[_PRODUCTION_DF['date'].str.startswith("2025-09-30")]
        return _PRODUCTION_DF
    except Exception as e:
        print(f"Error loading parquet: {e}")
        return None

@router.get("/summary")
def get_production_summary():
    df = get_production_df()
    if df is None:
        raise HTTPException(status_code=404, detail="Production forecast not found")
        
    return {
        "date": "2025-09-30",
        "total_blocks": len(df),
        "alert_levels": df['alert_level'].value_counts().to_dict(),
        "model_version": df['model_version'].iloc[0] if len(df) > 0 else "unknown"
    }

@router.get("/blocks")
def get_production_blocks():
    df = get_production_df()
    if df is None:
        raise HTTPException(status_code=404, detail="Production forecast not found")
    
    # Return a lightweight list for the explorer table
    summary_df = df[['block_id', 'alert_level', 'combined_monsoon_risk']].copy()
    return summary_df.fillna("").to_dict(orient="records")

@router.get("/block/{block_id}")
def get_block_forecast(block_id: str):
    df = get_production_df()
    if df is None:
        raise HTTPException(status_code=404, detail="Production forecast not found")
        
    block_row = df[df['block_id'] == block_id]
    if block_row.empty:
        raise HTTPException(status_code=404, detail=f"Block {block_id} not found")
        
    # Pandas returns nan for missing floats, convert them for JSON serializability
    result = block_row.iloc[0].fillna("").to_dict()
    return result

from fastapi.responses import FileResponse

@router.get("/map/geojson")
def get_map_geojson():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    geojson_path = os.path.join(base_dir, "forecast", "geojson", "block_forecast_map_simplified_2025-09-30.geojson")
    
    if not os.path.exists(geojson_path):
        raise HTTPException(status_code=404, detail="Map GeoJSON not found")
        
    return FileResponse(geojson_path, media_type="application/geo+json")
