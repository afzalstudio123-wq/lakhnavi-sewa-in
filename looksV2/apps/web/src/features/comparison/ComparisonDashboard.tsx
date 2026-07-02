'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../components/AppContext';
import { TrendingUp, Landmark, Users, ArrowUpRight, BarChart2 } from 'lucide-react';
import { THEME } from '../../utils/theme';

interface SectorMetric {
  name: string;
  volume: number;
  revenue: number;
  conversion: number;
}

export const ComparisonDashboard: React.FC = () => {
  const { analytics } = useApp();
  const [selectedMetric, setSelectedMetric] = useState<'volume' | 'revenue' | 'conversion'>('revenue');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Lucknow local sector stats
  const [sectors, setSectors] = useState<SectorMetric[]>([
    { name: 'Gomti Nagar', volume: 184, revenue: 245000, conversion: 94.2 },
    { name: 'Hazratganj', volume: 148, revenue: 198000, conversion: 89.5 },
    { name: 'Aliganj', volume: 96, revenue: 125000, conversion: 86.8 },
    { name: 'Indiranagar', volume: 120, revenue: 160000, conversion: 91.1 },
    { name: 'Chowk Area', volume: 72, revenue: 94000, conversion: 82.3 }
  ]);

  // Fluctuating metric simulator
  useEffect(() => {
    const timer = setInterval(() => {
      setSectors(prev => prev.map(s => {
        const deltaVol = Math.random() > 0.6 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        const deltaRev = Math.random() > 0.6 ? Math.floor((Math.random() - 0.5) * 500) : 0;
        return {
          ...s,
          volume: Math.max(20, s.volume + deltaVol),
          revenue: Math.max(10000, s.revenue + deltaRev)
        };
      }));
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const maxVal = Math.max(...sectors.map(s => s[selectedMetric]));

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      <div>
        <h2 className={THEME.heading}>Lucknow Sector Market Dynamics</h2>
        <p className={THEME.subheading}>Real-time telemetry analysis of job volumes and platform liquidity nodes.</p>
      </div>

      {/* Metrics Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-borderColor rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted uppercase">Platform Gross Revenue</span>
            <span className="text-2xl font-black text-primary font-mono mt-1">₹{analytics.revenue.toLocaleString('en-IN')}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="bg-white border border-borderColor rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted uppercase">Lucknow Active Pools</span>
            <span className="text-2xl font-black text-ink font-mono mt-1">{analytics.activeJobs} Nodes</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-surface2 text-muted flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-white border border-borderColor rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted uppercase">Conversion Rate (Net)</span>
            <span className="text-2xl font-black text-semantic-success font-mono mt-1">91.4%</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-semantic-success/10 text-semantic-success flex items-center justify-center">
            <ArrowUpRight size={24} />
          </div>
        </div>
      </div>

      {/* Chart & Comparison Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SVG charts */}
        <div className="lg:col-span-2 bg-white border border-borderColor rounded-3xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-borderColor/60 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-ink uppercase tracking-wider flex items-center gap-1.5">
                <BarChart2 size={16} className="text-primary" />
                Comparison Matrix Charts
              </h3>
              <p className="text-[9px] text-muted font-bold mt-0.5">Sectors analytical growth indices</p>
            </div>
            
            <div className="flex gap-2">
              {(['revenue', 'volume', 'conversion'] as const).map(met => (
                <button 
                  key={met}
                  onClick={() => setSelectedMetric(met)}
                  className={`px-3 py-1.5 border rounded-lg text-[9px] font-black uppercase transition-all ${
                    selectedMetric === met ? 'bg-primary text-white border-transparent' : 'bg-surface border-borderColor text-ink'
                  }`}
                >
                  {met}
                </button>
              ))}
            </div>
          </div>

          {/* Render bar chart */}
          <div className="relative h-64 w-full flex items-end justify-between px-4 pt-10 pb-6 border-b border-borderColor">
            {/* Grid Lines */}
            <div className="absolute left-0 right-0 top-10 border-t border-dashed border-borderColor/60 text-[8px] text-muted font-mono font-bold pl-1 pt-0.5">MAX RANGE: {selectedMetric === 'revenue' ? `₹${maxVal.toLocaleString()}` : maxVal}</div>
            <div className="absolute left-0 right-0 top-32 border-t border-dashed border-borderColor/40" />

            {sectors.map((s, idx) => {
              const val = s[selectedMetric];
              const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
              const isHovered = hoveredIndex === idx;
              
              return (
                <div 
                  key={s.name} 
                  className="flex-grow flex flex-col items-center group relative cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-12 z-30 bg-[#1A1A2E] text-white text-[9px] font-bold px-2 py-1.5 rounded-lg shadow-lg border border-white/10 flex flex-col text-center">
                      <span>{s.name}</span>
                      <span className="font-mono mt-0.5 text-primary">
                        {selectedMetric === 'revenue' ? `₹${val.toLocaleString()}` : selectedMetric === 'conversion' ? `${val}%` : `${val} Jobs`}
                      </span>
                    </div>
                  )}

                  {/* Visual Bar */}
                  <div 
                    className="w-10 sm:w-14 bg-primary hover:bg-primary-hover rounded-t-lg transition-all duration-300 shadow-md shadow-primary/10 relative"
                    style={{ height: `${Math.max(15, pct * 1.5)}px` }}
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg" />
                  </div>

                  <span className="text-[9px] font-black text-muted uppercase mt-3 tracking-wider">{s.name.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-muted text-center font-bold uppercase tracking-wider flex justify-center gap-4">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-primary" /> Active Segment Value</span>
          </div>
        </div>

        {/* Detailed ledger sidebar */}
        <div className="bg-white border border-borderColor rounded-3xl p-6 shadow-sm flex flex-col gap-4">
          <h4 className="text-xs font-black text-ink uppercase tracking-wider">
            Sector Summary details
          </h4>

          <div className="space-y-4">
            {sectors.map(s => (
              <div key={s.name} className="flex justify-between items-center text-xs font-bold border-b border-borderColor/40 pb-2">
                <span className="text-ink">{s.name}</span>
                <div className="text-right flex flex-col gap-0.5">
                  <span className="font-mono text-ink">₹{s.revenue.toLocaleString('en-IN')}</span>
                  <span className="text-[9px] text-muted font-normal block leading-none">
                    {s.volume} bookings &middot; {s.conversion}% conv
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
export default ComparisonDashboard;
