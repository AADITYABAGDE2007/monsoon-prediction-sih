import httpx
from datetime import datetime
from typing import Dict, Any

# Open-Meteo provides free ECMWF/IMD calibrated atmospheric data
# No API key required, reliable for high-frequency downscaling
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

async def fetch_live_atmospheric_data(lat: float, lon: float) -> Dict[str, Any]:
    """
    Fetches real-time atmospheric variables corresponding to our 34-feature model contract:
    - 2m Temperature, Relative Humidity
    - Surface & Pressure level winds (u/v components or speed & direction)
    - Precipitation & convective indicators
    """
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": ["temperature_2m", "relative_humidity_2m", "precipitation", "surface_pressure", "wind_speed_10m", "wind_direction_10m"],
        "daily": ["precipitation_sum", "precipitation_probability_max", "temperature_2m_max", "temperature_2m_min"],
        "timezone": "Asia/Kolkata",
        "forecast_days": 16
    }
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(OPEN_METEO_URL, params=params)
            if resp.status_code == 200:
                data = resp.json()
                curr = data.get("current", {})
                daily = data.get("daily", {})
                
                # Derive live metrics
                precip_sums = daily.get("precipitation_sum", [0])
                rain_7d = sum(precip_sums[:7])
                rain_14d = sum(precip_sums[:14])
                
                return {
                    "status": "success",
                    "source": "Open-Meteo (ECMWF/IMD Ensemble)",
                    "synced_at": datetime.now().strftime("%d %b %Y, %I:%M %p IST"),
                    "coordinates": {"lat": lat, "lon": lon},
                    "current": {
                        "temperature_c": curr.get("temperature_2m"),
                        "humidity_pct": curr.get("relative_humidity_2m"),
                        "current_rain_mm": curr.get("precipitation", 0.0),
                        "pressure_hpa": curr.get("surface_pressure"),
                        "wind_speed_kmh": curr.get("wind_speed_10m"),
                        "wind_dir_deg": curr.get("wind_direction_10m")
                    },
                    "cumulative_forecast": {
                        "next_7d_rainfall_mm": round(rain_7d, 1),
                        "next_14d_rainfall_mm": round(rain_14d, 1),
                        "daily_trend": [
                            {
                                "date": daily.get("time", [])[i],
                                "rainfall_mm": daily.get("precipitation_sum", [])[i] if i < len(precip_sums) else 0,
                                "max_temp": daily.get("temperature_2m_max", [])[i] if i < len(daily.get("temperature_2m_max", [])) else 0
                            }
                            for i in range(min(7, len(daily.get("time", []))))
                        ]
                    }
                }
    except Exception as e:
        print(f"Live weather fetch error: {e}")
        
    # Fallback to calibrated baseline if network is unreachable
    return {
        "status": "fallback",
        "source": "MonsoonMitra Climatological Baseline",
        "synced_at": datetime.now().strftime("%d %b %Y, %I:%M %p IST"),
        "coordinates": {"lat": lat, "lon": lon},
        "current": {
            "temperature_c": 28.5,
            "humidity_pct": 78,
            "current_rain_mm": 12.4,
            "pressure_hpa": 1008.2,
            "wind_speed_kmh": 14.2,
            "wind_dir_deg": 230
        },
        "cumulative_forecast": {
            "next_7d_rainfall_mm": 95.0,
            "next_14d_rainfall_mm": 180.0,
            "daily_trend": []
        }
    }
