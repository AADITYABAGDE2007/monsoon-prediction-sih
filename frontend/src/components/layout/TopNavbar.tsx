import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  LogOut
} from 'lucide-react';

export default function TopNavbar() {
  const { lang, setLang, location, user, logout } = useApp();
  const [mobileMenu, setMobileMenu] = useState(false);
  const currentPath = useLocation().pathname;

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'hi' : 'en');
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
              title="Click to Change Location"
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

            {/* User Profile / Login Link */}
            {user ? (
              <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-xs">
                <User className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-semibold text-slate-200">{user.phone}</span>
                <button
                  onClick={logout}
                  className="text-slate-400 hover:text-red-400 ml-1"
                  title="Logout"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
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
