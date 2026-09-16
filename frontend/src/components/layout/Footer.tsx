import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CloudRain, ExternalLink, Mail, Phone, Award } from 'lucide-react';

export default function Footer() {
  const { lang } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
                <CloudRain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">MonsoonMitra</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'en' 
                ? 'AI-powered Hyperlocal Monsoon Onset & Break Prediction System for Indian farmers at Village/Block scale.' 
                : 'भारतीय किसानों के लिए ग्राम एवं ब्लॉक स्तर पर AI-संचालित सटीक मानसून एवं सूखा पूर्वानुमान प्रणाली।'}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-800/60 text-blue-400 text-xs font-semibold">
              <Award className="h-4 w-4 text-cyan-400" />
              <span>Ministry of Earth Sciences (MoES) Initiative</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 text-slate-200">
              {lang === 'en' ? 'Platform Services' : 'मुख्य सेवाएँ'}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  {lang === 'en' ? 'Live Weather Dashboard' : 'लाइव मौसम डैशबोर्ड'}
                </Link>
              </li>
              <li>
                <Link to="/forecast" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  {lang === 'en' ? '30-Day Monsoon Forecast' : '30-दिवसीय मानसून पूर्वानुमान'}
                </Link>
              </li>
              <li>
                <Link to="/advisory" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  {lang === 'en' ? 'Crop & Sowing Advisory' : 'फसल एवं बुवाई सलाह'}
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  {lang === 'en' ? 'Hyperlocal Village Map' : 'हाइपरलोकल ग्राम नक्शा'}
                </Link>
              </li>
              <li>
                <Link to="/explainability" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  {lang === 'en' ? 'Explainable AI (SHAP)' : 'AI पारदर्शिता (SHAP)'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Government & Data Partners */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 text-slate-200">
              {lang === 'en' ? 'Data & Govt Partners' : 'डेटा एवं सरकारी भागीदारी'}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://mausam.imd.gov.in" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1">
                  IMD (India Met Department) <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://www.ncmrwf.gov.in" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1">
                  NCMRWF / MoES <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1">
                  Open-Meteo Atmospheric Feed <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://ecmwf.int" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1">
                  ERA5 Atmospheric Reanalysis <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Kisan Support & Contact */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 text-slate-200">
              {lang === 'en' ? 'Kisan Helpline & Support' : 'किसान हेल्पलाइन एवं सहायता'}
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2 text-slate-400">
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                <span>+91 7722912906 (Kisan Helpline / कॉल सेंटर)</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="h-3.5 w-3.5 text-blue-400" />
                <span>support@monsoonmitra.gov.in</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-400 font-medium block">All-India Coverage:</span>
              <span className="text-[10px] text-cyan-400 font-mono">28 States • 8 UTs • 700+ Districts</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 bg-slate-950/80 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 MonsoonMitra. Ministry of Earth Sciences (MoES) & NCMRWF Initiative.</p>
          <div className="flex items-center gap-3">
            <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-slate-400 font-mono text-[10px]">
              FastAPI • React 19 • XGBoost • Supabase
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
