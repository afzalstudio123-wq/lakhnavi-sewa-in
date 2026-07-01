'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';

export const HyperlocalRadar: React.FC = () => {
  const [currentSector, setCurrentSector] = useState('Gomti Nagar');
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredCount, setDiscoveredCount] = useState(14);

  const lucknowHubs = ['Gomti Nagar', 'Hazratganj', 'Aliganj', 'Indira Nagar', 'Chowk'];

  const runRadarScan = (hub: string) => {
    setCurrentSector(hub);
    setIsScanning(true);
    setDiscoveredCount(0);
    setTimeout(() => {
      setIsScanning(false);
      setDiscoveredCount(Math.floor(Math.random() * 20) + 5);
    }, 1600);
  };

  return (
    <div className="w-full bg-[#1A1A2E] border border-[#6E7191]/30 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
      <div className="mb-6">
        <div className="text-[10px] font-bold text-[#FF6B6B] tracking-widest uppercase flex items-center gap-1">
          <Radio size={12} /> Radar Network Simulator
        </div>
        <h3 className="text-lg font-bold mt-1 text-[#EEF0F8]">Lucknow Regional Scanning Grid</h3>
      </div>

      <div className="relative w-40 h-40 mx-auto bg-black/40 border border-[#6E7191]/20 rounded-full flex items-center justify-center mb-6">
        <div className="absolute inset-4 border border-[#6E7191]/10 rounded-full" />
        <div className="absolute inset-12 border border-[#6E7191]/10 rounded-full" />
        <div className="absolute inset-20 border border-[#6E7191]/5 rounded-full" />

        {isScanning && (
          <motion.div
            className="absolute inset-0 bg-[#5C33F6]/10 rounded-full border-2 border-[#5C33F6]"
            initial={{ scale: 0.1, opacity: 1 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
          />
        )}

        <div className="z-10 text-center">
          <span className="text-2xl font-black text-white font-mono">{discoveredCount}</span>
          <p className="text-[9px] text-[#6E7191] uppercase tracking-wider mt-1 font-bold">Verified Pools</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-[10px] font-bold text-[#6E7191] uppercase tracking-widest">Select Operational Sector</label>
        <div className="flex flex-wrap gap-1.5">
          {lucknowHubs.map((hub) => (
            <button
              key={hub}
              onClick={() => runRadarScan(hub)}
              disabled={isScanning}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentSector === hub
                  ? 'bg-[#5C33F6] text-white border border-[#5C33F6]'
                  : 'bg-white/5 text-[#6E7191] hover:bg-white/10 border border-white/5'
              }`}
            >
              {hub}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[#6E7191]/20 text-center text-xs text-[#6E7191]">
        Current Active Radius: <span className="text-[#EEF0F8] font-mono font-bold">{currentSector}, LKO</span>
      </div>
    </div>
  );
};
export default HyperlocalRadar;
