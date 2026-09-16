import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchForecast } from '../services/api';
import { 
  Calendar, 
  CloudRain, 
  Sun, 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle2,
  Sliders,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

export default function ForecastPage() {
  const { lang, location } = useApp();
  const [horizon, setHorizon] = useState<number>(30);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchForecast(String(location.id), horizon)
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [location.id, horizon]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-600">Generating multi-horizon predictions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            {lang === 'en' ? 'Probabilistic Multi-Horizon Outlook' : 'संभाव्यता आधारित बहु-अवधि पूर्वानुमान'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {lang === 'en' ? 'Hyperlocal Forecast Horizon' : 'हाइपरलोकल पूर्वानुमान (7–30 दिन)'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {location.block} Block ({location.district}, {location.state}) • Forecast Horizon: {horizon} Days
          </p>
        </div>

        {/* Horizon Filter Tabs */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
          {[7, 14, 21, 30].map((d) => (
            <button
              key={d}
              onClick={() => setHorizon(d)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                horizon === d
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {d} {lang === 'en' ? 'Days' : 'दिन'}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Horizon Period Timeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {data.periods.map((p: any, i: number) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md uppercase">
                {p.period}
              </span>
              <span className="text-[11px] font-bold text-slate-400">{p.confidence}% Conf.</span>
            </div>

            <div className="text-lg font-bold text-slate-800">{p.rainfall}</div>
            <div className="text-xs font-semibold text-slate-500 mb-4">{p.rainfall_range}</div>

            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Onset Prob:</span>
                <span className="font-bold text-blue-600">{p.onset}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Break Risk:</span>
                <span className="font-bold text-amber-600">{p.break_risk}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Heavy Rain:</span>
                <span className="font-bold text-red-600">{p.heavy_rain}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4 Multi-Line Probabilistic Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Rainfall Trend */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            {lang === 'en' ? 'Daily Rainfall Outlook (mm)' : 'दैनिक वर्षा दृष्टिकोण (मिमी)'}
          </h3>
          <p className="text-xs text-slate-400 mb-4">Projected precipitation volume over the next {horizon} days</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.timeline}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="rainfall_mm" stroke="#2563eb" strokeWidth={2} dot={false} name="Rainfall mm" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Onset Probability Trend */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            {lang === 'en' ? 'Onset Probability Trend (%)' : 'मानसून आगमन संभावना (%)'}
          </h3>
          <p className="text-xs text-slate-400 mb-4">Dynamic probability threshold calibrated with isotonic regression</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.timeline}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="onset_prob" stroke="#059669" strokeWidth={2} dot={false} name="Onset Prob %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Break / Dry Spell Risk */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            {lang === 'en' ? 'Break / Dry Spell Risk (%)' : 'मानसून ब्रेक (सूखा दौर) जोखिम (%)'}
          </h3>
          <p className="text-xs text-slate-400 mb-4">Estimated risk of consecutive non-rain days exceeding 5-day duration</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.timeline}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="break_prob" stroke="#d97706" strokeWidth={2} dot={false} name="Break Risk %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Heavy Rainfall Probability */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            {lang === 'en' ? 'Extreme Downpour Risk (%)' : 'अत्यधिक भारी वर्षा का जोखिम (%)'}
          </h3>
          <p className="text-xs text-slate-400 mb-4">Forecast of rainfall exceeding the 64.5 mm/day threshold</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.timeline}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="heavy_rain_prob" stroke="#dc2626" strokeWidth={2} dot={false} name="Heavy Rain %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
