import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchMapData } from '../services/api';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Filter, Layers, ArrowRight, ShieldAlert, CloudRain, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HyperlocalMap() {
  const { lang, setLocation } = useApp();
  const navigate = useNavigate();

  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [activeLayer, setActiveLayer] = useState<string>('risk');

  useEffect(() => {
    fetchMapData()
      .then(res => {
        setFeatures(res);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const filteredFeatures = features.filter(f => {
    if (selectedRisk === 'ALL') return true;
    return f.risk_level === selectedRisk;
  });

  const getMarkerColor = (f: any) => {
    if (activeLayer === 'risk') {
      if (f.risk_level === 'HIGH') return '#ef4444';
      if (f.risk_level === 'MODERATE') return '#f59e0b';
      return '#10b981';
    } else if (activeLayer === 'onset') {
      return f.onset_probability > 75 ? '#2563eb' : '#93c5fd';
    } else {
      return f.break_probability > 30 ? '#ea580c' : '#fdba74';
    }
  };

  const handleSelectLocation = (f: any) => {
    setLocation({
      id: f.id,
      state: f.state,
      district: f.district,
      block: f.block,
      panchayat: f.panchayat,
      block_id: f.block_id,
      lat: f.lat,
      lon: f.lon
    });
    navigate('/dashboard');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            {lang === 'en' ? 'Spatial Granularity Map' : 'भू-स्थानिक हाइपरलोकल नक्शा'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {lang === 'en' ? 'Hyperlocal Monsoon Risk Map' : 'हाइपरलोकल मानसून जोखिम नक्शा (ब्लॉक स्तर)'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'en' 
              ? 'Click any block node to view calibrated onset, dry spell, and downpour probabilities.' 
              : 'ब्लॉक पर क्लिक करके आगमन, सूखा दौर और भारी बारिश की सटीक संभावना देखें।'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Layer switch */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveLayer('risk')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeLayer === 'risk' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Overall Risk
            </button>
            <button
              onClick={() => setActiveLayer('onset')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeLayer === 'onset' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Onset Prob
            </button>
            <button
              onClick={() => setActiveLayer('break')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeLayer === 'break' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Break Risk
            </button>
          </div>

          {/* Filter */}
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="text-xs font-bold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-700 shadow-sm focus:outline-none"
          >
            <option value="ALL">All Risk Zones</option>
            <option value="HIGH">High Risk Zones</option>
            <option value="MODERATE">Moderate Zones</option>
            <option value="LOW">Low Risk Zones</option>
          </select>

        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[68vh] relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <MapContainer
            center={[22.5, 78.5]}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filteredFeatures.map((f) => (
              <CircleMarker
                key={f.id}
                center={[f.lat, f.lon]}
                radius={8}
                pathOptions={{
                  fillColor: getMarkerColor(f),
                  color: '#ffffff',
                  weight: 1.5,
                  fillOpacity: 0.85
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[200px] space-y-2">
                    <div className="border-b border-slate-100 pb-2">
                      <div className="text-sm font-black text-slate-900">
                        {f.block} Block
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {f.district}, {f.state}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 p-2 rounded">
                        <span className="text-[10px] text-slate-400 block font-bold">ONSET PROB</span>
                        <span className="text-sm font-extrabold text-blue-600">{f.onset_probability}%</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded">
                        <span className="text-[10px] text-slate-400 block font-bold">BREAK RISK</span>
                        <span className="text-sm font-extrabold text-amber-600">{f.break_probability}%</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded col-span-2">
                        <span className="text-[10px] text-slate-400 block font-bold">HEAVY RAIN CHANCE</span>
                        <span className="text-sm font-extrabold text-red-600">{f.heavy_rain_risk}%</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectLocation(f)}
                      className="w-full mt-1 flex items-center justify-center gap-1.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors"
                    >
                      <span>View Full Dashboard</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        )}

        {/* Legend overlay */}
        <div className="absolute bottom-6 right-6 z-[1000] bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-lg text-xs space-y-2">
          <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            Risk Classification
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600">Low Risk (&lt; 40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="text-slate-600">Moderate Risk (40–65%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-slate-600">High Risk (&gt; 65%)</span>
          </div>
        </div>

      </div>

    </div>
  );
}
