'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2 } from 'lucide-react';

interface PaymentOverlayProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentOverlay: React.FC<PaymentOverlayProps> = ({ amount, onSuccess, onCancel }) => {
  const [paymentState, setPaymentState] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');

  const executeMockPayment = () => {
    setPaymentState('PROCESSING');
    setTimeout(() => {
      setPaymentState('SUCCESS');
      setTimeout(() => {
        onSuccess();
      }, 1200);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl border border-[#DDE2F0] w-full max-w-sm overflow-hidden shadow-2xl p-6"
      >
        {paymentState === 'IDLE' && (
          <>
            <div className="text-center mb-6">
              <span className="bg-[#EEF0F8] text-[#5C33F6] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                UPI Payment Simulator / भुगतान
              </span>
              <h3 className="text-2xl font-black text-[#1A1A2E] mt-3">₹{amount.toLocaleString('en-IN')}</h3>
              <p className="text-xs text-[#6E7191] mt-1">Securing Booking via Antigravity Sandbox Protocol</p>
            </div>

            <div className="bg-[#F8F9FC] border border-[#DDE2F0] rounded-2xl p-4 flex flex-col items-center justify-center mb-6">
              <div className="w-36 h-36 bg-white border border-[#DDE2F0] rounded-xl flex items-center justify-center relative shadow-inner">
                {/* Simulated UPI QR Vector Layout */}
                <div className="w-28 h-28 bg-[radial-gradient(#1A1A2E_2px,transparent_1px)] [background-size:8px_8px]" />
                <div className="absolute top-4 left-4 w-6 h-6 border-4 border-[#1A1A2E] rounded" />
                <div className="absolute top-4 right-4 w-6 h-6 border-4 border-[#1A1A2E] rounded" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-4 border-[#1A1A2E] rounded" />
              </div>
              <p className="text-[10px] text-[#6E7191] mt-3 font-bold tracking-wide uppercase">Scan using any UPI App</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={executeMockPayment}
                className="w-full bg-[#5C33F6] hover:bg-[#4B29D4] text-white font-bold py-3.5 rounded-xl text-xs transition-colors tracking-wider uppercase shadow-md shadow-[#5C33F6]/20"
              >
                Simulate Successful Payment
              </button>
              <button
                onClick={onCancel}
                className="w-full bg-white text-[#6E7191] border border-[#DDE2F0] font-bold py-3.5 rounded-xl text-xs hover:bg-[#F8F9FC] transition-all tracking-wider uppercase"
              >
                Cancel / रद्द करें
              </button>
            </div>
          </>
        )}

        {paymentState === 'PROCESSING' && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-[#5C33F6] animate-spin" />
            <p className="text-xs font-semibold text-[#1A1A2E] animate-pulse">Processing Sandbox Settlement Network Link...</p>
          </div>
        )}

        {paymentState === 'SUCCESS' && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 bg-[#10B981] rounded-full flex items-center justify-center text-white text-xl shadow-lg shadow-[#10B981]/20">
              ✓
            </div>
            <h4 className="text-base font-bold text-[#1A1A2E]">Payment Verified Successfully</h4>
            <p className="text-xs font-bold text-[#6E7191]">Booking data loops updated across dashboard metrics.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
export default PaymentOverlay;
