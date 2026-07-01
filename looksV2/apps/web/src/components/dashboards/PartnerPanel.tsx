'use client';

import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { motion } from 'framer-motion';
import { Edit2, Sparkles, Activity, Check, X } from 'lucide-react';

export const PartnerPanel: React.FC = () => {
  const { partnerCatalog, updateCatalogItem } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');

  const savePriceModification = (id: string) => {
    const parsedPrice = parseFloat(editPrice);
    if (!isNaN(parsedPrice) && parsedPrice >= 0) {
      updateCatalogItem(id, { rateINR: parsedPrice });
      setEditingId(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white border border-[#DDE2F0] rounded-3xl shadow-sm text-[#1A1A2E]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#DDE2F0] pb-5 mb-6 gap-4">
        <div>
          <span className="bg-[#EEF0F8] text-[#5C33F6] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-fit">
            <Sparkles size={12} className="animate-pulse" />
            Partner Control Portal / पार्टनर पैनल
          </span>
          <h2 className="text-xl font-black mt-2 text-[#1A1A2E]">Service Catalog & Rate Card Management</h2>
        </div>
        
        {/* Dynamic Load Balancing Indicator Feature */}
        <div className="text-left bg-[#F8F9FC] border border-[#DDE2F0] p-3 rounded-2xl shrink-0">
          <p className="text-[10px] uppercase font-bold text-[#6E7191] flex items-center gap-1">
            <Activity size={12} className="text-semantic-success animate-bounce" />
            Lucknow Consumer Traffic Load
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="w-2.5 h-2.5 bg-[#10B981] rounded-full animate-ping" />
            <span className="text-xs font-bold text-[#1A1A2E]">High Demand (Hazratganj Node)</span>
          </div>
        </div>
      </div>

      {/* Senior Architectural Catalog Matrix Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-[#6E7191] uppercase tracking-wider">
          Your Active Public Services Rate Matrix
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {partnerCatalog.map((item) => (
            <div 
              key={item.id} 
              className="border border-[#DDE2F0] rounded-2xl p-5 bg-[#F8F9FC] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-bold text-[#1A1A2E]">{item.serviceName}</h4>
                  <span className="text-[11px] text-[#6E7191] font-semibold bg-surface2 px-2 py-0.5 rounded">
                    {item.hindiTranslation}
                  </span>
                </div>
                <p className="text-xs text-[#6E7191] mt-1.5">
                  Standard Service Window: <span className="font-semibold">{item.duration}</span>
                </p>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                {editingId === item.id ? (
                  <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-primary/60">
                    <span className="text-xs font-bold text-muted pl-2">₹</span>
                    <input 
                      type="number" 
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value.replace(/\D/g, ''))}
                      className="w-20 px-1 py-1 bg-transparent text-xs font-bold font-mono outline-none text-ink"
                      required
                    />
                    <button 
                      onClick={() => savePriceModification(item.id)} 
                      className="bg-[#10B981] hover:bg-[#0EA271] text-white p-1.5 rounded-lg text-xs font-bold transition-colors"
                      title="Save Price"
                    >
                      <Check size={12} />
                    </button>
                    <button 
                      onClick={() => setEditingId(null)} 
                      className="bg-[#6E7191] hover:bg-neutral-600 text-white p-1.5 rounded-lg text-xs font-bold transition-colors"
                      title="Cancel"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-mono text-sm font-black text-[#1A1A2E]">₹{item.rateINR}</span>
                    <button 
                      onClick={() => { setEditingId(item.id); setEditPrice(item.rateINR.toString()); }}
                      className="bg-white border border-[#DDE2F0] hover:border-primary text-[#1A1A2E] hover:text-primary px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all flex items-center gap-1 shadow-sm"
                    >
                      <Edit2 size={12} />
                      <span>Update Rate</span>
                    </button>
                  </>
                )}

                <button 
                  onClick={() => updateCatalogItem(item.id, { isAvailable: !item.isAvailable })}
                  className={`px-3.5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wide border transition-all shadow-sm ${
                    item.isAvailable 
                      ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30 hover:bg-[#10B981]/25' 
                      : 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100'
                  }`}
                >
                  {item.isAvailable ? 'Active / सक्रीय' : 'Paused / रुकी हुई'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default PartnerPanel;
