export interface ServiceProvider {
  id: string;
  name: string;
  avatarUrl: string;
  category: 'Beauty' | 'Repairs' | 'Cleaning' | 'Smart Products' | 'Labours' | 'Contractors';
  rating: number;
  basePriceINR: number;
  sectorLucknow: string;
  verifiedStatus: boolean;
}

export interface TaskBooking {
  id: string;
  customerId: string;
  providerId: string;
  serviceTitle: string;
  scheduledTimestamp: string;
  computedCostINR: number;
  currentStatus: 'PENDING_OTP' | 'CONFIRMED' | 'DISPATCHED' | 'COMPLETED';
}

export const LUCKNOW_PROVIDERS_SEED: ServiceProvider[] = [
  {
    id: 'prov_lko_01',
    name: 'Amit Kumar (Salon Expert)',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    category: 'Beauty',
    rating: 4.8,
    basePriceINR: 499,
    sectorLucknow: 'Gomti Nagar',
    verifiedStatus: true
  },
  {
    id: 'prov_lko_02',
    name: 'Mishra Electrical Solutions',
    avatarUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=200',
    category: 'Repairs',
    rating: 4.6,
    basePriceINR: 350,
    sectorLucknow: 'Aliganj',
    verifiedStatus: true
  },
  {
    id: 'prov_lko_03',
    name: 'Hazratganj Smart Security Systems',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
    category: 'Smart Products',
    rating: 4.9,
    basePriceINR: 1200,
    sectorLucknow: 'Hazratganj',
    verifiedStatus: true
  },
  {
    id: 'prov_lko_04',
    name: 'Ramesh Singh (Civil Contractor)',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    category: 'Contractors',
    rating: 4.7,
    basePriceINR: 2500,
    sectorLucknow: 'Indira Nagar',
    verifiedStatus: true
  },
  {
    id: 'prov_lko_05',
    name: 'Awadh Labour Pool Group',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    category: 'Labours',
    rating: 4.5,
    basePriceINR: 550,
    sectorLucknow: 'Chowk',
    verifiedStatus: true
  }
];

export const INITIAL_BOOKINGS_SEED: TaskBooking[] = [
  {
    id: 'bk_lko_882',
    customerId: 'cust_demo_active',
    providerId: 'prov_lko_03',
    serviceTitle: 'IoT Home Camera Alignment & Setup',
    scheduledTimestamp: '2026-07-02T11:00:00Z',
    computedCostINR: 1200,
    currentStatus: 'CONFIRMED'
  },
  {
    id: 'bk_lko_883',
    customerId: 'cust_demo_active',
    providerId: 'prov_lko_01',
    serviceTitle: 'Premium Haircut & Grooming Package',
    scheduledTimestamp: '2026-07-05T14:30:00Z',
    computedCostINR: 499,
    currentStatus: 'PENDING_OTP'
  }
];

export const PLATFORM_AUDIT_LOGS_SEED = [
  { timestamp: '2026-07-01T09:12:04Z', action: 'PERSONA_SWITCH', details: 'Bypassed authentication to Customer perspective' },
  { timestamp: '2026-07-01T09:15:32Z', action: 'MOCK_PAYMENT', details: 'Processed dummy transactional payment string for ₹1,200' },
  { timestamp: '2026-07-01T09:22:11Z', action: 'RADAR_SCAN', details: 'Executed regional geo-pulse discovery over Sector: Aliganj' },
  { timestamp: '2026-07-01T09:30:00Z', action: 'BID_SUBMISSION', details: 'Injected proposal row: Aminabad Labour Union Agent into matching pool' }
];
