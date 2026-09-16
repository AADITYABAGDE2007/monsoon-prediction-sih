import axios from 'axios';

const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    if (envUrl.startsWith('http://') || envUrl.startsWith('https://')) {
      return envUrl;
    }
    return `https://${envUrl}`;
  }
  // Auto-detect Render deployment domain
  if (typeof window !== 'undefined' && window.location.hostname.includes('onrender.com')) {
    return 'https://monsoonmitra-backend.onrender.com';
  }
  return 'http://localhost:8000';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Model & System info
export const fetchHealth = () => api.get('/health').then(res => res.data);
export const fetchModelInfo = () => api.get('/model-info').then(res => res.data);
export const predict = (features: any) => api.post('/predict', features).then(res => res.data);

// Location APIs
export const fetchStates = () => api.get('/api/locations/states').then(res => res.data.states);
export const fetchDistricts = (state: string) => api.get(`/api/locations/districts?state=${encodeURIComponent(state)}`).then(res => res.data.districts);
export const fetchBlocks = (district: string) => api.get(`/api/locations/blocks?district=${encodeURIComponent(district)}`).then(res => res.data.blocks);
export const fetchPanchayats = (block: string) => api.get(`/api/locations/panchayats?block=${encodeURIComponent(block)}`).then(res => res.data.panchayats);
export const searchLocations = (query: string) => api.get(`/api/locations/search?q=${encodeURIComponent(query)}`).then(res => res.data.results);

// Core Platform APIs
export const fetchDashboard = (locationId?: string) => 
  api.get(`/api/dashboard${locationId ? `?location_id=${locationId}` : ''}`).then(res => res.data);

export const fetchForecast = (locationId?: string, days: number = 30) => 
  api.get(`/api/forecast?days=${days}${locationId ? `&location_id=${locationId}` : ''}`).then(res => res.data);

export const fetchAdvisory = (crop: string, growthStage: string, locationId?: string) => 
  api.get(`/api/advisory?crop=${encodeURIComponent(crop)}&growth_stage=${encodeURIComponent(growthStage)}${locationId ? `&location_id=${locationId}` : ''}`).then(res => res.data);

export const fetchHistory = (locationId?: string) => 
  api.get(`/api/history${locationId ? `?location_id=${locationId}` : ''}`).then(res => res.data);

export const fetchClimateSignals = () => 
  api.get('/api/climate-signals').then(res => res.data);

export const fetchAlerts = (locationId?: string) => 
  api.get(`/api/alerts${locationId ? `?location_id=${locationId}` : ''}`).then(res => res.data);

export const acknowledgeAlert = (alertId: string) => 
  api.post('/api/alerts/acknowledge', { alert_id: alertId }).then(res => res.data);

export const fetchMapData = () => 
  api.get('/api/map/data').then(res => res.data.features);

// Production ML / SHAP APIs
export const fetchProductionSummary = () => api.get('/api/production/summary').then(res => res.data);
export const fetchProductionBlocks = () => api.get('/api/production/blocks').then(res => res.data);
export const fetchProductionBlock = (blockId: string) => api.get(`/api/production/block/${blockId}`).then(res => res.data);
export const fetchExplainability = (blockId: string, model: string = 'onset_7d') => 
  api.get(`/api/production/block/${blockId}/explainability?model=${model}`).then(res => res.data);

// Kisan Authentication APIs
export const sendOtp = (phone: string) => api.post('/api/auth/send-otp', { phone }).then(res => res.data);
export const verifyOtp = (phone: string, otp: string, name?: string, locationId?: number) => 
  api.post('/api/auth/verify-otp', { phone, otp, name, location_id: locationId }).then(res => res.data);

// Live Weather Sync API
export const fetchLiveWeather = (locationId?: string) => 
  api.get(`/api/weather/live${locationId ? `?location_id=${locationId}` : ''}`).then(res => res.data);


