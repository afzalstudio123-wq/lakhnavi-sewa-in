'use client';

import React, { useState, useEffect } from 'react';
import { mockServices } from '../../services/mockServices';
import { TrainingModule, RewardPointsHistory } from '../../mock/database';
import { Award, BookOpen, Lock, Unlock, CheckCircle, RefreshCw, Landmark, ArrowDownLeft } from 'lucide-react';
import { THEME } from '../../utils/theme';
import { useApp } from '../../components/AppContext';

export const TrainingPortal: React.FC = () => {
  const { showToast } = useApp();
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [points, setPoints] = useState(0);
  const [rewardsHistory, setRewardsHistory] = useState<RewardPointsHistory[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  const loadData = () => {
    setModules(mockServices.getTrainingModules());
    setPoints(mockServices.getRewardPointsTotal());
    setRewardsHistory(mockServices.getRewardPointsHistory());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCompleteLesson = (id: string) => {
    mockServices.completeTrainingProgress(id);
    showToast('Course module completed! Earned 200 Lakhnavi rewards points.', 'success');
    loadData();
  };

  const handleConvertPoints = () => {
    if (points < 500) {
      showToast('Minimum 500 points required to convert.', 'error');
      return;
    }
    
    setIsConverting(true);
    setTimeout(() => {
      try {
        const { cashConverted, pointsDeducted } = mockServices.convertPointsToCash();
        showToast(`Successfully converted ${pointsDeducted} points into ₹${cashConverted} available wallet balance!`, 'success');
        loadData();
      } catch (err: any) {
        showToast(err.message || 'Conversion failed', 'error');
      } finally {
        setIsConverting(false);
      }
    }, 1500);
  };

  // Simulating certificate printing
  const handlePrintCertificate = (title: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate of Service Excellence - LakhnaviSewa</title>
          <style>
            body { font-family: 'Inter', sans-serif; background: #F8F9FC; color: #1A1A2E; padding: 40px; text-align: center; }
            .cert-box { border: 15px solid #5C33F6; background: white; padding: 50px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
            h1 { font-size: 36px; font-weight: 900; color: #5C33F6; margin-bottom: 5px; }
            h2 { font-size: 18px; font-weight: 700; color: #6E7191; letter-spacing: 2px; text-transform: uppercase; }
            .name { font-size: 28px; font-weight: 900; border-bottom: 2px solid #DDE2F0; display: inline-block; padding: 10px 40px; margin: 30px 0; }
            p { font-size: 14px; line-height: 1.6; max-width: 500px; margin: 0 auto; color: #6E7191; font-weight: 500; }
            .footer-info { margin-top: 50px; display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; }
            .btn-print { margin-top: 30px; background: #5C33F6; color: white; border: none; padding: 12px 30px; border-radius: 10px; font-weight: 700; cursor: pointer; }
            @media print { .btn-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="cert-box">
            <h2>LakhnaviSewa Training Academy</h2>
            <h1>Certificate of Excellence</h1>
            <p style="margin-top: 20px;">This certificate is proudly presented to</p>
            <div class="name">Lakhnavi Verified Partner</div>
            <p>For successfully completing the comprehensive professional vetting program and training curriculum in:</p>
            <p style="color: #1A1A2E; font-weight: bold; margin-top: 10px;">${title}</p>
            <div class="footer-info">
              <div>DATE: ${new Date().toLocaleDateString()}</div>
              <div>VERIFIER: UIDAI & Vetting Registry</div>
            </div>
            <button class="btn-print" onclick="window.print()">Print Certificate / प्रिंट</button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full text-left">
      
      {/* Course modules listing */}
      <div className="lg:col-span-2 bg-white border border-borderColor rounded-3xl p-6 shadow-sm flex flex-col gap-5">
        <div>
          <h3 className="font-extrabold text-sm text-ink uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen size={16} className="text-primary" />
            Provider Training Modules
          </h3>
          <p className="text-[10px] text-muted font-bold mt-0.5">Vetting safety curriculum & service excellence courses</p>
        </div>

        <div className="space-y-4">
          {modules.map((m, idx) => (
            <div 
              key={m.id}
              className={`border rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${
                m.status === 'LOCKED' ? 'bg-[#F8F9FC]/60 border-borderColor/60 opacity-60' : 'bg-white border-borderColor'
              }`}
            >
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  {m.status === 'COMPLETED' ? (
                    <CheckCircle className="text-semantic-success" size={18} />
                  ) : m.status === 'UNLOCKED' ? (
                    <Unlock className="text-primary" size={18} />
                  ) : (
                    <Lock className="text-muted" size={18} />
                  )}
                  <h4 className="font-extrabold text-sm text-ink">{m.title_en}</h4>
                </div>
                
                {/* Progress bar */}
                {m.status !== 'LOCKED' && (
                  <div className="w-48 bg-surface h-1.5 rounded-full overflow-hidden mt-2.5">
                    <div 
                      className="bg-primary h-full transition-all"
                      style={{ width: `${m.progressPercent}%` }}
                    />
                  </div>
                )}
              </div>

              <div>
                {m.status === 'UNLOCKED' ? (
                  <button 
                    onClick={() => handleCompleteLesson(m.id)}
                    className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-xl text-xs uppercase"
                  >
                    Finish Module
                  </button>
                ) : m.status === 'COMPLETED' ? (
                  <button 
                    onClick={() => handlePrintCertificate(m.title_en)}
                    className="border border-primary text-primary hover:bg-primary hover:text-white font-bold py-2 px-4 rounded-xl text-xs uppercase transition-all flex items-center gap-1"
                  >
                    <Award size={12} />
                    <span>Get Cert</span>
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider bg-surface2 px-2.5 py-1 rounded-md">Locked</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards & points conversion */}
      <div className="flex flex-col gap-6">
        
        {/* Total rewards card */}
        <div className="bg-white border border-borderColor rounded-3xl p-6 shadow-sm flex flex-col gap-4">
          <span className="text-[10px] font-black text-[#6E7191] uppercase tracking-widest flex items-center gap-1.5">
            <Award size={14} className="text-primary" />
            Lakhnavi Reward Points
          </span>
          <div className="flex justify-between items-end border-b border-borderColor/60 pb-3">
            <div className="flex flex-col text-left">
              <span className="text-3xl font-black text-ink font-mono">{points} Pts</span>
              <span className="text-[10px] text-[#6E7191] mt-0.5 font-bold">500 Points = ₹50 Cash Value</span>
            </div>
            
            <button 
              onClick={handleConvertPoints}
              disabled={isConverting || points < 500}
              className="bg-[#10B981] hover:bg-[#0EA271] disabled:opacity-30 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase flex items-center gap-1"
            >
              {isConverting ? <RefreshCw className="animate-spin" size={12} /> : <Landmark size={12} />}
              <span>Convert</span>
            </button>
          </div>

          {/* Points rules */}
          <p className="text-[10px] text-muted leading-relaxed font-semibold">
            🎁 Complete training lessons or take night/weekend shifts in Hazratganj to accumulate bonus points.
          </p>
        </div>

        {/* History log */}
        <div className="bg-white border border-borderColor rounded-3xl p-6 shadow-sm flex flex-col gap-3 text-left">
          <h4 className="text-[10px] font-black text-[#6E7191] uppercase tracking-widest">
            Bonus Trigger Ledger
          </h4>

          <div className="divide-y divide-[#DDE2F0]/50 space-y-2">
            {rewardsHistory.length === 0 ? (
              <p className="text-xs text-muted font-bold py-4 text-center">No points history registered yet.</p>
            ) : (
              rewardsHistory.map(hist => (
                <div key={hist.id} className="pt-2 flex justify-between items-center text-xs font-bold">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-ink">{hist.label}</span>
                    <span className="text-[9px] text-muted font-normal">{hist.date} &middot; {hist.type.replace('_', ' ')}</span>
                  </div>
                  <span className="text-primary font-mono font-black">+{hist.points} pts</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
export default TrainingPortal;
