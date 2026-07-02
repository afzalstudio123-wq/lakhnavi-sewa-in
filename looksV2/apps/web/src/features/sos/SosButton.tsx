'use client';

import React, { useState } from 'react';
import { useApp } from '../../components/AppContext';
import { ShieldAlert, PhoneCall, AlertTriangle, Play, Check } from 'lucide-react';
import { THEME } from '../../utils/theme';

export const SosButton: React.FC = () => {
  const { showToast, addMockNotification } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);
  const [sosActive, setSosActive] = useState(false);

  const triggerSOS = () => {
    setSosActive(true);
    setShowConfirm(false);
    showToast('🚨 SOS Emergency Triggered! Local emergency authorities notified.', 'error');
    addMockNotification('🚨 SOS beacon active! GPS coordinates shared with local Lucknow patrol nodes.', 'warning');
  };

  return (
    <>
      <button 
        onClick={() => {
          if (sosActive) {
            setSosActive(false);
            showToast('SOS Beacon deactivated.', 'info');
          } else {
            setShowConfirm(true);
          }
        }}
        className={`w-full font-black py-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all text-xs tracking-widest uppercase border ${
          sosActive 
            ? 'bg-semantic-error text-white animate-pulse border-red-600' 
            : 'bg-white hover:bg-red-50/40 text-semantic-error border-red-200'
        }`}
      >
        <ShieldAlert size={18} className={sosActive ? 'animate-bounce' : ''} />
        <span>{sosActive ? 'Deactivate Safety SOS' : 'Trigger Safety SOS'}</span>
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 border border-borderColor flex flex-col gap-5 text-center shadow-2xl animate-in zoom-in-95 duration-150 text-left">
            <div className="mx-auto w-12 h-12 bg-red-100 text-semantic-error rounded-2xl flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>

            <div className="text-center">
              <h3 className="font-extrabold text-base text-ink">Confirm SOS Safety Trigger?</h3>
              <p className="text-xs text-muted font-medium mt-1.5 leading-relaxed">
                This will simulate broadcasting your current location coords to the Lucknow Police Network and dispatching emergency alerts to pre-configured family contacts.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-grow py-3 border border-borderColor hover:bg-surface text-ink font-bold rounded-xl text-xs uppercase"
              >
                Cancel
              </button>
              <button
                onClick={triggerSOS}
                className="flex-grow py-3 bg-semantic-error hover:bg-red-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-red-200"
              >
                Confirm Emergency
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SOS Active Overlay Info Panel */}
      {sosActive && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex flex-col gap-2.5 text-left text-xs font-bold text-semantic-error mt-4">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1"><ShieldAlert size={14} className="animate-spin" /> SOS BROADCAST ACTIVE</span>
            <span className="bg-red-200 text-[9px] px-1.5 py-0.5 rounded uppercase font-black">GPS Telemetry</span>
          </div>
          <p className="text-[10px] text-red-700/80 leading-normal font-semibold">
            Broadcasting Gomti Nagar coordinates: <span className="font-mono">26.8500° N, 81.0000° E</span>
          </p>
          <a 
            href="tel:112"
            className="w-full bg-semantic-error hover:bg-red-600 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1 transition-colors mt-1 shadow-sm"
          >
            <PhoneCall size={12} /> Call Lucknow Helpline (112)
          </a>
        </div>
      )}
    </>
  );
};
export default SosButton;
