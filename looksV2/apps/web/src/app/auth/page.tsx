'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/components/AppContext';
import { Phone, ShieldAlert, Sparkles, KeyRound } from 'lucide-react';
import Link from 'next/link';

function AuthContent() {
  const { t, login, showToast, language } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [role, setRole] = useState<'CUSTOMER' | 'PROVIDER'>('CUSTOMER');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'PROVIDER' || roleParam === 'CUSTOMER') {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, role })
      });
      const data = await res.json();
      if (res.ok) {
        setSimulatedOtp(data.otp);
        showToast(`OTP Sent successfully (Simulated)`, 'info');
        setStep(2);
      } else {
        showToast(data.error || 'Login failed', 'error');
      }
    } catch (err) {
      showToast('Backend connection failed. Displaying simulated OTP instead.', 'warning');
      const fallbackOtp = '1234';
      setSimulatedOtp(fallbackOtp);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4 || !/^\d+$/.test(otp)) {
      showToast('Please enter a 4-digit code', 'error');
      return;
    }

    if (otp !== simulatedOtp && otp !== '1234') {
      showToast('Invalid OTP. Use the simulated OTP code shown above.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, role, otp })
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user);
        showToast(language === 'en' ? 'Logged in successfully!' : 'सफलतापूर्वक लॉग इन किया गया!');
        if (role === 'PROVIDER') {
          router.push('/dashboard/provider');
        } else {
          router.push('/dashboard/customer');
        }
      } else {
        showToast(data.error || 'Verification failed', 'error');
      }
    } catch (err) {
      // Fallback for standalone frontend presentation
      const mockUser = {
        id: role === 'PROVIDER' ? 'prov_1' : 'usr_customer_1',
        name: role === 'PROVIDER' ? 'Priya Sharma' : 'Arjun Mishra',
        phone,
        role,
        locality: 'Gomti Nagar, Lucknow',
        wishlist: [],
        status: 'APPROVED'
      };
      login(mockUser);
      showToast('Standalone mode: Logged in successfully!');
      if (role === 'PROVIDER') {
        router.push('/dashboard/provider');
      } else {
        router.push('/dashboard/customer');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20 flex flex-col gap-8">
      {/* Role Selection Tabs */}
      {step === 1 && (
        <div className="flex bg-surface p-1 rounded-2xl border border-borderColor">
          <button
            onClick={() => setRole('CUSTOMER')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              role === 'CUSTOMER' ? 'bg-canvas text-primary shadow-sm' : 'text-muted hover:text-ink'
            }`}
          >
            {t('customerPortal')}
          </button>
          <button
            onClick={() => setRole('PROVIDER')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              role === 'PROVIDER' ? 'bg-canvas text-primary shadow-sm' : 'text-muted hover:text-ink'
            }`}
          >
            {t('providerPortal')}
          </button>
        </div>
      )}

      <div className="bg-canvas border border-borderColor rounded-3xl p-8 shadow-xl flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl" />

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-black text-ink flex items-center gap-2">
            <Sparkles size={20} className="text-accent animate-spin" />
            {role === 'CUSTOMER' ? 'Customer Auth' : 'Partner Boarding'}
          </h2>
          <p className="text-xs font-semibold text-muted">
            {t('loginDesc')}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-muted uppercase tracking-wider">{t('phoneLabel')}</label>
              <div className="flex items-center gap-3 bg-surface border border-borderColor rounded-xl px-4 py-3.5 focus-within:border-primary transition-all">
                <span className="text-sm font-bold text-muted">+91</span>
                <input
                  type="text"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="bg-transparent outline-none flex-grow font-semibold text-sm text-ink"
                  required
                />
                <Phone size={16} className="text-muted" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-canvas font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Sending...' : t('getOtp')}</span>
            </button>
            {role === 'PROVIDER' && (
              <Link
                href="/auth/provider-onboarding"
                className="w-full text-center border border-primary text-primary hover:bg-primary hover:text-canvas font-bold py-3 rounded-xl transition-all text-xs uppercase tracking-wider block mt-1"
              >
                Become a Verified Partner (15-Step Funnel) &rarr;
              </Link>
            )}
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
            {simulatedOtp && (
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-center gap-3">
                <KeyRound size={20} className="text-primary shrink-0 animate-bounce" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-primary">Simulated OTP Received</span>
                  <span className="text-lg font-black tracking-widest text-ink">{simulatedOtp}</span>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-muted uppercase tracking-wider">{t('otpLabel')}</label>
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="XXXX"
                className="bg-surface border border-borderColor rounded-xl p-3.5 outline-none font-bold text-center tracking-[1em] text-lg text-ink focus:border-primary transition-all"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 text-sm font-bold border border-borderColor hover:bg-surface rounded-xl transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] bg-primary hover:bg-primary-hover text-canvas font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/10 flex items-center justify-center"
              >
                <span>{loading ? 'Verifying...' : t('verifyOtp')}</span>
              </button>
            </div>
          </form>
        )}

        <div className="flex gap-2 items-center text-[10px] text-muted font-bold uppercase mt-2">
          <ShieldAlert size={12} className="text-accent" />
          <span> Lucknow Local Vetting Registry Active</span>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading Authentication Router...</div>}>
      <AuthContent />
    </Suspense>
  );
}
