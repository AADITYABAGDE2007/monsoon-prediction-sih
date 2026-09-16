# MonsoonMitra (SIH26086)
## Hyperlocal Monsoon Onset & Break Prediction System (Block & Panchayat Scale)

An AI-powered agricultural decision-support and early-warning platform converting global climate signals and atmospheric downscaling into actionable farm-level insights.

---

### Key Architectural Modules

1. **Dashboard (`/dashboard`)**:
   - Live Onset Probability (82%), Break Risk (24%), Heavy Rain Risk (68%), Rainfall Anomaly (+18%), and 24h precipitation.
   - 30-Day cumulative rainfall projections with interactive Recharts trends.
   - 4-Horizon outlook windows (Next 7d, 8–14d, 15–21d, 22–30d).

2. **Hierarchical Location Selector (`/location`)**:
   - Administrative cascading dropdown: State ➔ District ➔ Block ➔ Gram Panchayat.
   - Global search bar indexing all districts, blocks, and village clusters across India.

3. **Hyperlocal Interactive Map (`/map`)**:
   - Leaflet & React Leaflet geospatial mapping with CARTO basemaps.
   - Color-coded risk markers (Green: Low, Amber: Moderate, Red: High) and layer toggles (Overall Risk, Onset, Break).

4. **Probabilistic Multi-Horizon Forecast (`/forecast`)**:
   - 7, 14, 21, and 30-day forecast views with 4 multi-series line charts.

5. **Crop-Specific Advisory Engine (`/advisory`)**:
   - Rule-based agronomic decision engine covering Soybean, Paddy, Cotton, Maize, Pulses, and Wheat across all growth stages.
   - Bilingual (English & Hindi) guidance: Recommended Field Actions, Practices to Avoid, and Atmospheric rationale.

6. **Historical Climate Analysis (`/history`)**:
   - 18-Year long-term observation series (2009–2026) calibrated against IMD gridded normals.

7. **Planetary Climate Signals (`/climate-signals`)**:
   - Real-time teleconnection tracking: ENSO (ONI), IOD (DMI), MJO (RMM), and INSAT-3D OLR anomalies.

8. **Automated Alert Center (`/alerts`)**:
   - Early Warning System with simulated SMS (Twilio) and WhatsApp API dispatch.

---

### Local Execution Instructions

#### 1. Backend Service
```bash
cd backend
.venv\Scripts\activate
python -m uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend Application
```bash
cd frontend
npm run dev
```

Visit the application at: **http://localhost:5173**
Backend Swagger Documentation: **http://localhost:8000/docs**
