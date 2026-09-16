import React, { useEffect, useState } from 'react';
// @ts-ignore
import Map, { Source, Layer, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { fetchProductionBlock } from '../../services/api';
import { MapPin } from 'lucide-react';

const RISK_COLORS = {
  "GREEN": "#10b981",
  "YELLOW": "#f59e0b",
  "ORANGE": "#f97316",
  "RED": "#ef4444",
  "UNKNOWN": "#94a3b8"
};

export default function WeatherMap() {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [blockDetails, setBlockDetails] = useState<any>(null);
  const [hoverInfo, setHoverInfo] = useState<any>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const GEOJSON_URL = `${API_BASE_URL}/api/production/map/geojson`;

  useEffect(() => {
    if (selectedBlockId) {
      fetchProductionBlock(selectedBlockId).then(setBlockDetails).catch(console.error);
    } else {
      setBlockDetails(null);
    }
  }, [selectedBlockId]);

  const onHover = (event: any) => {
    const { features, point } = event;
    if (features && features.length > 0) {
      setHoverInfo({ feature: features[0], x: point.x, y: point.y });
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

  const riskFillLayer = {
    id: "blocks-fill",
    type: "fill",
    source: "blocks-source",
    paint: {
      "fill-color": [
        "match", ["get", "alert_level"],
        "GREEN", RISK_COLORS["GREEN"],
        "YELLOW", RISK_COLORS["YELLOW"],
        "ORANGE", RISK_COLORS["ORANGE"],
        "RED", RISK_COLORS["RED"],
        RISK_COLORS["UNKNOWN"]
      ],
      "fill-opacity": 0.6
    }
  };

  const riskLineLayer = {
    id: "blocks-line",
    type: "line",
    source: "blocks-source",
    paint: {
      "line-color": "#ffffff",
      "line-width": 1,
      "line-opacity": 0.3
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <MapPin className="h-8 w-8 text-blue-600" />
          लाइव मौसम का नक्शा (Live Weather Map)
        </h1>
        <p className="text-slate-600 mt-2">
          नक्शे पर अपने ब्लॉक/गाँव पर क्लिक करके वहां की ताज़ा जानकारी प्राप्त करें।
        </p>
      </div>

      <div className="h-[60vh] flex flex-col md:flex-row gap-4">
        {/* Map Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
          <Map
            initialViewState={{ longitude: 78.9629, latitude: 22.5937, zoom: 4 }}
            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
            interactiveLayerIds={["blocks-fill"]}
            onMouseMove={onHover}
            onClick={onClick}
            cursor={hoverInfo ? 'pointer' : 'grab'}
          >
            <Source id="blocks-source" type="geojson" data={GEOJSON_URL}>
              <Layer {...(riskFillLayer as any)} />
              <Layer {...(riskLineLayer as any)} />
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
        </div>
        
        {/* Simplified Info Panel */}
        {blockDetails && (
          <div className="w-full md:w-80 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-4">ब्लॉक की जानकारी</h2>
            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase">Block ID</div>
                <div className="text-lg font-semibold">{blockDetails.block_id}</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-2">अलर्ट लेवल</div>
                <div className="text-lg font-bold text-slate-800">{blockDetails.alert_level}</div>
                <div className="mt-2 text-sm text-slate-700 italic">
                  सलाह: {blockDetails.advisory_action.replace(/_/g, ' ')}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">बारिश की संभावना (7 दिन)</div>
                <div className="text-xl font-bold text-blue-600">
                  {(blockDetails.onset_7d_probability * 100).toFixed(0)}%
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">सूखे का खतरा (7 दिन)</div>
                <div className="text-xl font-bold text-orange-600">
                  {(blockDetails.break_7d_probability * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
