'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/AppContext';
import { ArrowUpRight, Check, X, Calendar, Clock, MapPin, Sparkles, Loader2, IndianRupee } from 'lucide-react';
import PartnerPanel from '@/components/dashboards/PartnerPanel';

export default function ProviderDashboard() {
  const { t, user, showToast, language } = useApp();
  const router = useRouter();

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not provider
  useEffect(() => {
    if (!user) {
      router.push('/auth?role=PROVIDER');
    }
  }, [user, router]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/bookings?provider_id=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      } else {
        throw new Error();
      }
    } catch (err) {
      // Fallback
      const offline = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
      // Filter by provider_id in offline mode
      const filtered = offline.filter((b: any) => b.provider_id === user?.id || b.provider_id === 'prov_1');
      setBookings(filtered.reverse());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleUpdateStatus = async (id: string, newStatus: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showToast(`Job status updated to ${newStatus}`);
        loadData();
      } else {
        throw new Error();
      }
    } catch (err) {
      // Offline edit
      const offline = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
      const idx = offline.findIndex((b: any) => b.id === id);
      if (idx !== -1) {
        offline[idx].status = newStatus;
        localStorage.setItem('mock_bookings', JSON.stringify(offline));
        showToast(`Offline Mode: Job status updated to ${newStatus}`);
        loadData();
      }
    }
  };

  if (!user) return null;

  // Compute metrics
  const leads = bookings.filter(b => b.status === 'PENDING');
  const activeJobs = bookings.filter(b => b.status === 'CONFIRMED');
  const completedJobs = bookings.filter(b => b.status === 'COMPLETED');
  const totalEarnings = completedJobs.reduce((sum, b) => sum + b.total_amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col gap-10">
      {/* Profile Header */}
      <div className="bg-ink text-canvas border border-borderColor/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />
        
        <div className="flex items-center gap-4 relative z-10">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover border border-canvas/20 shadow-md"
          />
          <div className="flex flex-col">
            <h1 className="text-2xl font-black">{user.name || 'Priya Sharma'}</h1>
            <span className="text-xs font-bold text-accent bg-canvas/10 px-2.5 py-1 rounded-md self-start mt-1 uppercase tracking-wider">
              Verified {user.category || 'Beauty Expert'}
            </span>
          </div>
        </div>

        <div className="flex flex-col md:items-end gap-1 font-semibold text-sm relative z-10 text-muted">
          <span className="text-canvas flex items-center gap-1.5"><MapPin size={16} className="text-accent" /> {user.locality || 'Hazratganj'}, Lucknow</span>
          <span>Status: <span className="text-semantic-success uppercase font-bold">{user.status || 'APPROVED'}</span></span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface border border-borderColor rounded-2xl p-6 flex flex-col gap-1.5 shadow-sm">
          <span className="text-xs font-bold text-muted uppercase">Total Earnings</span>
          <div className="flex items-center text-3xl font-black text-ink">
            <IndianRupee size={28} className="text-primary shrink-0" />
            <span>{totalEarnings}</span>
          </div>
        </div>

        <div className="bg-surface border border-borderColor rounded-2xl p-6 flex flex-col gap-1.5 shadow-sm">
          <span className="text-xs font-bold text-muted uppercase">Active Bookings</span>
          <span className="text-3xl font-black text-ink">{activeJobs.length}</span>
        </div>

        <div className="bg-surface border border-borderColor rounded-2xl p-6 flex flex-col gap-1.5 shadow-sm">
          <span className="text-xs font-bold text-muted uppercase">Completed Jobs</span>
          <span className="text-3xl font-black text-ink">{completedJobs.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Leads & Active jobs */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          
          {/* Active Jobs panel */}
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-extrabold text-ink flex items-center gap-2">
              <Sparkles size={18} className="text-primary animate-spin" />
              {t('activeJobs')} ({activeJobs.length})
            </h2>

            {loading ? (
              <div className="py-12 text-center text-xs font-bold text-muted uppercase">Syncing...</div>
            ) : activeJobs.length === 0 ? (
              <div className="border border-borderColor/80 rounded-2xl py-12 text-center text-xs font-bold text-muted uppercase bg-surface">
                No active bookings in progress.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {activeJobs.map((job) => (
                  <div key={job.id} className="p-6 bg-canvas border border-borderColor rounded-2xl flex flex-col justify-between shadow-sm">
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-md uppercase">
                          {job.service ? job.service.category : 'General Job'}
                        </span>
                        <span className="text-xs font-bold text-muted">REF: {job.id}</span>
                      </div>
                      
                      <h3 className="font-extrabold text-base text-ink">
                        {job.service ? (language === 'en' ? job.service.title_en : job.service.title_hi) : 'Home Repairs'}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-semibold text-muted mt-2">
                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {job.scheduled_date}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} /> {job.scheduled_time}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={14} className="text-accent" /> {job.address}</span>
                      </div>

                      <div className="text-xs font-semibold text-muted border-t border-borderColor/50 mt-3 pt-3">
                        Customer details: <span className="text-ink font-bold">{job.customer?.name} ({job.customer?.phone})</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-borderColor/50 mt-4 pt-3">
                      <span className="font-black text-ink text-sm">Payout: ₹{job.total_amount}</span>
                      <button
                        onClick={() => handleUpdateStatus(job.id, 'COMPLETED')}
                        className="bg-primary hover:bg-primary-hover text-canvas font-bold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5"
                      >
                        <Check size={14} />
                        <span>{t('completeJob')}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Leads Center */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-extrabold text-ink">{t('leads')} ({leads.length})</h2>

          {loading ? (
            <div className="py-12 text-center text-xs font-bold text-muted uppercase">Syncing Leads...</div>
          ) : leads.length === 0 ? (
            <div className="border border-borderColor/80 rounded-2xl py-16 text-center text-xs font-bold text-muted uppercase bg-surface flex flex-col gap-2 p-6">
              <span>📭</span>
              <span>All leads answered</span>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {leads.map((lead) => (
                <div key={lead.id} className="bg-surface border border-borderColor rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded self-start uppercase">{lead.service?.category}</span>
                    <h3 className="font-extrabold text-sm text-ink">{language === 'en' ? lead.service?.title_en : lead.service?.title_hi}</h3>
                    <div className="flex flex-col gap-1 text-xs text-muted font-medium mt-1">
                      <span>Date: {lead.scheduled_date}</span>
                      <span>Time: {lead.scheduled_time}</span>
                      <span>Locality: {lead.address}</span>
                      <span>Customer: {lead.customer?.name}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-borderColor/60 pt-3">
                    <span className="font-black text-sm text-ink">₹{lead.total_amount}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus(lead.id, 'CANCELLED')}
                        className="p-2 border border-semantic-error/30 hover:bg-semantic-error/10 text-semantic-error rounded-xl transition-colors"
                        title={t('decline')}
                      >
                        <X size={14} />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(lead.id, 'CONFIRMED')}
                        className="bg-primary hover:bg-primary-hover text-canvas font-bold text-xs py-2 px-3.5 rounded-xl transition-all flex items-center gap-1"
                      >
                        <Check size={14} />
                        <span>{t('accept')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Service Catalog & Rate Card Management */}
      <div className="border-t border-borderColor/60 pt-12 mt-12">
        <PartnerPanel />
      </div>
    </div>
  );
}
