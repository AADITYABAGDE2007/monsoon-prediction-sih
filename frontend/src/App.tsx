import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import TopNavbar from './components/layout/TopNavbar';
import AppSidebar from './components/layout/AppSidebar';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import LocationSelection from './pages/LocationSelection';
import HyperlocalMap from './pages/HyperlocalMap';
import ForecastPage from './pages/ForecastPage';
import CropAdvisoryPage from './pages/CropAdvisoryPage';
import HistoricalAnalysis from './pages/HistoricalAnalysis';
import ClimateSignalsPage from './pages/ClimateSignalsPage';
import AlertsCenter from './pages/AlertsCenter';
import MethodologyPage from './pages/MethodologyPage';
import SettingsPage from './pages/SettingsPage';
import Explainability from './pages/Explainability';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
          
          {/* Top Bar */}
          <TopNavbar />

          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar */}
            <AppSidebar />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-slate-50">
              <Routes>
                {/* Landing page accessible directly */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Main Core Platform Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/location" element={<LocationSelection />} />
                <Route path="/map" element={<HyperlocalMap />} />
                <Route path="/forecast" element={<ForecastPage />} />
                <Route path="/advisory" element={<CropAdvisoryPage />} />
                <Route path="/history" element={<HistoricalAnalysis />} />
                <Route path="/climate-signals" element={<ClimateSignalsPage />} />
                <Route path="/alerts" element={<AlertsCenter />} />
                <Route path="/methodology" element={<MethodologyPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                
                {/* Native Real SHAP Explainability from Phase B */}
                <Route path="/explainability" element={<Explainability />} />

                {/* Default redirect to Dashboard */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>

        </div>
      </Router>
    </AppProvider>
  );
}
