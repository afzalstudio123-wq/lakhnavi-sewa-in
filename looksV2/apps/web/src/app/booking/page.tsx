'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/components/AppContext';
import { Calendar, Clock, MapPin, CreditCard, Sparkles, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import PaymentOverlay from '@/components/ui/PaymentOverlay';
import UnifiedAuthModal from '@/components/auth/UnifiedAuthModal';
import InvoiceModal from '@/components/ui/InvoiceModal';

const LOCALITIES = ["Gomti Nagar", "Hazratganj", "Aliganj", "Indiranagar", "Chowk", "Aminabad"];
const TIME_SLOTS = ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"];

function BookingContent() {
  const { t, user, showToast, language, partnerCatalog, services } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [service, setService] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Date & Time, 2: Address, 3: Login/OTP (if not logged in) or Checkout, 4: Success
  const [showPayment, setShowPayment] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const catalogItem = partnerCatalog.find((item) => item.id === service?.id);
  const currentPrice = catalogItem ? catalogItem.rateINR : (service ? service.price_inr : 0);

  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [mockRef, setMockRef] = useState('');

  useEffect(() => {
    if (step === 4 && !mockRef) {
      setMockRef(`REF_${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }, [step, mockRef]);

  // Form State
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [locality, setLocality] = useState(LOCALITIES[0]);
  const [address, setAddress] = useState('');
  const [payMethod, setPayMethod] = useState<'COD' | 'CARD'>('COD');

  // Inline Login state (if user is guest)
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [otpStep, setOtpStep] = useState<1 | 2>(1);
  const [authLoading, setAuthLoading] = useState(false);

  // Fetch Service Details
  useEffect(() => {
    const serviceId = searchParams.get('service_id');
    if (!serviceId) {
      showToast('No service selected for booking', 'error');
      router.push('/catalog');
      return;
    }

    const fetchService = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/services/${serviceId}`);
        if (res.ok) {
          const data = await res.json();
          setService(data);
        } else {
          throw new Error('Not found');
        }
      } catch (err) {
        // Find in stateful global services array (case-insensitive)
        const s = services.find(item => item.id.toLowerCase() === serviceId.toLowerCase());
        if (s) {
          setService(s);
        } else {
          // Fallback static
          const staticServices = [
            { id: "srv_beauty_1", category: "Beauty & Grooming", title_en: "Premium Salon at Home for Women", price_inr: 1200, locality: "Gomti Nagar", provider_id: "prov_1" },
            { id: "srv_repair_1", category: "Home Repairs & Maintenance", title_en: "Emergency Plumbing Diagnostics & Repair", price_inr: 490, locality: "Hazratganj", provider_id: "prov_2" },
            { id: "srv_cleaning_1", category: "Cleaning & Pest Control", title_en: "Deep Home Sanitization & Cleaning", price_inr: 1800, locality: "Aliganj", provider_id: "prov_3" },
            { id: "srv_smart_1", category: "Native Smart Products", title_en: "Smart IoT Hub & Camera Setup", price_inr: 1500, locality: "Indiranagar", provider_id: "prov_4" },
            { id: "srv_labour_1", category: "Indian Labours", title_en: "Skilled Daily Wage Mason / Helper", price_inr: 800, locality: "Chowk", provider_id: "prov_5" },
            { id: "srv_contractor_1", category: "Contractors & Builders", title_en: "Premium Home Renovation Consultation", price_inr: 2500, locality: "Hazratganj", provider_id: "prov_6" }
          ];
          const backup = staticServices.find(item => item.id.toLowerCase() === serviceId.toLowerCase());
          if (backup) {
            setService(backup);
          } else {
            showToast('Service details failed to load', 'error');
            router.push('/catalog');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [searchParams, services]);

  // Set default dates
  useEffect(() => {
    // Generate tomorrow's date by default (YYYY-MM-DD)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
    setSelectedTime(TIME_SLOTS[0]);
  }, []);

  // Auto-open auth modal if we hit step 3
  useEffect(() => {
    if (step === 3 && !user) {
      setIsAuthModalOpen(true);
    }
  }, [step, user]);

  const handleNextStep = () => {
    if (step === 1) {
      if (!selectedDate || !selectedTime) {
        showToast('Please select date and slot time', 'error');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (address.trim().length < 10) {
        showToast('Please enter a detailed address (min 10 characters)', 'error');
        return;
      }
      if (!user) {
        setIsAuthModalOpen(true);
        setStep(3); // Route to authentication step
      } else {
        setShowPayment(true);
      }
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      showToast('Please enter 10-digit number', 'error');
      return;
    }
    setAuthLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, role: 'CUSTOMER' })
      });
      const data = await res.json();
      if (res.ok) {
        setSimulatedOtp(data.otp);
        showToast('Simulated OTP code generated!', 'info');
        setOtpStep(2);
      }
    } catch (err) {
      setSimulatedOtp('1234');
      setOtpStep(2);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== simulatedOtp && otp !== '1234') {
      showToast('Invalid OTP. Check the helper display.', 'error');
      return;
    }
    setAuthLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, role: 'CUSTOMER', otp })
      });
      const data = await res.json();
      if (res.ok) {
        // Save session locally
        localStorage.setItem('user', JSON.stringify(data.user));
        showToast('Logged in successfully!');
        // Reload page to context or directly proceed
        window.location.reload();
      }
    } catch (err) {
      const mockUser = { id: 'usr_customer_1', name: 'Arjun Mishra', phone, role: 'CUSTOMER', locality: 'Hazratganj' };
      localStorage.setItem('user', JSON.stringify(mockUser));
      showToast('Offline Mode: Logged in successfully!');
      window.location.reload();
    } finally {
      setAuthLoading(false);
    }
  };

  const submitBooking = async () => {
    setLoading(true);
    const postBody = {
      customer_id: user?.id || 'usr_customer_1',
      provider_id: service.provider_id || 'prov_1',
      service_id: service.id,
      scheduled_date: selectedDate,
      scheduled_time: selectedTime,
      address: `${address}, ${locality}, Lucknow`,
      total_amount: currentPrice
    };

    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postBody)
      });
      if (res.ok) {
        showToast(t('bookingSuccess'));
        setStep(4);
      } else {
        throw new Error('Server reject');
      }
    } catch (err) {
      // Offline fallback: save to localStorage mock bookings array so customer dashboard can load it!
      const currentBookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
      const newBooking = {
        id: `bk_${Math.floor(100 + Math.random() * 900)}`,
        ...postBody,
        status: 'PENDING',
        created_at: new Date().toISOString(),
        service: service
      };
      currentBookings.push(newBooking);
      localStorage.setItem('mock_bookings', JSON.stringify(currentBookings));
      
      showToast('Standalone mode: Booking saved in offline browser cache!');
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  if (loading && step !== 4) {
    return (
      <div className="flex flex-col items-center justify-center py-48 gap-3">
        <Loader2 className="text-primary animate-spin" size={36} />
        <span className="text-sm font-bold text-muted uppercase tracking-wider">Verifying Booking Parameters...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-10">
      {/* Wizard Steps indicator */}
      {step < 4 && (
        <div className="flex justify-between items-center text-xs font-bold text-muted uppercase border-b border-borderColor pb-6">
          <span className={step >= 1 ? 'text-primary' : ''}>1. Schedule</span>
          <span>&mdash;</span>
          <span className={step >= 2 ? 'text-primary' : ''}>2. Location</span>
          <span>&mdash;</span>
          <span className={step >= 3 ? 'text-primary' : ''}>3. Checkout</span>
        </div>
      )}

      {/* Step 1: Schedule Selection */}
      {step === 1 && (
        <div className="flex flex-col gap-6 bg-canvas border border-borderColor rounded-3xl p-8 shadow-md">
          <h2 className="text-xl font-extrabold text-ink flex items-center gap-2"><Calendar size={20} className="text-primary" /> Select Preferred Slot</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-muted uppercase">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="bg-surface border border-borderColor rounded-xl p-3.5 outline-none font-semibold text-sm text-ink focus:border-primary transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-muted uppercase">Select Time Slot</label>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-3 px-2 border rounded-xl font-bold text-xs transition-colors ${
                      selectedTime === slot ? 'bg-primary text-canvas border-primary' : 'bg-surface hover:bg-surface2 border-borderColor text-ink'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleNextStep}
            className="w-full bg-primary hover:bg-primary-hover text-canvas font-bold py-3.5 rounded-xl transition-all shadow-md mt-6"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Location Selection */}
      {step === 2 && (
        <div className="flex flex-col gap-6 bg-canvas border border-borderColor rounded-3xl p-8 shadow-md">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-ink flex items-center gap-2"><MapPin size={20} className="text-accent" /> Service Delivery Address</h2>
            <button onClick={() => setStep(1)} className="text-xs font-bold text-muted flex items-center gap-1"><ArrowLeft size={14} /> Back</button>
          </div>

          <div className="grid grid-cols-1 gap-6 mt-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-muted uppercase">Lucknow Locality Hub</label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="bg-surface border border-borderColor rounded-xl p-3.5 outline-none font-bold text-sm text-ink focus:border-primary"
              >
                {LOCALITIES.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-muted uppercase">Full Home Address</label>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat/House No, Building Name, Landmark near Hazratganj/Gomti Nagar..."
                className="bg-surface border border-borderColor rounded-xl p-3.5 outline-none font-semibold text-sm text-ink focus:border-primary transition-all resize-none"
              />
            </div>
          </div>

          <button
            onClick={handleNextStep}
            className="w-full bg-primary hover:bg-primary-hover text-canvas font-bold py-3.5 rounded-xl transition-all shadow-md mt-6"
          >
            {user ? 'Proceed to Confirmation' : 'Verify Mobile Credentials'}
          </button>
        </div>
      )}

      {/* Step 3: Auth Integration within flow (only if not logged in) */}
      {step === 3 && !user && (
        <div className="flex flex-col gap-6 bg-canvas border border-borderColor rounded-3xl p-8 shadow-md max-w-md mx-auto w-full text-center py-12">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
          <h3 className="font-extrabold text-lg text-ink">Authentication Required</h3>
          <p className="text-xs text-muted font-semibold">Please authenticate through our secure entry terminal to confirm your booking.</p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="mt-4 px-6 py-3 bg-primary hover:bg-primary-hover text-canvas font-bold rounded-xl text-sm transition-colors uppercase tracking-wider"
          >
            Open Secure Terminal
          </button>
          <UnifiedAuthModal
            isOpen={isAuthModalOpen}
            onClose={() => {
              setIsAuthModalOpen(false);
              setStep(2);
            }}
            onAuthSuccess={() => {
              setIsAuthModalOpen(false);
              setStep(2);
              setShowPayment(true);
            }}
          />
        </div>
      )}

      {/* Step 4: Success Screen */}
      {step === 4 && (
        <div className="flex flex-col items-center text-center gap-6 py-12 max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-semantic-success/10 flex items-center justify-center text-semantic-success animate-bounce">
            <CheckCircle2 size={48} />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-black text-ink">Booking Placed!</h2>
            <p className="text-sm text-muted font-semibold leading-relaxed">
              Your service request is matching with local providers. Status updates will display in your user panel.
            </p>
          </div>

          <div className="w-full bg-surface border border-borderColor rounded-2xl p-5 flex flex-col gap-3 text-xs font-bold text-left text-ink">
            <div className="flex justify-between border-b border-borderColor/60 pb-2.5">
              <span className="text-muted">Booking Reference</span>
              <span>{mockRef}</span>
            </div>
            <div className="flex justify-between border-b border-borderColor/60 pb-2.5">
              <span className="text-muted">Schedule Date</span>
              <span>{selectedDate}</span>
            </div>
            <div className="flex justify-between border-b border-borderColor/60 pb-2.5">
              <span className="text-muted">Slot Time</span>
              <span>{selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Service Location</span>
              <span>{locality}, Lucknow</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
            <button
              onClick={() => setIsInvoiceOpen(true)}
              className="flex-grow py-3 text-center bg-accent hover:bg-accent/90 text-canvas font-bold rounded-xl text-sm transition-all shadow-md shadow-accent/15 uppercase tracking-wider"
            >
              Receipt / Invoice
            </button>
            <Link
              href="/catalog"
              className="flex-1 py-3 text-center border border-borderColor font-bold hover:bg-surface rounded-xl text-sm transition-all text-ink uppercase tracking-wider"
            >
              Book Another
            </Link>
            <Link
              href="/dashboard/customer"
              className="flex-1 py-3 text-center bg-primary hover:bg-primary-hover text-canvas font-bold rounded-xl text-sm transition-all shadow-md shadow-primary/10 uppercase tracking-wider"
            >
              My Dashboard
            </Link>
          </div>
        </div>
      )}

      {showPayment && (
        <PaymentOverlay
          amount={currentPrice || 500}
          onSuccess={() => {
            setShowPayment(false);
            submitBooking();
          }}
          onCancel={() => {
            setShowPayment(false);
            showToast('Payment cancelled by user', 'warning');
          }}
        />
      )}

      {isInvoiceOpen && (
        <InvoiceModal
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          data={{
            serviceName: language === 'en' ? service?.title_en : service?.title_hi,
            cost: currentPrice,
            customer: user?.name || 'Afzal Ehsan',
            bookingRef: mockRef || 'REF_9026',
            date: selectedDate,
            time: selectedTime,
            address: `${address}, ${locality}, Lucknow`
          }}
        />
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading Booking Wizard...</div>}>
      <BookingContent />
    </Suspense>
  );
}
