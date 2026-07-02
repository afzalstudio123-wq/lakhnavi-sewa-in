'use client';

import React, { useState } from 'react';
import { useApp } from '../../components/AppContext';
import { mockServices } from '../../services/mockServices';
import { Check, Clock, ShieldCheck, KeyRound, Camera, Plus, Sparkles, Image, IndianRupee, Loader2 } from 'lucide-react';
import { THEME } from '../../utils/theme';

interface StepperProps {
  bookingId: string;
  initialStatus: string;
  cost: number;
  customerName: string;
  providerName: string;
  onStatusChange?: (newStatus: any) => void;
}

const STEPS = ['PENDING', 'ACCEPTED', 'TRAVELLING', 'ARRIVED', 'STARTED', 'COMPLETED'];

export const WorkProgressStepper: React.FC<StepperProps> = ({
  bookingId,
  initialStatus,
  cost,
  customerName,
  providerName,
  onStatusChange
}) => {
  const { showToast, addMockNotification } = useApp();
  const [status, setStatus] = useState(initialStatus.toUpperCase());
  const [otpCode, setOtpCode] = useState('');
  
  // Photo proof states
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [compressLog, setCompressLog] = useState('');

  // Extra charges
  const [materialCost, setMaterialCost] = useState(0);
  const [nightCharge, setNightCharge] = useState(false);
  const [emergencyFee, setEmergencyFee] = useState(false);

  // Tip states
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [customTip, setCustomTip] = useState('');
  const [tipSettled, setTipSettled] = useState(false);

  const currentStepIndex = STEPS.indexOf(status);

  const advanceStatus = () => {
    if (status === 'PENDING') {
      updateStatus('ACCEPTED');
    } else if (status === 'ACCEPTED') {
      updateStatus('TRAVELLING');
    } else if (status === 'TRAVELLING') {
      updateStatus('ARRIVED');
      showToast('Arrived at customer address. Start Work OTP code 2026 required.', 'info');
      addMockNotification(`Start Work verification code generated for ${bookingId}: 2026`, 'success');
    } else if (status === 'STARTED') {
      if (!afterPhoto) {
        showToast('Please upload an after-job photo proof to complete.', 'warning');
        return;
      }
      updateStatus('COMPLETED');
      // Add final amount to wallet
      const extraFees = materialCost + (nightCharge ? 99 : 0) + (emergencyFee ? 150 : 0);
      mockServices.addMockJobPayout(cost + extraFees);
    }
  };

  const updateStatus = (newStatus: string) => {
    setStatus(newStatus);
    if (onStatusChange) onStatusChange(newStatus);
    showToast(`Job status transitioned to ${newStatus}`);
    addMockNotification(`Job ${bookingId} status changed: ${newStatus}`, 'info');
  };

  // OTP Start verify
  const handleVerifyStartOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode === '2026') {
      if (!beforePhoto) {
        showToast('Please attach a before-work photo proof first.', 'warning');
        return;
      }
      updateStatus('STARTED');
    } else {
      showToast('Invalid Start Work OTP code. Enter 2026 to verify.', 'error');
    }
  };

  // Photo uploads
  const simulatePhotoUpload = (type: 'BEFORE' | 'AFTER') => {
    setCompressing(true);
    setCompressLog('Vetting image data...');
    
    setTimeout(() => {
      setCompressLog('Applying client-side compression: 4.2MB -> 180KB');
      setTimeout(() => {
        setCompressing(false);
        setCompressLog('');
        const mockImg = type === 'BEFORE' 
          ? 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=200'
          : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=200';
        
        if (type === 'BEFORE') {
          setBeforePhoto(mockImg);
          showToast('Before-work photo verified and compressed successfully.');
        } else {
          setAfterPhoto(mockImg);
          showToast('After-work completion photo verified and compressed.');
        }
      }, 1000);
    }, 1000);
  };

  // Tip submission
  const handleTipSubmit = () => {
    const tipVal = selectedTip !== null ? selectedTip : parseFloat(customTip);
    if (isNaN(tipVal) || tipVal <= 0) return;
    
    mockServices.addMockTip(tipVal);
    setTipSettled(true);
    showToast(`Thank you! Tip of ₹${tipVal} dispatched directly to partner wallet.`, 'success');
    addMockNotification(`Received customer tip reward: ₹${tipVal}`, 'success');
  };

  const finalAmount = cost + materialCost + (nightCharge ? 99 : 0) + (emergencyFee ? 150 : 0);

  return (
    <div className={THEME.card}>
      <div className="flex justify-between items-center border-b border-borderColor/60 pb-3 mb-6">
        <div>
          <h3 className="font-extrabold text-sm text-ink uppercase tracking-wider">
            Job Progress Pipeline ({bookingId})
          </h3>
          <p className="text-[10px] text-muted font-bold mt-0.5">SaaS State Machine telemetry link</p>
        </div>
        <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
          {status}
        </span>
      </div>

      {/* Stepper Timeline */}
      <div className="flex justify-between items-center relative mb-8 px-2">
        <div className="absolute left-4 right-4 h-0.5 bg-borderColor z-0" />
        <div 
          className="absolute left-4 h-0.5 bg-primary z-0 transition-all duration-300"
          style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 90}%` }}
        />

        {STEPS.map((stepName, idx) => (
          <div key={stepName} className="flex flex-col items-center relative z-10">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center border font-bold text-xs transition-all ${
                idx <= currentStepIndex 
                  ? 'bg-primary border-primary text-white shadow-sm' 
                  : 'bg-white border-borderColor text-muted'
              }`}
            >
              {idx < currentStepIndex ? <Check size={14} /> : idx + 1}
            </div>
            <span className="text-[8px] font-black uppercase text-muted tracking-wider mt-1.5 absolute -bottom-5 whitespace-nowrap">
              {stepName === 'PENDING' ? 'Pending' : stepName === 'ACCEPTED' ? 'Accepted' : stepName === 'TRAVELLING' ? 'Transit' : stepName === 'ARRIVED' ? 'Arrived' : stepName === 'STARTED' ? 'Started' : 'Done'}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-2 flex flex-col gap-5 text-left">
        
        {/* Step: ARRIVED (Verification Input) */}
        {status === 'ARRIVED' && (
          <form onSubmit={handleVerifyStartOtp} className="bg-surface border border-borderColor p-4 rounded-2xl flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <KeyRound size={16} />
              <span>Customer Verification Code Required</span>
            </div>

            {/* Before Photo Input Requirement */}
            <div className="flex flex-col gap-2">
              <span className={THEME.label}>Step A: Attach Before-work Photo Proof</span>
              {beforePhoto ? (
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-borderColor">
                  <Image size={18} className="text-primary" />
                  <span className="text-xs font-bold text-ink">before_proof.jpg (180KB Vetted)</span>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => simulatePhotoUpload('BEFORE')}
                  disabled={compressing}
                  className="w-full border-2 border-dashed border-borderColor hover:border-primary p-4 rounded-xl flex items-center justify-center gap-2 text-xs text-muted font-bold transition-all"
                >
                  {compressing ? <Loader2 className="animate-spin text-primary" size={16} /> : <Camera size={16} />}
                  <span>{compressing ? compressLog : 'Upload Before-Work Photo'}</span>
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <span className={THEME.label}>Step B: Enter Customer OTP</span>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="2026"
                  className={THEME.input}
                />
                <button 
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 rounded-xl text-xs uppercase"
                >
                  Start Job
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Step: STARTED (Invoice Configuration) */}
        {status === 'STARTED' && (
          <div className="bg-surface border border-borderColor p-4 rounded-2xl flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#FF6B6B]">
              <Sparkles size={16} />
              <span>Job Invoice Modification Sheet</span>
            </div>

            {/* Extra Charges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <span className={THEME.label}>Material Fee (₹)</span>
                <input 
                  type="number" 
                  value={materialCost || ''}
                  onChange={(e) => setMaterialCost(Number(e.target.value))}
                  placeholder="0"
                  className={THEME.input}
                />
              </div>
              <button 
                onClick={() => setNightCharge(!nightCharge)}
                className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                  nightCharge ? 'bg-[#FF6B6B] text-white border-transparent' : 'bg-white border-borderColor text-muted'
                }`}
              >
                Night Surcharge (+₹99)
              </button>
              <button 
                onClick={() => setEmergencyFee(!emergencyFee)}
                className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                  emergencyFee ? 'bg-[#FF6B6B] text-white border-transparent' : 'bg-white border-borderColor text-muted'
                }`}
              >
                Emergency Surcharge (+₹150)
              </button>
            </div>

            {/* After Photo Proof Requirement */}
            <div className="flex flex-col gap-2">
              <span className={THEME.label}>Attach Completed Job After-Photo Proof</span>
              {afterPhoto ? (
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-borderColor">
                  <Image size={18} className="text-semantic-success" />
                  <span className="text-xs font-bold text-ink">after_proof.jpg (180KB Vetted)</span>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => simulatePhotoUpload('AFTER')}
                  disabled={compressing}
                  className="w-full border-2 border-dashed border-borderColor hover:border-primary p-4 rounded-xl flex items-center justify-center gap-2 text-xs text-muted font-bold transition-all"
                >
                  {compressing ? <Loader2 className="animate-spin text-primary" size={16} /> : <Camera size={16} />}
                  <span>{compressing ? compressLog : 'Upload After-Work Photo'}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step: COMPLETED (Tipping System) */}
        {status === 'COMPLETED' && !tipSettled && (
          <div className="bg-[#10B981]/5 border border-[#10B981]/20 p-5 rounded-2xl flex flex-col gap-4">
            <h4 className="font-extrabold text-sm text-[#10B981] flex items-center gap-1.5">
              <ShieldCheck size={16} /> Job Invoice Settled successfully!
            </h4>
            
            <div className="flex flex-col gap-2 text-left">
              <span className={THEME.label}>Add Tip for {providerName}</span>
              <div className="flex gap-2">
                {[20, 50, 100].map(amt => (
                  <button 
                    key={amt}
                    onClick={() => { setSelectedTip(amt); setCustomTip(''); }}
                    className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all ${
                      selectedTip === amt ? 'bg-primary text-white border-transparent' : 'bg-white border-borderColor text-ink'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2 mt-1">
                <input 
                  type="number"
                  placeholder="Custom tip amount"
                  value={customTip}
                  onChange={(e) => { setCustomTip(e.target.value); setSelectedTip(null); }}
                  className={THEME.input}
                />
                <button 
                  onClick={handleTipSubmit}
                  className="bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 rounded-xl text-xs uppercase"
                >
                  Submit Tip
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Summary */}
        <div className="flex justify-between items-center bg-[#F8F9FC] border border-borderColor p-4 rounded-xl font-bold">
          <div className="flex flex-col gap-0.5 text-xs text-muted">
            <span>Base Cost: ₹{cost}</span>
            {(materialCost > 0 || nightCharge || emergencyFee) && (
              <span>Surcharges: ₹{materialCost + (nightCharge ? 99 : 0) + (emergencyFee ? 150 : 0)}</span>
            )}
          </div>
          <div className="text-right">
            <span className="text-[10px] text-muted block uppercase tracking-wider font-bold">Final Total</span>
            <span className="text-xl font-black text-ink font-mono">₹{finalAmount}</span>
          </div>
        </div>

        {/* Stepper Progression Button */}
        {status !== 'COMPLETED' && status !== 'ARRIVED' && status !== 'STARTED' && (
          <button 
            onClick={advanceStatus}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md shadow-primary/20"
          >
            Advance Job Status &rarr;
          </button>
        )}
        
        {status === 'STARTED' && (
          <button 
            onClick={advanceStatus}
            disabled={!afterPhoto}
            className="w-full bg-[#10B981] hover:bg-[#0EA271] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md"
          >
            Finish Job & Clear Invoice &rarr;
          </button>
        )}

      </div>
    </div>
  );
};
export default WorkProgressStepper;
