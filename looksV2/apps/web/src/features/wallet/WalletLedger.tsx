'use client';

import React, { useState, useEffect } from 'react';
import { mockServices } from '../../services/mockServices';
import { WalletTransaction } from '../../mock/database';
import { Landmark, ArrowUpRight, ArrowDownLeft, ShieldCheck, HelpCircle, RefreshCw, Send } from 'lucide-react';
import { THEME } from '../../utils/theme';
import { useApp } from '../../components/AppContext';

export const WalletLedger: React.FC = () => {
  const { showToast } = useApp();
  const [balance, setBalance] = useState({ available: 0, pending: 0 });
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  
  // Withdrawal Form States
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedGateway, setSelectedGateway] = useState('GPay');
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    setBalance(mockServices.getWalletBalance());
    setTransactions(mockServices.getWalletTransactions());
  };

  useEffect(() => {
    loadData();
    
    // Polling simulation to refresh transaction list if auto-approvals trigger in background
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(withdrawAmount);

    if (isNaN(amountVal) || amountVal <= 0) {
      showToast('Please enter a valid withdrawal amount', 'error');
      return;
    }
    if (amountVal > balance.available) {
      showToast('Requested amount exceeds available balance', 'error');
      return;
    }
    if (!upiId.includes('@')) {
      showToast('Please enter a valid UPI address VPA (must contain @)', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      try {
        const { netPayout, deductions } = mockServices.requestUPIWithdrawal(amountVal, upiId);
        showToast(`Withdrawal requested! Net ₹${netPayout.toFixed(2)} dispatched to ${upiId} (${selectedGateway})`, 'success');
        setWithdrawAmount('');
        loadData();
      } catch (err: any) {
        showToast(err.message || 'Withdrawal failed', 'error');
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  // Fee calculation preview
  const enteredAmount = parseFloat(withdrawAmount) || 0;
  const flatFee = enteredAmount > 0 ? 49 : 0;
  const systemFee = enteredAmount * 0.05;
  const totalDeductions = flatFee + systemFee;
  const netPayoutPreview = Math.max(0, enteredAmount - totalDeductions);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full text-left">
      
      {/* Balance Registry & Form */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Balance cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-borderColor rounded-3xl p-6 shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted uppercase">Available Balance</span>
              <span className="text-3xl font-black text-primary font-mono mt-1">₹{balance.available.toLocaleString('en-IN')}</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Landmark size={24} />
            </div>
          </div>

          <div className="bg-white border border-borderColor rounded-3xl p-6 shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted uppercase">Pending Balance</span>
              <span className="text-2xl font-black text-ink font-mono mt-1">₹{balance.pending.toLocaleString('en-IN')}</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-surface2 text-muted flex items-center justify-center">
              <RefreshCw className="animate-spin text-muted" size={20} />
            </div>
          </div>
        </div>

        {/* Withdrawal Form */}
        <div className="bg-white border border-borderColor rounded-3xl p-6 shadow-sm flex flex-col gap-4">
          <div className="border-b border-borderColor/60 pb-3">
            <h3 className="font-extrabold text-sm text-ink uppercase tracking-wider">UPI Withdrawal Simulator</h3>
            <p className="text-[10px] text-muted font-bold mt-0.5">Abstracted B2B billing channel</p>
          </div>

          <form onSubmit={handleWithdrawalSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className={THEME.label}>Withdrawal Value (INR)</span>
                <div className="relative flex items-center bg-surface border border-borderColor rounded-xl px-4 py-3 focus-within:border-primary">
                  <span className="text-sm font-bold text-muted mr-1.5">₹</span>
                  <input 
                    type="number" 
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter amount"
                    className="bg-transparent outline-none flex-grow text-sm font-semibold text-ink font-mono"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className={THEME.label}>Target UPI Address VPA</span>
                <input 
                  type="text" 
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="name@upi"
                  className={THEME.input}
                  required
                />
              </div>
            </div>

            {/* Gateway selection */}
            <div className="flex flex-col gap-1.5">
              <span className={THEME.label}>Supported UPI Gateway</span>
              <div className="flex flex-wrap gap-2">
                {['GPay', 'PhonePe', 'Paytm', 'CRED', 'BHIM'].map(gw => (
                  <button 
                    key={gw}
                    type="button"
                    onClick={() => setSelectedGateway(gw)}
                    className={`px-4 py-2 border rounded-xl text-xs font-black transition-all ${
                      selectedGateway === gw ? 'bg-primary text-white border-transparent' : 'bg-surface border-borderColor text-ink'
                    }`}
                  >
                    {gw}
                  </button>
                ))}
              </div>
            </div>

            {/* Fee Preview Box */}
            {enteredAmount > 0 && (
              <div className="bg-surface border border-borderColor p-4 rounded-2xl flex flex-col gap-2 text-[10px] font-bold text-muted uppercase tracking-wider">
                <div className="flex justify-between">
                  <span>Gross Withdrawal:</span>
                  <span className="font-mono text-ink">₹{enteredAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Gateway Fee:</span>
                  <span className="font-mono text-ink">₹49.00</span>
                </div>
                <div className="flex justify-between border-b border-borderColor/60 pb-2">
                  <span>System Interest fee (5%):</span>
                  <span className="font-mono text-ink">₹{systemFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-black text-ink pt-1 font-mono">
                  <span>Net Dispatched Settlement:</span>
                  <span className="text-primary">₹{netPayoutPreview.toFixed(2)}</span>
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading || !withdrawAmount || enteredAmount <= 0}
              className={THEME.buttonPrimary}
            >
              {loading ? <RefreshCw className="animate-spin" size={16} /> : <Send size={16} />}
              <span>{loading ? 'Processing Ledger request...' : 'Submit Withdrawal Settlement'}</span>
            </button>
          </form>
        </div>

      </div>

      {/* Ledger transactions list */}
      <div className="bg-white border border-borderColor rounded-3xl p-6 shadow-sm flex flex-col gap-4 text-left">
        <div>
          <h4 className="text-xs font-black text-ink uppercase tracking-wider flex items-center gap-1.5">
            <Landmark size={14} className="text-primary" />
            Settlement Audit Trail
          </h4>
          <p className="text-[9px] text-muted font-bold mt-0.5">Verified local transaction pipeline</p>
        </div>

        <div className="divide-y divide-borderColor/60 space-y-3 max-h-[350px] overflow-y-auto pr-1">
          {transactions.length === 0 ? (
            <p className="text-xs text-muted font-semibold py-8 text-center">No transactional history recorded.</p>
          ) : (
            transactions.map(tx => (
              <div key={tx.id} className="pt-3 flex justify-between items-center text-xs font-bold">
                <div className="flex flex-col gap-0.5">
                  <span className="text-ink flex items-center gap-1">
                    {tx.type === 'WITHDRAWAL' ? <ArrowUpRight className="text-accent" size={14} /> : <ArrowDownLeft className="text-semantic-success" size={14} />}
                    {tx.type} ({tx.id})
                  </span>
                  <span className="text-[9px] text-muted font-normal block leading-tight">
                    {tx.timestamp} {tx.upiId && `| VPA: ${tx.upiId}`}
                  </span>
                </div>
                
                <div className="flex flex-col items-end gap-1 font-mono">
                  <span className={tx.type === 'WITHDRAWAL' ? 'text-accent' : 'text-semantic-success'}>
                    {tx.type === 'WITHDRAWAL' ? '-' : '+'}₹{tx.amount}
                  </span>
                  <span className={`text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded font-sans ${
                    tx.status === 'Approved' ? 'bg-semantic-success/10 text-semantic-success' : 
                    tx.status === 'Rejected' ? 'bg-semantic-error/10 text-semantic-error' :
                    'bg-semantic-warning/10 text-semantic-warning animate-pulse'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
export default WalletLedger;
