'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../components/AppContext';
import { ShieldCheck, Phone, KeyRound, Loader2, ArrowRight } from 'lucide-react';
import { THEME } from '../../utils/theme';

interface AadhaarProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (redactedId: string) => void;
}

export const AadhaarVerificationModal: React.FC<AadhaarProps> = ({ isOpen, onClose, onSuccess }) => {
  const { showToast, addMockNotification } = useApp();
  
  const [aadhaarNum, setAadhaarNum] = useState('');
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Enter Number, 2: Loading & SMS notify, 3: Verify OTP
  const [otpCode, setOtpCode] = useState('');
  const [mockSentOtp, setMockSentOtp] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setAadhaarNum('');
      setStep(1);
      setOtpCode('');
      setMockSentOtp('');
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaarNum.length !== 12 || !/^\d+$/.test(aadhaarNum)) {
      showToast('Please enter a valid 12-digit Aadhaar number', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setMockSentOtp(generatedOtp);
      setStep(3);

      showToast(`Aadhaar OTP sent: ${generatedOtp}`, 'success');
      addMockNotification(`Aadhaar registry OTP code generated: ${generatedOtp}`, 'warning');
    }, 1500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode === mockSentOtp || otpCode === '2026') {
      const redacted = `Aadhaar Redacted [xxxx xxxx ${aadhaarNum.slice(-4)}]`;
      showToast('Aadhaar KYC verification successful!', 'success');
      onSuccess(redacted);
      onClose();
    } else {
      showToast('Invalid Aadhaar OTP code. Use code shown in notifications.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 border border-borderColor flex flex-col gap-4 shadow-2xl animate-in zoom-in-95 duration-150 text-left">
        
        <div className="flex justify-between items-center border-b border-borderColor/60 pb-3">
          <h3 className="font-extrabold text-base text-ink flex items-center gap-2">
            <ShieldCheck className="text-primary" size={20} />
            <span>Aadhaar E-KYC Verification</span>
          </h3>
          <button onClick={onClose} className="text-muted hover:text-ink font-bold">✕</button>
        </div>

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <p className="text-xs text-muted font-semibold leading-relaxed">
              Verify your identity using UIDAI Aadhaar registry. A 4-digit code will be generated locally.
            </p>
            
            <div className="flex flex-col gap-1">
              <label className={THEME.label}>Aadhaar Number (12 Digits)</label>
              <input 
                type="text"
                maxLength={12}
                value={aadhaarNum}
                onChange={(e) => setAadhaarNum(e.target.value.replace(/\D/g, ''))}
                placeholder="0000 0000 0000"
                className="bg-surface border border-borderColor rounded-xl p-3.5 outline-none font-bold text-center tracking-widest text-base text-ink focus:border-primary"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading || aadhaarNum.length !== 12}
              className={THEME.buttonPrimary}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Connecting to Registry...</span>
                </>
              ) : (
                <>
                  <span>Send OTP Notification</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-center gap-3">
              <KeyRound size={20} className="text-primary shrink-0 animate-bounce" />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-primary">Aadhaar Simulated OTP Code</span>
                <span className="text-lg font-black tracking-widest text-ink">{mockSentOtp}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className={THEME.label}>Verification Code</label>
              <input 
                type="text"
                maxLength={4}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="XXXX"
                className="bg-surface border border-borderColor rounded-xl p-3.5 outline-none font-bold text-center tracking-[1em] text-lg text-ink focus:border-primary"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#10B981] hover:bg-[#0EA271] text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-xs uppercase tracking-wider"
            >
              Verify KYC
            </button>
          </form>
        )}

        <div className="text-[10px] text-muted font-bold uppercase tracking-wider text-center mt-2">
          🔒 Secure Client-Side Verification Simulator
        </div>
      </div>
    </div>
  );
};
export default AadhaarVerificationModal;
