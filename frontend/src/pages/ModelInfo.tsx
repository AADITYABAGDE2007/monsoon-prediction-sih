import React, { useEffect, useState } from 'react';
import { fetchModelInfo } from '../services/api';

export default function ModelInfo() {
  const [apiInfo, setApiInfo] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchModelInfo()
      .then(res => setApiInfo(res))
      .catch(() => setError(true));
  }, []);

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Model Information</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Architecture</h3>
            <ul className="space-y-2 text-slate-700">
              <li><strong>Model Family:</strong> XGBoost (Frozen)</li>
              <li><strong>Feature Count:</strong> 34 Exact Features</li>
              <li><strong>Sub-Models:</strong> Onset 7-Day, Onset 14-Day, Break 7-Day, Break 14-Day</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Calibration & Evaluation</h3>
            <ul className="space-y-2 text-slate-700">
              <li><strong>Calibration:</strong> Isotonic Regression</li>
              <li><strong>Calibration Year:</strong> 2022</li>
              <li><strong>Threshold Selection:</strong> 2023</li>
              <li><strong>Final Untouched Test:</strong> 2024</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">API Backend Status</h2>
        {apiInfo ? (
          <div className="bg-green-50 text-green-800 p-4 rounded border border-green-200">
            <p className="font-semibold mb-2">Backend API is online.</p>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(apiInfo, null, 2)}
            </pre>
          </div>
        ) : error ? (
          <div className="bg-yellow-50 text-yellow-800 p-4 rounded border border-yellow-200">
            <p>Backend API is currently unreachable or models are not loaded. The dashboard is operating in Historical Demo mode only.</p>
          </div>
        ) : (
          <div className="text-slate-500">Checking API status...</div>
        )}
      </div>
    </div>
  );
}
