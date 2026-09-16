import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, User, MapPin, ArrowRight } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    state: '',
    district: '',
    tehsil: '',
    block: '',
    panchayat: ''
  });

  // Mock data for dropdowns
  const states = ['Madhya Pradesh', 'Maharashtra', 'Gujarat'];
  const districts = ['Bhopal', 'Sehore', 'Vidisha'];
  const tehsils = ['Huzur', 'Berasia', 'Kolar'];
  const blocks = ['Phanda', 'Berasia', 'Obaidullaganj']; // In reality mapped to BLK_XXXXX
  const panchayats = ['Ratibad', 'Mugaliya Chhap', 'Khejra'];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // Complete registration and go to dashboard
      localStorage.setItem('userBlockName', formData.block);
      localStorage.setItem('userBlockId', 'BLK_00001'); // Hardcoded for demo to load real data
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1599813958932-d1ebbc1381de?auto=format&fit=crop&q=80")' }}
      />
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl relative z-10 border border-slate-100">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-slate-900">
            {step === 1 ? 'नया खाता बनाएँ' : 'अपना स्थान चुनें'}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            {step === 1 ? 'अपनी मूल जानकारी दर्ज करें' : 'सटीक मौसम जानकारी के लिए अपना गाँव चुनें'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">पूरा नाम (Full Name)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    className="appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border border-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="अपना नाम दर्ज करें"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">मोबाइल नंबर (Mobile Number)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    className="appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border border-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10 अंकों का मोबाइल नंबर"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2 text-slate-600 text-sm mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span>हम आपको आपके चुने हुए स्थान के आधार पर अलर्ट भेजेंगे (SMS Alerts)।</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">राज्य (State)</label>
                <select 
                  required
                  className="w-full rounded-xl border border-slate-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                >
                  <option value="">राज्य चुनें...</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ज़िला (District)</label>
                <select 
                  required
                  className="w-full rounded-xl border border-slate-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.district}
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                >
                  <option value="">ज़िला चुनें...</option>
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">तहसील (Tehsil)</label>
                <select 
                  required
                  className="w-full rounded-xl border border-slate-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.tehsil}
                  onChange={(e) => setFormData({...formData, tehsil: e.target.value})}
                >
                  <option value="">तहसील चुनें...</option>
                  {tehsils.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ब्लॉक (Block)</label>
                <select 
                  required
                  className="w-full rounded-xl border border-slate-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.block}
                  onChange={(e) => setFormData({...formData, block: e.target.value})}
                >
                  <option value="">ब्लॉक चुनें...</option>
                  {blocks.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ग्राम पंचायत (Gram Panchayat)</label>
                <select 
                  required
                  className="w-full rounded-xl border border-slate-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.panchayat}
                  onChange={(e) => setFormData({...formData, panchayat: e.target.value})}
                >
                  <option value="">ग्राम पंचायत चुनें...</option>
                  {panchayats.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 flex justify-center py-3 px-4 border border-slate-300 text-sm font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-colors"
              >
                पीछे जाएँ
              </button>
            )}
            <button
              type="submit"
              className="flex-1 flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md transition-colors items-center gap-2"
            >
              {step === 1 ? 'आगे बढ़ें' : 'खाता बनाएँ'} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
