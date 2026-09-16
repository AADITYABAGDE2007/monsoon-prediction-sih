import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

export interface LocationInfo {
  id: number;
  state: string;
  district: string;
  block: string;
  panchayat: string;
  block_id: string;
  lat: number;
  lon: number;
}

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  location: LocationInfo;
  setLocation: (loc: LocationInfo) => void;
  dataMode: 'LIVE' | 'DEMO';
  setDataMode: (mode: 'LIVE' | 'DEMO') => void;
  user: any;
  setUser: (user: any) => void;
  logout: () => void;
}

const DEFAULT_LOCATION: LocationInfo = {
  id: 1,
  state: 'Madhya Pradesh',
  district: 'Betul',
  block: 'Betul',
  panchayat: 'Sadar',
  block_id: 'BLK_00001',
  lat: 21.90,
  lon: 77.90
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('mm_lang') as Language) || 'en';
  });

  const [location, setLocationState] = useState<LocationInfo>(() => {
    const saved = localStorage.getItem('mm_loc');
    return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
  });

  const [user, setUserState] = useState<any>(() => {
    const saved = localStorage.getItem('mm_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [dataMode, setDataMode] = useState<'LIVE' | 'DEMO'>('LIVE');

  useEffect(() => {
    localStorage.setItem('mm_lang', lang);
  }, [lang]);

  const setLocation = (loc: LocationInfo) => {
    setLocationState(loc);
    localStorage.setItem('mm_loc', JSON.stringify(loc));
  };

  const setUser = (userData: any) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem('mm_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('mm_user');
      localStorage.removeItem('mm_token');
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ lang, setLang, location, setLocation, dataMode, setDataMode, user, setUser, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
