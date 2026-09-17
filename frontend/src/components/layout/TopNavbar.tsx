import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  CloudRain, 
  MapPin, 
  Globe, 
  Bell, 
  Menu, 
  X,
  ChevronRight,
  Sparkles,
  User,
  LogOut,
  ShieldCheck,
  Phone,
  Sprout,
  Check
} from 'lucide-react';

export default function TopNavbar() {
  const { lang, setLang, location, user, logout } = useApp();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'hi' : 'en');
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate('/');
  };

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2 rounded-xl shadow-md group-hover:scale-105 transition-transform">
                <CloudRain className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                  MonsoonMitra
                </span>
              </div>
            </Link>

            {/* Location Breadcrumb Badge */}
            <Link 
              to="/location"
              className="hidden lg:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs text-slate-300 transition-colors shadow-inner"
              title={lang === 'en' ? 'Click to Change Location' : 'स्थान बदलने के लिए क्लिक करें'}
            >
              <MapPin className="h-3.5 w-3.5 text-cyan-400" />
              <span className="font-semibold text-white">{location.block}</span>
              <span className="text-slate-400">({location.district}, {location.state})</span>
              <ChevronRight className="h-3 w-3 text-slate-500" />
            </Link>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors shadow-sm"
              title="Change Language"
            >
              <Globe className="h-3.5 w-3.5 text-blue-400" />
              <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* User Profile Avatar with Modal/Dropdown (No phone number shown directly in navbar) */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="relative p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 flex items-center justify-center group"
                  title={lang === 'en' ? 'Farmer Profile' : 'किसान प्रोफाइल'}
                >
                  <User className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
                </button>

                {/* Profile Popup Dropdown Card */}
                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    
                    {/* Profile Header */}
                    <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-black text-lg shadow-lg">
                          {(user?.name ? user.name[0] : 'K').toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-white text-sm">
                            {user?.name || (lang === 'en' ? 'Farmer Friend' : 'किसान साथी')}
                          </h4>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                            <Phone className="h-3 w-3 text-cyan-400" />
                            <span className="font-mono">{user?.phone}</span>
                          </div>
                          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 mt-1">
                            <ShieldCheck className="h-3 w-3" />
                            <span>{lang === 'en' ? 'Verified Kisan Profile' : 'प्रमाणित किसान खाता'}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setProfileOpen(false)}
                        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Registered Farm Location Details */}
                    <div className="py-4 border-b border-slate-800 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {lang === 'en' ? 'Registered Farm Location' : 'पंजीकृत खेत का स्थान'}
                      </span>
                      <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-400">{lang === 'en' ? 'Panchayat:' : 'पंचायत:'}</span>
                          <span className="font-bold text-white">{location.panchayat}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-400">{lang === 'en' ? 'Block / District:' : 'ब्लॉक / ज़िला:'}</span>
                          <span className="font-medium text-slate-200">{location.block}, {location.district}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-400">{lang === 'en' ? 'State:' : 'राज्य:'}</span>
                          <span className="font-medium text-cyan-300">{location.state}</span>
                        </div>
                      </div>

                      <Link
                        to="/location"
                        onClick={() => setProfileOpen(false)}
                        className="w-full text-center text-xs font-bold text-cyan-400 hover:text-cyan-300 py-1.5 block hover:underline"
                      >
                        {lang === 'en' ? 'Change Farm Location →' : 'खेत का स्थान बदलें →'}
                      </Link>
                    </div>

                    {/* Quick Shortcuts */}
                    <div className="py-3 border-b border-slate-800 space-y-1 text-xs">
                      <Link
                        to="/advisory"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
                      >
                        <Sprout className="h-4 w-4 text-emerald-400" />
                        <span>{lang === 'en' ? 'My Crop Advisory' : 'मेरी फसल कृषि सलाह'}</span>
                      </Link>
                      <button
                        onClick={toggleLanguage}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition text-left"
                      >
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-blue-400" />
                          <span>{lang === 'en' ? 'Language / भाषा' : 'भाषा / Language'}</span>
                        </div>
                        <span className="text-[11px] font-bold text-cyan-400">
                          {lang === 'en' ? 'English' : 'हिंदी'}
                        </span>
                      </button>
                    </div>

                    {/* Logout Button */}
                    <div className="pt-4">
                      <button
                        onClick={handleLogout}
                        className="w-full py-2.5 px-4 bg-red-950/50 hover:bg-red-900/60 border border-red-800/60 text-red-300 hover:text-red-100 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>{lang === 'en' ? 'Log Out Account' : 'खाता लॉग आउट करें'}</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
              >
                <User className="h-3.5 w-3.5" />
                <span>{lang === 'en' ? 'Kisan Login' : 'किसान लॉगिन'}</span>
              </Link>
            )}

            {/* Alerts Quick Link */}
            <Link 
              to="/alerts"
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Alert Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-slate-900"></span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {mobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
