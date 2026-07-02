import { initializeMockDatabase, Testimonial, WalletTransaction, RewardPointsHistory, TrainingModule } from '../mock/database';

// Initialize on load
if (typeof window !== 'undefined') {
  initializeMockDatabase();
}

export const mockServices = {
  // Testimonials Hub Service
  getTestimonials: (): Testimonial[] => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('mock_testimonials') || '[]');
  },

  submitTestimonial: (t: Partial<Testimonial>): Testimonial => {
    const list = mockServices.getTestimonials();
    const newTest: Testimonial = {
      id: `test_${Date.now()}`,
      authorName: t.authorName || 'Anonymous',
      role: t.role || 'CUSTOMER',
      rating: t.rating || 5,
      reviewText: t.reviewText || '',
      authorAvatar: t.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${t.authorName}`,
      isVerified: true,
      status: 'PENDING', // Default to pending for admin moderation
      timestamp: 'Just now'
    };
    list.unshift(newTest);
    localStorage.setItem('mock_testimonials', JSON.stringify(list));
    return newTest;
  },

  updateTestimonialStatus: (id: string, status: 'APPROVED' | 'REJECTED'): void => {
    const list = mockServices.getTestimonials();
    const idx = list.findIndex(t => t.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      localStorage.setItem('mock_testimonials', JSON.stringify(list));
    }
  },

  // Wallet Service
  getWalletBalance: () => {
    if (typeof window === 'undefined') return { available: 0, pending: 0 };
    return JSON.parse(localStorage.getItem('mock_provider_wallet_balance') || '{"available": 0, "pending": 0}');
  },

  getWalletTransactions: (): WalletTransaction[] => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('mock_wallet_transactions') || '[]');
  },

  requestUPIWithdrawal: (amount: number, upiId: string) => {
    const balance = mockServices.getWalletBalance();
    if (amount > balance.available) {
      throw new Error('Insufficient available balance');
    }

    // platform fee: flat ₹49 + 5% system fee
    const flatFee = 49;
    const systemFee = amount * 0.05;
    const totalDeductions = flatFee + systemFee;
    const netPayout = amount - totalDeductions;

    if (netPayout <= 0) {
      throw new Error('Requested amount is too low to cover platform fees.');
    }

    // Deduct
    const updatedBalance = {
      ...balance,
      available: balance.available - amount
    };
    localStorage.setItem('mock_provider_wallet_balance', JSON.stringify(updatedBalance));

    // Save transaction
    const txs = mockServices.getWalletTransactions();
    const newTx: WalletTransaction = {
      id: `TX_${Math.floor(1000 + Math.random() * 9000)}`,
      amount: amount,
      type: 'WITHDRAWAL',
      status: 'Pending',
      upiId: upiId,
      timestamp: new Date().toLocaleString()
    };
    txs.unshift(newTx);
    localStorage.setItem('mock_wallet_transactions', JSON.stringify(txs));

    // Simulate auto-approval after 5 seconds
    setTimeout(() => {
      const liveTxs = mockServices.getWalletTransactions();
      const matchIdx = liveTxs.findIndex(t => t.id === newTx.id);
      if (matchIdx !== -1) {
        liveTxs[matchIdx].status = 'Approved';
        localStorage.setItem('mock_wallet_transactions', JSON.stringify(liveTxs));
        // Global notify if context binds
      }
    }, 5000);

    return { transaction: newTx, netPayout, deductions: totalDeductions };
  },

  addMockJobPayout: (amount: number) => {
    const balance = mockServices.getWalletBalance();
    const updated = {
      ...balance,
      available: balance.available + amount
    };
    localStorage.setItem('mock_provider_wallet_balance', JSON.stringify(updated));

    const txs = mockServices.getWalletTransactions();
    const newTx: WalletTransaction = {
      id: `TX_${Math.floor(1000 + Math.random() * 9000)}`,
      amount: amount,
      type: 'JOB_PAYOUT',
      status: 'Approved',
      timestamp: new Date().toLocaleString()
    };
    txs.unshift(newTx);
    localStorage.setItem('mock_wallet_transactions', JSON.stringify(txs));
  },

  addMockTip: (amount: number) => {
    const balance = mockServices.getWalletBalance();
    const updated = {
      ...balance,
      available: balance.available + amount
    };
    localStorage.setItem('mock_provider_wallet_balance', JSON.stringify(updated));

    const txs = mockServices.getWalletTransactions();
    const newTx: WalletTransaction = {
      id: `TX_${Math.floor(1000 + Math.random() * 9000)}`,
      amount: amount,
      type: 'TIP',
      status: 'Approved',
      timestamp: new Date().toLocaleString()
    };
    txs.unshift(newTx);
    localStorage.setItem('mock_wallet_transactions', JSON.stringify(txs));
  },

  // Reward Points Service
  getRewardPointsTotal: (): number => {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem('mock_reward_points_total') || '0', 10);
  },

  getRewardPointsHistory: (): RewardPointsHistory[] => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('mock_reward_points_history') || '[]');
  },

  convertPointsToCash: (): { cashConverted: number; pointsDeducted: number } => {
    const points = mockServices.getRewardPointsTotal();
    if (points < 500) {
      throw new Error('Minimum 500 points required to convert.');
    }

    const groups = Math.floor(points / 500);
    const pointsDeducted = groups * 500;
    const cashConverted = groups * 50; // 500 points = ₹50

    // Deduct points
    const remainingPoints = points - pointsDeducted;
    localStorage.setItem('mock_reward_points_total', remainingPoints.toString());

    // Add to wallet available balance
    const balance = mockServices.getWalletBalance();
    const updatedBalance = {
      ...balance,
      available: balance.available + cashConverted
    };
    localStorage.setItem('mock_provider_wallet_balance', JSON.stringify(updatedBalance));

    // Add transaction logs
    const txs = mockServices.getWalletTransactions();
    const newTx: WalletTransaction = {
      id: `TX_PTS_${Math.floor(1000 + Math.random() * 9000)}`,
      amount: cashConverted,
      type: 'JOB_PAYOUT', // Converted reward points function as direct cash payout
      status: 'Approved',
      timestamp: new Date().toLocaleString()
    };
    txs.unshift(newTx);
    localStorage.setItem('mock_wallet_transactions', JSON.stringify(txs));

    return { cashConverted, pointsDeducted };
  },

  // Training Portal Service
  getTrainingModules: (): TrainingModule[] => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('mock_training_modules') || '[]');
  },

  completeTrainingProgress: (id: string): void => {
    const list = mockServices.getTrainingModules();
    const idx = list.findIndex(m => m.id === id);
    if (idx !== -1) {
      list[idx].status = 'COMPLETED';
      list[idx].progressPercent = 100;

      // Unlock the next module in sequence if it was locked
      if (idx + 1 < list.length && list[idx + 1].status === 'LOCKED') {
        list[idx + 1].status = 'UNLOCKED';
        list[idx + 1].progressPercent = 0;
      }
      
      localStorage.setItem('mock_training_modules', JSON.stringify(list));

      // Award 200 points for lesson completion
      const points = mockServices.getRewardPointsTotal();
      localStorage.setItem('mock_reward_points_total', (points + 200).toString());

      // Add to reward history logs
      const rewHist = mockServices.getRewardPointsHistory();
      rewHist.unshift({
        id: `rew_${Date.now()}`,
        type: 'FUEL_BONUS',
        points: 200,
        label: `Completed Course: ${list[idx].title_en}`,
        date: new Date().toISOString().split('T')[0]
      });
      localStorage.setItem('mock_reward_points_history', JSON.stringify(rewHist));
    }
  }
};
