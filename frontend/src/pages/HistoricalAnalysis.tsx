import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchHistory } from '../services/api';
import {
  History as HistoryIcon,
  TrendingDown,
  TrendingUp,
  Award,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

export default function HistoricalAnalysis() {
  const { lang, location } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory(String(location.id))
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(console.error);
  }, [location.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5 mb-1">
          <HistoryIcon className="h-4 w-4" />
          {lang === 'en' ? 'Long-Term Observation Series' : 'दीर्घकालिक वर्षा सांख्यिकी (2009–2026)'}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {lang === 'en' ? 'Historical Monsoon Analysis' : 'ऐतिहासिक मानसून विश्लेषण (2009–2026)'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {location.block} Block ({location.district}) • Verified Climatological Trend Evaluation
        </p>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Average Annual Rain</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{data.kpis.avg_monsoon_rainfall} mm</div>
          <span className="text-[11px] text-slate-400">18-Year Baseline Normal</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Average Onset Date</span>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">{data.kpis.avg_onset_date}</div>
          <span className="text-[11px] text-slate-400">Normal Onset Window</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Wettest Year</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{data.kpis.wettest_year}</div>
          <span className="text-[11px] text-emerald-700 font-semibold">+16% Above Normal</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Driest Year</span>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">{data.kpis.driest_year}</div>
          <span className="text-[11px] text-rose-700 font-semibold">-19% Below Normal</span>
        </div>
      </div>

      {/* Chart 1: Annual Rainfall Series */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          {lang === 'en' ? 'Annual Monsoon Precipitation (2009–2026)' : 'वार्षिक मानसूनी वर्षा (2009–2026)'}
        </h3>
        <p className="text-xs text-slate-500 mb-4">Observed precipitation (mm) against the 990 mm regional normal</p>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.annual_series}>
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="rainfall" fill="#2563eb" radius={[4, 4, 0, 0]} name="Rainfall (mm)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Rainfall Anomaly Trend */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          {lang === 'en' ? 'Rainfall Percentage Anomaly (%)' : 'वर्षा विचलन प्रतिशत (%)'}
        </h3>
        <p className="text-xs text-slate-500 mb-4">Deviation from the long-period average</p>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.annual_series}>
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="anomaly" stroke="#dc2626" strokeWidth={2.5} name="Anomaly %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
