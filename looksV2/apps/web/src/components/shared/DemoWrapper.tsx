'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '../AppContext';
import PersonaSwitcher from './PersonaSwitcher';

export const DemoWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, login, showToast } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  const [currentPersona, setCurrentPersona] = useState<'customer' | 'provider' | 'admin'>('customer');
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsOnline(window.navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      showToast('Connection re-established! Syncing offline database...', 'success');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('Connection lost. Operating in offline resilient mode.', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  // Track the active user role to update switcher state
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') setCurrentPersona('admin');
      else if (user.role === 'PROVIDER') setCurrentPersona('provider');
      else setCurrentPersona('customer');
    }
  }, [user]);

  const handlePersonaChange = (persona: 'customer' | 'provider' | 'admin') => {
    setCurrentPersona(persona);
    localStorage.setItem('admin_auth', persona === 'admin' ? 'true' : 'false');
    
    if (persona === 'customer') {
      const mockCustomer = {
        id: 'usr_customer_1',
        name: 'Arjun Mishra',
        phone: '9876543210',
        role: 'CUSTOMER',
        locality: 'Gomti Nagar',
        status: 'APPROVED'
      };
      login(mockCustomer);
      showToast('Bypassed to Customer perspective / ग्राहक दृष्टिकोण');
      router.push('/dashboard/customer');
    } else if (persona === 'provider') {
      const mockProvider = {
        id: 'prov_lko_02',
        name: 'Mishra Electrical Solutions',
        phone: '9876543211',
        role: 'PROVIDER',
        category: 'Home Repairs & Maintenance',
        locality: 'Aliganj',
        status: 'APPROVED'
      };
      login(mockProvider);
      showToast('Bypassed to Provider perspective / प्रदाता दृष्टिकोण');
      router.push('/dashboard/provider');
    } else if (persona === 'admin') {
      const mockAdmin = {
        id: 'admin_root',
        name: 'Platform Admin',
        role: 'ADMIN',
        status: 'APPROVED'
      };
      login(mockAdmin);
      showToast('Bypassed to Admin Control Desk / व्यवस्थापक दृष्टिकोण');
      router.push('/dashboard/admin');
    }
  };

  return (
    <>
      {!isOnline && (
        <div className="bg-semantic-warning text-white text-[10px] font-black uppercase tracking-widest text-center py-2.5 px-4 sticky top-0 z-[100] flex items-center justify-center gap-2 shadow-md animate-in slide-in-from-top duration-200">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>Offline resilience mode active / ऑफ़लाइन मोड सक्रिय</span>
        </div>
      )}
      {children}
      <PersonaSwitcher currentPersona={currentPersona} onPersonaChange={handlePersonaChange} />
    </>
  );
};
export default DemoWrapper;
