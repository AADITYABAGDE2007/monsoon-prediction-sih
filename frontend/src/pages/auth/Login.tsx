import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { sendOtp, verifyOtp } from '../../services/api';
import { Phone, KeyRound, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { lang, location, setUser } = useApp();
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoHint, setDemoHint] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError(lang === 'en' ? 'Please enter a valid 10-digit mobile number' : 'कृपया मान्य 10-अंकीय मोबाइल नंबर दर्ज करें');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await sendOtp(phone);
      setStep('otp');
      if (res.test_otp) {
        setDemoHint(`Test OTP: ${res.test_otp}`);
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError(lang === 'en' ? 'Please enter OTP' : 'कृपया OTP दर्ज करें');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await verifyOtp(phone, otp, 'Kisan Brother', location.id);
      localStorage.setItem('mm_token', res.access_token);
      setUser(res.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Invalid OTP. Please enter 7722 or 123456');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1599813958932-d1ebbc1381de?auto=format&fit=crop&q=80")' }}
      />
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-xl relative z-10 border border-slate-100">
        
        <div className="text-center">
          <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600 mb-3">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {lang === 'en' ? 'Kisan Mobile Login' : 'किसान मोबाइल लॉगिन'}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {step === 'phone' 
              ? (lang === 'en' ? 'Enter mobile number for instant OTP verification' : 'त्वरित OTP सत्यापन के लिए मोबाइल नंबर दर्ज करें')
              : (lang === 'en' ? `Enter the verification code sent to ${phone}` : `${phone} पर भेजा गया सत्यापन कोड दर्ज करें`)}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
            {error}
          </div>
        )}

        {demoHint && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>{demoHint}</span>
          </div>
        )}

        {step === 'phone' ? (
          <form className="space-y-5" onSubmit={handleSendOtp}>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                {lang === 'en' ? 'Mobile Number' : 'मोबाइल नंबर (10 अंक)'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  className="rounded-xl block w-full pl-10 px-3 py-3 border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm font-semibold"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md items-center gap-2 disabled:opacity-50"
            >
              {loading 
                ? (lang === 'en' ? 'Sending OTP...' : 'OTP भेजा जा रहा है...') 
                : (lang === 'en' ? 'Send OTP' : 'OTP भेजें')} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <form className="space-y-5" onSubmit={handleVerifyOtp}>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                {lang === 'en' ? 'Enter 4 or 6-digit OTP' : 'OTP दर्ज करें'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <KeyRound className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  className="rounded-xl block w-full pl-10 px-3 py-3 border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none text-base tracking-widest font-bold"
                  placeholder="7722"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 text-sm font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md items-center gap-2 disabled:opacity-50"
            >
              {loading 
                ? (lang === 'en' ? 'Verifying...' : 'सत्यापित हो रहा है...') 
                : (lang === 'en' ? 'Verify & Login' : 'सत्यापित करें और लॉगिन करें')} <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => { setStep('phone'); setDemoHint(null); setError(null); }}
              className="w-full text-xs text-slate-500 hover:text-slate-800 font-semibold text-center"
            >
              {lang === 'en' ? 'Change Mobile Number' : 'मोबाइल नंबर बदलें'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
