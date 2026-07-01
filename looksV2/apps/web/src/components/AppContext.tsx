'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '../utils/translations';
import { EXHAUSTIVE_SERVICES } from '../database/exhaustiveServices';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
  avatar: string;
  locality?: string;
  category?: string;
  status?: string;
}

export interface CatalogItem {
  id: string;
  serviceName: string;
  rateINR: number;
  duration: string;
  isAvailable: boolean;
  hindiTranslation: string;
}

export interface Booking {
  id: string;
  customerName: string;
  providerName: string;
  service: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  assignedPartnerId: string;
  computedCostINR: number;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
}

export interface AppNotification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: string;
}

export interface AnalyticsData {
  revenue: number;
  activeJobs: number;
}

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
  user: UserSession | null;
  login: (userData: any) => void;
  logout: () => void;
  toast: Toast | null;
  showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  hideToast: () => void;
  
  // Decoupled state simulator variables
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  partnerCatalog: CatalogItem[];
  updateCatalogItem: (id: string, updated: Partial<CatalogItem>) => void;
  cancelBookingByAdmin: (id: string) => void;
  updatePartnerBidStatus: (id: string, status: 'Confirmed' | 'Cancelled') => void;
  addBooking: (booking: Booking) => void;

  // Global Services Matrix (Stateful Onboarding Appends)
  services: any[];
  setServices: React.Dispatch<React.SetStateAction<any[]>>;
  addProviderWithServices: (provider: any, newServices: any[]) => void;

  // Investor Telemetry & Notification hooks
  notifications: AppNotification[];
  addMockNotification: (msg: string, type?: 'info' | 'success' | 'warning') => void;
  analytics: AnalyticsData;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [user, setUser] = useState<UserSession | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  // Decoupled state variables
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'AG-901',
      customerName: 'Rahul Mishra',
      providerName: 'Mishra Electrical Solutions',
      service: 'Smart Meter Wire Fix',
      status: 'Pending',
      assignedPartnerId: 'prov_lko_02',
      computedCostINR: 350,
      scheduledDate: '2026-07-02',
      scheduledTime: '11:00 AM',
      address: 'Sector C, Aliganj, Lucknow'
    },
    {
      id: 'AG-902',
      customerName: 'Priya GomtiNagar',
      providerName: 'Amit Kumar (Salon Expert)',
      service: 'Premium Bridal Styling',
      status: 'Confirmed',
      assignedPartnerId: 'prov_lko_01',
      computedCostINR: 499,
      scheduledDate: '2026-07-05',
      scheduledTime: '02:30 PM',
      address: 'Patrakarpuram, Gomti Nagar, Lucknow'
    },
    {
      id: 'AG-903',
      customerName: 'Vikram Singh',
      providerName: 'Mishra Electrical Solutions',
      service: 'AC Copper Piping Installation',
      status: 'Confirmed',
      assignedPartnerId: 'prov_lko_02',
      computedCostINR: 800,
      scheduledDate: '2026-07-04',
      scheduledTime: '09:00 AM',
      address: 'Mahanagar near Chowk, Lucknow'
    }
  ]);

  const [partnerCatalog, setPartnerCatalog] = useState<CatalogItem[]>([
    { id: 'srv_cleaning_1', serviceName: 'Deep Cleaning (Per Room)', rateINR: 1499, duration: '2 Hours', isAvailable: true, hindiTranslation: 'कमरे की गहरी सफाई' },
    { id: 'srv_repairs_1', serviceName: 'Electrician Appliance Fix', rateINR: 350, duration: '45 Mins', isAvailable: true, hindiTranslation: 'बिजली उपकरण मरम्मत' },
    { id: 'srv_beauty_1', serviceName: 'Premium Salon at Home', rateINR: 1200, duration: '90 Mins', isAvailable: true, hindiTranslation: 'महिलाओं के लिए सैलून एट होम' },
    { id: 'srv_labour_1', serviceName: 'Daily Labor Pool Fix', rateINR: 600, duration: '8 Hours', isAvailable: true, hindiTranslation: 'दैनिक मजदूर पूल' }
  ]);

  // Global stateful services list (For onboarding funnels appends)
  const [services, setServices] = useState<any[]>([]);

  // Notifications Queue
  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: 'n1', message: 'Welcome to Lakhnavi Sewa Hub Network!', type: 'info', timestamp: 'Just Now' }
  ]);

  // Analytics fluctuating matrix
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    revenue: 48250,
    activeJobs: 14
  });

  const addMockNotification = (msg: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const newNotif = {
      id: Math.random().toString(),
      message: msg,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 4)]);
  };

  // Real-time Traffic Simulator Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(prev => ({
        revenue: prev.revenue + Math.floor(Math.random() * 400) + 50,
        activeJobs: Math.max(5, prev.activeJobs + (Math.random() > 0.55 ? 1 : -1))
      }));
      
      if (Math.random() > 0.75) {
        const hubs = ["Gomti Nagar", "Hazratganj", "Aliganj", "Indiranagar", "Chowk"];
        const randomHub = hubs[Math.floor(Math.random() * hubs.length)];
        addMockNotification(`New service booking registered in ${randomHub} cluster!`, 'success');
      }
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as Language;
    if (savedLang) {
      setLanguageState(savedLang);
    }
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    const savedBookings = localStorage.getItem('mock_app_bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
    
    // Load custom services or exhaustive matrix
    const savedServices = localStorage.getItem('mock_app_services');
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    } else {
      setServices(EXHAUSTIVE_SERVICES);
    }

    const savedCatalog = localStorage.getItem('mock_app_catalog');
    if (savedCatalog) {
      setPartnerCatalog(JSON.parse(savedCatalog));
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lang', lang);
  };

  const login = (userData: any) => {
    const sessionUser: UserSession = {
      id: userData.id || 'usr_afzal',
      name: userData.name || 'Afzal Ehsan',
      email: userData.email || 'afzal@afzalehsan.com',
      phone: userData.phone || '9876543210',
      role: userData.role || 'CUSTOMER',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${userData.name || 'afzal'}`,
      locality: userData.locality || 'Hazratganj',
      category: userData.category || 'Beauty & Grooming',
      status: userData.status || 'APPROVED'
    };
    setUser(sessionUser);
    localStorage.setItem('user', JSON.stringify(sessionUser));
    addMockNotification(`Session opened: secure handshake completed for ${sessionUser.name}`, 'info');
  };

  const logout = () => {
    addMockNotification(`Session closed for ${user?.name || 'user'}`, 'warning');
    setUser(null);
    localStorage.removeItem('user');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const updateCatalogItem = (id: string, updated: Partial<CatalogItem>) => {
    const newCatalog = partnerCatalog.map((item) => item.id === id ? { ...item, ...updated } : item);
    setPartnerCatalog(newCatalog);
    localStorage.setItem('mock_app_catalog', JSON.stringify(newCatalog));
    showToast(`Catalog updated successfully!`);
    addMockNotification(`Catalog item ${id} was modified by partner.`, 'info');
  };

  const cancelBookingByAdmin = (id: string) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem('mock_app_bookings', JSON.stringify(updated));
    showToast(`Booking ${id} revoked by administrator`, 'info');
    addMockNotification(`Booking ${id} administratively revoked!`, 'warning');
  };

  const updatePartnerBidStatus = (id: string, status: 'Confirmed' | 'Cancelled') => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: status } : b));
    setBookings(updated);
    localStorage.setItem('mock_app_bookings', JSON.stringify(updated));
    showToast(`Job status updated to ${status}`);
    addMockNotification(`Job request ${id} updated to ${status}.`, 'info');
  };

  const addBooking = (newBk: Booking) => {
    const updated = [newBk, ...bookings];
    setBookings(updated);
    localStorage.setItem('mock_app_bookings', JSON.stringify(updated));
    addMockNotification(`New booking ${newBk.id} placed successfully!`, 'success');
  };

  const addProviderWithServices = (provider: any, newServices: any[]) => {
    // Append new services to services state
    const updatedServices = [...newServices, ...services];
    setServices(updatedServices);
    localStorage.setItem('mock_app_services', JSON.stringify(updatedServices));

    // Append to partnerCatalog for dashboard overrides
    const newCatalogEntries = newServices.map(s => ({
      id: s.id,
      serviceName: s.title_en,
      rateINR: s.price_inr,
      duration: `${s.duration_mins} Mins`,
      isAvailable: true,
      hindiTranslation: s.title_hi
    }));
    const updatedCatalog = [...newCatalogEntries, ...partnerCatalog];
    setPartnerCatalog(updatedCatalog);
    localStorage.setItem('mock_app_catalog', JSON.stringify(updatedCatalog));

    // Save newly onboarded provider session locally
    login(provider);

    showToast('Onboarded successfully!');
    addMockNotification(`New provider ${provider.name} registered and catalog items synced!`, 'success');
  };

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations['en'][key] || String(key);
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      t,
      user,
      login,
      logout,
      toast,
      showToast,
      hideToast,
      bookings,
      setBookings,
      partnerCatalog,
      updateCatalogItem,
      cancelBookingByAdmin,
      updatePartnerBidStatus,
      addBooking,
      services,
      setServices,
      addProviderWithServices,
      notifications,
      addMockNotification,
      analytics
    }}>
      {children}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-ink text-canvas border border-borderColor p-4 rounded-xl shadow-2xl animate-bounce">
          <div className={`w-3 h-3 rounded-full ${
            toast.type === 'success' ? 'bg-semantic-success' :
            toast.type === 'error' ? 'bg-semantic-error' :
            toast.type === 'warning' ? 'bg-semantic-warning' : 'bg-semantic-info'
          }`} />
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={hideToast} className="ml-2 text-muted hover:text-canvas transition-colors text-xs font-bold">✕</button>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
