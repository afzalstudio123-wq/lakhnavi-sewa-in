'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/components/AppContext';
import { ShieldCheck, Users, BarChart3, TrendingUp, Check, X, AlertCircle, Loader2, MessageSquare } from 'lucide-react';
import { mockServices } from '../../../services/mockServices';
import { Testimonial } from '../../../mock/database';

// Feature components
import { ComparisonDashboard } from '../../../features/comparison/ComparisonDashboard';
import { THEME } from '../../../utils/theme';

export default function AdminDashboard() {
  const { t, showToast } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Analytics and Provider approvals states
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [pendingProviders, setPendingProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'MODERATION'>('ANALYTICS');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'lucknow2026') {
      setIsAuthenticated(true);
      showToast('Admin Dashboard unlocked!');
      localStorage.setItem('admin_auth', 'true');
    } else {
      showToast('Invalid admin security key', 'error');
    }
  };

  // Check auth on mount
  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const loadAdminData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const resAnalytic = await fetch('http://localhost:5000/api/analytics');
      const resProviders = await fetch('http://localhost:5000/api/providers?status=PENDING');
      
      if (resAnalytic.ok && resProviders.ok) {
        const analyticData = await resAnalytic.json();
        const providersData = await resProviders.json();
        setAnalytics(analyticData);
        setPendingProviders(providersData);
      } else {
        throw new Error();
      }
    } catch (err) {
      // Offline fallback: construct mock analytical numbers
      const mockAnalytic = {
        totalRevenue: 2890,
        bookingsCount: 6,
        completedBookings: 2,
        pendingBookings: 2,
        confirmedBookings: 2,
        providersCount: 6,
        customersCount: 3,
        servicesCount: 6,
        categoriesOverview: [
          { name: 'Beauty & Grooming', count: 1 },
          { name: 'Home Repairs & Maintenance', count: 1 },
          { name: 'Cleaning & Pest Control', count: 1 },
          { name: 'Native Smart Products', count: 1 },
          { name: 'Indian Labours', count: 1 },
          { name: 'Contractors & Builders', count: 1 }
        ]
      };
      setAnalytics(mockAnalytic);
      // Construct mock pending provider
      setPendingProviders([
        {
          id: 'prov_pending_1',
          name: 'Rajesh Mishra',
          phone: '9988112233',
          category: 'Indian Labours',
          experience_years: 12,
          locality: 'Chowk',
          status: 'PENDING'
        }
      ]);
    } finally {
      setLoading(false);
      setTestimonials(mockServices.getTestimonials());
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [isAuthenticated]);

  const handleApproveProvider = async (id: string, approve: boolean) => {
    const status = approve ? 'APPROVED' : 'REJECTED';
    try {
      const res = await fetch(`http://localhost:5000/api/providers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showToast(`Provider status updated to ${status}`);
        loadAdminData();
      } else {
        throw new Error();
      }
    } catch (err) {
      // Offline update
      showToast(`Standalone Mode: Provider is now ${status}`);
      setPendingProviders(pendingProviders.filter(p => p.id !== id));
    }
  };

  const handleModerateTestimonial = (id: string, status: 'APPROVED' | 'REJECTED') => {
    mockServices.updateTestimonialStatus(id, status);
    showToast(`Testimonial review has been moderated to ${status}`, 'success');
    setTestimonials(mockServices.getTestimonials());
  };

  const handleLock = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
    showToast('Admin Panel locked.');
  };

  const pendingTestimonials = testimonials.filter(t => t.status === 'PENDING');

  // 1. Password Protection Form
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 flex flex-col gap-6">
        <div className="bg-canvas border border-borderColor rounded-3xl p-8 shadow-2xl flex flex-col gap-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent self-center">
            <ShieldCheck size={32} />
          </div>
          
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-black text-ink">Secure Gateway</h2>
            <p className="text-xs text-muted font-semibold">Enter secret credential key code to view global stats.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-muted uppercase">Security Key</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Hint: lucknow2026"
                className="bg-surface border border-borderColor rounded-xl p-3.5 outline-none font-bold text-center tracking-widest text-sm text-ink focus:border-primary transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-canvas font-bold py-3.5 rounded-xl transition-all shadow-md shadow-primary/10 mt-2"
            >
              Verify Credentials
            </button>
          </form>

          <div className="flex gap-2 items-center justify-center text-[10px] text-muted font-bold uppercase mt-2">
            <AlertCircle size={12} className="text-muted shrink-0" />
            <span>Strictly authorized prototype access only</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col gap-10">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-borderColor pb-6 text-left">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-ink flex items-center gap-2">
            <BarChart3 className="text-primary" /> Admin Control Desk
          </h1>
          <p className="text-xs text-muted font-semibold mt-1">Platform management operations for Lucknow region.</p>
        </div>

        <button
          onClick={handleLock}
          className="text-xs font-bold bg-surface hover:bg-surface2 text-ink border border-borderColor py-2 px-4 rounded-xl transition-all"
        >
          Lock Panel
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-borderColor pb-3 text-sm font-bold text-muted justify-start">
        <button
          onClick={() => setActiveTab('ANALYTICS')}
          className={`pb-3 relative transition-all ${
            activeTab === 'ANALYTICS' ? 'text-primary border-b-2 border-primary' : 'hover:text-ink'
          }`}
        >
          Telemetry Analytics
        </button>
        <button
          onClick={() => setActiveTab('MODERATION')}
          className={`pb-3 relative transition-all ${
            activeTab === 'MODERATION' ? 'text-primary border-b-2 border-primary' : 'hover:text-ink'
          }`}
        >
          Moderation Center ({pendingTestimonials.length})
        </button>
      </div>

      {/* Loading Pane */}
      {loading || !analytics ? (
        <div className="flex flex-col items-center justify-center py-40 gap-3">
          <Loader2 className="text-primary animate-spin" size={32} />
          <span className="text-xs font-bold text-muted uppercase">Syncing server metrics...</span>
        </div>
      ) : activeTab === 'ANALYTICS' ? (
        <div className="flex flex-col gap-10">
          
          {/* Comparison Dashboard (SVG charts & sectors comparison) */}
          <ComparisonDashboard />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: Provider Approvals */}
            <div className="lg:col-span-2 flex flex-col gap-6 text-left">
              <h2 className="text-xl font-extrabold text-ink flex items-center gap-2">
                <Users size={18} className="text-primary" /> Pending Provider Approvals ({pendingProviders.length})
              </h2>

              {pendingProviders.length === 0 ? (
                <div className="border border-borderColor/80 bg-surface rounded-2xl py-12 text-center text-xs font-bold text-muted uppercase">
                  All partners verified and cleared.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {pendingProviders.map((p) => (
                    <div key={p.id} className="bg-white border border-borderColor rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                      <div className="flex flex-col gap-1">
                        <h3 className="font-extrabold text-base text-ink">{p.name}</h3>
                        <div className="flex flex-wrap gap-2 text-xs font-semibold text-muted mt-1">
                          <span className="bg-surface2 px-2 py-0.5 rounded">{p.category}</span>
                          <span>&bull;</span>
                          <span>{p.experience_years} Years Experience</span>
                          <span>&bull;</span>
                          <span>Locality: {p.locality}</span>
                        </div>
                        <span className="text-[10px] text-muted font-bold mt-1 uppercase">Phone: +91 {p.phone}</span>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleApproveProvider(p.id, false)}
                          className="p-2.5 border border-semantic-error/30 hover:bg-semantic-error/10 text-semantic-error rounded-xl transition-all"
                          title="Reject partner application"
                        >
                          <X size={16} />
                        </button>
                        <button
                          onClick={() => handleApproveProvider(p.id, true)}
                          className="bg-primary hover:bg-primary-hover text-canvas font-bold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-primary/5 transition-all flex items-center gap-1"
                        >
                          <Check size={14} />
                          <span>Approve Vetting</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Category Distribution */}
            <div className="flex flex-col gap-6 text-left">
              <h2 className="text-xl font-extrabold text-ink flex items-center gap-2">
                <TrendingUp size={18} className="text-accent" /> Categories Overview
              </h2>

              <div className="bg-surface border border-borderColor rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
                {analytics.categoriesOverview?.map((cat: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-xs font-bold text-muted uppercase">
                    <span className="text-ink truncate max-w-[160px]">{cat.name}</span>
                    <span className="bg-canvas border border-borderColor px-2.5 py-1 rounded text-primary shrink-0">
                      {cat.count} Partners
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Testimonials Moderation Tab */
        <div className="flex flex-col gap-6 text-left">
          <h2 className="text-xl font-extrabold text-ink flex items-center gap-2">
            <MessageSquare size={18} className="text-primary" /> Vetting Testimonial Reviews ({pendingTestimonials.length})
          </h2>

          {pendingTestimonials.length === 0 ? (
            <div className="border border-borderColor/80 bg-surface rounded-2xl py-12 text-center text-xs font-bold text-muted uppercase">
              No testimonials pending review.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingTestimonials.map((t) => (
                <div key={t.id} className="bg-white border border-borderColor rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-ink">{t.authorName}</h4>
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wide bg-primary/5 px-2 py-0.5 rounded-md">
                        {t.role}
                      </span>
                    </div>
                    <p className="text-xs text-muted font-medium italic mt-2">"{t.reviewText}"</p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleModerateTestimonial(t.id, 'REJECTED')}
                      className="p-2.5 border border-semantic-error/30 hover:bg-semantic-error/10 text-semantic-error rounded-xl transition-all"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleModerateTestimonial(t.id, 'APPROVED')}
                      className="bg-semantic-success hover:bg-emerald-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center gap-1"
                    >
                      <Check size={14} />
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
