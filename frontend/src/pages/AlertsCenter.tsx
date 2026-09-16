import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchAlerts, acknowledgeAlert } from '../services/api';
import {
  BellRing,
  AlertTriangle,
  CheckCircle,
  Share2,
  Phone,
  MessageSquare,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function AlertsCenter() {
  const { lang, location } = useApp();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [acknowledged, setAcknowledged] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchAlerts(String(location.id))
      .then(res => {
        setAlerts(res.alerts);
        setLoading(false);
      })
      .catch(console.error);
  }, [location.id]);

  const handleAck = (id: string) => {
    acknowledgeAlert(id).then(() => {
      setAcknowledged(prev => ({ ...prev, [id]: true }));
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5 mb-1">
          <BellRing className="h-4 w-4" />
          {lang === 'en' ? 'Early Warning System (EWS)' : 'पूर्व चेतावनी प्रणाली (EWS)'}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {lang === 'en' ? 'Automated Risk Alerts' : 'स्वचालित मानसूनी चेतावनी केंद्र'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Targeted alerts for {location.block} Block ({location.district}) dispatched to farmers and agricultural extension officers.
        </p>
      </div>

      {/* Multichannel Notification Simulation Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block mb-1">
            Multichannel Dispatch Active
          </span>
          <h3 className="text-lg font-bold">Web Push • SMS Gateway (Twilio) • WhatsApp API</h3>
          <p className="text-xs text-slate-400 mt-1">
            Instant automated alerts triggered when block heavy rainfall probability exceeds 65% or break duration &gt; 5 days.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" /> SMS Ready
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" /> WhatsApp API
          </span>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-slate-500 font-bold">Loading local alerts...</div>
        ) : alerts.map((alt) => {
          const isAck = acknowledged[alt.id] || alt.status === 'Acknowledged';

          return (
            <div
              key={alt.id}
              className={`p-6 rounded-2xl border transition-all ${
                alt.severity === 'HIGH'
                  ? 'bg-red-50/40 border-red-200'
                  : alt.severity === 'MODERATE'
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    alt.severity === 'HIGH'
                      ? 'bg-red-600 text-white'
                      : alt.severity === 'MODERATE'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-600 text-white'
                  }`}>
                    {alt.severity}
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900">
                    {lang === 'en' ? alt.type : alt.type_hi}
                  </h4>
                </div>
                <span className="text-xs text-slate-400 font-medium">{alt.time} • {alt.location}</span>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed mb-4">
                {lang === 'en' ? alt.description_en : alt.description_hi}
              </p>

              <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 mb-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Action Required
                </span>
                <p className="text-xs font-semibold text-slate-900">
                  {lang === 'en' ? alt.recommended_en : alt.recommended_hi}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400 font-mono">Alert ID: {alt.id}</span>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAck(alt.id)}
                    disabled={isAck}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isAck
                        ? 'bg-emerald-100 text-emerald-800 cursor-default'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-sm'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                    {isAck ? 'Acknowledged' : 'Acknowledge'}
                  </button>

                  <button
                    onClick={() => alert(`Alert ${alt.id} shared with village WhatsApp broadcast.`)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    Share Alert
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
