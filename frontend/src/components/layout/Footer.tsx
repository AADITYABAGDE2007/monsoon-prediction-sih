import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Monsoon Mitra</h3>
            <p className="text-sm text-slate-400">
              किसानों के लिए सटीक और हाइपरलोकल मौसम पूर्वानुमान (Hyperlocal Weather Forecast for Farmers). 
              Smart India Hackathon 2026 Initiative.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Useful Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400">IMD Official Website</a></li>
              <li><a href="#" className="hover:text-blue-400">Ministry of Earth Sciences</a></li>
              <li><a href="#" className="hover:text-blue-400">Kisan Call Center</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Support</h4>
            <p className="text-sm text-slate-400 mb-2">Toll Free: 1800-180-1551</p>
            <p className="text-sm text-slate-400">Email: support@monsoonmitra.gov.in</p>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
          &copy; 2026 Monsoon Mitra (SIH26086). All rights reserved.
        </div>
      </div>
    </footer>
  );
}
