'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/components/AppContext';
import { Filter, Star, Search, ShieldCheck, MapPin, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Static client-side fallback list in case backend server is booting or offline
const STATIC_FALLBACK_SERVICES = [
  {
    "id": "srv_beauty_1",
    "category": "Beauty & Grooming",
    "title_en": "Premium Salon at Home for Women",
    "title_hi": "महिलाओं के लिए प्रीमियम सैलून एट होम",
    "price_inr": 1200,
    "duration_mins": 90,
    "rating": 4.8,
    "reviews_count": 24,
    "locality": "Gomti Nagar, Lucknow",
    "provider_id": "prov_1",
    "description_en": "Get professional facial, waxing, and hair spa services at the comfort of your home.",
    "description_hi": "अपने घर के आराम में पेशेवर फेशियल, वैक्सिंग और हेयर स्पा सेवाएं प्राप्त करें।"
  },
  {
    "id": "srv_repair_1",
    "category": "Home Repairs & Maintenance",
    "title_en": "Emergency Plumbing Diagnostics & Repair",
    "title_hi": "आपातकालीन प्लंबिंग निदान और मरम्मत",
    "price_inr": 490,
    "duration_mins": 45,
    "rating": 4.7,
    "reviews_count": 52,
    "locality": "Hazratganj, Lucknow",
    "provider_id": "prov_2",
    "description_en": "Fast resolving of pipe leakages, tap replacements, and water flow issues with modern toolkit.",
    "description_hi": "आधुनिक टूलकिट के साथ पाइप लीकेज, नल रिप्लेसमेंट और पानी के बहाव की समस्याओं का त्वरित समाधान।"
  },
  {
    "id": "srv_cleaning_1",
    "category": "Cleaning & Pest Control",
    "title_en": "Deep Home Sanitization & Cleaning",
    "title_hi": "गहरी गृह स्वच्छता और सफाई",
    "price_inr": 1800,
    "duration_mins": 180,
    "rating": 4.9,
    "reviews_count": 18,
    "locality": "Aliganj, Lucknow",
    "provider_id": "prov_3",
    "description_en": "Complete vacuuming, kitchen scrubbing, bathroom sanitization, and bedroom deep clean.",
    "description_hi": "पूरा वैक्यूमिंग, किचन स्क्रबिंग, बाथरूम सैनिटाइजेशन और बेडरूम की गहरी सफाई।"
  },
  {
    "id": "srv_smart_1",
    "category": "Native Smart Products",
    "title_en": "Smart IoT Hub & Camera Setup",
    "title_hi": "स्मार्ट IoT हब और कैमरा सेटअप",
    "price_inr": 1500,
    "duration_mins": 120,
    "rating": 4.9,
    "reviews_count": 11,
    "locality": "Indiranagar, Lucknow",
    "provider_id": "prov_4",
    "description_en": "Installation and integration of smart home doorbells, Wi-Fi security cameras, and smart assistants.",
    "description_hi": "स्मार्ट होम डोरबेल, वाई-फाई सुरक्षा कैमरे और स्मार्ट सहायकों की स्थापना और एकीकरण।"
  },
  {
    "id": "srv_labour_1",
    "category": "Indian Labours",
    "title_en": "Skilled Daily Wage Mason / Helper",
    "title_hi": "कुशल दैनिक वेतन भोगी राजमिस्त्री / सहायक",
    "price_inr": 800,
    "duration_mins": 480,
    "rating": 4.6,
    "reviews_count": 31,
    "locality": "Chowk, Lucknow",
    "provider_id": "prov_5",
    "description_en": "Experienced local helper for shifting, bricklaying, concrete mixing, and basic structural manual work.",
    "description_hi": "स्थानांतरण, ईंट बिछाने, कंक्रीट मिलाने और बुनियादी संरचनात्मक शारीरिक कार्यों के लिए अनुभवी स्थानीय सहायक।"
  },
  {
    "id": "srv_contractor_1",
    "category": "Contractors & Builders",
    "title_en": "Premium Home Renovation Consultation",
    "title_hi": "प्रीमियम गृह नवीनीकरण परामर्श",
    "price_inr": 2500,
    "duration_mins": 60,
    "rating": 5.0,
    "reviews_count": 7,
    "locality": "Hazratganj, Lucknow",
    "provider_id": "prov_6",
    "description_en": "On-site assessment, structure design ideas, material estimation, and budget planning by a licensed builder.",
    "description_hi": "एक लाइसेंस प्राप्त बिल्डर द्वारा साइट पर मूल्यांकन, संरचना डिजाइन विचार, सामग्री अनुमान और बजट योजना।"
  }
];

const LOCALITIES = [
  "All Localities",
  "Hazratganj",
  "Gomti Nagar",
  "Aliganj",
  "Indiranagar",
  "Chowk",
  "Aminabad"
];

const CATEGORIES = [
  "All Categories",
  "Beauty & Grooming",
  "Home Repairs & Maintenance",
  "Cleaning & Pest Control",
  "Native Smart Products",
  "Indian Labours",
  "Contractors & Builders"
];

function CatalogContent() {
  const { t, language, showToast, services: appServices } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States for filters
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLocality, setSelectedLocality] = useState('All Localities');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(3000);

  // Initialize query parameters
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
    const q = searchParams.get('search');
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Fetch Services from Backend or Fallback
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        let url = 'http://localhost:5000/api/services?';
        if (selectedCategory !== 'All Categories') {
          url += `category=${encodeURIComponent(selectedCategory)}&`;
        }
        if (selectedLocality !== 'All Localities') {
          url += `locality=${encodeURIComponent(selectedLocality)}&`;
        }
        if (searchQuery) {
          url += `search=${encodeURIComponent(searchQuery)}&`;
        }

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          // Filter by price range client side
          const filtered = data.filter((s: any) => s.price_inr <= priceRange);
          setServices(filtered);
        } else {
          throw new Error('Server error');
        }
      } catch (err) {
        // Fallback filtering
        let filtered = appServices;
        if (selectedCategory !== 'All Categories') {
          filtered = filtered.filter(s => s.category.toLowerCase() === selectedCategory.toLowerCase());
        }
        if (selectedLocality !== 'All Localities') {
          filtered = filtered.filter(s => s.locality.toLowerCase().includes(selectedLocality.toLowerCase()));
        }
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(s => 
            s.title_en.toLowerCase().includes(q) || 
            s.title_hi.includes(q)
          );
        }
        filtered = filtered.filter(s => s.price_inr <= priceRange);
        setServices(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [selectedCategory, selectedLocality, searchQuery, priceRange]);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col gap-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-borderColor pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-ink tracking-tight flex items-center gap-2">
            {t('allCategories')}
          </h1>
          <p className="text-sm text-muted font-medium mt-1">
            {language === 'en' ? 'Vetted professionals matching Lucknow service parameters.' : 'लखनऊ सेवा मापदंडों से मेल खाते प्रमाणित पेशेवर।'}
          </p>
        </div>

        {/* Localized Mini Search */}
        <div className="flex items-center gap-3 bg-surface border border-borderColor rounded-xl px-4 py-2 w-full md:max-w-xs">
          <Search size={16} className="text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog..."
            className="bg-transparent outline-none text-xs font-semibold text-ink w-full"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-8 bg-surface p-6 rounded-2xl border border-borderColor h-fit">
          <div className="flex items-center gap-2 font-bold text-ink border-b border-borderColor pb-4 text-sm uppercase tracking-wide">
            <Filter size={16} className="text-primary" />
            <span>Filters</span>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-muted uppercase">Category</label>
            <div className="flex flex-col gap-1">
              {CATEGORIES.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left text-xs font-bold py-2 px-3 rounded-lg transition-colors ${
                    selectedCategory === cat ? 'bg-primary text-canvas' : 'text-muted hover:bg-surface2 hover:text-ink'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Locality Filter */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-muted uppercase">Locality</label>
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="bg-canvas border border-borderColor rounded-xl p-2.5 outline-none font-bold text-xs text-ink"
            >
              {LOCALITIES.map((loc, i) => (
                <option key={i} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs font-bold">
              <label className="text-muted uppercase">Max Price</label>
              <span className="text-primary">₹{priceRange}</span>
            </div>
            <input
              type="range"
              min={400}
              max={3000}
              step={100}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1 bg-surface2 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </aside>

        {/* Main List */}
        <div className="flex-grow flex flex-col gap-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-3">
              <Loader2 className="text-primary animate-spin" size={32} />
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Loading verified providers...</span>
            </div>
          ) : services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 border border-dashed border-borderColor rounded-3xl text-center p-6 gap-4">
              <span className="text-4xl">🔍</span>
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-lg text-ink">No Local Services Match</h4>
                <p className="text-xs text-muted max-w-xs font-semibold leading-relaxed">
                  Try adjusting filters or searching for terms like plumbing, salon, deep cleaning, IoT, helper, builder.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-canvas border border-borderColor rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-md uppercase tracking-wide">
                        {srv.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-ink">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        {srv.rating} ({srv.reviews_count || 10})
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <h3 className="font-extrabold text-lg text-ink">
                        {language === 'en' ? srv.title_en : srv.title_hi}
                      </h3>
                      <p className="text-xs text-muted leading-relaxed font-semibold">
                        {language === 'en' ? srv.description_en : srv.description_hi}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 border-t border-borderColor/60 mt-6 pt-4">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="flex items-center gap-1 text-muted">
                        <MapPin size={12} className="text-accent" />
                        {srv.locality}
                      </span>
                      <span className="text-muted">
                        {srv.duration_mins} mins
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted font-bold uppercase">Estimated rate</span>
                        <span className="text-xl font-black text-ink">₹{srv.price_inr}</span>
                      </div>

                      <Link
                        href={`/catalog/${srv.id}`}
                        className="bg-primary hover:bg-primary-hover text-canvas font-bold text-xs py-3 px-5 rounded-xl transition-all shadow-md shadow-primary/5 flex items-center gap-1.5"
                      >
                        <ShieldCheck size={14} />
                        <span>Book Details</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading Service Catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
