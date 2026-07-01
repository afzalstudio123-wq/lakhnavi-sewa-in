'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/AppContext';
import { Search, Sparkles, ShieldCheck, MapPin, Star, Hammer, Brush, Scissors, Cpu, Users, Building } from 'lucide-react';
import Link from 'next/link';
import HyperlocalRadar from '@/components/workflows/HyperlocalRadar';
import AntigravityAssistant from '@/components/marketing/AntigravityAssistant';

export default function LandingPage() {
  const { t, language } = useApp();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/catalog');
    }
  };

  const categories = [
    { name: "Beauty & Grooming", nameHi: "ब्यूटी और ग्रूमिंग", icon: Scissors, color: "bg-pink-500", count: 12 },
    { name: "Home Repairs & Maintenance", nameHi: "गृह मरम्मत और रखरखाव", icon: Hammer, color: "bg-blue-500", count: 18 },
    { name: "Cleaning & Pest Control", nameHi: "सफाई और कीट नियंत्रण", icon: Brush, color: "bg-green-500", count: 15 },
    { name: "Native Smart Products", nameHi: "स्मार्ट उत्पाद सेटअप", icon: Cpu, color: "bg-purple-500", count: 8 },
    { name: "Indian Labours", nameHi: "भारतीय मजदूर", icon: Users, color: "bg-amber-500", count: 24 },
    { name: "Contractors & Builders", nameHi: "ठेकेदार और बिल्डर्स", icon: Building, color: "bg-teal-500", count: 9 },
  ];

  const featuredProviders = [
    { name: "Priya Sharma", role: "Beauty & Grooming Expert", rate: "₹1,200/hr", rating: 4.8, locality: "Hazratganj", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" },
    { name: "Amit Kumar", role: "Senior Plumbing Technician", rate: "₹490/hr", rating: 4.7, locality: "Gomti Nagar", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=200" },
    { name: "Sanjay Bajpai", role: "Civil Contractor & Builder", rate: "₹2,500/hr", rating: 5.0, locality: "Aliganj", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" },
  ];

  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-ink py-24 md:py-32 px-6 md:px-12 text-center text-canvas">
        {/* Glow Effects */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px]" />

        <div className="max-w-4xl mx-auto flex flex-col items-center gap-8 relative z-10">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-canvas/10 border border-canvas/20 text-xs md:text-sm font-semibold tracking-wide text-accent-hover uppercase">
            <Sparkles size={16} className="text-accent" />
            {language === 'en' ? 'Directly servicing Hazratganj, Gomti Nagar & Aliganj' : 'हजरतगंज, गोमती नगर और अलीगंज में सीधी सेवाएं'}
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] max-w-3xl">
            {language === 'en' ? (
              <>Premium Home Services, <span className="text-primary-hover bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Crafted for Lucknow</span></>
            ) : (
              <>प्रीमियम होम सर्विसेज, <span className="text-primary-hover bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">विशेष रूप से लखनऊ के लिए</span></>
            )}
          </h1>

          <p className="text-lg md:text-xl text-muted/80 max-w-2xl font-medium">
            {t('subTagline')}
          </p>

          {/* Premium Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-2xl bg-canvas text-ink p-2 rounded-2xl border border-borderColor flex shadow-2xl mt-4">
            <div className="flex items-center gap-3 px-3 flex-grow">
              <Search className="text-muted" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full text-sm outline-none text-ink font-semibold"
              />
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-canvas font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <span>{t('searchBtn')}</span>
            </button>
          </form>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col gap-12">
        <div className="flex flex-col gap-4 text-center md:text-left">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink">
            {language === 'en' ? 'Explore Local Offerings' : 'स्थानीय सेवाओं का अन्वेषण करें'}
          </h2>
          <p className="text-muted font-medium">
            {language === 'en' ? 'Click on any service category to view vetted Lucknow professionals.' : 'सत्यापित लखनऊ पेशेवरों को देखने के लिए किसी भी सेवा श्रेणी पर क्लिक करें।'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, index) => {
            const IconComponent = cat.icon;
            const displayName = language === 'en' ? cat.name : cat.nameHi;
            return (
              <Link
                key={index}
                href={`/catalog?category=${encodeURIComponent(cat.name)}`}
                className="group flex items-start gap-4 p-6 rounded-2xl bg-surface border border-borderColor hover:border-primary hover:bg-canvas transition-all shadow-sm hover:shadow-xl hover:translate-y-[-2px]"
              >
                <div className={`p-4 rounded-xl ${cat.color} text-canvas`}>
                  <IconComponent size={24} />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-lg text-ink group-hover:text-primary transition-colors">
                    {displayName}
                  </h3>
                  <span className="text-xs font-semibold text-muted bg-surface2 px-2.5 py-1 rounded-md self-start">
                    {cat.count} {language === 'en' ? 'Services' : 'सेवाएं'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trust Banner / Stats */}
      <section className="bg-surface py-20 px-6 md:px-12 border-y border-borderColor">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-bold text-ink">100% Vetted Local Pros</h3>
            <p className="text-sm text-muted max-w-xs font-medium">
              Every provider undergoes physical address checks and skill testing in Lucknow hubs.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <MapPin size={28} />
            </div>
            <h3 className="text-xl font-bold text-ink">Hyperlocal Operations</h3>
            <p className="text-sm text-muted max-w-xs font-medium">
              Dedicated operations teams located in Hazratganj to resolve support issues within 1 hour.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-semantic-success/10 flex items-center justify-center text-semantic-success">
              <Star size={28} />
            </div>
            <h3 className="text-xl font-bold text-ink">Upfront Standard Pricing</h3>
            <p className="text-sm text-muted max-w-xs font-medium">
              Say goodbye to haggling. Flat rate estimates based on Lucknow local market indices.
            </p>
          </div>
        </div>
      </section>

      {/* Top Providers Showcase */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col gap-12">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink">
              {language === 'en' ? 'Highly Rated Lucknow Partners' : 'शीर्ष रेटेड लखनऊ पार्टनर्स'}
            </h2>
            <p className="text-muted font-medium">
              {language === 'en' ? 'Directly contact or book professional builders, beauticians, and cleaners.' : 'व्यावसायिक बिल्डरों, ब्यूटीशियनों और क्लीनर को सीधे बुक करें।'}
            </p>
          </div>
          <Link
            href="/catalog"
            className="text-sm font-bold text-primary hover:text-primary-hover flex items-center gap-1 group"
          >
            <span>{language === 'en' ? 'View All' : 'सभी देखें'}</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProviders.map((prov, index) => (
            <div key={index} className="p-6 rounded-2xl bg-canvas border border-borderColor flex flex-col gap-4 shadow-sm hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <img
                  src={prov.img}
                  alt={prov.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-bold text-lg text-ink">{prov.name}</h3>
                  <p className="text-xs text-muted font-semibold">{prov.role}</p>
                </div>
              </div>
              <div className="flex justify-between items-center bg-surface p-3 rounded-xl border border-borderColor text-sm">
                <span className="font-bold text-primary">{prov.rate}</span>
                <span className="flex items-center gap-1 font-semibold text-ink">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  {prov.rating}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted font-semibold">
                  <MapPin size={12} className="text-accent" />
                  {prov.locality}
                </span>
              </div>
              <Link
                href="/catalog"
                className="w-full py-2.5 rounded-xl border border-borderColor hover:border-primary text-center text-sm font-bold text-ink hover:text-primary transition-all"
              >
                {t('bookNow')}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Antigravity AI & Local Radar Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider w-fit">
              Advanced Simulation Desk
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink">
              {language === 'en' ? 'Conversational AI & Geofencing Radar' : 'संवादात्मक एआई और जियोफेंसिंग रडार'}
            </h2>
            <p className="text-sm text-muted font-medium leading-relaxed">
              Use the Antigravity AI Assistant to search for local laborer pools or contractors. Scan nearby Lucknow neighborhoods dynamically using our simulated geospatial scanning grid.
            </p>
          </div>
          <HyperlocalRadar />
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold text-muted uppercase tracking-wider">Antigravity AI Chat Panel</h3>
          <AntigravityAssistant />
        </div>
      </section>

      {/* Custom Timeline steps */}
      <section className="max-w-4xl mx-auto px-6 md:px-12 w-full flex flex-col gap-16 text-center">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink">
            {language === 'en' ? 'Simple Booking Protocol' : 'आसान बुकिंग प्रक्रिया'}
          </h2>
          <p className="text-muted font-medium max-w-xl mx-auto">
            Book any local laborer, expert repairs, or deep cleaner in less than 3 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="flex flex-col items-center gap-4">
            <span className="w-12 h-12 rounded-full bg-primary text-canvas flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20">
              1
            </span>
            <h4 className="font-bold text-lg text-ink">Select & Filter</h4>
            <p className="text-sm text-muted leading-relaxed font-medium">
              Choose your vertical and input search terms. Compare vetted local rates instantly.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <span className="w-12 h-12 rounded-full bg-accent text-canvas flex items-center justify-center font-bold text-lg shadow-lg shadow-accent/20">
              2
            </span>
            <h4 className="font-bold text-lg text-ink">Confirm Slot & Address</h4>
            <p className="text-sm text-muted leading-relaxed font-medium">
              Pick dates and flexible slots. Verify your Hazratganj/Gomti Nagar billing address.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <span className="w-12 h-12 rounded-full bg-semantic-success text-canvas flex items-center justify-center font-bold text-lg shadow-lg shadow-semantic-success/20">
              3
            </span>
            <h4 className="font-bold text-lg text-ink">Job Verification</h4>
            <p className="text-sm text-muted leading-relaxed font-medium">
              Pay after the service is fully completed and verified by you. Guaranteed satisfaction.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
