import React from 'react';
import { Link } from 'react-router-dom';
import { CloudLightning, Sprout, ShieldAlert, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-blue-900 text-white overflow-hidden">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1599813958932-d1ebbc1381de?auto=format&fit=crop&q=80")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-blue-900/40" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              मानसून की सटीक जानकारी, <br />
              <span className="text-blue-400">अब सीधे आपके गाँव तक</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl leading-relaxed">
              Monsoon Mitra is an AI-powered Early Warning System that predicts Monsoon Onset and Droughts 
              at the Block and Panchayat level, helping farmers secure their crops.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/register" 
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg text-center transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                अपना गाँव जोड़ें <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                to="/login" 
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg text-center transition-colors"
              >
                लॉग इन करें
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">हमारी सेवाएँ (Our Services)</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              हम मौसम विभाग (IMD) के डेटा और AI का उपयोग करके आपको सबसे सटीक जानकारी प्रदान करते हैं।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6">
                <CloudLightning className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">बारिश की भविष्यवाणी</h3>
              <p className="text-slate-600 leading-relaxed">
                जानें कि आपके ब्लॉक में अगले 7 से 14 दिनों में मानसून आने की कितनी संभावना है।
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6">
                <ShieldAlert className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">सूखे का अलर्ट (Dry Spell)</h3>
              <p className="text-slate-600 leading-relaxed">
                सूखा पड़ने से पहले अलर्ट प्राप्त करें, ताकि आप सिंचाई का सही प्रबंध कर सकें।
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="bg-green-100 w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6">
                <Sprout className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">फसल सुरक्षा सलाह</h3>
              <p className="text-slate-600 leading-relaxed">
                मौसम के अनुसार कृषि वैज्ञानिकों द्वारा दी गई सलाह (Advisory) सीधे आपके फोन पर।
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
