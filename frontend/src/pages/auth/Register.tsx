import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  fetchStates, 
  fetchDistricts, 
  fetchBlocks, 
  fetchPanchayats 
} from '../../services/api';
import { 
  Phone, 
  User as UserIcon, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2,
  Sparkles,
  LogIn,
  Globe
} from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { lang, setLang, setLocation } = useApp();
  const [step, setStep] = useState(1);

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'hi' : 'en');
  };

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Location Cascades
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<string[]>([]);
  const [panchayats, setPanchayats] = useState<any[]>([]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedPanchayatObj, setSelectedPanchayatObj] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load States initially
  useEffect(() => {
    fetchStates()
      .then((res: string[]) => {
        setStates(res || []);
        if (res && res.length > 0) {
          setSelectedState(res[0]);
        }
      })
      .catch((err) => console.error("Error loading states:", err));
  }, []);

  // When State changes -> load districts
  useEffect(() => {
    if (selectedState) {
      fetchDistricts(selectedState)
        .then((res: string[]) => {
          setDistricts(res || []);
          if (res && res.length > 0) {
            setSelectedDistrict(res[0]);
          } else {
            setSelectedDistrict('');
          }
        })
        .catch((err) => console.error("Error loading districts:", err));
    }
  }, [selectedState]);

  // When District changes -> load blocks
  useEffect(() => {
    if (selectedDistrict) {
      fetchBlocks(selectedDistrict)
        .then((res: string[]) => {
          setBlocks(res || []);
          if (res && res.length > 0) {
            setSelectedBlock(res[0]);
          } else {
            setSelectedBlock('');
          }
        })
        .catch((err) => console.error("Error loading blocks:", err));
    }
  }, [selectedDistrict]);

  // When Block changes -> load panchayats
  useEffect(() => {
    if (selectedBlock) {
      fetchPanchayats(selectedBlock)
        .then((res: any[]) => {
          setPanchayats(res || []);
          if (res && res.length > 0) {
            setSelectedPanchayatObj(res[0]);
          } else {
            setSelectedPanchayatObj(null);
          }
        })
        .catch((err) => console.error("Error loading panchayats:", err));
    }
  }, [selectedBlock]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(lang === 'en' ? 'Please enter full name' : 'कृपया अपना नाम दर्ज करें');
      return;
    }
    if (phone.length < 10) {
      setError(lang === 'en' ? 'Please enter valid 10-digit mobile number' : 'कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleRegisterComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save location context if selected
      if (selectedPanchayatObj) {
        setLocation({
          id: selectedPanchayatObj.id,
          state: selectedState,
          district: selectedDistrict,
          block: selectedBlock,
          panchayat: selectedPanchayatObj.name,
          block_id: selectedPanchayatObj.block_id,
          lat: 21.90,
          lon: 77.90
        });
      }

      // Store prefill for login
      localStorage.setItem('mm_prefill_phone', phone);
      localStorage.setItem('mm_prefill_name', name);

      // Navigate to login with success query
      navigate('/login?registered=true');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background AI Image */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: 'url("/monsoon_hero.jpg")' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-950/70" />

      {/* Language Switcher in Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-all shadow-md backdrop-blur-md"
        >
          <Globe className="h-3.5 w-3.5 text-cyan-400" />
          <span>{lang === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}</span>
        </button>
      </div>

      <div className="max-w-md w-full space-y-6 bg-slate-900/90 p-8 sm:p-10 rounded-3xl shadow-2xl relative z-10 border border-slate-800 backdrop-blur-xl">
        
        {/* Brand header */}
        <div className="text-center">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3">
            <Sparkles className="h-7 w-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {step === 1 
              ? (lang === 'en' ? 'Farmer Registration' : 'नया किसान पंजीकरण')
              : (lang === 'en' ? 'Select Village & Block' : 'अपना गाँव व ब्लॉक चुनें')}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {step === 1 
              ? (lang === 'en' ? 'Enter name and mobile number to receive alerts' : 'मौसम अलर्ट पाने के लिए नाम एवं मोबाइल नंबर दर्ज करें')
              : (lang === 'en' ? 'Select your farm location across All India' : 'अखिल भारतीय स्तर पर अपने खेत का सटीक स्थान चुनें')}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className={`h-2 rounded-full transition-all ${step === 1 ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-700'}`} />
          <div className={`h-2 rounded-full transition-all ${step === 2 ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-700'}`} />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs font-semibold">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form className="space-y-4" onSubmit={handleNext}>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                {lang === 'en' ? 'Farmer Name' : 'किसान का पूरा नाम'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <UserIcon className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  required
                  className="rounded-xl block w-full pl-10 px-3 py-3 bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                  placeholder={lang === 'en' ? 'e.g. Ramesh Patel' : 'उदा. रमेश पटेल'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                {lang === 'en' ? 'Mobile Number (10 Digits)' : 'मोबाइल नंबर (10 अंक)'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  className="rounded-xl block w-full pl-10 px-3 py-3 bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm font-mono"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3.5 px-4 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-600/20 items-center gap-2 mt-4"
            >
              <span>{lang === 'en' ? 'Next: Select Location' : 'आगे बढ़ें: स्थान चुनें'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleRegisterComplete}>
            
            {/* State */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                1. {lang === 'en' ? 'State' : 'राज्य'}
              </label>
              <select
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                {states.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                2. {lang === 'en' ? 'District' : 'ज़िला'}
              </label>
              <select
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                {districts.map((dt) => (
                  <option key={dt} value={dt}>{dt}</option>
                ))}
              </select>
            </div>

            {/* Block */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                3. {lang === 'en' ? 'Block (Tehsil)' : 'ब्लॉक / तहसील'}
              </label>
              <select
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
              >
                {blocks.map((bk) => (
                  <option key={bk} value={bk}>{bk}</option>
                ))}
              </select>
            </div>

            {/* Panchayat */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                4. {lang === 'en' ? 'Gram Panchayat' : 'ग्राम पंचायत'}
              </label>
              <select
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                value={selectedPanchayatObj ? selectedPanchayatObj.id : ''}
                onChange={(e) => {
                  const p = panchayats.find((item) => String(item.id) === e.target.value);
                  setSelectedPanchayatObj(p);
                }}
              >
                {panchayats.map((pan) => (
                  <option key={pan.id} value={pan.id}>{pan.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition"
              >
                {lang === 'en' ? 'Back' : 'पीछे'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{loading ? 'Submitting...' : (lang === 'en' ? 'Complete Registration' : 'पंजीकरण पूरा करें')}</span>
              </button>
            </div>

          </form>
        )}

        {/* Login Link */}
        <div className="pt-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            {lang === 'en' ? 'Already registered?' : 'पहले से खाता है?'}{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-bold underline ml-1 inline-flex items-center gap-1">
              <LogIn className="h-3 w-3" />
              <span>{lang === 'en' ? 'Login via OTP' : 'OTP से लॉगिन करें'}</span>
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
}
