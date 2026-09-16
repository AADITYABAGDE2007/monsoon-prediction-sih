import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchClimateSignals } from '../services/api';
import {
  Activity,
  Globe2,
  Wind,
  Compass,
  CheckCircle2,
  Info,
  Waves
} from 'lucide-react';

export default function ClimateSignalsPage() {
  const { lang } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClimateSignals()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

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
        <div className="text-xs font-bold uppercase tracking-wider text-cyan-600 flex items-center gap-1.5 mb-1">
          <Globe2 className="h-4 w-4" />
          {lang === 'en' ? 'Large-Scale Planetary Teleconnections' : 'वैश्विक जलवायु संकेत एवं टेलीकनेक्शन'}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {lang === 'en' ? 'Climate Signals & Boundary Conditions' : 'जलवायु संकेत (ENSO, IOD, MJO & OLR)'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Downscaled teleconnection forcing ingested into the 34-feature XGBoost inference pipeline.
        </p>
      </div>

      {/* Overall Climate Signal Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 md:p-8 rounded-2xl shadow-md border border-blue-800">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 block mb-2">
          Integrated Climate Assessment
        </span>
        <h2 className="text-2xl font-bold mb-3">
          {lang === 'en' ? data.overall_signal.status : data.overall_signal.status_hi}
        </h2>
        <p className="text-sm text-blue-100 max-w-3xl leading-relaxed">
          {data.overall_signal.summary}
        </p>
      </div>

      {/* 4 Teleconnection Index Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.signals.map((sig: any) => (
          <div key={sig.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600">{sig.id} Index</span>
                <h3 className="text-base font-bold text-slate-900">{sig.name}</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200">
                {sig.badge}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl">
                <span className="text-slate-400 font-bold block text-[10px]">CURRENT VALUE</span>
                <span className="text-sm font-extrabold text-slate-800">{sig.state}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl">
                <span className="text-slate-400 font-bold block text-[10px]">EVOLUTION TREND</span>
                <span className="text-sm font-semibold text-slate-700">{sig.trend}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                Monsoon Influence
              </span>
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {lang === 'en' ? sig.influence : sig.influence_hi}
              </p>
            </div>

            <div className="text-[10px] text-slate-400 text-right">
              Data Source: {sig.confidence}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
