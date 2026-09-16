import React from 'react';

export default function AboutSystem() {
  return (
    <div className="max-w-4xl bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-slate-700 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">About the System</h1>
      
      <p className="text-lg">
        The <strong>Hyperlocal Monsoon Onset & Break Prediction System</strong> provides block/village-scale forecasting for critical agricultural and disaster-management decision making.
      </p>

      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-3">Data Sources</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>IMD Rainfall (Gridded & Station)</li>
          <li>ERA5 Wind (850hPa, 925hPa) & Humidity</li>
          <li>Outgoing Longwave Radiation (OLR)</li>
          <li>ENSO/ONI Indices</li>
          <li>Indian Ocean Dipole (DMI)</li>
          <li>Madden-Julian Oscillation (MJO / RMM1, RMM2)</li>
          <li>Block-level geographic boundaries (EPSG:4326)</li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-3">System Pipeline</h2>
        <div className="bg-slate-50 p-4 rounded border border-slate-200 font-mono text-sm text-center">
          Data Ingestion &rarr; Feature Engineering (34 Features) &rarr; XGBoost Inference &rarr; Isotonic Calibration &rarr; Frozen Thresholds &rarr; Block-level Forecast &rarr; Risk Classification &rarr; Dashboard
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h3 className="font-bold text-blue-900 mb-1">Important Disclaimer</h3>
        <p className="text-blue-800 text-sm">
          The onset label used in this system is a project-specific block-scale operational proxy designed for local risk assessment. It is <strong>not</strong> the official IMD monsoon onset declaration for the country or broad regions.
        </p>
      </div>
    </div>
  );
}
