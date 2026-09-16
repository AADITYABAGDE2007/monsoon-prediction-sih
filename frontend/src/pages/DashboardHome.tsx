import React, { useEffect, useState } from 'react';
import { fetchProductionSummary } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function DashboardHome() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductionSummary().then(res => {
      setSummary(res);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const chartData = summary ? [
    { name: 'Green (Low)', count: summary.alert_levels["GREEN"] || 0, color: '#10b981' },
    { name: 'Yellow (Moderate)', count: summary.alert_levels["YELLOW"] || 0, color: '#f59e0b' },
    { name: 'Orange (High)', count: summary.alert_levels["ORANGE"] || 0, color: '#f97316' },
    { name: 'Red (Very High)', count: summary.alert_levels["RED"] || 0, color: '#ef4444' },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">System Overview</h1>
        <p className="text-slate-500">Block/Village Scale Forecasting for Monsoon Onset and Break Risk</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Blocks Evaluated" value={summary ? summary.total_blocks.toLocaleString() : "..."} />
        <StatCard title="Model Version" value={summary ? summary.model_version : "..."} />
        <StatCard title="Active Alerts" value={summary ? (summary.alert_levels["ORANGE"] + summary.alert_levels["RED"]).toLocaleString() : "..."} />
        <StatCard title="Forecast Date" value={summary ? summary.date : "..."} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Overall Risk Distribution</h2>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-slate-400">Loading...</div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
                  <XAxis dataKey="name" angle={-45} textAnchor="end" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h2 className="text-lg font-semibold text-slate-800 mb-4">Dashboard Actions</h2>
           <p className="text-slate-600 mb-4">
             Explore the interactive map for detailed block-level risk assessments, or view explainability charts to understand model decisions.
           </p>
           <div className="space-y-3">
             <a href="/map" className="block p-3 bg-blue-50 text-blue-700 rounded border border-blue-100 hover:bg-blue-100 transition">View Forecast Map →</a>
             <a href="/explorer" className="block p-3 bg-slate-50 text-slate-700 rounded border border-slate-200 hover:bg-slate-100 transition">Browse Block Explorer →</a>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string, value: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-sm font-medium text-slate-500 mb-1">{title}</h3>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
    </div>
  );
}
