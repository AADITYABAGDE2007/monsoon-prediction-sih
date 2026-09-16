import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import TopNavbar from './components/layout/TopNavbar';
import AppSidebar from './components/layout/AppSidebar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';

// Protected Core Platform Pages
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

function AppContent() {
  const { user } = useApp();

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-950 font-sans text-slate-100">
        
        {/* Render TopNavbar only for logged-in users inside platform */}
        {user && <TopNavbar />}

        <div className="flex flex-1 overflow-hidden">
          {/* Render Sidebar only for logged-in users inside platform */}
          {user && <AppSidebar />}

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-slate-50 text-slate-900 flex flex-col justify-between">
            <div className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* Auth-Protected Core Platform Routes */}
                <Route 
                  path="/dashboard" 
                  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
                />
                <Route 
                  path="/location" 
                  element={<ProtectedRoute><LocationSelection /></ProtectedRoute>} 
                />
                <Route 
                  path="/map" 
                  element={<ProtectedRoute><HyperlocalMap /></ProtectedRoute>} 
                />
                <Route 
                  path="/forecast" 
                  element={<ProtectedRoute><ForecastPage /></ProtectedRoute>} 
                />
                <Route 
                  path="/advisory" 
                  element={<ProtectedRoute><CropAdvisoryPage /></ProtectedRoute>} 
                />
                <Route 
                  path="/history" 
                  element={<ProtectedRoute><HistoricalAnalysis /></ProtectedRoute>} 
                />
                <Route 
                  path="/climate-signals" 
                  element={<ProtectedRoute><ClimateSignalsPage /></ProtectedRoute>} 
                />
                <Route 
                  path="/alerts" 
                  element={<ProtectedRoute><AlertsCenter /></ProtectedRoute>} 
                />
                <Route 
                  path="/methodology" 
                  element={<ProtectedRoute><MethodologyPage /></ProtectedRoute>} 
                />
                <Route 
                  path="/settings" 
                  element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} 
                />
                <Route 
                  path="/explainability" 
                  element={<ProtectedRoute><Explainability /></ProtectedRoute>} 
                />

                {/* Default Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>

            {/* Render Platform Footer at bottom of logged in app */}
            {user && <Footer />}
          </main>
        </div>

      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
