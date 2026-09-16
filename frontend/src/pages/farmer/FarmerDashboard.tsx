import React, { useEffect, useState } from 'react';
import { fetchProductionBlock, fetchExplainability } from '../../services/api';
import { CloudRain, Sun, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';

export default function FarmerDashboard() {
  const [blockData, setBlockData] = useState<any>(null);
  const [shapData, setShapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Get user's block from registration (or default to BLK_00001 for demo)
  const blockId = localStorage.getItem('userBlockId') || 'BLK_00001';
  const blockName = localStorage.getItem('userBlockName') || 'Phanda';

  useEffect(() => {
    Promise.all([
      fetchProductionBlock(blockId),
      fetchExplainability(blockId, 'onset_7d')
    ]).then(([blockRes, shapRes]) => {
      setBlockData(blockRes);
      setShapData(shapRes);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [blockId]);

  if (loading) {
    return <div className="text-center py-20 text-slate-500 font-bold">मौसम का डेटा लाया जा रहा है... (Loading Data)</div>;
  }

  if (!blockData) {
    return <div className="text-center py-20 text-red-500">डेटा नहीं मिला (Data not found)</div>;
  }

  const alertColors: Record<string, string> = {
    "GREEN": "bg-green-100 border-green-500 text-green-800",
    "YELLOW": "bg-yellow-100 border-yellow-500 text-yellow-800",
    "ORANGE": "bg-orange-100 border-orange-500 text-orange-800",
    "RED": "bg-red-100 border-red-500 text-red-800"
  };

  const currentAlertColor = alertColors[blockData.alert_level] || "bg-slate-100 border-slate-500 text-slate-800";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <MapPin className="h-8 w-8 text-blue-600" />
            आपका गाँव: {blockName}
          </h1>
          <p className="text-slate-500 mt-1">
            ब्लॉक आईडी: {blockData.block_id} | मौसम रिपोर्ट दिनांक: {blockData.date}
          </p>
        </div>
      </div>

      {/* Main Alert Card */}
      <div className={`p-6 rounded-2xl border-l-8 shadow-sm mb-8 ${currentAlertColor}`}>
        <div className="flex items-start gap-4">
          <AlertTriangle className="h-8 w-8 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-bold mb-2">
              वर्तमान स्थिति (Current Alert): {blockData.alert_level}
            </h2>
            <p className="text-lg font-medium opacity-90">
              कृषि सलाह (Advisory): {blockData.advisory_action.replace(/_/g, ' ')}
            </p>
          </div>
        </div>
      </div>

      {/* Probability Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Onset (Rain) Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800">बारिश की संभावना</h3>
              <p className="text-sm text-slate-500">अगले 7 दिनों में मानसून आने की उम्मीद</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <CloudRain className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-blue-600 mb-2">
            {(blockData.onset_7d_probability * 100).toFixed(0)}%
          </div>
          <div className="text-sm font-medium text-slate-600">
            खतरे का स्तर: {blockData.onset_7d_risk_band.replace('_', ' ')}
          </div>
        </div>

        {/* Break (Dry Spell) Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800">सूखे का खतरा</h3>
              <p className="text-sm text-slate-500">अगले 7 दिनों में मौसम सूखा रहने की उम्मीद</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Sun className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-orange-600 mb-2">
            {(blockData.break_7d_probability * 100).toFixed(0)}%
          </div>
          <div className="text-sm font-medium text-slate-600">
            खतरे का स्तर: {blockData.break_7d_risk_band.replace('_', ' ')}
          </div>
        </div>
      </div>

      {/* AI Explanation Section (Simplified SHAP) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="h-6 w-6 text-green-600" />
          <h3 className="text-xl font-bold text-slate-800">AI ने यह भविष्यवाणी क्यों की?</h3>
        </div>
        
        {shapData ? (
          <div>
            <p className="text-sm text-slate-600 mb-6">
              हमारे AI सिस्टम ने निम्नलिखित कारणों से यह रिपोर्ट तैयार की है (सबसे मुख्य कारण ऊपर हैं):
            </p>
            <div className="space-y-3">
              {shapData.contributions.slice(0, 5).map((c: any, i: number) => {
                const isPositive = c.contribution > 0;
                return (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="font-medium text-slate-700">{c.feature.replace(/_/g, ' ').toUpperCase()}</div>
                    <div className={`text-sm font-bold ${isPositive ? 'text-red-500' : 'text-blue-500'}`}>
                      {isPositive ? 'बारिश का खतरा बढ़ाता है' : 'मौसम सामान्य रखता है'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-slate-500 text-sm">AI विश्लेषण अभी उपलब्ध नहीं है।</p>
        )}
      </div>

    </div>
  );
}
