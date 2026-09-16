import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchAdvisory } from '../services/api';
import {
  Sprout,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Share2,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Volume2,
  VolumeX,
  PhoneCall
} from 'lucide-react';

export default function CropAdvisoryPage() {
  const { lang, location } = useApp();
  
  const crops = ['Soybean', 'Paddy', 'Cotton', 'Maize', 'Pulses', 'Wheat'];
  const stages = ['Pre-sowing', 'Sowing', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest'];

  const [selectedCrop, setSelectedCrop] = useState('Soybean');
  const [selectedStage, setSelectedStage] = useState('Sowing');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Stop speech if crop or stage changes
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    setLoading(true);
    fetchAdvisory(selectedCrop, selectedStage, String(location.id))
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedCrop, selectedStage, location.id]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!data) return;

    // Compose spoken message
    const isHindi = lang === 'hi';
    let textToSpeak = '';

    if (isHindi) {
      const why = data.why_advisory?.hi || '';
      const actions = (data.recommended_actions?.hi || []).join('। ');
      textToSpeak = `किसान भाईयों, ${location.block} ब्लॉक के लिए ${data.crop} की ${data.growth_stage} अवस्था हेतु कृषि सलाह। ${why}। मुख्य सलाह: ${actions}`;
    } else {
      const why = data.why_advisory?.en || '';
      const actions = (data.recommended_actions?.en || []).join('. ');
      textToSpeak = `Farmer Advisory for ${data.crop} at ${data.growth_stage} stage in ${location.block} block. ${why}. Key actions: ${actions}`;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95; // slightly slower for rural clarity
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleShareWhatsApp = () => {
    if (!data) return;
    const isHindi = lang === 'hi';
    const text = isHindi
      ? `🌾 *मानसूनमित्र कृषि सलाह - ${location.block} ब्लॉक*\n\n🌱 *फसल:* ${data.crop} (${data.growth_stage})\n⚠️ *जोखिम स्तर:* ${data.risk_level}\n\n📋 *मुख्य सलाह:*\n${(data.recommended_actions.hi || []).map((a: string) => `• ${a}`).join('\n')}\n\n🔗 अधिक जानकारी के लिए देखें: MonsoonMitra App`
      : `🌾 *MonsoonMitra Advisory - ${location.block} Block*\n\n🌱 *Crop:* ${data.crop} (${data.growth_stage})\n⚠️ *Risk Level:* ${data.risk_level}\n\n📋 *Actions:*\n${(data.recommended_actions.en || []).map((a: string) => `• ${a}`).join('\n')}\n\n🔗 Check MonsoonMitra Platform`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="text-xs font-bold uppercase tracking-wider text-green-700 flex items-center gap-1.5 mb-1">
          <Sprout className="h-4 w-4" />
          {lang === 'en' ? 'Agronomic Decision Support Engine' : 'कृषि निर्णय सहायता प्रणाली'}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {lang === 'en' ? 'Crop-Specific Advisory' : 'फसल-विशिष्ट कृषि परामर्श व सलाह'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {lang === 'en' 
            ? `Tailored guidance for ${location.block} Block based on soil moisture and upcoming rain spells.` 
            : `${location.block} ब्लॉक हेतु मानसूनी वर्षा व मिट्टी की नमी के आधार पर तैयार सलाह।`}
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        
        {/* Crop Selector */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
            1. {lang === 'en' ? 'Select Target Crop' : 'फसल का चयन करें'}
          </label>
          <div className="flex flex-wrap gap-2">
            {crops.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCrop(c)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCrop === c
                    ? 'bg-green-600 text-white shadow-md shadow-green-600/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Growth Stage Selector */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
            2. {lang === 'en' ? 'Crop Growth Stage' : 'फसल की वर्तमान अवस्था'}
          </label>
          <div className="flex flex-wrap gap-2">
            {stages.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStage(s)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedStage === s
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Advisory Output Display */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-500">Generating expert advisory rules...</p>
        </div>
      ) : data ? (
        <div className="space-y-6">
          
          {/* Main Risk Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-xs font-bold uppercase text-slate-400 block mb-1">
                  Active Advisory Profile
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {data.crop} • {data.growth_stage} Stage
                </h3>
                <span className="text-xs text-slate-500 mt-1 block">
                  Location: {location.block} Block ({location.panchayat}) • Confidence: {data.confidence}%
                </span>
              </div>

              <div className="text-right">
                <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  data.risk_level === 'HIGH' 
                    ? 'bg-red-100 text-red-800 border border-red-200' 
                    : data.risk_level === 'MODERATE'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {data.risk_level} RISK
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">Generated: {data.generated_at}</span>
              </div>
            </div>

            {/* Audio Advisory & Social Share Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 rounded-2xl border border-emerald-200/80 shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleSpeak}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all ${
                    isSpeaking
                      ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="h-5 w-5" />
                      <span>{lang === 'en' ? 'Stop Audio' : 'आवाज़ बंद करें'}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-5 w-5" />
                      <span>{lang === 'en' ? '🔊 Listen Advisory (Audio)' : '🔊 सलाह आवाज़ में सुनें'}</span>
                    </>
                  )}
                </button>

                <span className="text-xs text-slate-600 hidden sm:inline-block font-medium">
                  {lang === 'en' ? 'Click to hear the guidance read aloud' : 'क्लिक करके कृषि सलाह हिंदी में सुनें'}
                </span>
              </div>

              <button
                onClick={handleShareWhatsApp}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                title="Share Advisory via WhatsApp"
              >
                <Share2 className="h-4 w-4" />
                <span>{lang === 'en' ? 'Share on WhatsApp' : 'व्हाट्सएप पर भेजें'}</span>
              </button>
            </div>

            {/* Why this advisory? */}
            <div className="bg-blue-50/60 p-5 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
                <HelpCircle className="h-4 w-4 text-blue-600" />
                {lang === 'en' ? 'Why this advisory? (Atmospheric Context)' : 'यह सलाह क्यों दी जा रही है?'}
              </div>
              <p className="text-sm text-blue-950 leading-relaxed font-medium">
                {lang === 'en' ? data.why_advisory.en : data.why_advisory.hi}
              </p>
            </div>

            {/* Dual Grid: Recommended Actions vs Things to Avoid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Do's */}
              <div className="bg-emerald-50/40 p-6 rounded-2xl border border-emerald-200/60 space-y-4">
                <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-900 uppercase">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  {lang === 'en' ? 'Recommended Field Actions' : 'अनुशंसित कृषि कार्य (क्या करें)'}
                </div>
                <ul className="space-y-3">
                  {(lang === 'en' ? data.recommended_actions.en : data.recommended_actions.hi).map((act: string, idx: number) => (
                    <li key={idx} className="text-xs sm:text-sm text-emerald-950 font-medium flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0"></span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Don'ts */}
              <div className="bg-rose-50/40 p-6 rounded-2xl border border-rose-200/60 space-y-4">
                <div className="flex items-center gap-2 text-sm font-extrabold text-rose-900 uppercase">
                  <XCircle className="h-5 w-5 text-rose-600" />
                  {lang === 'en' ? 'Practices to Avoid' : 'सावधानियां (क्या न करें)'}
                </div>
                <ul className="space-y-3">
                  {(lang === 'en' ? data.things_to_avoid.en : data.things_to_avoid.hi).map((av: string, idx: number) => (
                    <li key={idx} className="text-xs sm:text-sm text-rose-950 font-medium flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-2 flex-shrink-0"></span>
                      <span>{av}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Disclaimer */}
            <div className="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200 italic flex items-center gap-2">
              <Info className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span>{data.disclaimer}</span>
            </div>

          </div>

        </div>
      ) : null}

    </div>
  );
}
