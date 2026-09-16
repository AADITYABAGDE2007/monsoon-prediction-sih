import React from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Globe, Shield, Database, Bell } from 'lucide-react';

export default function SettingsPage() {
  const { lang, setLang, dataMode, setDataMode } = useApp();

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
          <Settings className="h-4 w-4" />
          System Preferences
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Platform Settings
        </h1>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        {/* Language setting */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Interface Language</h4>
            <p className="text-xs text-slate-500">Toggle between English and Hindi across the platform</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                lang === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                lang === 'hi' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>

        {/* Data mode setting */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Data Operational Mode</h4>
            <p className="text-xs text-slate-500">
              Switch between local demo baseline dataset and real-time live external API feeds
            </p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setDataMode('DEMO')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                dataMode === 'DEMO' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              DEMO MODE
            </button>
            <button
              onClick={() => setDataMode('LIVE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                dataMode === 'LIVE' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              LIVE API
            </button>
          </div>
        </div>

        {/* SMS gateway status */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Twilio Automated SMS Delivery</h4>
            <p className="text-xs text-slate-500">Dispatches real SMS to registered farmers when alert severity is HIGH</p>
          </div>
          <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
            CONFIGURED
          </span>
        </div>
      </div>
    </div>
  );
}
