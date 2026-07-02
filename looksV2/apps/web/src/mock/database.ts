export interface Testimonial {
  id: string;
  authorName: string;
  role: 'CUSTOMER' | 'PROVIDER';
  rating: number;
  reviewText: string;
  authorAvatar: string;
  isVerified: boolean;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  timestamp: string;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'WITHDRAWAL' | 'JOB_PAYOUT' | 'TIP';
  status: 'Pending' | 'Approved' | 'Rejected';
  upiId?: string;
  timestamp: string;
}

export interface RewardPointsHistory {
  id: string;
  type: 'FUEL_BONUS' | 'RECHARGE_BONUS' | 'REFERRAL_BONUS';
  points: number;
  label: string;
  date: string;
}

export interface TrainingModule {
  id: string;
  title_en: string;
  title_hi: string;
  status: 'LOCKED' | 'UNLOCKED' | 'COMPLETED';
  progressPercent: number;
}

// Initial Seeds
const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test_01',
    authorName: 'Arjun Mishra',
    role: 'CUSTOMER',
    rating: 5,
    reviewText: 'Outstanding service! Mishra Electrical solutions repaired my AC conduit quickly. Vetted professionals are a blessing in Gomti Nagar.',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=arjun',
    isVerified: true,
    status: 'APPROVED',
    timestamp: '2 hours ago'
  },
  {
    id: 'test_02',
    authorName: 'Amit Kumar',
    role: 'PROVIDER',
    rating: 4.8,
    reviewText: 'LakhnaviSewa matches me with premium direct customer gigs. Platform fee details are clear and payouts clear to GPay instantly!',
    authorAvatar: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=200',
    isVerified: true,
    status: 'APPROVED',
    timestamp: 'Yesterday'
  },
  {
    id: 'test_03',
    authorName: 'Neha Srivastava',
    role: 'CUSTOMER',
    rating: 5,
    reviewText: 'Salon at home is safe, verified, and extremely professional. The Awadhi translation switcher helps my parents schedule bookings too!',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=neha',
    isVerified: true,
    status: 'APPROVED',
    timestamp: '3 days ago'
  }
];

const DEFAULT_REWARDS: RewardPointsHistory[] = [
  { id: 'rew_01', type: 'REFERRAL_BONUS', points: 300, label: 'Referred Rahul Gomti Nagar', date: '2026-06-28' },
  { id: 'rew_02', type: 'FUEL_BONUS', points: 200, label: 'Hazratganj Peak Hours Fuel Bonus', date: '2026-07-01' }
];

const DEFAULT_TRAINING: TrainingModule[] = [
  { id: 'train_01', title_en: 'Customer Etiquette & Behavior standards', title_hi: 'ग्राहक शिष्टाचार और व्यवहार मानक', status: 'COMPLETED', progressPercent: 100 },
  { id: 'train_02', title_en: 'Smart Tools & Equipment Diagnostic Protocols', title_hi: 'स्मार्ट उपकरण और नैदानिक प्रोटोकॉल', status: 'UNLOCKED', progressPercent: 30 },
  { id: 'train_03', title_en: 'Safety procedures, SOS activation & Emergency guidelines', title_hi: 'सुरक्षा प्रक्रियाएं और आपातकालीन दिशानिर्देश', status: 'LOCKED', progressPercent: 0 }
];

export const initializeMockDatabase = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem('mock_testimonials')) {
    localStorage.setItem('mock_testimonials', JSON.stringify(DEFAULT_TESTIMONIALS));
  }
  if (!localStorage.getItem('mock_wallet_transactions')) {
    localStorage.setItem('mock_wallet_transactions', JSON.stringify([]));
  }
  if (!localStorage.getItem('mock_reward_points_history')) {
    localStorage.setItem('mock_reward_points_history', JSON.stringify(DEFAULT_REWARDS));
  }
  if (!localStorage.getItem('mock_training_modules')) {
    localStorage.setItem('mock_training_modules', JSON.stringify(DEFAULT_TRAINING));
  }
  if (!localStorage.getItem('mock_provider_wallet_balance')) {
    localStorage.setItem('mock_provider_wallet_balance', JSON.stringify({ available: 1850, pending: 450 }));
  }
  if (!localStorage.getItem('mock_reward_points_total')) {
    localStorage.setItem('mock_reward_points_total', JSON.stringify(500)); // 500 points = ₹50
  }
};
