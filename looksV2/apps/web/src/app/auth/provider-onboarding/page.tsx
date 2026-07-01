'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, KeyRound, User, Award, Tag, Camera, FileText, IndianRupee, 
  Check, ArrowLeft, ArrowRight, Sparkles, Activity, ShieldCheck, 
  Wallet, ArrowUpRight, ShieldAlert, Wifi, WifiOff 
} from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  "Beauty & Grooming",
  "Home Repairs & Maintenance",
  "Cleaning & Pest Control",
  "Native Smart Products",
  "Indian Labours",
  "Contractors & Builders"
];

// 5 Mock Services for each category to dynamically inject into the global catalog
const CATEGORY_SERVICES_MATRIX: Record<string, any[]> = {
  "Beauty & Grooming": [
    { name_en: "Salon at Home (Men/Women)", name_hi: "सैलून एट होम (पुरुष/महिला)", price: 499, duration: 120 },
    { name_en: "Bridal Makeup & Festive Styling", name_hi: "दुल्हन का मेकअप और उत्सव स्टाइलिंग", price: 4999, duration: 480 },
    { name_en: "Facial Conditioning & Skin Cleanup", name_hi: "फेशियल कंडीशनिंग और स्किन क्लीनअप", price: 799, duration: 60 },
    { name_en: "Hair Coloring & Spa Nourishment", name_hi: "हेयर कलरिंग और स्पा पोषण", price: 1200, duration: 90 },
    { name_en: "Kids Haircut at Doorstep", name_hi: "बच्चों के बाल काटने की सेवा", price: 299, duration: 45 }
  ],
  "Home Repairs & Maintenance": [
    { name_en: "Electrician Fault Repair", name_hi: "इलेक्ट्रीशियन फॉल्ट मरम्मत", price: 250, duration: 45 },
    { name_en: "Plumbing Leakage Fixing", name_hi: "प्लंबिंग लीकेज फिक्सिंग", price: 300, duration: 60 },
    { name_en: "Carpenter Door/Lock Fitting", name_hi: "बढ़ई दरवाजा/ताला फिटिंग", price: 400, duration: 60 },
    { name_en: "AC Jet Deep Cleaning Service", name_hi: "एसी जेट गहरी सफाई सेवा", price: 599, duration: 90 },
    { name_en: "Washing Machine Diagnostics", name_hi: "वाशिंग मशीन निदान", price: 450, duration: 60 }
  ],
  "Cleaning & Pest Control": [
    { name_en: "Deep Home Cleaning (Per Room)", name_hi: "कमरे की गहरी सफाई", price: 1199, duration: 120 },
    { name_en: "Kitchen Deep Degreasing", name_hi: "रसोई की गहरी डीग्रीज़िंग सफाई", price: 1499, duration: 180 },
    { name_en: "Sofa & Carpet Shampooing", name_hi: "सोफा और कालीन शैंपू से सफाई", price: 899, duration: 90 },
    { name_en: "Bathroom Disinfection Sanitization", name_hi: "बाथरूम की कीटाणुशोधन सफाई", price: 399, duration: 45 },
    { name_en: "Water Tank Anti-Algae Flush", name_hi: "पानी की टंकी एंटी-एल्गी सफाई", price: 999, duration: 120 }
  ],
  "Native Smart Products": [
    { name_en: "CCTV Camera Network Setup", name_hi: "सीसीटीवी कैमरा नेटवर्क सेटअप", price: 1500, duration: 180 },
    { name_en: "Smart Video Doorbell Link", name_hi: "स्मार्ट वीडियो डोरबेल स्थापना", price: 899, duration: 60 },
    { name_en: "Alexa/Google Home Voice Integration", name_hi: "आवाज सहायक एकीकरण (Alexa/Google Home)", price: 1200, duration: 120 },
    { name_en: "Wi-Fi Mesh Router Configuration", name_hi: "वाई-फाई मेश राउटर कॉन्फ़िगरेशन", price: 600, duration: 60 },
    { name_en: "Smart Lock Architectural Mounting", name_hi: "स्मार्ट लॉक स्थापना और माउंटिंग", price: 1999, duration: 90 }
  ],
  "Indian Labours": [
    { name_en: "Daily Wage Mason / राजमिस्त्री", name_hi: "दैनिक मजदूरी राजमिस्त्री", price: 700, duration: 480 },
    { name_en: "Structural Helper / मजदूर हेल्पर", name_hi: "मजदूर हेल्पर", price: 450, duration: 480 },
    { name_en: "Wall Painter / पेंटर", name_hi: "दीवार पेंटर", price: 600, duration: 480 },
    { name_en: "Tile Cutter & Layer Worker", name_hi: "टाइल कटर और लेयर मजदूर", price: 650, duration: 480 },
    { name_en: "Debris Removal Handling Fleet", name_hi: "मलबा हटाने का काम", price: 500, duration: 480 }
  ],
  "Contractors & Builders": [
    { name_en: "Full House Renovation Oversight", name_hi: "घर का पूर्ण नवीनीकरण और देखरेख", price: 25000, duration: 1440 },
    { name_en: "Modular Kitchen Layout Planning", name_hi: "मॉड्यूलर किचन लेआउट योजना", price: 15000, duration: 720 },
    { name_en: "Waterproofing Structure Specialist", name_hi: "जलरोधक (Waterproofing) संरचना विशेषज्ञ", price: 8500, duration: 480 },
    { name_en: "Electrical Pipeline Blueprinting", name_hi: "विद्युत पाइपलाइन ब्लूप्रिंटिंग", price: 12000, duration: 600 },
    { name_en: "Iron Grill Welding Contractor", name_hi: "लोहे की ग्रिल वेल्डिंग ठेकेदार", price: 5500, duration: 360 }
  ]
};

export default function ProviderOnboardingPage() {
  const { addProviderWithServices, showToast, language } = useApp();
  const router = useRouter();

  // Wizard Funnel Steps (1 to 15)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Onboarding Data (Steps 1 to 9)
  const [phone, setPhone] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('28');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [qualification, setQualification] = useState('Diploma in Technology');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [skills, setSkills] = useState<string[]>(['Smart Repairs', 'Troubleshooting']);
  const [newSkill, setNewSkill] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://api.dicebear.com/7.x/bottts/svg?seed=newpartner');
  const [kycType, setKycType] = useState<'Aadhaar' | 'PAN'>('Aadhaar');
  const [kycNumber, setKycNumber] = useState('');
  const [isKycBlurred, setIsKycBlurred] = useState(false);
  const [baseRate, setBaseRate] = useState('500');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Live Operations Dashboard Data (Steps 10 to 15)
  const [isOnline, setIsOnline] = useState(true);
  const [walletBalance, setWalletBalance] = useState(1200);
  const [settledWithdrawals, setSettledWithdrawals] = useState<any[]>([]);
  const [upiKey, setUpiKey] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  
  // Dashboard mock incoming requests
  const [incomingJobs, setIncomingJobs] = useState<any[]>([
    { id: 'JOB_LKO_101', customer: 'Raman Gomti Nagar', serviceName: 'Priority Repair Callout', area: 'Sector 4, Gomti Nagar', cost: 600, status: 'PENDING' },
    { id: 'JOB_LKO_102', customer: 'Sushma Hazratganj', serviceName: 'Standard Setup Inspection', area: 'Chowk Bypass, Lucknow', cost: 450, status: 'PENDING' }
  ]);

  // Step 2 delay simulation
  useEffect(() => {
    if (currentStep === 2) {
      setVerificationLoading(true);
      const timer = setTimeout(() => {
        setVerificationLoading(false);
        setCurrentStep(3);
        showToast('OTP code dispatched. Use code 2026 to unlock.', 'info');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Tag helper
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  // OTP Validation Bypasser
  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '2026') {
      showToast('Security validation handshake approved!', 'success');
      setCurrentStep(4);
    } else {
      showToast('Validation code mismatch! Hint: use 2026.', 'error');
    }
  };

  // Submit Step 9
  const handleLaunchLaunch = () => {
    // Generate 5 custom services matching category
    const templateServices = CATEGORY_SERVICES_MATRIX[selectedCategory] || [];
    const generatedServices = templateServices.map((t, idx) => ({
      id: `srv_custom_${Date.now()}_${idx}`,
      category: selectedCategory,
      title_en: t.name_en,
      title_hi: t.name_hi,
      price_inr: parseFloat(baseRate) + (idx * 150), // Scale from base rate
      duration_mins: t.duration,
      rating: 5.0,
      reviews_count: 1,
      locality: 'Hazratganj, Lucknow',
      provider_id: `prov_new_${fullName.replace(/\s+/g, '').toLowerCase()}`,
      description_en: `High quality customized ${t.name_en} service in Lucknow area.`,
      description_hi: `लखनऊ क्षेत्र में उच्च गुणवत्ता वाली अनुकूलित ${t.name_hi} सेवा।`
    }));

    const mockProvider = {
      id: `prov_new_${fullName.replace(/\s+/g, '').toLowerCase()}`,
      name: fullName,
      email: `${fullName.replace(/\s+/g, '').toLowerCase()}@sewahub.com`,
      phone: phone || '9988776655',
      role: 'PROVIDER' as const,
      avatar: avatarUrl,
      locality: 'Hazratganj',
      category: selectedCategory,
      status: 'APPROVED'
    };

    // Save state globally
    addProviderWithServices(mockProvider, generatedServices);
    setShowWelcomeModal(true);
  };

  // Transition to Step 10 Live Dashboard
  const handleEnterDashboard = () => {
    setShowWelcomeModal(false);
    setCurrentStep(10);
  };

  // Job Actions
  const handleJobAction = (id: string, action: 'ACCEPT' | 'DECLINE') => {
    setIncomingJobs(prev => prev.map(job => {
      if (job.id === id) {
        return { ...job, status: action === 'ACCEPT' ? 'ACCEPTED' : 'DECLINED' };
      }
      return job;
    }));
    
    if (action === 'ACCEPT') {
      showToast('Request added to active duty task list!');
      // Add job payout to wallet ledger
      const job = incomingJobs.find(j => j.id === id);
      if (job) {
        setWalletBalance(prev => prev + job.cost);
      }
    } else {
      showToast('Request declined and returned to dispatch queue.', 'warning');
    }
  };

  // Step 14 & 15: Financial Settlement Fee deductions
  const handleRequestSettlement = (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawVal = parseFloat(withdrawAmount);
    if (isNaN(withdrawVal) || withdrawVal <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }
    if (withdrawVal > walletBalance) {
      showToast('Insufficient ledger balance', 'error');
      return;
    }
    if (!upiKey.includes('@')) {
      showToast('Please enter a valid UPI address (e.g. name@upi)', 'error');
      return;
    }

    // Deduce Platform Fees: Flat ₹49 + 5% system fee
    const platformFee = 49;
    const interestFee = withdrawVal * 0.05;
    const totalDeducted = platformFee + interestFee;
    const netReceived = withdrawVal - totalDeducted;

    if (netReceived <= 0) {
      showToast('Withdrawal value is too low to cover platform fees.', 'error');
      return;
    }

    setWalletBalance(prev => prev - withdrawVal);
    const newTx = {
      id: `TX_${Math.floor(1000 + Math.random() * 9000)}`,
      requested: withdrawVal,
      deductions: totalDeducted,
      net: netReceived,
      upi: upiKey,
      timestamp: new Date().toLocaleTimeString()
    };

    setSettledWithdrawals([newTx, ...settledWithdrawals]);
    setWithdrawAmount('');
    showToast(`Settlement cleared! Net of ₹${netReceived.toFixed(2)} pushed to ${upiKey}`, 'success');
  };

  // Masking KYC
  const getRedactedKyc = () => {
    if (!kycNumber) return '';
    return `${kycType} Redacted [•••• ${kycNumber.slice(-4)}]`;
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-10 min-h-screen text-[#1A1A2E]">
      
      {/* 1. ONBOARDING FUNNEL GRID (Steps 1 to 9) */}
      {currentStep < 10 && (
        <div className="bg-white border border-[#DDE2F0] rounded-3xl p-6 md:p-10 shadow-xl flex flex-col gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />

          {/* Stepper Header */}
          <div className="flex flex-col gap-2 relative z-10">
            <div className="flex justify-between items-center text-[10px] font-bold text-muted uppercase tracking-wider">
              <span>Onboarding Funnel</span>
              <span className="text-primary font-black bg-primary/5 px-2.5 py-1 rounded-md">Step {currentStep} of 9</span>
            </div>
            
            <h1 className="text-2xl font-black tracking-tight text-ink">
              {currentStep === 1 && (language === 'en' ? 'Start Partner Journey' : 'साझेदार यात्रा शुरू करें')}
              {currentStep === 2 && 'Generating Security Protocols'}
              {currentStep === 3 && 'OTP Validation Terminal'}
              {currentStep === 4 && 'Define Professional Profile'}
              {currentStep === 5 && 'Interactive Skills Registry'}
              {currentStep === 6 && 'Photo Manifest Upload'}
              {currentStep === 7 && 'Redacted Compliance KYC'}
              {currentStep === 8 && 'Custom Rate Card setup'}
              {currentStep === 9 && 'Onboarding Verification Summary'}
            </h1>
            
            <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${(currentStep / 9) * 100}%` }}
              />
            </div>
          </div>

          {/* Stepper Viewport */}
          <div className="min-h-[250px] flex flex-col justify-center py-4">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.form 
                  key="step1" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={(e) => { e.preventDefault(); if (phone.length === 10) setCurrentStep(2); }}
                  className="flex flex-col gap-4 max-w-md mx-auto w-full"
                >
                  <label className="text-xs font-bold text-muted uppercase tracking-widest flex items-center gap-1.5">
                    <Phone size={14} className="text-primary" /> Lucknow Mobile Contact
                  </label>
                  <div className="flex items-center gap-3 bg-surface border border-borderColor rounded-xl px-4 py-3.5 focus-within:border-primary transition-all">
                    <span className="text-sm font-bold text-muted">+91</span>
                    <input 
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 10-digit number"
                      className="bg-transparent outline-none flex-grow font-bold text-sm text-ink"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={phone.length !== 10}
                    className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-canvas font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/10 uppercase tracking-widest text-xs"
                  >
                    Initiate Security Handshake &rarr;
                  </button>
                </motion.form>
              )}

              {currentStep === 2 && (
                <motion.div 
                  key="step2" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center gap-4 text-center"
                >
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-bold text-ink">Simulating Automated Verification Delay Hooks...</p>
                  <p className="text-xs text-muted">Establishing secure telemetry handshake with Lucknow registry</p>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.form 
                  key="step3" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handleOtpVerify}
                  className="flex flex-col gap-4 max-w-md mx-auto w-full text-center"
                >
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex flex-col gap-1 items-center">
                    <KeyRound size={24} className="text-primary animate-bounce mb-1" />
                    <span className="text-xs font-bold text-primary">Mock Security Token Generated</span>
                    <span className="text-lg font-black tracking-widest text-ink">2026</span>
                  </div>

                  <div className="flex flex-col gap-2 text-left">
                    <label className="text-xs font-bold text-muted uppercase tracking-widest">Provide Security Code</label>
                    <input 
                      type="text"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="xxxx"
                      className="bg-surface border border-[#DDE2F0] rounded-xl p-3.5 outline-none font-bold text-center tracking-[1em] text-lg text-ink focus:border-primary"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary-hover text-canvas font-bold py-3.5 rounded-xl transition-all shadow-md uppercase tracking-wider text-xs"
                  >
                    Unlock Criteria Portal
                  </button>
                </motion.form>
              )}

              {currentStep === 4 && (
                <motion.div 
                  key="step4" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left"
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-muted uppercase">Full Name</label>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Afzal Ehsan"
                      className="bg-surface border border-borderColor rounded-xl p-3.5 outline-none font-bold text-sm text-ink"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-muted uppercase">Age</label>
                    <input 
                      type="number" 
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="bg-surface border border-borderColor rounded-xl p-3.5 outline-none font-bold text-sm text-ink"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-muted uppercase">Gender</label>
                    <select 
                      value={gender}
                      onChange={(e: any) => setGender(e.target.value)}
                      className="bg-surface border border-borderColor rounded-xl p-3.5 outline-none font-bold text-sm text-ink"
                    >
                      <option value="Male">Male / पुरुष</option>
                      <option value="Female">Female / महिला</option>
                      <option value="Other">Other / अन्य</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-muted uppercase">Qualifications</label>
                    <input 
                      type="text" 
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      className="bg-surface border border-borderColor rounded-xl p-3.5 outline-none font-bold text-sm text-ink"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-bold text-muted uppercase">Core Category Allocation</label>
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-surface border border-borderColor rounded-xl p-3.5 outline-none font-bold text-sm text-ink"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </motion.div>
              )}

              {currentStep === 5 && (
                <motion.div 
                  key="step5" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col gap-5 text-left"
                >
                  <form onSubmit={handleAddSkill} className="flex gap-2">
                    <div className="flex-grow flex items-center bg-surface border border-borderColor rounded-xl px-4 py-2">
                      <Tag size={16} className="text-muted mr-2" />
                      <input 
                        type="text" 
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Type capability badge (e.g. Copper Wire Welding) and tap Add"
                        className="bg-transparent outline-none text-xs font-bold text-ink w-full"
                      />
                    </div>
                    <button type="submit" className="bg-primary hover:bg-primary-hover text-canvas font-bold px-5 rounded-xl text-xs uppercase tracking-wide">
                      Add Badge
                    </button>
                  </form>

                  <div className="flex flex-wrap gap-2 min-h-[100px] p-4 bg-surface rounded-2xl border border-borderColor/60">
                    {skills.length === 0 ? (
                      <span className="text-xs text-muted font-bold m-auto">No custom capabilities appended yet.</span>
                    ) : (
                      skills.map(s => (
                        <span 
                          key={s} 
                          className="bg-primary/10 text-primary text-xs font-bold py-1.5 px-3 rounded-full flex items-center gap-2 border border-primary/20"
                        >
                          <span>{s}</span>
                          <button onClick={() => handleRemoveSkill(s)} className="text-primary hover:text-accent font-black">✕</button>
                        </span>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 6 && (
                <motion.div 
                  key="step6" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col items-center justify-center gap-6 max-w-sm mx-auto w-full text-center"
                >
                  <div className="w-24 h-24 rounded-3xl bg-surface border border-borderColor flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="onboard avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Camera size={32} className="text-muted" />
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-full text-left">
                    <label className="text-xs font-bold text-muted uppercase">Select Premium Avatar Seed</label>
                    <select
                      onChange={(e) => setAvatarUrl(`https://api.dicebear.com/7.x/bottts/svg?seed=${e.target.value}`)}
                      className="bg-surface border border-borderColor rounded-xl p-3.5 outline-none font-bold text-sm text-ink w-full"
                    >
                      <option value="newpartner">Seed: Partner Beta</option>
                      <option value="rahul">Seed: Lucknow Tech</option>
                      <option value="salonsmart">Seed: Grooming Pro</option>
                      <option value="masonry">Seed: Mason Union</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {currentStep === 7 && (
                <motion.div 
                  key="step7" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col gap-5 text-left max-w-md mx-auto w-full"
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-muted uppercase">KYC Verification Protocol</label>
                    <select 
                      value={kycType}
                      onChange={(e: any) => setKycType(e.target.value)}
                      className="bg-surface border border-borderColor rounded-xl p-3.5 outline-none font-bold text-sm text-ink"
                    >
                      <option value="Aadhaar">Aadhaar Card / आधार कार्ड</option>
                      <option value="PAN">PAN Card / पैन कार्ड</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-muted uppercase">Card Number</label>
                    <input 
                      type="text" 
                      value={isKycBlurred ? getRedactedKyc() : kycNumber}
                      onChange={(e) => setKycNumber(e.target.value)}
                      onBlur={() => setIsKycBlurred(true)}
                      onFocus={() => setIsKycBlurred(false)}
                      placeholder={kycType === 'Aadhaar' ? '12-digit number (e.g. 123456789012)' : '10-character PAN'}
                      className="bg-surface border border-borderColor rounded-xl p-3.5 outline-none font-bold text-sm text-ink tracking-wider font-mono"
                    />
                    <span className="text-[10px] text-muted font-bold">Your document identifier is masked client-side for security privacy bounds.</span>
                  </div>
                </motion.div>
              )}

              {currentStep === 8 && (
                <motion.div 
                  key="step8" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col gap-4 text-left max-w-sm mx-auto w-full"
                >
                  <label className="text-xs font-bold text-[#6E7191] uppercase tracking-widest">Base Rate Card Setting (INR / Day)</label>
                  <div className="flex items-center gap-2 bg-surface border border-borderColor rounded-xl px-4 py-3.5 focus-within:border-primary">
                    <span className="text-sm font-black text-ink">₹</span>
                    <input 
                      type="number" 
                      value={baseRate}
                      onChange={(e) => setBaseRate(e.target.value.replace(/\D/g, ''))}
                      className="bg-transparent outline-none flex-grow font-bold text-sm text-ink font-mono"
                      required
                    />
                    <span className="text-xs font-bold text-muted">/ DAY</span>
                  </div>
                  <span className="text-[10px] text-muted font-bold">This rate serves as the baseline index for your customized 5 service catalog listings.</span>
                </motion.div>
              )}

              {currentStep === 9 && (
                <motion.div 
                  key="step9" 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col gap-6 text-left max-w-md mx-auto w-full"
                >
                  {/* Summary Card */}
                  <div className="bg-surface border border-[#DDE2F0] rounded-2xl p-6 flex flex-col gap-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#5C33F6]/5 rounded-bl-full" />
                    
                    <div className="flex items-center gap-4">
                      <img src={avatarUrl} alt="Summary Avt" className="w-14 h-14 rounded-xl border border-borderColor object-cover" />
                      <div>
                        <h4 className="font-extrabold text-base text-ink">{fullName || 'Vetted Specialist'}</h4>
                        <p className="text-[11px] text-muted font-semibold">{selectedCategory} | {age} Yrs</p>
                      </div>
                    </div>

                    <div className="border-t border-[#DDE2F0] pt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-bold">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-[#6E7191] uppercase">KYC REDACTED</span>
                        <span className="text-ink truncate font-mono mt-0.5">{getRedactedKyc() || 'Aadhaar Redacted'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-[#6E7191] uppercase">BASE RATE CARD</span>
                        <span className="text-primary mt-0.5">₹{baseRate} / Day</span>
                      </div>
                      <div className="flex flex-col col-span-2 mt-1">
                        <span className="text-[9px] text-[#6E7191] uppercase">QUALIFICATIONS</span>
                        <span className="text-ink font-medium mt-0.5">{qualification}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {skills.map(s => (
                        <span key={s} className="bg-primary/5 text-primary text-[9px] font-bold px-2 py-0.5 rounded border border-primary/10">{s}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stepper Footer Controls */}
          <div className="flex justify-between items-center border-t border-[#DDE2F0]/60 pt-6">
            <button
              onClick={() => { if (currentStep > 1) { if (currentStep === 3) setCurrentStep(1); else setCurrentStep(currentStep - 1); } }}
              disabled={currentStep === 1 || currentStep === 2}
              className="flex items-center gap-1.5 px-4 py-2.5 border border-borderColor hover:bg-surface disabled:opacity-30 rounded-xl text-xs font-bold uppercase transition-colors"
            >
              <ArrowLeft size={14} /> Back
            </button>

            {currentStep < 9 ? (
              currentStep !== 1 && currentStep !== 2 && currentStep !== 3 && (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary-hover text-canvas rounded-xl text-xs font-bold uppercase transition-colors shadow-md shadow-primary/15"
                >
                  Continue <ArrowRight size={14} />
                </button>
              )
            ) : (
              <button
                onClick={handleLaunchLaunch}
                className="flex items-center gap-1.5 px-6 py-3 bg-[#10B981] hover:bg-[#0EA271] text-canvas rounded-xl text-xs font-bold uppercase transition-all shadow-md shadow-[#10B981]/20"
              >
                Launch Partner Node <Sparkles size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. LIVE OPERATIONS DASHBOARD PORTAL (Steps 10 to 15) */}
      {currentStep >= 10 && (
        <div className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Operations Header */}
          <div className="bg-[#1A1A2E] p-6 text-white rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border border-[#6E7191]/20">
            <div className="flex items-center gap-4">
              <img src={avatarUrl} alt="dashboard avatar" className="w-16 h-16 rounded-2xl border border-borderColor/20 object-cover bg-surface" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-[#EEF0F8]">{fullName}</h2>
                  <span className="bg-[#5C33F6] text-canvas text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                    Verified Partner
                  </span>
                </div>
                <p className="text-xs text-[#6E7191] font-semibold mt-1">Operational Desk: <span className="text-[#EEF0F8]">{selectedCategory}</span></p>
              </div>
            </div>

            {/* Step 12: Real-time Active Duty Toggle */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-4 w-full sm:w-auto">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-[#6E7191] font-bold uppercase tracking-wider">Duty Toggle</span>
                <span className="text-xs font-bold flex items-center gap-1">
                  {isOnline ? (
                    <>
                      <Wifi size={12} className="text-[#10B981]" />
                      <span className="text-[#10B981]">ONLINE & ACTIVE</span>
                    </>
                  ) : (
                    <>
                      <WifiOff size={12} className="text-[#FF6B6B]" />
                      <span className="text-[#FF6B6B]">OFFLINE / INACTIVE</span>
                    </>
                  )}
                </span>
              </div>
              <button 
                onClick={() => setIsOnline(!isOnline)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${isOnline ? 'bg-[#10B981]' : 'bg-neutral-600'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isOnline ? 'translate-x-6' : ''}`} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Job stream list */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Step 11: Incoming Request Stream */}
              <div className="bg-white border border-[#DDE2F0] rounded-3xl p-6 shadow-sm flex flex-col gap-5">
                <h3 className="text-xs font-black text-[#6E7191] uppercase tracking-widest flex items-center gap-1.5">
                  <Activity size={14} className="text-primary animate-ping" />
                  Incoming Request Stream (Lucknow Sector)
                </h3>

                <div className="space-y-4">
                  {incomingJobs.map(job => (
                    <div 
                      key={job.id} 
                      className="border border-borderColor bg-[#F8F9FC] rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all"
                    >
                      <div className="flex flex-col gap-1 text-left">
                        <span className="text-[10px] font-bold text-primary uppercase">{job.id}</span>
                        <h4 className="font-extrabold text-sm text-ink">{job.serviceName}</h4>
                        <span className="text-xs text-muted font-medium mt-0.5">Customer: {job.customer} | {job.area}</span>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <span className="font-mono text-sm font-black text-ink">₹{job.cost}</span>
                        {job.status === 'PENDING' ? (
                          <div className="flex gap-1.5">
                            <button 
                              onClick={() => handleJobAction(job.id, 'DECLINE')}
                              className="p-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                              title="Decline Job"
                            >
                              ✕
                            </button>
                            <button 
                              onClick={() => handleJobAction(job.id, 'ACCEPT')}
                              className="bg-[#10B981] hover:bg-[#0EA271] text-white py-2 px-4 rounded-xl text-xs font-bold uppercase transition-colors"
                            >
                              Accept
                            </button>
                          </div>
                        ) : (
                          <span className={`text-xs font-bold uppercase tracking-wider ${job.status === 'ACCEPTED' ? 'text-[#10B981]' : 'text-[#FF6B6B]'}`}>
                            {job.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Ledger and Withdrawals */}
            <div className="col-span-1 flex flex-col gap-6">
              
              {/* Step 13: Liquidity Ledger Balance Component */}
              <div className="bg-white border border-[#DDE2F0] rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <span className="text-[10px] font-black text-[#6E7191] uppercase tracking-widest flex items-center gap-1.5">
                  <Wallet size={14} className="text-primary" />
                  Liquidity Ledger Balance
                </span>
                <div className="flex flex-col text-left">
                  <span className="text-3xl font-black text-ink font-mono">₹{walletBalance.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-[#6E7191] mt-1 font-bold">Unsettled wallet earnings registry</span>
                </div>
              </div>

              {/* Step 14: Financial Settlement System */}
              <div className="bg-white border border-[#DDE2F0] rounded-3xl p-6 shadow-sm flex flex-col gap-4 text-left">
                <h4 className="text-xs font-black text-[#6E7191] uppercase tracking-widest">
                  Withdraw to Bank Account
                </h4>

                <form onSubmit={handleRequestSettlement} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-muted uppercase">Target UPI VPA</label>
                    <input 
                      type="text" 
                      value={upiKey}
                      onChange={(e) => setUpiKey(e.target.value)}
                      placeholder="e.g. afzal@ybl"
                      className="bg-surface border border-borderColor rounded-xl p-3 outline-none text-xs font-bold text-ink tracking-wide font-mono"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-muted uppercase">Withdraw Amount (INR)</label>
                    <div className="flex items-center gap-1.5 bg-surface border border-borderColor rounded-xl px-3 py-1">
                      <span className="text-xs font-bold text-muted">₹</span>
                      <input 
                        type="number" 
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 500"
                        className="bg-transparent outline-none flex-grow text-xs font-bold text-ink font-mono"
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#5C33F6] hover:bg-[#4B29D4] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-1"
                  >
                    <span>Request Settlement</span>
                    <ArrowUpRight size={14} />
                  </button>
                </form>

                {/* Step 15: Mathematical Calculation Output Engine */}
                {withdrawAmount && parseFloat(withdrawAmount) > 0 && (
                  <div className="bg-[#F8F9FC] border border-[#DDE2F0] p-4 rounded-2xl flex flex-col gap-2 text-[10px] font-bold text-[#6E7191] uppercase tracking-wide">
                    <div className="flex justify-between">
                      <span>Deducted Platform Fee:</span>
                      <span className="font-mono text-ink">₹49.00</span>
                    </div>
                    <div className="flex justify-between border-b border-[#DDE2F0]/60 pb-2">
                      <span>System Interest Fee (5%):</span>
                      <span className="font-mono text-ink">₹{(parseFloat(withdrawAmount) * 0.05).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-ink text-xs font-black pt-1 font-mono">
                      <span>Net Settlement:</span>
                      <span>₹{Math.max(0, parseFloat(withdrawAmount) - (49 + parseFloat(withdrawAmount) * 0.05)).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Settled Transactions list */}
          {settledWithdrawals.length > 0 && (
            <div className="bg-white border border-[#DDE2F0] rounded-3xl p-6 shadow-sm flex flex-col gap-4 text-left">
              <h4 className="text-xs font-black text-[#6E7191] uppercase tracking-widest">
                Ledger Settlement History
              </h4>
              <div className="divide-y divide-[#DDE2F0]/50 space-y-2">
                {settledWithdrawals.map(tx => (
                  <div key={tx.id} className="pt-2 flex justify-between items-center text-xs font-bold">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-ink">{tx.upi} ({tx.id})</span>
                      <span className="text-[10px] text-muted font-normal">Deductions: ₹{tx.deductions.toFixed(2)} | {tx.timestamp}</span>
                    </div>
                    <span className="text-[#10B981] font-mono">+₹{tx.net.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Platform Footnote Standard Terms Block */}
          <div className="bg-[#F8F9FC] border border-[#DDE2F0] p-6 rounded-3xl text-center text-[10px] font-semibold text-[#6E7191] leading-relaxed flex flex-col gap-2 mt-4">
            <div className="flex justify-center gap-4 text-xs font-bold text-primary mb-1">
              <span className="hover:underline cursor-pointer">Operational Terms & Conditions</span>
              <span>&middot;</span>
              <span className="hover:underline cursor-pointer">Corporate Privacy Policies</span>
            </div>
            <p>
              By toggling active duty states or requesting settlement withdrawal ledger actions, you represent and verify compliance with regional labor laws in the Lucknow region. Lakshvi Sewa operations parameters are masked and simulated locally on the client-side context.
            </p>
          </div>
        </div>
      )}

      {/* Welcome popup modal at Step 9 transition */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#DDE2F0] rounded-3xl w-full max-w-md p-8 text-center shadow-2xl flex flex-col items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#10B981]/5 rounded-bl-full" />
            <div className="w-16 h-16 bg-[#10B981]/15 text-[#10B981] rounded-2xl flex items-center justify-center text-2xl font-bold animate-bounce">
              ✓
            </div>
            
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-black text-ink leading-tight">
                Welcome to Lakshvi Sewa Provider!
              </h2>
              <h3 className="text-sm font-semibold text-primary">
                लक्ष्मी सेवा प्रदाता में आपका स्वागत है!
              </h3>
              <p className="text-xs text-muted font-semibold mt-2 leading-relaxed">
                Your onboarding manifest was vetted successfully. Your 5 specialized services rate cards are now indexed in the public Lucknow catalog.
              </p>
            </div>

            <button
              onClick={handleEnterDashboard}
              className="w-full bg-[#10B981] hover:bg-[#0EA271] text-canvas font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest shadow-md transition-colors"
            >
              Enter Operations Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
