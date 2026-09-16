import React, { useEffect, useState } from 'react';
import { fetchExplainability, fetchProductionBlocks } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Explainability() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [blocks, setBlocks] = useState<any[]>([]);
  const [selectedBlock, setSelectedBlock] = useState('BLK_00001');
  const [selectedModel, setSelectedModel] = useState('onset_7d');

  const models = [
    { id: 'onset_7d', label: 'Onset 7-Day' },
    { id: 'onset_14d', label: 'Onset 14-Day' },
    { id: 'break_7d', label: 'Break 7-Day' },
    { id: 'break_14d', label: 'Break 14-Day' }
  ];

  useEffect(() => {
    fetchProductionBlocks().then(res => {
      setBlocks(res.slice(0, 500)); // Just load a few blocks for dropdown to avoid lag
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedBlock) return;
    
    setLoading(true);
    setError(null);
    fetchExplainability(selectedBlock, selectedModel)
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Could not load explainability data for this block.");
        setLoading(false);
      });
  }, [selectedBlock, selectedModel]);

  const chartData = React.useMemo(() => {
    if (!data || !data.contributions) return [];
    
    // Sort absolute contribution to show biggest impact at top
    const sorted = [...data.contributions].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
    // Take top 15 features
    return sorted.slice(0, 15).map(c => ({
      name: c.feature,
      value: c.contribution,
      actualValue: c.value
    }));
  }, [data]);

  return (
    <div className="space-y-6">
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Block</label>
          <select 
            className="border border-slate-300 rounded px-3 py-2 text-sm w-48"
            value={selectedBlock}
            onChange={e => setSelectedBlock(e.target.value)}
          >
            {blocks.map(b => (
              <option key={b.block_id} value={b.block_id}>{b.block_id}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Model</label>
          <select 
            className="border border-slate-300 rounded px-3 py-2 text-sm w-48"
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
          >
            {models.map(m => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Local Model Explanation (SHAP)</h1>
        <p className="text-slate-600 mb-4 text-sm">
          <strong>Important Scientific Note:</strong> SHAP values indicate how strongly each feature contributed to the specific model's <em>raw numerical prediction</em> for this exact block and date. 
          It mathematically breaks down the raw score into base expected value + feature contributions. <strong>This does not establish physical causation.</strong>
        </p>

        {loading ? (
          <div className="text-center py-10 text-slate-500">Calculating local SHAP contributions...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : data ? (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 p-4 rounded border border-slate-100">
                <div className="text-xs text-slate-500 font-bold uppercase">Raw Model Score (Margin)</div>
                <div className="text-xl font-bold text-slate-800">{data.raw_score.toFixed(4)}</div>
                <div className="text-xs text-slate-400 mt-1">SHAP Sum Validation: {data.shap_sum_validation.toFixed(4)}</div>
              </div>
              <div className="bg-slate-50 p-4 rounded border border-slate-100">
                <div className="text-xs text-slate-500 font-bold uppercase">Base / Expected Value</div>
                <div className="text-xl font-bold text-slate-800">{data.base_value.toFixed(4)}</div>
                <div className="text-xs text-slate-400 mt-1">Average model margin without features</div>
              </div>
              <div className="bg-blue-50 p-4 rounded border border-blue-100">
                <div className="text-xs text-blue-600 font-bold uppercase">Calibrated Probability</div>
                <div className="text-xl font-bold text-blue-800">{(data.calibrated_probability * 100).toFixed(1)}%</div>
                <div className="text-xs text-blue-500 mt-1">Final Operational Score</div>
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-800 mb-3 border-b pb-2">Top 15 Feature Contributions</h3>
            
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 130, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: any, name: any, props: any) => [
                      `Contrib: ${Number(value).toFixed(4)} | Value: ${Number(props.payload.actualValue).toFixed(4)}`, 
                      "Impact"
                    ]}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#ef4444' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex gap-4 mt-4 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-red-500 rounded-sm"></span> Positive Contribution (Pushes Score Up)
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-500 rounded-sm"></span> Negative Contribution (Pushes Score Down)
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
