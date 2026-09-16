from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .config import settings
from .services.model_service import model_service
from .routes import health, forecast, model_info, production, alerts, explainability, monsoonmitra, auth

from apscheduler.schedulers.background import BackgroundScheduler
import asyncio
from .services.weather_sync import fetch_live_atmospheric_data

def scheduled_weather_sync():
    print("[CRON] Running automated daily atmospheric weather sync across reference coordinates...")
    asyncio.run(fetch_live_atmospheric_data(21.90, 77.90))
    print("[CRON] Weather sync complete.")

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Loading models and calibrators...")
    success = model_service.load_artifacts()
    if not success:
        print("WARNING: Some model artifacts are missing. Prediction endpoints will fail.")
    else:
        print("Models loaded successfully.")
        
    # Start automated daily sync scheduler
    scheduler = BackgroundScheduler()
    # Runs everyday at 6:00 AM IST and once every 6 hours
    scheduler.add_job(scheduled_weather_sync, 'interval', hours=6)
    scheduler.start()
    print("Automated Atmospheric Weather Sync Scheduler started.")
    
    yield
    scheduler.shutdown()

app = FastAPI(
    title="MonsoonMitra API",
    description="Hyperlocal Monsoon Onset & Break Prediction System (SIH26086)",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Core & Legacy routers
app.include_router(health.router, tags=["Health"])
app.include_router(model_info.router, tags=["Model Info"])
app.include_router(forecast.router, tags=["Forecast"])
app.include_router(production.router, prefix="/api/production", tags=["Production Forecast"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts System"])
app.include_router(explainability.router, prefix="/api/production", tags=["Explainability"])

# New Comprehensive MonsoonMitra Engine
app.include_router(monsoonmitra.router, prefix="/api", tags=["MonsoonMitra Platform"])
app.include_router(auth.router, prefix="/api/auth", tags=["Kisan Authentication"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
