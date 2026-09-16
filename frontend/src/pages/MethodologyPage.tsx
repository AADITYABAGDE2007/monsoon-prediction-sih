import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Cpu,
  Layers,
  CheckCircle2,
  Database,
  Binary,
  GitBranch,
  ShieldCheck,
  Award
} from 'lucide-react';

export default function MethodologyPage() {
  const { lang } = useApp();

  const pipelineSteps = [
    { title: 'Data Ingestion', desc: 'ERA5 reanalysis, IMD gridded daily precipitation, NOAA ONI, BoM DMI & INSAT-3D OLR.' },
    { title: 'Quality Control & Alignment', desc: 'Missing value imputation, temporal window aggregation, and LGD/Bhuvan spatial alignment.' },
    { title: 'Feature Engineering (34-Contract)', desc: '1d, 3d, 7d, 15d, 30d rolling rainfall, dry/wet spells, 850/925 hPa winds, shear & MJO phase.' },
    { title: 'Frozen XGBoost Inference', desc: '4 dedicated gradient boosted tree models (onset_7d, onset_14d, break_7d, break_14d).' },
    { title: 'Isotonic Probability Calibration', desc: 'Post-hoc non-parametric probability calibration mapping raw margins to statistical percentages.' },
    { title: 'Local SHAP Attribution', desc: 'Native TreeExplainer calculating exact additive feature contributions per block prediction.' },
    { title: 'Agronomic Expert Rules', desc: 'Heuristic translation of moisture stress probabilities into crop-specific advisories.' }
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="text-xs font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1.5 mb-1">
          <BookOpen className="h-4 w-4" />
          Scientific Architecture & Model Transparency
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          AI & ML Prediction Methodology
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Technical specifications of the hybrid physical-statistical downscaling architecture (SIH26086).
        </p>
      </div>

      {/* Visual Pipeline */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
          End-to-End Processing Architecture
        </h3>

        <div className="relative border-l-2 border-blue-600 ml-4 pl-6 space-y-6">
          {pipelineSteps.map((step, idx) => (
            <div key={idx} className="relative">
              <span className="absolute -left-[33px] top-0.5 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-100 flex items-center justify-center text-[9px] font-bold text-white">
                {idx + 1}
              </span>
              <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Model Contract & Metric Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-extrabold text-blue-600 uppercase">
            <Binary className="h-4 w-4" />
            Frozen Model Specification
          </div>
          <h4 className="text-base font-bold text-slate-900">34-Feature Atmospheric Contract</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Models are trained with strict time-series splits (chronological evaluation) to avoid future data leakage. 
            Calibrated with Isotonic regression to ensure Brier score minimization.
          </p>
          <div className="pt-2">
            <span className="text-xs font-mono font-bold bg-slate-100 px-3 py-1 rounded text-slate-700">
              Contract Version: xgboost-frozen-production
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-600 uppercase">
            <ShieldCheck className="h-4 w-4" />
            Operational Risk Protocol
          </div>
          <h4 className="text-base font-bold text-slate-900">Threshold Verification</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Predictions are verified against untouched 2024–2025 ground truth. 
            All SHAP values satisfy the mathematical property: 
            <code className="text-[11px] bg-slate-100 p-1 rounded font-bold block mt-1">
              Sum(SHAP) + Expected Bias == Raw Model Margin
            </code>
          </p>
        </div>
      </div>

    </div>
  );
}
