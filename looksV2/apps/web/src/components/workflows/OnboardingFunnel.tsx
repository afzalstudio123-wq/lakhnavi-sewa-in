'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/AppContext';

export const OnboardingFunnel: React.FC = () => {
  const router = useRouter();
  const { showToast } = useApp();
  
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  const finalizeOnboarding = () => {
    setIsOnboarded(true);
    setShowWelcomePopup(true);
  };

  const submitOnboardingForm = (e: React.FormEvent) => {
    e.preventDefault();
    finalizeOnboarding();
  };

  const handlePopupClose = () => {
    setShowWelcomePopup(false);
    showToast('Onboarding completed! Welcome to the network.');
    router.push('/dashboard/provider');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-[#DDE2F0] rounded-2xl shadow-xl text-[#1A1A2E]">
      <h2 className="text-xl font-black mb-4">Partner Onboarding Funnel</h2>
      
      <form onSubmit={submitOnboardingForm} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 text-left">
          <label className="text-xs font-bold text-[#6E7191] uppercase">Full Name</label>
          <input 
            type="text" 
            placeholder="Afzal Ehsan" 
            className="bg-[#F8F9FC] border border-[#DDE2F0] rounded-xl p-3 text-xs outline-none font-bold" 
            required 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-[#5C33F6] hover:bg-[#4B29D4] text-white py-3 rounded-xl text-xs font-bold uppercase transition-colors"
        >
          Submit Onboarding
        </button>
      </form>

      {showWelcomePopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#DDE2F0] rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in-95 duration-150">
            <span className="text-4xl">🎉</span>
            <h3 className="font-extrabold text-lg text-ink">Welcome to Lakshvi Sewa!</h3>
            <p className="text-xs text-muted font-medium">
              Your profile is verified and active on the platform.
            </p>
            <button
              onClick={handlePopupClose}
              className="w-full bg-[#10B981] hover:bg-[#0EA271] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Enter Dashboard / प्रवेश करें
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingFunnel;
