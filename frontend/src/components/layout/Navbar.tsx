import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CloudRain, Menu, X, Globe, User } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState('hi'); // 'hi' or 'en'
  const navigate = useNavigate();
  const location = useLocation();

  const toggleLang = () => {
    setLang(lang === 'hi' ? 'en' : 'hi');
    // In a real app, this would trigger an i18n context update
  };

  const isAuth = location.pathname.includes('/dashboard') || location.pathname.includes('/map');

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <CloudRain className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">
                Monsoon Mitra
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={toggleLang}
              className="flex items-center gap-1 text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors"
            >
              <Globe className="h-4 w-4" />
              {lang === 'hi' ? 'English' : 'हिंदी'}
            </button>
            
            {isAuth ? (
              <div className="flex items-center gap-6">
                <Link to="/dashboard" className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors">
                  {lang === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
                </Link>
                <Link to="/map" className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors">
                  {lang === 'hi' ? 'नक्शा' : 'Map'}
                </Link>
                <button 
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 text-slate-600 hover:text-red-600 font-medium text-sm transition-colors"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login"
                  className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors"
                >
                  {lang === 'hi' ? 'लॉग इन करें' : 'Login'}
                </Link>
                <Link 
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
                >
                  {lang === 'hi' ? 'नया खाता बनाएँ' : 'Register'}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-500 hover:text-slate-700 p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200">
          <div className="px-4 pt-2 pb-4 space-y-3">
            <button 
              onClick={toggleLang}
              className="flex items-center gap-2 text-slate-600 w-full p-2"
            >
              <Globe className="h-5 w-5" />
              {lang === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
            </button>
            
            {isAuth ? (
              <button 
                onClick={() => navigate('/')}
                className="block text-slate-600 font-medium w-full text-left p-2"
              >
                Log Out
              </button>
            ) : (
              <>
                <Link 
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-slate-600 font-medium p-2"
                >
                  {lang === 'hi' ? 'लॉग इन करें' : 'Login'}
                </Link>
                <Link 
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block bg-blue-600 text-white font-medium p-2 rounded-lg text-center"
                >
                  {lang === 'hi' ? 'नया खाता बनाएँ' : 'Register'}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
