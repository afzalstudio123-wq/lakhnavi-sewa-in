'use client';

import React from 'react';
import { useApp } from '@/components/AppContext';
import { Landmark, Compass, Users2, Shield } from 'lucide-react';

export default function AboutPage() {
  const { t, language } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col gap-16">
      <div className="text-center flex flex-col gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">
          {language === 'en' ? 'Our Story & Vision' : 'हमारी कहानी और दृष्टिकोण'}
        </h1>
        <p className="text-lg text-muted max-w-xl mx-auto leading-relaxed">
          {t('aboutDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <div className="p-6 rounded-2xl bg-surface border border-borderColor flex flex-col gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Landmark size={20} />
          </div>
          <h3 className="font-bold text-lg text-ink">
            {language === 'en' ? 'Lucknow Roots' : 'लखनऊ की जड़ें'}
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            Headquartered in Hazratganj, we build services specifically configured for Lucknow local areas. We understand the nuances of the local workforce.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-borderColor flex flex-col gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            <Compass size={20} />
          </div>
          <h3 className="font-bold text-lg text-ink">
            {language === 'en' ? 'Bilingual Platform' : 'द्विभाषी मंच'}
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            Our platform provides Hindi and English languages so that local laborers, builders, and contractors can navigate and interact as easily as clients.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-borderColor flex flex-col gap-3">
          <div className="w-10 h-10 rounded-lg bg-semantic-success/10 flex items-center justify-center text-semantic-success">
            <Users2 size={20} />
          </div>
          <h3 className="font-bold text-lg text-ink">
            {language === 'en' ? 'Economic Empowerment' : 'आर्थिक सशक्तिकरण'}
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            We offer fair wage standards for workers, insurance guidelines, and directly connect them to high-end households, boosting Lucknow’s micro-economy.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-borderColor flex flex-col gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
            <Shield size={20} />
          </div>
          <h3 className="font-bold text-lg text-ink">
            {language === 'en' ? 'Premium Vetting' : 'प्रीमियम स्क्रीनिंग'}
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            Every specialist, mason, and plumber undergoes screening including physical address confirmation, reference tests, and skill checks.
          </p>
        </div>
      </div>
    </div>
  );
}
