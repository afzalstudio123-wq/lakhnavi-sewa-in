'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AdminTerminal } from './AdminTerminal';
import { AlertCircle } from 'lucide-react';
import { useApp } from '../AppContext';

export const AdminGate: React.FC = () => {
  const { login, logout } = useApp();
  const [passkey, setPasskey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasError, setHasError] = useState(false);

  const targetMasterKey = '2026'; // Secret administrative root passkey token

  const processGateVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkey === targetMasterKey) {
      setIsAuthenticated(true);
      setHasError(false);
      localStorage.setItem('admin_gate_auth', 'true');
      login({
        id: 'admin_root',
        name: 'Platform Admin',
        role: 'ADMIN',
        status: 'APPROVED'
      });
    } else {
      setHasError(true);
      setPasskey('');
    }
  };

  // Check cached gate authorization
  React.useEffect(() => {
    const isAuth = localStorage.getItem('admin_gate_auth');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLock = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_gate_auth');
    logout();
  };

  if (isAuthenticated) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-end pr-6">
          <button 
            onClick={handleLock} 
            className="bg-white border border-[#DDE2F0] hover:bg-[#F8F9FC] text-[#6E7191] text-xs font-bold py-2 px-4 rounded-xl shadow-sm transition-colors uppercase tracking-wider"
          >
            Lock Terminal
          </button>
        </div>
        <AdminTerminal />
      </div>
    );
  }

  return (
    <div className="w-full bg-[#1A1A2E] flex items-center justify-center p-6 rounded-3xl min-h-[500px]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-white/5 border border-[#6E7191]/20 rounded-3xl p-6 text-white shadow-2xl"
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#FF6B6B]/20 text-[#FF6B6B] rounded-2xl flex items-center justify-center mx-auto text-lg font-bold">🔒</div>
          <h2 className="text-md font-bold tracking-wide mt-3 text-[#EEF0F8]">Admin Boundary Fire-Wall</h2>
          <p className="text-[11px] text-[#6E7191] mt-1">This segment is completely hidden from public visibility layers.</p>
        </div>

        <form onSubmit={processGateVerification} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6E7191] mb-2">Provide Security Passkey Token</label>
            <input 
              type="password" 
              maxLength={4}
              placeholder="••••"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value.replace(/\D/g, ''))}
              className="w-full text-center px-4 py-3 bg-black/40 border border-[#6E7191]/30 rounded-xl text-lg font-bold tracking-widest text-white focus:outline-none focus:border-[#5C33F6]"
              required
            />
          </div>

          {hasError && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-[#FF6B6B] text-center flex items-center gap-1.5 justify-center">
              <AlertCircle size={14} />
              <span>Gate Key Mismatch! Hint: '2026'.</span>
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full bg-[#5C33F6] hover:bg-[#4B29D4] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
          >
            Request Access Override
          </button>
        </form>
      </motion.div>
    </div>
  );
};
export default AdminGate;
