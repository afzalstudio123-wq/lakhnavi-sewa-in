'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/AppContext';
import { Star, ShieldAlert, Clock, Award, ShieldCheck, MapPin, Calendar, Loader2 } from 'lucide-react';
import Link from 'next/link';
import UnifiedAuthModal from '@/components/auth/UnifiedAuthModal';

// Static client-side fallback list in case backend server is booting or offline
const STATIC_FALLBACK_SERVICES: Record<string, any> = {
  "srv_beauty_1": {
    "id": "srv_beauty_1",
    "category": "Beauty & Grooming",
    "title_en": "Premium Salon at Home for Women",
    "title_hi": "महिलाओं के लिए प्रीमियम सैलून एट होम",
    "price_inr": 1200,
    "duration_mins": 90,
    "rating": 4.8,
    "reviews_count": 24,
    "locality": "Gomti Nagar, Lucknow",
    "description_en": "Get professional facial, waxing, and hair spa services at the comfort of your home by certified beauticians.",
    "description_hi": "प्रमाणित ब्यूटीशियनों द्वारा अपने घर के आराम में पेशेवर फेशियल, वैक्सिंग और हेयर स्पा सेवाएं प्राप्त करें।",
    "provider": {
      "name": "Priya Sharma",
      "rating": 4.8,
      "experience_years": 5,
      "bio_en": "Professional beautician specialized in bridal and party grooming at home.",
      "bio_hi": "घर पर दुल्हन और पार्टी ग्रूमिंग में विशेषज्ञता रखने वाली पेशेवर ब्यूटीशियन।",
      "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
    }
  },
  "srv_repair_1": {
    "id": "srv_repair_1",
    "category": "Home Repairs & Maintenance",
    "title_en": "Emergency Plumbing Diagnostics & Repair",
    "title_hi": "आपातकालीन प्लंबिंग निदान और मरम्मत",
    "price_inr": 490,
    "duration_mins": 45,
    "rating": 4.7,
    "reviews_count": 52,
    "locality": "Hazratganj, Lucknow",
    "description_en": "Fast resolving of pipe leakages, tap replacements, and water flow issues with modern toolkit.",
    "description_hi": "आधुनिक टूलकिट के साथ पाइप लीकेज, नल रिप्लेसमेंट और पानी के बहाव की समस्याओं का त्वरित समाधान।",
    "provider": {
      "name": "Amit Kumar",
      "rating": 4.7,
      "experience_years": 8,
      "bio_en": "Licensed plumber with experience in residential plumbing and system fixing.",
      "bio_hi": "आवासीय प्लंबिंग और सिस्टम फिक्सिंग का अनुभव रखने वाले लाइसेंस प्राप्त प्लंबर।",
      "avatar": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=200"
    }
  },
  "srv_cleaning_1": {
    "id": "srv_cleaning_1",
    "category": "Cleaning & Pest Control",
    "title_en": "Deep Home Sanitization & Cleaning",
    "title_hi": "गहरी गृह स्वच्छता और सफाई",
    "price_inr": 1800,
    "duration_mins": 180,
    "rating": 4.9,
    "reviews_count": 18,
    "locality": "Aliganj, Lucknow",
    "description_en": "Complete vacuuming, kitchen scrubbing, bathroom sanitization, and bedroom deep clean.",
    "description_hi": "पूरा वैक्यूमिंग, किचन स्क्रबिंग, बाथरूम सैनिटाइजेशन और बेडरूम की गहरी सफाई।",
    "provider": {
      "name": "Vikram Singh",
      "rating": 4.9,
      "experience_years": 4,
      "bio_en": "Pest control expert and home deep cleaning professional with safe chemical usage certs.",
      "bio_hi": "सुरक्षित रासायनिक उपयोग प्रमाणपत्रों के साथ कीट नियंत्रण विशेषज्ञ और होम डीप क्लीनिंग पेशेवर।",
      "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200"
    }
  },
  "srv_smart_1": {
    "id": "srv_smart_1",
    "category": "Native Smart Products",
    "title_en": "Smart IoT Hub & Camera Setup",
    "title_hi": "स्मार्ट IoT हब और कैमरा सेटअप",
    "price_inr": 1500,
    "duration_mins": 120,
    "rating": 4.9,
    "reviews_count": 11,
    "locality": "Indiranagar, Lucknow",
    "description_en": "Installation and integration of smart home doorbells, Wi-Fi security cameras, and smart assistants.",
    "description_hi": "स्मार्ट होम डोरबेल, वाई-फाई सुरक्षा कैमरे और स्मार्ट सहायकों की स्थापना और एकीकरण।",
    "provider": {
      "name": "Rohan Gupta",
      "rating": 4.9,
      "experience_years": 6,
      "bio_en": "IoT expert and home security system installer specializing in smart devices integration.",
      "bio_hi": "स्मार्ट उपकरणों के एकीकरण में विशेषज्ञता रखने वाले IoT विशेषज्ञ और गृह सुरक्षा प्रणाली इंस्टॉलर।",
      "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200"
    }
  },
  "srv_labour_1": {
    "id": "srv_labour_1",
    "category": "Indian Labours",
    "title_en": "Skilled Daily Wage Mason / Helper",
    "title_hi": "कुशल दैनिक वेतन भोगी राजमिस्त्री / सहायक",
    "price_inr": 800,
    "duration_mins": 480,
    "rating": 4.6,
    "reviews_count": 31,
    "locality": "Chowk, Lucknow",
    "description_en": "Experienced local helper for shifting, bricklaying, concrete mixing, and basic structural manual work.",
    "description_hi": "स्थानांतरण, ईंट बिछाने, कंक्रीट मिलाने और बुनियादी संरचनात्मक शारीरिक कार्यों के लिए अनुभवी स्थानीय सहायक।",
    "provider": {
      "name": "Ram Lal",
      "rating": 4.6,
      "experience_years": 10,
      "bio_en": "Experienced masonry helper, concrete specialist, and construction worker.",
      "bio_hi": "अनुभवी चिनाई सहायक, कंक्रीट विशेषज्ञ और निर्माण कार्यकर्ता।",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
    }
  },
  "srv_contractor_1": {
    "id": "srv_contractor_1",
    "category": "Contractors & Builders",
    "title_en": "Premium Home Renovation Consultation",
    "title_hi": "प्रीमियम गृह नवीनीकरण परामर्श",
    "price_inr": 2500,
    "duration_mins": 60,
    "rating": 5.0,
    "reviews_count": 7,
    "locality": "Hazratganj, Lucknow",
    "description_en": "On-site assessment, structure design ideas, material estimation, and budget planning by a licensed builder.",
    "description_hi": "एक लाइसेंस प्राप्त बिल्डर द्वारा साइट पर मूल्यांकन, संरचना डिजाइन विचार, सामग्री अनुमान और बजट योजना।",
    "provider": {
      "name": "Sanjay Bajpai",
      "rating": 5.0,
      "experience_years": 15,
      "bio_en": "Certified civil contractor managing residential and commercial layout structures.",
      "bio_hi": "आवासीय और व्यावसायिक लेआउट संरचनाओं का प्रबंधन करने वाले प्रमाणित सिविल ठेकेदार।",
      "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
    }
  }
};

const MOCK_REVIEWS = [
  { name: "Rahul S.", rating: 5, date: "2026-06-15", text: "Excellent behavior and great work efficiency. Thoroughly recommended." },
  { name: "Meera K.", rating: 4.5, date: "2026-05-29", text: "Very polite, resolved the issue quickly and cleaned up the site before leaving." }
];

interface Props {
  params: { id: string };
}

export default function ServiceDetailsPage({ params }: Props) {
  const { t, language, user, partnerCatalog, services } = useApp();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [service, setService] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const catalogItem = partnerCatalog.find((item) => item.id === params.id);
  const currentPrice = catalogItem ? catalogItem.rateINR : (service ? service.price_inr : 0);
  const isAvailable = catalogItem ? catalogItem.isAvailable : true;

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/services/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setService(data);
        } else {
          throw new Error('Not found');
        }
      } catch (err) {
        // Search in stateful global services array
        const found = services.find((s) => s.id === params.id);
        if (found) {
          setService(found);
        } else {
          const fallback = STATIC_FALLBACK_SERVICES[params.id];
          setService(fallback || null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [params.id, services]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-48 gap-3">
        <Loader2 className="text-primary animate-spin" size={36} />
        <span className="text-sm font-bold text-muted uppercase tracking-wider">Retrieving Service Details...</span>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-md mx-auto py-32 px-6 text-center flex flex-col gap-4">
        <span className="text-5xl">⚠️</span>
        <h2 className="font-extrabold text-2xl text-ink">Service Registry Not Found</h2>
        <p className="text-sm text-muted">The requested service details could not be loaded from our registry database.</p>
        <Link href="/catalog" className="px-6 py-2.5 bg-primary text-canvas font-bold rounded-xl mt-4 self-center">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const provider = service.provider || {
    name: "Lakhnavi Verified Pro",
    rating: 4.8,
    experience_years: 5,
    bio_en: "Hyper-vetted local partner matching Lakhnavi Sewa strict guidelines.",
    bio_hi: "लखनवी सेवा के सख्त दिशानिर्देशों से मेल खाने वाले अति-जांचे गए स्थानीय पार्टनर।",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* Left Columns - Details */}
      <div className="lg:col-span-2 flex flex-col gap-10">
        {/* Service Header card */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-lg uppercase tracking-wide">
              {service.category}
            </span>
            <span className="flex items-center gap-1 text-sm font-bold text-ink bg-surface border border-borderColor px-2.5 py-1 rounded-lg">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              {service.rating} ({service.reviews_count || 15} reviews)
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight">
            {language === 'en' ? service.title_en : service.title_hi}
          </h1>

          <p className="text-sm text-muted font-medium leading-relaxed bg-surface p-4 rounded-xl border border-borderColor/60 mt-2">
            {language === 'en' ? service.description_en : service.description_hi}
          </p>
        </div>

        {/* Localized Vetting Check */}
        <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl flex flex-col gap-3">
          <h3 className="font-bold text-ink flex items-center gap-2 text-sm uppercase tracking-wide">
            <ShieldCheck size={18} className="text-primary" /> Lakhnavi Vetting Guarantee
          </h3>
          <p className="text-xs text-muted leading-relaxed font-semibold">
            Every specialist is vetted through an extensive checklist including ID verification, local trade tests, criminal registry scans, and real customer reviews.
          </p>
        </div>

        {/* Assigned Provider Profile */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-extrabold text-ink">Assigned Professional</h2>
          <div className="bg-canvas border border-borderColor rounded-2xl p-6 flex flex-col md:flex-row gap-6">
            <img
              src={provider.avatar}
              alt={provider.name}
              className="w-20 h-20 rounded-2xl object-cover shrink-0 self-start md:self-center"
            />
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <h3 className="font-extrabold text-lg text-ink">{provider.name}</h3>
                <span className="flex items-center gap-1 text-xs font-bold text-ink bg-surface border border-borderColor px-2 py-0.5 rounded-md">
                  <Award size={12} className="text-primary" /> {provider.experience_years} Yrs Exp
                </span>
              </div>
              <p className="text-xs text-muted leading-relaxed font-semibold">
                {language === 'en' ? provider.bio_en : provider.bio_hi}
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted mt-1">
                <MapPin size={12} className="text-accent" />
                <span>Operating area: {service.locality}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-extrabold text-ink">Recent Customer Reviews</h2>
          <div className="flex flex-col gap-4">
            {MOCK_REVIEWS.map((rev, idx) => (
              <div key={idx} className="p-5 border border-borderColor rounded-2xl flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-ink">{rev.name}</span>
                  <span className="text-muted">{rev.date}</span>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-muted font-semibold leading-relaxed">{rev.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Booking Details panel */}
      <aside className="w-full h-fit sticky top-28 bg-surface border border-borderColor rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-xl">
        <h3 className="text-xl font-extrabold text-ink">Booking Details</h3>

        <div className="flex flex-col gap-4 border-b border-borderColor/60 pb-6 text-sm font-semibold">
          <div className="flex justify-between items-center">
            <span className="text-muted flex items-center gap-1.5"><Clock size={16} /> Estimated duration</span>
            <span className="text-ink">{service.duration_mins} Minutes</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted flex items-center gap-1.5"><MapPin size={16} className="text-accent" /> Base Locality</span>
            <span className="text-ink">{service.locality}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted flex items-center gap-1.5"><Star size={16} className="text-amber-500 fill-amber-500" /> Rated score</span>
            <span className="text-ink">{service.rating} / 5.0</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs text-muted font-bold uppercase">Estimated rate</span>
            <span className="text-3xl font-black text-ink">₹{currentPrice}</span>
          </div>
          <span className="text-[10px] text-muted font-bold bg-surface2 px-2.5 py-1 rounded-md">INC. ALL TAXES</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isAvailable) return;
            if (!user) {
              setIsAuthModalOpen(true);
            } else {
              router.push(`/booking?service_id=${service.id}`);
            }
          }}
          disabled={!isAvailable}
          className={`w-full font-bold text-center py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider ${
            isAvailable 
              ? 'bg-primary hover:bg-primary-hover text-canvas shadow-lg shadow-primary/20' 
              : 'bg-muted/20 text-muted border border-borderColor cursor-not-allowed'
          }`}
        >
          <Calendar size={16} />
          <span>{isAvailable ? t('bookNow') : (language === 'en' ? 'Service Paused' : 'सेवा रोकी गई')}</span>
        </button>

        <UnifiedAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={() => {
            setIsAuthModalOpen(false);
            router.push(`/booking?service_id=${service.id}`);
          }}
        />

        <div className="flex gap-2 items-center text-[10px] text-muted font-bold uppercase justify-center mt-2">
          <ShieldAlert size={12} className="text-accent" />
          <span>Pay after job completion</span>
        </div>
      </aside>
    </div>
  );
}
