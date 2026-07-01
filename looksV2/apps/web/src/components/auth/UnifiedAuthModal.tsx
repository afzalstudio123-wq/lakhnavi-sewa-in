'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../AppContext';
import { LogIn, Phone, ShieldCheck, Mail, Sparkles } from 'lucide-react';

interface UnifiedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

export const UnifiedAuthModal: React.FC<UnifiedAuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const { user, login, showToast } = useApp();
  const [phoneMode, setPhoneMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mockOtp, setMockOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  if (!isOpen) return null;

  const handleAuthAction = (method: string) => {
    const defaultName = 'Afzal Ehsan';
    const mockUser = {
      id: 'usr_afzal',
      name: defaultName,
      email: 'afzal@afzalehsan.com',
      phone: phoneNumber || '9876543210',
      role: 'CUSTOMER',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=afzal',
      locality: 'Gomti Nagar',
      status: 'APPROVED'
    };
    login(mockUser);
    showToast(`Simulated handshake via: ${method}`);
    onAuthSuccess();
    onClose();
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      if (phoneNumber.length === 10 && /^\d+$/.test(phoneNumber)) {
        setOtpSent(true);
        showToast('OTP sent (Simulated). Enter 2026 to bypass verification.', 'info');
      } else {
        showToast('Please enter a valid 10-digit number', 'error');
      }
    } else {
      if (mockOtp === '2026') {
        handleAuthAction('Secure Phone OTP Engine');
      } else {
        showToast('Invalid Mock OTP! Use passcode 2026 for demonstration bypass.', 'error');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1A1A2E]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl border border-[#DDE2F0] w-full max-w-md p-6 shadow-2xl overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-xl" />

        <div className="flex justify-between items-center mb-6 relative z-10">
          <h3 className="text-sm font-black text-[#1A1A2E] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="text-primary" size={18} />
            Secure Access Terminal
          </h3>
          <button onClick={onClose} className="text-[#6E7191] hover:text-[#1A1A2E] text-xs font-bold bg-surface p-1.5 rounded-lg border border-borderColor">✕</button>
        </div>

        {!phoneMode ? (
          <div className="space-y-4">
            {/* Existing Session Switcher Detection Hook */}
            <div className="bg-[#F8F9FC] border border-[#DDE2F0] p-4 rounded-2xl">
              <p className="text-[10px] text-[#6E7191] uppercase font-bold tracking-widest mb-3 flex items-center gap-1">
                <Sparkles size={12} className="text-accent animate-spin" />
                Detected Profile Session
              </p>
              <button 
                onClick={() => handleAuthAction('Cached Profile Session')}
                className="w-full flex items-center justify-between p-3.5 bg-white border border-[#DDE2F0] rounded-xl hover:border-primary hover:shadow-lg transition-all text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-surface2 flex items-center justify-center font-bold text-primary border border-borderColor">
                    AE
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A2E]">Afzal Ehsan</h4>
                    <p className="text-[10px] text-[#6E7191]">afzal@afzalehsan.com</p>
                  </div>
                </div>
                <span className="text-[10px] text-primary font-bold uppercase flex items-center gap-1 bg-primary/5 py-1 px-2 rounded-md">
                  Continue &rarr;
                </span>
              </button>
            </div>

            <div className="text-center text-[10px] font-bold text-[#6E7191] uppercase tracking-widest my-4">- OR ALTERNATIVE AUTH -</div>

            <button 
              onClick={() => handleAuthAction('Google Authenticated Token')} 
              className="w-full flex items-center justify-center space-x-3 bg-white border border-[#DDE2F0] text-[#1A1A2E] py-3.5 rounded-xl text-xs font-bold hover:bg-[#F8F9FC] hover:border-primary transition-all"
            >
              <span className="font-black text-red-500">G</span> 
              <span>Continue with Google</span>
            </button>

            <button 
              onClick={() => handleAuthAction('Apple ID Integration')} 
              className="w-full flex items-center justify-center space-x-3 bg-[#1A1A2E] text-white py-3.5 rounded-xl text-xs font-bold hover:bg-black transition-all"
            >
              <span>🍎</span> 
              <span>Continue with Apple</span>
            </button>

            <button 
              onClick={() => setPhoneMode(true)} 
              className="w-full bg-white border border-[#5C33F6] text-[#5C33F6] py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#EEF0F8] transition-all"
            >
              Use Mobile Number / मोबाइल नंबर
            </button>
          </div>
        ) : (
          <form onSubmit={handlePhoneSubmit} className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6E7191]">Mobile Contact Number</label>
              <div className="flex items-center gap-2 bg-surface border border-borderColor rounded-xl px-3 py-1">
                <span className="text-xs font-bold text-muted">+91</span>
                <input 
                  type="tel" 
                  disabled={otpSent}
                  maxLength={10}
                  placeholder="Enter 10-digit number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-1 py-3 bg-transparent text-xs text-[#1A1A2E] outline-none font-bold"
                  required
                />
                <Phone size={14} className="text-muted" />
              </div>
            </div>

            {otpSent && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#10B981]">Enter Passcode (Use passcode '2026')</label>
                <input 
                  type="text" 
                  maxLength={4}
                  placeholder="••••"
                  value={mockOtp}
                  onChange={(e) => setMockOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 border border-[#10B981] bg-[#F8F9FC] rounded-xl text-center text-sm font-bold tracking-widest focus:outline-none text-[#1A1A2E]"
                  required
                />
              </motion.div>
            )}

            <div className="flex space-x-2 pt-2 text-xs font-bold uppercase">
              <button type="button" onClick={() => { setPhoneMode(false); setOtpSent(false); }} className="px-4 py-3 border border-[#DDE2F0] text-[#6E7191] rounded-xl hover:bg-surface transition-colors">Back</button>
              <button type="submit" className="flex-grow bg-[#5C33F6] text-white py-3 rounded-xl hover:bg-[#4B29D4] tracking-wider transition-colors">
                {otpSent ? 'Verify Passcode' : 'Request OTP Token'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
export default UnifiedAuthModal;
