import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  CloudLightning, 
  Sprout, 
  ShieldAlert, 
  ArrowRight, 
  MapPin, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck,
  UserPlus,
  LogIn
} from 'lucide-react';
import Footer from '../components/layout/Footer';

export default function LandingPage() {
  const { lang, user } = useApp();

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      
      {/* Top Header for Landing Page */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-blue-600 to-cyan-400 p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <CloudLightning className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
              MonsoonMitra
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-900/50 text-cyan-300 border border-cyan-500/30">
              AI Powered
            </span>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition shadow-md flex items-center gap-1.5"
              >
                <span>{lang === 'en' ? 'Open Dashboard' : 'डैशबोर्ड खोलें'}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-bold text-slate-300 hover:text-white px-3 py-2 rounded-xl transition flex items-center gap-1"
                >
                  <LogIn className="h-4 w-4 text-cyan-400" />
                  <span>{lang === 'en' ? 'Login' : 'लॉगिन'}</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition shadow-md shadow-emerald-700/20 flex items-center gap-1.5"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>{lang === 'en' ? 'Register' : 'पंजीकरण करें'}</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with AI Generated Background */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* AI Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000"
          style={{ backgroundImage: 'url("/monsoon_hero.jpg")' }}
        />
        {/* Dark Gradient Overlay for optimal readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 z-10">
          <div className="max-w-3xl">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-cyan-300 text-xs font-semibold mb-6 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300 animate-pulse" />
              <span>
                {lang === 'en' 
                  ? 'MoES & NCMRWF • SIH 26086 Smart India Hackathon' 
                  : 'पृथ्वी विज्ञान मंत्रालय (MoES) • स्मार्ट इंडिया हैकथॉन 2026'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight mb-6">
              {lang === 'en' ? (
                <>
                  Hyperlocal Monsoon AI <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    Down to Village & Block Scale
                  </span>
                </>
              ) : (
                <>
                  मानसून की सटीक AI भविष्यवाणी, <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    सीधे आपके ब्लॉक और गाँव तक
                  </span>
                </>
              )}
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed font-normal">
              {lang === 'en'
                ? 'MonsoonMitra uses calibrated XGBoost models & ERA5 atmospheric reanalysis across 34 planetary variables to deliver 7-day and 14-day Onset & Dry-Spell alerts before they happen.'
                : 'मानसून मित्र 34 वायुमंडलीय संकेतों और AI मॉडलों की मदद से 7 और 14 दिन पहले मानसून आगमन और सूखे (Dry Spells) की चेतावनी सीधे किसान के मोबाइल पर देता है।'}
            </p>

            {/* CTAs - Auth Flow Directed */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              {user ? (
                <Link 
                  to="/dashboard" 
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold text-base text-center transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 group"
                >
                  <span>{lang === 'en' ? 'Go to Dashboard' : 'डैशबोर्ड पर जाएँ'}</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link 
                    to="/register" 
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-8 py-4 rounded-2xl font-bold text-base text-center transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 group"
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>{lang === 'en' ? 'Step 1: Register Farmer' : 'चरण 1: नया किसान पंजीकरण'}</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link 
                    to="/login" 
                    className="bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700 text-white px-8 py-4 rounded-2xl font-bold text-base text-center transition-all shadow-lg flex items-center justify-center gap-2 backdrop-blur-md"
                  >
                    <LogIn className="h-5 w-5 text-cyan-400" />
                    <span>{lang === 'en' ? 'Step 2: Kisan Login (OTP)' : 'चरण 2: किसान लॉगिन (OTP)'}</span>
                  </Link>
                </>
              )}
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
              <div>
                <div className="text-2xl font-black text-cyan-400">28+8</div>
                <div className="text-xs text-slate-400 font-medium">
                  {lang === 'en' ? 'States & UTs Covered' : 'सभी राज्य और केंद्र शासित प्रदेश'}
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-400">34</div>
                <div className="text-xs text-slate-400 font-medium">
                  {lang === 'en' ? 'Atmospheric Features' : 'AI वायुमंडलीय चर'}
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-blue-400">SHAP</div>
                <div className="text-xs text-slate-400 font-medium">
                  {lang === 'en' ? 'Explainable AI Transparency' : 'पूर्ण AI पारदर्शिता'}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-20 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-2">
              {lang === 'en' ? 'Production Scale Architecture' : 'राष्ट्रीय स्तर की प्रणाली'}
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              {lang === 'en' ? 'How MonsoonMitra Protects Your Harvest' : 'मानसून मित्र आपकी फसल की सुरक्षा कैसे करता है'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl hover:border-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-500/10">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-6">
                <CloudLightning className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {lang === 'en' ? 'Onset & Break Prediction' : 'मानसून आगमन एवं सूखे की भविष्यवाणी'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {lang === 'en'
                  ? 'Dual-horizon XGBoost classifiers deliver calibrated probabilities for 7-day and 14-day rainfall onset and dry spells.'
                  : '7 दिन और 14 दिन के सटीक अग्रिम पूर्वानुमान ताकि सही समय पर खरीफ और रबी की बुवाई की जा सके।'}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Isotonic Calibrated
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl hover:border-emerald-500/50 transition-all hover:shadow-xl hover:shadow-emerald-500/10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6">
                <Sprout className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {lang === 'en' ? 'Vernacular Audio Crop Advisory' : 'आवाज़ में सुनें फसल कृषि सलाह'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {lang === 'en'
                  ? 'Real-time agronomic advisories tailored to crop type and growth stage with browser-native Hindi Text-to-Speech.'
                  : 'मौसम अनुसार फसल सुरक्षा सलाह, जिसे किसान सीधे आवाज़ (Hindi TTS) में सुन सकते हैं और व्हाट्सएप पर शेयर कर सकते हैं।'}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Hindi Voice TTS + WhatsApp
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/10">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-6">
                <Cpu className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {lang === 'en' ? 'SHAP Explainable AI' : 'पारदर्शी AI निर्णय (Explainable AI)'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {lang === 'en'
                  ? 'Complete transparency for scientists and policy makers showing exactly which atmospheric variables drove each forecast.'
                  : 'सरकारी अधिकारियों एवं वैज्ञानिकों के भरोसे के लिए SHAP वैल्यूज से दिखता है कि AI ने यह निर्णय किन कारणों से लिया।'}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Native XGBoost SHAP TreeExplainer
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
}
