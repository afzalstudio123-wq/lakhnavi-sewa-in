'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/AppContext';
import { Calendar, Clock, MapPin, Star, Heart, Ban, CheckCircle, RefreshCw, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CustomerDashboard() {
  const { t, user, showToast, language } = useApp();
  const router = useRouter();

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'HISTORY' | 'WISHLIST'>('UPCOMING');
  const [wishlist, setWishlist] = useState<any[]>([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/auth?role=CUSTOMER');
    }
  }, [user, router]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/bookings?customer_id=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      } else {
        throw new Error('Server issues');
      }
    } catch (err) {
      // Offline fallback: load from localStorage
      const offline = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
      setBookings(offline.reverse());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Load mock wishlist items
    const staticWishlist = [
      { id: "srv_beauty_1", category: "Beauty & Grooming", title_en: "Premium Salon at Home for Women", title_hi: "महिलाओं के लिए प्रीमियम सैलून एट होम", price_inr: 1200 },
      { id: "srv_smart_1", category: "Native Smart Products", title_en: "Smart IoT Hub & Camera Setup", title_hi: "स्मार्ट IoT हब और कैमरा सेटअप", price_inr: 1500 }
    ];
    setWishlist(staticWishlist);
  }, [user]);

  const handleCancelBooking = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' })
      });
      if (res.ok) {
        showToast('Booking cancelled successfully');
        loadData();
      } else {
        throw new Error();
      }
    } catch (err) {
      // Offline updates
      const offline = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
      const index = offline.findIndex((b: any) => b.id === id);
      if (index !== -1) {
        offline[index].status = 'CANCELLED';
        localStorage.setItem('mock_bookings', JSON.stringify(offline));
        showToast('Offline Mode: Booking cancelled successfully!');
        loadData();
      }
    }
  };

  if (!user) {
    return null;
  }

  const upcomingBookings = bookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED');
  const pastBookings = bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED');

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col gap-10">
      {/* Profile Header */}
      <div className="bg-surface border border-borderColor rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary text-canvas flex items-center justify-center font-black text-2xl">
            {user.name ? user.name[0] : 'C'}
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-ink">{user.name || 'Arjun Mishra'}</h1>
            <span className="text-xs font-semibold text-muted bg-surface2 px-2.5 py-1 rounded-md self-start mt-1 uppercase tracking-wide">
              {user.role} PORTAL
            </span>
          </div>
        </div>

        <div className="flex flex-col md:items-end gap-1 font-semibold text-sm">
          <span className="text-ink flex items-center gap-1.5"><MapPin size={16} className="text-accent" /> {user.locality || 'Hazratganj'}, Lucknow</span>
          <span className="text-muted">Registered phone: +91 {user.phone}</span>
        </div>
      </div>

      {/* Hyperlocal Cluster sync board */}
      <div className="bg-white border border-borderColor rounded-3xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-borderColor/60 pb-3">
          <div>
            <h3 className="font-extrabold text-sm text-ink uppercase tracking-wide">Lucknow Localities Operations Cluster (Hyperlocal Sync)</h3>
            <p className="text-xs text-muted font-semibold mt-1">Select a locality sector to see operational demand and active providers.</p>
          </div>
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md uppercase">Live Radar Connection</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Hazratganj Hub', demand: 'High', latency: '4ms', workers: 14 },
            { name: 'Gomti Nagar Grid', demand: 'Peak', latency: '6ms', workers: 18 },
            { name: 'Aliganj Pool', demand: 'Normal', latency: '3ms', workers: 9 },
            { name: 'Indiranagar Node', demand: 'High', latency: '5ms', workers: 12 },
          ].map((cluster) => (
            <div 
              key={cluster.name}
              className="bg-surface border border-borderColor hover:border-primary p-4 rounded-2xl flex flex-col gap-2 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-ink group-hover:text-primary transition-colors">{cluster.name}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                  cluster.demand === 'Peak' || cluster.demand === 'High' ? 'bg-semantic-warning/10 text-semantic-warning' : 'bg-semantic-success/10 text-semantic-success'
                }`}>{cluster.demand}</span>
              </div>
              <div className="flex justify-between text-[10px] text-muted font-semibold mt-2">
                <span>Latency: {cluster.latency}</span>
                <span>Active: {cluster.workers}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-borderColor pb-3 text-sm font-bold text-muted">
        <button
          onClick={() => setActiveTab('UPCOMING')}
          className={`pb-3 relative transition-all ${
            activeTab === 'UPCOMING' ? 'text-primary border-b-2 border-primary' : 'hover:text-ink'
          }`}
        >
          {t('upcoming')} ({upcomingBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`pb-3 relative transition-all ${
            activeTab === 'HISTORY' ? 'text-primary border-b-2 border-primary' : 'hover:text-ink'
          }`}
        >
          {t('completed')} & {t('cancelled')} ({pastBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('WISHLIST')}
          className={`pb-3 relative transition-all ${
            activeTab === 'WISHLIST' ? 'text-primary border-b-2 border-primary' : 'hover:text-ink'
          }`}
        >
          Wishlist ({wishlist.length})
        </button>
      </div>

      {/* Main Content Pane */}
      <div className="flex-grow">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="text-primary animate-spin" size={32} />
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Syncing dashboard data...</span>
          </div>
        ) : activeTab === 'UPCOMING' ? (
          upcomingBookings.length === 0 ? (
            <div className="border border-dashed border-borderColor rounded-3xl py-20 text-center flex flex-col items-center gap-4 p-6">
              <span className="text-4xl">📅</span>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-lg text-ink">No Scheduled Bookings</h3>
                <p className="text-xs text-muted max-w-xs font-semibold leading-relaxed">
                  Book a verified plumber, smart setup, or beauty treatment.
                </p>
              </div>
              <Link href="/catalog" className="px-5 py-2.5 bg-primary text-canvas font-bold text-xs rounded-xl shadow-md">
                Browse Offerings
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingBookings.map((b) => (
                <div key={b.id} className="bg-canvas border border-borderColor rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                        b.status === 'CONFIRMED' ? 'bg-semantic-success/15 text-semantic-success' : 'bg-semantic-warning/15 text-semantic-warning'
                      }`}>
                        {b.status}
                      </span>
                      <span className="text-[10px] text-muted font-bold">REF: {b.id}</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <h3 className="font-extrabold text-lg text-ink">
                        {b.service ? (language === 'en' ? b.service.title_en : b.service.title_hi) : 'Premium Service Request'}
                      </h3>
                      <div className="flex flex-col gap-1.5 mt-2 text-xs font-semibold text-muted">
                        <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary" /> {b.scheduled_date}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-primary" /> {b.scheduled_time}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={14} className="text-accent" /> {b.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-borderColor/60 mt-6 pt-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted font-bold uppercase">Estimated cost</span>
                      <span className="text-lg font-black text-ink">₹{b.total_amount}</span>
                    </div>
                    {b.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="flex items-center gap-1 px-4 py-2 border border-semantic-error/30 hover:bg-semantic-error/15 text-semantic-error font-bold text-xs rounded-lg transition-colors"
                      >
                        <Ban size={12} />
                        <span>Cancel Booking</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : activeTab === 'HISTORY' ? (
          pastBookings.length === 0 ? (
            <div className="border border-dashed border-borderColor rounded-3xl py-20 text-center flex flex-col items-center gap-4 p-6">
              <span className="text-4xl">📁</span>
              <h3 className="font-bold text-lg text-ink">No Booking History</h3>
              <p className="text-xs text-muted max-w-xs font-semibold">Any completed or cancelled jobs will display here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastBookings.map((b) => (
                <div key={b.id} className="bg-canvas border border-borderColor rounded-2xl p-6 flex flex-col justify-between opacity-80 hover:opacity-100 transition-all">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                        b.status === 'COMPLETED' ? 'bg-slate-100 text-muted border border-borderColor' : 'bg-semantic-error/10 text-semantic-error'
                      }`}>
                        {b.status}
                      </span>
                      <span className="text-[10px] text-muted font-bold">REF: {b.id}</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <h3 className="font-bold text-base text-ink">
                        {b.service ? (language === 'en' ? b.service.title_en : b.service.title_hi) : 'Home Service Job'}
                      </h3>
                      <div className="flex flex-col gap-1 mt-2 text-xs text-muted font-medium">
                        <span>Date: {b.scheduled_date}</span>
                        <span>Slot: {b.scheduled_time}</span>
                        <span>Address: {b.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-borderColor/60 mt-4 pt-3 text-xs font-bold">
                    <span className="text-muted">Total: ₹{b.total_amount}</span>
                    {b.status === 'COMPLETED' && (
                      <span className="text-semantic-success flex items-center gap-1"><CheckCircle size={14} /> Completed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wishlist.map((srv) => (
              <div key={srv.id} className="bg-canvas border border-borderColor rounded-2xl p-6 flex justify-between items-center shadow-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-primary uppercase">{srv.category}</span>
                  <h3 className="font-extrabold text-base text-ink">{language === 'en' ? srv.title_en : srv.title_hi}</h3>
                  <span className="text-sm font-black text-ink mt-1">₹{srv.price_inr}</span>
                </div>
                <Link
                  href={`/catalog/${srv.id}`}
                  className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-canvas font-bold text-xs rounded-xl transition-all"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
