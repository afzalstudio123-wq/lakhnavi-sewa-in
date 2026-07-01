'use client';

import React from 'react';
import { ShieldCheck, Printer, X } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    serviceName: string;
    cost: number;
    customer: string;
    bookingRef: string;
    date: string;
    time: string;
    address: string;
  };
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const triggerSystemPrintLayout = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 text-black border border-[#DDE2F0] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
            Verified Receipt payload
          </span>
          <button onClick={onClose} className="text-muted hover:text-ink font-bold p-1 bg-surface border border-borderColor rounded-lg">
            <X size={16} />
          </button>
        </div>

        {/* Printable Region Block */}
        <div className="flex-1 bg-white p-6 border border-dashed border-[#6E7191]/40 rounded-xl font-mono text-xs space-y-4 text-left print:border-none print:p-0">
          <div className="text-center border-b border-[#DDE2F0] pb-4">
            <h2 className="text-sm font-black tracking-widest uppercase text-primary flex items-center justify-center gap-1.5">
              <ShieldCheck size={18} />
              LAKHNAVI SEWA SERVICES
            </h2>
            <p className="text-[10px] text-muted mt-1 font-semibold">Hazratganj Main Cluster Hub, Lucknow, UP</p>
            <p className="text-[9px] text-[#6E7191] font-semibold">GSTIN: 09AACKL9026M1Z2 (Prototype Loop)</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-[11px] leading-relaxed border-b border-[#DDE2F0]/60 pb-3">
            <div>
              <p className="text-[#6E7191] uppercase text-[9px] font-bold">Booking Details</p>
              <p className="font-bold text-ink mt-0.5">Reference: {data.bookingRef}</p>
              <p className="text-muted">Date: {data.date}</p>
              <p className="text-muted">Slot: {data.time}</p>
            </div>
            <div>
              <p className="text-[#6E7191] uppercase text-[9px] font-bold">Billed To</p>
              <p className="font-bold text-ink mt-0.5">{data.customer}</p>
              <p className="text-muted line-clamp-2">Address: {data.address}</p>
            </div>
          </div>

          <table className="w-full text-left border-b border-[#DDE2F0] pb-2 text-[11px]">
            <thead>
              <tr className="font-bold border-b border-[#DDE2F0] pb-2 text-[#6E7191] uppercase text-[9px]">
                <th className="pb-2">Item Description</th>
                <th className="text-right pb-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 font-semibold text-ink">
                  {data.serviceName} 
                  <span className="block text-[9px] text-muted font-normal mt-0.5">Lucknow Hyperlocal Vetted Delivery</span>
                </td>
                <td className="text-right font-bold text-ink">₹{data.cost.toLocaleString('en-IN')}</td>
              </tr>
              <tr className="border-t border-[#DDE2F0]/40 text-[10px] text-muted">
                <td className="py-1">SGST (9%)</td>
                <td className="text-right">₹{(data.cost * 0.09).toFixed(2)}</td>
              </tr>
              <tr className="text-[10px] text-muted">
                <td className="py-1">CGST (9%)</td>
                <td className="text-right">₹{(data.cost * 0.09).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-between items-center pt-2 font-black text-sm text-[#1A1A2E]">
            <span>Total Settled (Net):</span>
            <span className="font-mono text-base text-primary">₹{(data.cost + data.cost * 0.18).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
          </div>
          
          <div className="bg-[#10B981]/5 border border-[#10B981]/25 p-3 rounded-lg text-center text-[#10B981] font-bold text-[10px]">
            ✓ Payment Authenticated via Lakhnavi UPI QR Handshake
          </div>

          <p className="text-[9px] text-[#6E7191] text-center italic pt-2">This invoice is simulated for demonstration purposes.</p>
        </div>

        <div className="flex gap-3 mt-5">
          <button 
            onClick={onClose} 
            className="flex-1 border border-borderColor hover:bg-surface text-ink py-3 rounded-xl text-xs font-bold uppercase transition-all"
          >
            Close
          </button>
          
          <button 
            onClick={triggerSystemPrintLayout} 
            className="flex-grow bg-primary hover:bg-primary-hover text-canvas py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary/20"
          >
            <Printer size={14} />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default InvoiceModal;
