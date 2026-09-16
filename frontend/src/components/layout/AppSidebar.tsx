import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Map,
  CalendarDays,
  Sprout,
  History,
  Activity,
  BellRing,
  BookOpen,
  MapPin,
  Settings
} from 'lucide-react';

export default function AppSidebar() {
  const { lang } = useApp();

  const navItems = [
    {
      to: '/dashboard',
      icon: LayoutDashboard,
      label_en: 'Dashboard',
      label_hi: 'डैशबोर्ड'
    },
    {
      to: '/location',
      icon: MapPin,
      label_en: 'Location Selector',
      label_hi: 'स्थान चयन'
    },
    {
      to: '/map',
      icon: Map,
      label_en: 'Hyperlocal Map',
      label_hi: 'हाइपरलोकल नक्शा'
    },
    {
      to: '/forecast',
      icon: CalendarDays,
      label_en: 'Forecast (30-Day)',
      label_hi: 'पूर्वानुमान (30 दिन)'
    },
    {
      to: '/advisory',
      icon: Sprout,
      label_en: 'Crop Advisory',
      label_hi: 'फसल कृषि सलाह'
    },
    {
      to: '/history',
      icon: History,
      label_en: 'Historical Analysis',
      label_hi: 'ऐतिहासिक विश्लेषण'
    },
    {
      to: '/climate-signals',
      icon: Activity,
      label_en: 'Climate Signals',
      label_hi: 'जलवायु संकेत (ENSO/IOD)'
    },
    {
      to: '/alerts',
      icon: BellRing,
      label_en: 'Alert Center',
      label_hi: 'चेतावनी केंद्र'
    },
    {
      to: '/methodology',
      icon: BookOpen,
      label_en: 'AI Methodology',
      label_hi: 'मॉडल प्रणाली'
    },
    {
      to: '/settings',
      icon: Settings,
      label_en: 'Settings',
      label_hi: 'सेटिंग्स'
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 flex flex-col justify-between hidden md:flex">
      <div className="p-4 space-y-1.5 overflow-y-auto">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 py-2">
          {lang === 'en' ? 'Platform Navigation' : 'नेविगेशन मेनू'}
        </div>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                }`
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span>{lang === 'en' ? item.label_en : item.label_hi}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Mini MoES Footer badge */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="text-xs text-slate-400 font-medium">Ministry of Earth Sciences (MoES)</div>
        <div className="text-[10px] text-slate-500 mt-0.5">NCMRWF • SIH 2026 Initiative</div>
      </div>
    </aside>
  );
}
