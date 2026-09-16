import React, { useEffect, useState } from 'react';
// @ts-ignore
import Map, { Source, Layer, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { fetchProductionBlock } from '../services/api';

const RISK_COLORS = {
  "GREEN": "#10b981",
  "YELLOW": "#f59e0b",
  "ORANGE": "#f97316",
  "RED": "#ef4444",
  "UNKNOWN": "#94a3b8"
};

export default function ForecastMap() {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [blockDetails, setBlockDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [hoverInfo, setHoverInfo] = useState<any>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const GEOJSON_URL = `${API_BASE_URL}/api/production/map/geojson`;

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

  const onHover = (event: any) => {
    const { features, point } = event;
    if (features && features.length > 0) {
      setHoverInfo({
        feature: features[0],
        x: point.x,
        y: point.y
      });
    } else {
      setHoverInfo(null);
    }
  };

  const onClick = (event: any) => {
    const { features } = event;
    if (features && features.length > 0 && features[0].properties?.block_id) {
      setSelectedBlockId(features[0].properties.block_id);
    } else {
      setSelectedBlockId(null);
    }
  };

  // The simplified geojson contains "alert_level" for fill coloring
  const riskFillLayer = {
    id: "blocks-fill",
    type: "fill",
    source: "blocks-source",
    paint: {
      "fill-color": [
        "match",
        ["get", "alert_level"],
        "GREEN", RISK_COLORS["GREEN"],
        "YELLOW", RISK_COLORS["YELLOW"],
        "ORANGE", RISK_COLORS["ORANGE"],
        "RED", RISK_COLORS["RED"],
        RISK_COLORS["UNKNOWN"]
      ],
      "fill-opacity": 0.7
    }
  };

  const riskLineLayer = {
    id: "blocks-line",
    type: "line",
    source: "blocks-source",
    paint: {
      "line-color": "#ffffff",
      "line-width": 1,
      "line-opacity": 0.5
    }
  };

  const highlightLayer = {
    id: "blocks-highlight",
    type: "line",
    source: "blocks-source",
    paint: {
      "line-color": "#333333",
      "line-width": 2
    },
    filter: ["==", "block_id", hoverInfo?.feature?.properties?.block_id || ""]
  };

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
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-4">
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
        <Map
          initialViewState={{
            longitude: 78.9629,
            latitude: 22.5937,
            zoom: 4
          }}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          interactiveLayerIds={["blocks-fill"]}
          onMouseMove={onHover}
          onClick={onClick}
          cursor={hoverInfo ? 'pointer' : 'grab'}
        >
          <Source id="blocks-source" type="geojson" data={GEOJSON_URL}>
            <Layer {...(riskFillLayer as any)} />
            <Layer {...(riskLineLayer as any)} />
            <Layer {...(highlightLayer as any)} />
          </Source>
          
          <NavigationControl position="top-right" />
          
          {hoverInfo && (
            <div 
              className="absolute bg-white shadow-lg p-2 rounded pointer-events-none text-xs font-bold border border-slate-200 z-50"
              style={{ left: hoverInfo.x + 10, top: hoverInfo.y + 10 }}
            >
              {hoverInfo.feature.properties.block_id || 'Unknown Block'}
            </div>
          )}
        </Map>
        
        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white p-3 rounded shadow-md border border-slate-200 z-[400]">
          <h4 className="text-xs font-bold mb-2">Operational Alert</h4>
          {Object.entries(RISK_COLORS).map(([label, color]) => (
            <div key={label} className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: color }}></div>
              <span className="text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Details Panel */}
      <div className="w-full md:w-96 bg-white p-4 rounded-xl shadow-sm border border-slate-200 overflow-y-auto">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Forecast Details</h2>
        
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
          <div className="text-sm text-slate-500 italic text-center py-8">
            Click on a block on the map to view forecast details.
          </div>
        )}
      </div>
    </div>
  );
}
