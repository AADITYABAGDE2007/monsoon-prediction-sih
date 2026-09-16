import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  fetchStates,
  fetchDistricts,
  fetchBlocks,
  fetchPanchayats,
  searchLocations
} from '../services/api';
import { 
  MapPin, 
  Search, 
  Check, 
  RotateCcw, 
  Map as MapIcon, 
  ArrowRight,
  Compass
} from 'lucide-react';

export default function LocationSelection() {
  const { lang, location, setLocation } = useApp();
  const navigate = useNavigate();

  // Cascade states
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<string[]>([]);
  const [panchayats, setPanchayats] = useState<any[]>([]);

  // Selected values
  const [selectedState, setSelectedState] = useState(location.state);
  const [selectedDistrict, setSelectedDistrict] = useState(location.district);
  const [selectedBlock, setSelectedBlock] = useState(location.block);
  const [selectedPanchayatObj, setSelectedPanchayatObj] = useState<any>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // 1. Initial load states
  useEffect(() => {
    fetchStates().then(setStates).catch(console.error);
  }, []);

  // 2. Load districts when state changes
  useEffect(() => {
    if (selectedState) {
      fetchDistricts(selectedState).then(res => {
        setDistricts(res);
        if (!res.includes(selectedDistrict)) {
          setSelectedDistrict(res[0] || '');
        }
      }).catch(console.error);
    }
  }, [selectedState]);

  // 3. Load blocks when district changes
  useEffect(() => {
    if (selectedDistrict) {
      fetchBlocks(selectedDistrict).then(res => {
        setBlocks(res);
        if (!res.includes(selectedBlock)) {
          setSelectedBlock(res[0] || '');
        }
      }).catch(console.error);
    }
  }, [selectedDistrict]);

  // 4. Load panchayats when block changes
  useEffect(() => {
    if (selectedBlock) {
      fetchPanchayats(selectedBlock).then(res => {
        setPanchayats(res);
        setSelectedPanchayatObj(res[0] || null);
      }).catch(console.error);
    }
  }, [selectedBlock]);

  // Handle Search Input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.length >= 2) {
      searchLocations(q).then(setSearchResults).catch(console.error);
    } else {
      setSearchResults([]);
    }
  };

  const applySearchResult = (res: any) => {
    setLocation(res);
    navigate('/dashboard');
  };

  const handleApply = () => {
    if (selectedPanchayatObj) {
      setLocation({
        id: selectedPanchayatObj.id,
        state: selectedState,
        district: selectedDistrict,
        block: selectedBlock,
        panchayat: selectedPanchayatObj.name,
        block_id: selectedPanchayatObj.block_id,
        lat: 21.90,
        lon: 77.90
      });
      navigate('/dashboard');
    }
  };

  const handleReset = () => {
    setSelectedState('Madhya Pradesh');
    setSelectedDistrict('Betul');
    setSelectedBlock('Betul');
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
          <Compass className="h-4 w-4" />
          {lang === 'en' ? 'Administrative Hierarchy' : 'प्रशासनिक पदानुक्रम'}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {lang === 'en' ? 'Hyperlocal Location Selection' : 'स्थान का सटीक चयन (State ➔ Panchayat)'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {lang === 'en' 
            ? 'Select your State, District, Block and Panchayat to receive calibrated hyperlocal monsoon forecasts and crop advisories.' 
            : 'सटीक मानसून पूर्वानुमान और फसल सलाह प्राप्त करने के लिए अपने राज्य, जिले, ब्लॉक और पंचायत का चयन करें।'}
        </p>
      </div>

      {/* Global Search Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
        <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
          {lang === 'en' ? 'Quick Search Location (All India)' : 'त्वरित खोज (ब्लॉक या गाँव का नाम लिखें)'}
        </label>
        <div className="relative">
          <Search className="h-5 w-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            placeholder={lang === 'en' ? "Search for 'Betul', 'Amla', 'Phanda', 'Bhopal'..." : "उदा. 'Betul', 'Amla', 'Bhopal' खोजें..."}
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute left-6 right-6 top-[100px] z-20 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-slate-100">
            {searchResults.map((item) => (
              <div
                key={item.id}
                onClick={() => applySearchResult(item)}
                className="p-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    {item.block} Block ({item.panchayat})
                  </div>
                  <div className="text-xs text-slate-500">
                    {item.district} District, {item.state}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-blue-600" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cascading Dropdown Card */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          {lang === 'en' ? 'Hierarchical Cascading Selector' : 'पदानुक्रमित चयन सूची'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* State */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
              1. {lang === 'en' ? 'State' : 'राज्य'}
            </label>
            <select
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              {states.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
              2. {lang === 'en' ? 'District' : 'ज़िला'}
            </label>
            <select
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              {districts.map(dt => (
                <option key={dt} value={dt}>{dt}</option>
              ))}
            </select>
          </div>

          {/* Block */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
              3. {lang === 'en' ? 'Block (Tehsil Scale)' : 'ब्लॉक / तहसील'}
            </label>
            <select
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
            >
              {blocks.map(bk => (
                <option key={bk} value={bk}>{bk}</option>
              ))}
            </select>
          </div>

          {/* Panchayat */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
              4. {lang === 'en' ? 'Gram Panchayat (Village Cluster)' : 'ग्राम पंचायत'}
            </label>
            <select
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              value={selectedPanchayatObj ? selectedPanchayatObj.id : ''}
              onChange={(e) => {
                const target = panchayats.find(p => String(p.id) === e.target.value);
                setSelectedPanchayatObj(target);
              }}
            >
              {panchayats.map(pan => (
                <option key={pan.id} value={pan.id}>{pan.name}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Selected Summary Pill */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-blue-900 font-semibold">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span>
              {selectedState} ➔ {selectedDistrict} ➔ {selectedBlock} Block ➔ {selectedPanchayatObj?.name}
            </span>
          </div>
          <span className="text-xs font-mono font-bold bg-blue-600 text-white px-2 py-0.5 rounded">
            {selectedPanchayatObj?.block_id || 'BLK_00001'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={handleApply}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/20 transition-colors"
          >
            <Check className="h-4 w-4" />
            {lang === 'en' ? 'Apply Location' : 'स्थान लागू करें'}
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-sm border border-slate-300 rounded-xl transition-colors"
          >
            <RotateCcw className="h-4 w-4 text-slate-500" />
            {lang === 'en' ? 'Reset' : 'रीसेट'}
          </button>

          <button
            onClick={() => navigate('/map')}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-xl transition-colors ml-auto"
          >
            <MapIcon className="h-4 w-4 text-blue-600" />
            {lang === 'en' ? 'Choose on Map' : 'नक्शे पर चुनें'}
          </button>
        </div>

      </div>

    </div>
  );
}
