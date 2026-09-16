import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { fetchDashboard, fetchLiveWeather } from '../services/api';
import { Link } from 'react-router-dom';
import {
  CloudRain,
  Sun,
  ShieldAlert,
  TrendingUp,
  Droplets,
  Gauge,
  ChevronRight,
  Info,
  Calendar,
  AlertTriangle,
  Sprout,
  ArrowRight,
  Flame,
  Snowflake,
  Coins,
  CheckCircle2,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

export default function Dashboard() {
  const { lang, location } = useApp();
  const [data, setData] = useState<any>(null);
  const [liveWeather, setLiveWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchDashboard(String(location.id)),
      fetchLiveWeather(String(location.id))
    ])
      .then(([dashRes, weatherRes]) => {
        setData(dashRes);
        setLiveWeather(weatherRes?.live_weather);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [location.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-600">
          {lang === 'en' ? 'Analyzing climate and rainfall signals for this location...' : 'स्थान के लिए मौसम व मानसूनी संकेतों का विश्लेषण किया जा रहा है...'}
        </p>
      </div>
    );
  }

  if (!data) return null;

  // 1. Smart Irrigation Calculation
  const onsetProb = data?.kpis?.onset_probability || 0;
  const breakProb = data?.kpis?.break_probability || 0;
  const heavyRainProb = data?.kpis?.heavy_rain_risk || 0;
  const currentRain = liveWeather?.current?.current_rain_mm || 0;
  const currentTemp = liveWeather?.current?.temperature_c || 28;

  let irrigationAdvice = {
    type: 'HOLD',
    title: lang === 'en' ? '🛑 Hold Irrigation Today!' : '🛑 आज सिंचाई रोकें (Hold Irrigation)!',
    badge: lang === 'en' ? 'Rain Expected Soon' : 'वर्षा की उच्च संभावना',
    desc: lang === 'en' 
      ? `High probability of rainfall (${onsetProb}%) expected in ${location.block} within the next 24–48 hours. Keep tube-well off and utilize natural rain.` 
      : `अगले 24–48 घंटों में आपके ${location.block} ब्लॉक में बारिश की ${onsetProb}% संभावना है। ट्यूबवेल बंद रखें और प्राकृतिक वर्षा का लाभ उठाएं।`,
    savings: lang === 'en' ? '₹350 – ₹500 Saved (Fuel / Power)' : 'लगभग ₹350 – ₹500 की सीधी बचत (डीजल / बिजली)',
    theme: 'bg-amber-500/10 border-amber-500/30 text-amber-900',
    btnColor: 'bg-amber-600 hover:bg-amber-700'
  };

  if (currentRain > 5 || onsetProb >= 70 || heavyRainProb >= 35) {
    irrigationAdvice = {
      type: 'HOLD',
      title: lang === 'en' ? '🛑 Do NOT Irrigate Today!' : '🛑 आज बिल्कुल भी पानी न दें!',
      badge: lang === 'en' ? 'Heavy Rain Expected' : 'भारी वर्षा की संभावना',
      desc: lang === 'en'
        ? `Heavy precipitation forecasted. Irrigating now will cause waterlogging and root rot. Ensure drainage channels are clear.`
        : `खेत में भारी बारिश के आसार हैं। अभी सिंचाई करने से खेत में पानी भरने (जलभराव) और जड़ गलन का खतरा होगा। जल निकासी नालियां साफ रखें।`,
      savings: lang === 'en' ? '₹400 – ₹600 Saved (Fuel & Labour)' : 'लगभग ₹400 – ₹600 की बचत (ईंधन और मेहनत)',
      theme: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700'
    };
  } else if (onsetProb < 30 && breakProb > 45) {
    irrigationAdvice = {
      type: 'IRRIGATE',
      title: lang === 'en' ? '💧 Irrigate This Evening (Light Watering)' : '💧 आज शाम हल्की सिंचाई करें!',
      badge: lang === 'en' ? 'Dry Spell Active' : 'शुष्क मौसम सक्रिय',
      desc: lang === 'en'
        ? `No rain expected for next 4–5 days. Water crops after 5:00 PM to avoid rapid evaporation and prevent crop wilting.`
        : `अगले 4–5 दिनों तक बारिश की संभावना नहीं है। वाष्पीकरण रोकने और फसल को सूखने से बचाने हेतु शाम 5 बजे के बाद हल्की सिंचाई करें।`,
      savings: lang === 'en' ? 'Yield Protection Alert' : 'फसल को सूखने व नमी तनाव से सुरक्षा',
      theme: 'bg-blue-500/10 border-blue-500/30 text-blue-900',
      btnColor: 'bg-blue-600 hover:bg-blue-700'
    };
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 mb-1">
            <span>India</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span>{location.state}</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span>{location.district}</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-slate-800">{location.block} Block</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-slate-500 font-normal">{location.panchayat} Panchayat</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'en' ? 'MonsoonMitra Dashboard' : 'मानसूनमित्र डैशबोर्ड'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'en' 
              ? `Hyperlocal 7–30 day outlook for ${location.block} Block (${location.panchayat})` 
              : `${location.block} ब्लॉक (${location.panchayat}) हेतु 7–30 दिवसीय पूर्वानुमान`}
          </p>
        </div>

        <Link
          to="/location"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl shadow-sm transition-all"
        >
          {lang === 'en' ? 'Change Location' : 'स्थान बदलें'}
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 1. DAILY SMART IRRIGATION ADVISOR (Kisan Daily Driver) */}
      <div className={`p-5 rounded-2xl border ${irrigationAdvice.theme} shadow-sm relative overflow-hidden transition-all`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-slate-900 text-white flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-cyan-400" />
                {lang === 'en' ? 'DAILY IRRIGATION DECISION' : 'दैनिक सिंचाई निर्णय'}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/80 border border-slate-200">
                {irrigationAdvice.badge}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                <Coins className="h-3 w-3" />
                {irrigationAdvice.savings}
              </span>
            </div>

            <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
              {irrigationAdvice.title}
            </h3>
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed max-w-3xl">
              {irrigationAdvice.desc}
            </p>
          </div>

          <Link
            to="/advisory"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition whitespace-nowrap"
          >
            <span>{lang === 'en' ? 'View Crop Advisory' : 'विस्तृत फसल सलाह देखें'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Monsoon Status Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-blue-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold tracking-wider uppercase text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                {lang === 'en' ? 'MONSOON STATUS' : 'मानसून की स्थिति'}
              </span>
              <span className="text-xs font-bold text-emerald-300 bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                {data.monsoon_status.status}
              </span>
              {liveWeather && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/30 text-cyan-300 border border-cyan-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                  LIVE ATMOSPHERIC FEED
                </span>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-bold">
              {lang === 'en' ? 'Monsoon is Currently Active' : 'मानसून वर्तमान में सक्रिय अवस्था में है'}
            </h2>
            <p className="text-xs md:text-sm text-blue-200/90 max-w-2xl leading-relaxed">
              {data.monsoon_status.description}
            </p>
            {liveWeather && (
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-blue-200">
                <span>🌡️ Temp: <strong className="text-white">{liveWeather.current.temperature_c}°C</strong></span>
                <span>💧 Humidity: <strong className="text-white">{liveWeather.current.humidity_pct}%</strong></span>
                <span>💨 Wind: <strong className="text-white">{liveWeather.current.wind_speed_kmh} km/h</strong></span>
                <span>🌧️ Live Rain: <strong className="text-white">{liveWeather.current.current_rain_mm} mm</strong></span>
                <span className="text-[10px] opacity-75">({liveWeather.source})</span>
              </div>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/15 text-center min-w-[140px]">
            <span className="text-[11px] font-bold text-blue-200 block uppercase">
              {lang === 'en' ? 'Rainfall Pattern' : 'वर्षा की प्रवृत्ति'}
            </span>
            <span className="text-lg font-extrabold text-white">
              {data.monsoon_status.rainfall_condition}
            </span>
          </div>
        </div>
      </div>

      {/* ALL-WEATHER SEASON GUARD: Garmi (लू / Heatwave) & Thand (पाला / Cold Wave) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Heatwave Card (गर्मी / लू) */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-start gap-3.5 shadow-sm">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 flex-shrink-0">
            <Flame className="h-6 w-6" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-amber-900 text-sm">
                {lang === 'en' ? 'Summer Heatwave Advisory (लू अलर्ट)' : 'ग्रीष्मकालीन लू व ताप सुरक्षा (Heatwave)'}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-800 text-[10px] font-bold">
                March–June
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {lang === 'en'
                ? 'When temperatures cross 38°C, apply straw mulching around vegetable & pre-kharif crops to lock soil moisture. Avoid daytime pesticide sprays.'
                : 'तापमान 38°C से ऊपर जाने पर खेत में पुआल/मल्चिंग बिछाएं जिससे नमी न उड़े। दोपहर की धूप में कीटनाशक का छिड़काव न करें।'}
            </p>
          </div>
        </div>

        {/* Cold Wave & Frost Card (ठंड / पाला) */}
        <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4 flex items-start gap-3.5 shadow-sm">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 flex-shrink-0">
            <Snowflake className="h-6 w-6" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sky-900 text-sm">
                {lang === 'en' ? 'Winter Frost Alert (पाला व शीतलहर)' : 'शीतकालीन पाला एवं शीतलहर सुरक्षा (Frost)'}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-sky-200 text-sky-800 text-[10px] font-bold">
                Nov–Feb
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {lang === 'en'
                ? 'Risk of ground frost (सरसों, आलू, चना) when min temperature drops below 5°C. Create smoke at field boundaries and apply light evening irrigation.'
                : 'न्यूनतम तापमान 5°C से नीचे जाने पर पाला पड़ने का खतरा रहता है। सरसों, आलू व चने के खेत की मेड़ों पर धुआं करें और हल्की सिंचाई दें।'}
            </p>
          </div>
        </div>

      </div>

      {/* 6 Key Performance Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Onset */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">{lang === 'en' ? 'Onset Prob.' : 'आगमन संभावना'}</span>
            <CloudRain className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{data.kpis.onset_probability}%</div>
          <div className="text-[11px] font-semibold text-emerald-600 mt-1">High Probability</div>
        </div>

        {/* Break */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">{lang === 'en' ? 'Break Risk' : 'सूखा जोखिम'}</span>
            <Sun className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{data.kpis.break_probability}%</div>
          <div className="text-[11px] font-semibold text-slate-500 mt-1">Low Severity</div>
        </div>

        {/* Heavy Rain */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">{lang === 'en' ? 'Heavy Rain' : 'भारी वर्षा'}</span>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{data.kpis.heavy_rain_risk}%</div>
          <div className="text-[11px] font-semibold text-red-600 mt-1">Alert Elevated</div>
        </div>

        {/* Anomaly */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">{lang === 'en' ? 'Anomaly' : 'विचलन'}</span>
            <TrendingUp className="h-4 w-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">+{data.kpis.rainfall_anomaly}%</div>
          <div className="text-[11px] font-semibold text-cyan-700 mt-1">Above Normal</div>
        </div>

        {/* Current Rain */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">{lang === 'en' ? 'Current Rain' : 'वर्तमान वर्षा'}</span>
            <Droplets className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{data.kpis.current_rainfall} mm</div>
          <div className="text-[11px] font-semibold text-slate-500 mt-1">Last 24 Hours</div>
        </div>

        {/* Confidence */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">{lang === 'en' ? 'Confidence' : 'विश्वसनीयता'}</span>
            <Gauge className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{data.kpis.confidence}%</div>
          <div className="text-[11px] font-semibold text-purple-700 mt-1">Ensemble Agree</div>
        </div>

      </div>

      {/* 4-Period Forecast Overview Cards */}
      <div>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-600" />
          {lang === 'en' ? 'Multi-Week Horizon Outlook' : 'साप्ताहिक बहु-अवधि पूर्वानुमान'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.forecast_windows.map((win: any, idx: number) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
              <span className="text-xs font-bold text-slate-500 uppercase">{win.window}</span>
              <div className="text-lg font-bold text-slate-800 mt-1">{win.status}</div>
              <div className="text-xs text-slate-600 mt-2 flex justify-between">
                <span>Expected:</span>
                <span className="font-semibold text-slate-900">{win.rainfall_mm}</span>
              </div>
              <div className="text-xs text-slate-600 mt-1 flex justify-between">
                <span>Risk Level:</span>
                <span className={`font-bold ${win.risk === 'High' ? 'text-red-500' : 'text-slate-700'}`}>{win.risk}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 30-Day Rainfall Trend Line Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {lang === 'en' ? '30-Day Projected Rainfall Trend' : '30-दिवसीय वर्षा पूर्वानुमान प्रवृत्ति'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'en' ? 'Daily cumulative rainfall (mm) vs normal climatology' : 'दैनिक संचयी वर्षा (मिमी) बनाम सामान्य जलवायु स्तर'}
            </p>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
            mm/day
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.rainfall_chart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="rainfall_mm" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#rainGrad)" name="Rainfall (mm)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dual Column: Crop Advisory Preview & Alerts Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Crop Advisory Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200 flex items-center gap-1.5">
                <Sprout className="h-3.5 w-3.5" />
                {lang === 'en' ? 'Crop-Specific Advisory' : 'फसल-विशिष्ट कृषि सलाह'}
              </span>
              <span className="text-xs font-bold text-slate-700">
                {data.crop_preview.crop} • {data.crop_preview.stage}
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-2">
              {lang === 'en' ? 'Actionable Field Guidance' : 'खेत हेतु उपयोगी निर्देश'}
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {lang === 'en' ? data.crop_preview.advisory_en : data.crop_preview.advisory_hi}
            </p>
          </div>

          <Link
            to="/advisory"
            className="mt-4 inline-flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-300 rounded-xl transition-colors"
          >
            {lang === 'en' ? 'View Full Crop Advisory' : 'सम्पूर्ण कृषि सलाह देखें'}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Alerts Preview Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                {lang === 'en' ? 'Recent Alerts' : 'हालिया चेतावनियां'}
              </span>
              <span className="text-xs text-slate-400 font-medium">3 Active Alerts</span>
            </div>

            <div className="space-y-2.5">
              {data.alerts_preview.map((alt: any, idx: number) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase mt-0.5 ${
                    alt.severity === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {alt.severity}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-800">
                      {lang === 'en' ? alt.message_en : alt.message_hi}
                    </p>
                    <span className="text-[10px] text-slate-400">{alt.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/alerts"
            className="mt-4 inline-flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-300 rounded-xl transition-colors"
          >
            {lang === 'en' ? 'View All Alerts' : 'सभी चेतावनियां देखें'}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}
