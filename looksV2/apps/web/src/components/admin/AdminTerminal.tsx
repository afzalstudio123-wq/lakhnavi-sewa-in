'use client';

import React from 'react';
import { useApp, Booking } from '../AppContext';
import { PLATFORM_AUDIT_LOGS_SEED } from '../../database/mockStorage';
import { ShieldAlert, Trash2, TrendingUp, Landmark } from 'lucide-react';

export const AdminTerminal: React.FC = () => {
  const { bookings, cancelBookingByAdmin, showToast, analytics } = useApp();

  const handleRevokeJob = (id: string) => {
    if (confirm(`Are you sure you want to administratively drop booking ${id}?`)) {
      cancelBookingByAdmin(id);
    }
  };

  // Compute mock stats dynamically from the shared context bookings array
  const activeCount = bookings.filter(b => b.status === 'Confirmed').length;
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const cancelledCount = bookings.filter(b => b.status === 'Cancelled').length;

  const executeMasterPlatformFlush = () => {
    localStorage.clear();
    alert('System Cache Cleared. Mock databases normalized to fallback vector points.');
    window.location.reload();
  };

  return (
    <div className="w-full bg-[#F8F9FC] border border-[#DDE2F0] rounded-2xl shadow-xl overflow-hidden min-h-[600px] text-[#1A1A2E]">
      <div className="bg-[#1A1A2E] p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#DDE2F0] gap-4">
        <div>
          <div className="text-[10px] font-bold text-[#FF6B6B] tracking-widest uppercase flex items-center gap-1">
            <ShieldAlert size={14} /> Admin Command Center
          </div>
          <h2 className="text-xl font-black text-[#EEF0F8] mt-1">Platform Master Controller Override</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={executeMasterPlatformFlush}
            className="bg-[#FF6B6B] hover:bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#FF6B6B]/20"
          >
            Flush Platform Cache (Reset Engine)
          </button>
          <span className="bg-[#5C33F6] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider animate-pulse shrink-0">
            Live Session: Root Authority
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 bg-white border-b border-[#DDE2F0]">
        <div className="bg-[#F8F9FC] border border-[#DDE2F0] p-4 rounded-xl flex flex-col gap-1 shadow-sm">
          <span className="text-[10px] font-bold text-primary uppercase">Live Gross Revenue</span>
          <span className="text-2xl font-black text-ink font-mono">₹{analytics.revenue.toLocaleString('en-IN')}</span>
        </div>
        <div className="bg-[#F8F9FC] border border-[#DDE2F0] p-4 rounded-xl flex flex-col gap-1 shadow-sm">
          <span className="text-[10px] font-bold text-accent uppercase">Simulated Demand (Jobs)</span>
          <span className="text-2xl font-black text-ink">{analytics.activeJobs} Jobs</span>
        </div>
        <div className="bg-[#F8F9FC] border border-[#DDE2F0] p-4 rounded-xl flex flex-col gap-1 shadow-sm">
          <span className="text-[10px] font-bold text-muted uppercase">Active Bookings</span>
          <span className="text-2xl font-black text-ink">{activeCount}</span>
        </div>
        <div className="bg-[#F8F9FC] border border-[#DDE2F0] p-4 rounded-xl flex flex-col gap-1 shadow-sm">
          <span className="text-[10px] font-bold text-muted uppercase">Pending Bookings</span>
          <span className="text-2xl font-black text-ink">{pendingCount}</span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Table Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#DDE2F0] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6E7191]">
              Active Application System Bookings (Live Mutation Board)
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#DDE2F0] text-[10px] uppercase text-[#6E7191] tracking-wider font-bold">
                    <th className="pb-3">Booking ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Service Details</th>
                    <th className="pb-3">Current State</th>
                    <th className="pb-3 text-right">Administrative Drop</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="text-sm font-semibold text-[#1A1A2E] hover:bg-surface transition-colors">
                      <td className="py-4 font-mono text-xs text-primary">{booking.id}</td>
                      <td>{booking.customerName}</td>
                      <td>{booking.service}</td>
                      <td>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          booking.status === 'Confirmed' ? 'bg-[#10B981]/10 text-[#10B981]' :
                          booking.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <button 
                          onClick={() => handleRevokeJob(booking.id)}
                          className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1.5 ml-auto border border-red-200 hover:bg-red-50 py-1.5 px-3 rounded-lg"
                        >
                          <Trash2 size={12} />
                          <span>Revoke Job Node</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Audit Logs Panel */}
        <div className="col-span-1 bg-white border border-[#DDE2F0] rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#6E7191] flex items-center gap-1">
            <TrendingUp size={14} className="text-[#FF6B6B]" /> System Audit Telemetry
          </h4>
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {PLATFORM_AUDIT_LOGS_SEED.map((log: any, idx: number) => (
              <div key={idx} className="bg-[#F8F9FC] border border-[#DDE2F0] p-3 rounded-xl font-mono text-[10px] leading-relaxed">
                <span className="text-[#6E7191] block">[{log.timestamp}]</span>
                <span className="text-[#5C33F6] font-bold">{log.action}</span>: {log.details}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminTerminal;
