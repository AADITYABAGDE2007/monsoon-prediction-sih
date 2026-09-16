import React, { useEffect, useState, useMemo } from 'react';
import { fetchProductionBlocks, fetchProductionBlock } from '../services/api';

export default function BlockExplorer() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [blockDetails, setBlockDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const rowsPerPage = 50;

  useEffect(() => {
    fetchProductionBlocks().then(res => {
      setData(res);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedBlockId) {
      setLoadingDetails(true);
      fetchProductionBlock(selectedBlockId).then(res => {
        setBlockDetails(res);
        setLoadingDetails(false);
      }).catch(err => {
        console.error(err);
        setLoadingDetails(false);
      });
    } else {
      setBlockDetails(null);
    }
  }, [selectedBlockId]);

  const filteredData = useMemo(() => {
    if (!search) return data;
    const lower = search.toLowerCase();
    return data.filter(d => 
      (d.block_id && d.block_id.toLowerCase().includes(lower)) || 
      (d.alert_level && d.alert_level.toLowerCase().includes(lower))
    );
  }, [data, search]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const AlertBadge = ({ alert }: { alert: string }) => {
    const colors: Record<string, string> = {
      "GREEN": "bg-green-100 text-green-800",
      "YELLOW": "bg-yellow-100 text-yellow-800",
      "ORANGE": "bg-orange-100 text-orange-800",
      "RED": "bg-red-600 text-white",
    };
    const c = colors[alert] || "bg-slate-100 text-slate-800";
    return <span className={`px-2 py-1 text-xs rounded-full font-bold ${c}`}>{alert || "UNKNOWN"}</span>;
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">Block Explorer</h2>
          <input 
            type="text" 
            placeholder="Search Block ID or Alert..." 
            className="border border-slate-300 rounded-md px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="text-center py-10 text-slate-500">Loading production blocks...</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-y border-slate-200">
                  <th className="py-3 px-4 font-semibold">Block ID</th>
                  <th className="py-3 px-4 font-semibold">Alert Level</th>
                  <th className="py-3 px-4 font-semibold">Combined Risk</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {paginatedData.map((row, i) => (
                  <tr 
                    key={i} 
                    className={`border-b border-slate-100 cursor-pointer hover:bg-slate-50 ${selectedBlockId === row.block_id ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedBlockId(row.block_id)}
                  >
                    <td className="py-3 px-4 font-medium text-blue-600">{row.block_id || "N/A"}</td>
                    <td className="py-3 px-4"><AlertBadge alert={row.alert_level} /></td>
                    <td className="py-3 px-4">{(row.combined_monsoon_risk * 100).toFixed(1)}%</td>
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-slate-500">No matching blocks found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center text-sm">
          <div className="text-slate-500">
            Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredData.length)} of {filteredData.length} entries
          </div>
          <div className="flex gap-2">
            <button 
              className="px-3 py-1 border border-slate-300 rounded disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              Prev
            </button>
            <button 
              className="px-3 py-1 border border-slate-300 rounded disabled:opacity-50"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Details Panel */}
      {selectedBlockId && (
        <div className="w-96 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800">Forecast Details</h2>
            <button className="text-slate-400 hover:text-slate-600" onClick={() => setSelectedBlockId(null)}>✕</button>
          </div>
          
          {loadingDetails ? (
            <div className="text-center py-10 text-slate-500">Loading block data...</div>
          ) : blockDetails ? (
            <div className="space-y-6">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase">Block ID</div>
                <div className="text-lg font-semibold">{blockDetails.block_id}</div>
                <div className="text-xs text-slate-400">Target Date: {blockDetails.date}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-2">Operational Alert</div>
                <div className="flex items-center gap-3">
                  <AlertBadge alert={blockDetails.alert_level} />
                  <span className="text-sm font-medium text-slate-700">Conf: {blockDetails.forecast_confidence}</span>
                </div>
                <div className="mt-3 text-sm text-slate-800 italic">
                  "{blockDetails.advisory_action?.replace(/_/g, ' ')}"
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 border-b pb-1 mb-3">Onset Analysis</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-500">7-Day Risk Band</div>
                    <div className="font-semibold text-sm">{blockDetails.onset_7d_risk_band?.replace('_', ' ')}</div>
                    <div className="text-xs text-slate-400">Score: {blockDetails.onset_7d_raw_score?.toFixed(3)}</div>
                    <div className="text-xs text-slate-400">Prob: {(blockDetails.onset_7d_probability * 100).toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">14-Day Risk Band</div>
                    <div className="font-semibold text-sm">{blockDetails.onset_14d_risk_band?.replace('_', ' ')}</div>
                    <div className="text-xs text-slate-400">Score: {blockDetails.onset_14d_raw_score?.toFixed(3)}</div>
                    <div className="text-xs text-slate-400">Prob: {(blockDetails.onset_14d_probability * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 border-b pb-1 mb-3">Break Analysis</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-500">7-Day Risk Band</div>
                    <div className="font-semibold text-sm">{blockDetails.break_7d_risk_band?.replace('_', ' ')}</div>
                    <div className="text-xs text-slate-400">Score: {blockDetails.break_7d_raw_score?.toFixed(3)}</div>
                    <div className="text-xs text-slate-400">Prob: {(blockDetails.break_7d_probability * 100).toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">14-Day Risk Band</div>
                    <div className="font-semibold text-sm">{blockDetails.break_14d_risk_band?.replace('_', ' ')}</div>
                    <div className="text-xs text-slate-400">Score: {blockDetails.break_14d_raw_score?.toFixed(3)}</div>
                    <div className="text-xs text-slate-400">Prob: {(blockDetails.break_14d_probability * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-xs text-blue-800">
                <span className="font-bold">System Note:</span> Calibrated probability is the statistical likelihood derived via isotonic regression. Operational score (Risk Band/Alert Level) is the categorized metric used for disaster management decisions.
              </div>

            </div>
          ) : (
            <div className="text-sm text-slate-500">Could not load block details.</div>
          )}
        </div>
      )}
    </div>
  );
}
