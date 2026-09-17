import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  CloudRain, 
  ExternalLink, 
  Mail, 
  Phone, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Sprout, 
  MapPin, 
  Radio, 
  MessageCircle,
  HelpCircle,
  Activity
} from 'lucide-react';

export default function Footer() {
  const { lang } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 mt-auto">
      
      {/* Top Pre-Footer Highlight Bar */}
      <div className="border-b border-slate-800/60 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              <div className="p-3 rounded-xl bg-blue-500/10 text-cyan-400">
                <CloudRain className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  {lang === 'en' ? '7–14 Day Dual Forecast' : '7–14 दिवसीय AI पूर्वानुमान'}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {lang === 'en' ? 'Calibrated onset & break risk' : 'आगमन एवं सूखा दौर की सटीक संभावना'}
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Sprout className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  {lang === 'en' ? 'Smart Irrigation Advisor' : 'दैनिक स्मार्ट सिंचाई निर्णय'}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {lang === 'en' ? 'Saves ₹350–₹500 daily diesel' : 'प्रतिदिन ₹350–₹500 डीजल/बिजली की बचत'}
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  {lang === 'en' ? 'All-Season Weather Guard' : 'ग्रीष्म व शीतकालीन सुरक्षा'}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {lang === 'en' ? 'Heatwave & Frost alerts' : 'लू (Heatwave) एवं पाला (Frost) अलर्ट'}
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                <Radio className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  {lang === 'en' ? 'Live Satellite Sync' : 'लाइव वायुमंडलीय फीड'}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {lang === 'en' ? 'Updated every 6 hours' : 'प्रति 6 घंटे में स्वचालित मौसम अपडेट'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Spacious Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Brand & Organization Identity (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 p-3 rounded-2xl shadow-xl shadow-blue-500/20">
                <CloudRain className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white block">
                  MonsoonMitra
                </span>
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest block">
                  {lang === 'en' ? 'National Climate Platform' : 'राष्ट्रीय जलवायु एवं कृषि मंच'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {lang === 'en' 
                ? 'An initiative of Ministry of Earth Sciences (MoES) & NCMRWF delivering village & block-scale monsoon onset, dry-spell predictions, and agronomic advisories across India.' 
                : 'पृथ्वी विज्ञान मंत्रालय (MoES) एवं NCMRWF की राष्ट्रीय पहल, जो 34 वायुमंडलीय संकेतों के आधार पर अखिल भारतीय स्तर पर ग्राम व ब्लॉक स्तर तक सटीक मानसूनी व कृषि पूर्वानुमान प्रदान करती है।'}
            </p>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-950/60 border border-blue-800/60 text-blue-300 text-xs font-semibold">
                <Award className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                <span>Ministry of Earth Sciences (MoES) Initiative</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <MapPin className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <span>{lang === 'en' ? 'Coverage: 28 States & 8 Union Territories' : 'कवरेज: 28 राज्य एवं 8 केंद्र शासित प्रदेश'}</span>
              </div>
            </div>
          </div>

          {/* Quick Platform Services (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-widest text-slate-100 border-b border-slate-800 pb-2">
              {lang === 'en' ? 'Core Platform Services' : 'मुख्य कृषि व मौसम सेवाएँ'}
            </h3>
            <ul className="space-y-3 text-xs">
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center justify-between group">
                  <span>{lang === 'en' ? 'Live Weather Dashboard' : 'लाइव मौसम डैशबोर्ड'}</span>
                  <span className="text-slate-600 group-hover:text-cyan-400 transition-colors">→</span>
                </Link>
              </li>
              <li>
                <Link to="/forecast" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center justify-between group">
                  <span>{lang === 'en' ? '30-Day Monsoon Forecast' : '30-दिवसीय वर्षा पूर्वानुमान'}</span>
                  <span className="text-slate-600 group-hover:text-cyan-400 transition-colors">→</span>
                </Link>
              </li>
              <li>
                <Link to="/advisory" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center justify-between group">
                  <span>{lang === 'en' ? 'Crop & Sowing Advisory' : 'फसल बुवाई एवं सुरक्षा सलाह'}</span>
                  <span className="text-slate-600 group-hover:text-cyan-400 transition-colors">→</span>
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center justify-between group">
                  <span>{lang === 'en' ? 'Hyperlocal Village Map' : 'हाइपरलोकल ग्राम नक्शा'}</span>
                  <span className="text-slate-600 group-hover:text-cyan-400 transition-colors">→</span>
                </Link>
              </li>
              <li>
                <Link to="/alerts" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center justify-between group">
                  <span>{lang === 'en' ? 'Weather Alerts Center' : 'मौसम चेतावनी केंद्र'}</span>
                  <span className="text-slate-600 group-hover:text-cyan-400 transition-colors">→</span>
                </Link>
              </li>
              <li>
                <Link to="/explainability" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center justify-between group">
                  <span>{lang === 'en' ? 'Explainable AI (SHAP)' : 'पारदर्शी AI निर्णय प्रणाली'}</span>
                  <span className="text-slate-600 group-hover:text-cyan-400 transition-colors">→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Research & Data Partners (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-widest text-slate-100 border-b border-slate-800 pb-2">
              {lang === 'en' ? 'Data Partners' : 'डेटा एवं शोध भागीदार'}
            </h3>
            <ul className="space-y-3 text-xs">
              <li>
                <a href="https://mausam.imd.gov.in" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>IMD (Mausam)</span>
                  <ExternalLink className="h-3 w-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://www.ncmrwf.gov.in" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>NCMRWF / MoES</span>
                  <ExternalLink className="h-3 w-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>Open-Meteo API</span>
                  <ExternalLink className="h-3 w-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://ecmwf.int" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>ERA5 Reanalysis</span>
                  <ExternalLink className="h-3 w-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://icar.org.in" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>ICAR Krishi</span>
                  <ExternalLink className="h-3 w-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* 24/7 Kisan Helpline & Support Card (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-widest text-slate-100 border-b border-slate-800 pb-2">
              {lang === 'en' ? 'Kisan Helpline & Support' : 'किसान हेल्पलाइन एवं सहायता'}
            </h3>

            {/* Helpline Action Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-lg">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    {lang === 'en' ? 'Direct Toll / Helpline' : 'प्रत्यक्ष किसान हेल्पलाइन'}
                  </span>
                  <a 
                    href="tel:+917722912906" 
                    className="text-sm font-black text-white hover:text-emerald-400 transition-colors"
                  >
                    +91 7722912906
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <a
                  href="https://wa.me/917722912906"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] text-center transition flex items-center justify-center gap-1"
                >
                  <MessageCircle className="h-3 w-3" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href="tel:+917722912906"
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] text-center transition flex items-center justify-center gap-1"
                >
                  <Phone className="h-3 w-3 text-cyan-400" />
                  <span>{lang === 'en' ? 'Call Now' : 'कॉल करें'}</span>
                </a>
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-blue-400" />
                <span>support@monsoonmitra.gov.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-emerald-400" />
                <span>{lang === 'en' ? 'Server Uptime: 99.9% Live' : 'सर्वर स्थिति: 99.9% सक्रिय'}</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Spacious Bottom Bar */}
      <div className="border-t border-slate-800/80 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">MonsoonMitra</span>
            <span>•</span>
            <span>© 2026 Ministry of Earth Sciences (MoES) & NCMRWF.</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-slate-300 font-mono text-[11px]">
              FastAPI
            </span>
            <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-slate-300 font-mono text-[11px]">
              React 19
            </span>
            <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-slate-300 font-mono text-[11px]">
              XGBoost AI
            </span>
            <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-slate-300 font-mono text-[11px]">
              PostgreSQL
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
}
