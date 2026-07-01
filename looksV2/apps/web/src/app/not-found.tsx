'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/components/AppContext';
import { ArrowLeft, Ban } from 'lucide-react';

export default function NotFound() {
  const { t, language } = useApp();

  return (
    <div className="max-w-md mx-auto px-6 py-32 flex flex-col items-center text-center gap-6">
      <div className="w-20 h-20 rounded-3xl bg-accent/10 flex items-center justify-center text-accent animate-pulse">
        <Ban size={40} />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-6xl font-black tracking-tight text-ink">404</h1>
        <h3 className="text-xl font-bold text-ink">
          {language === 'en' ? 'Page Lost in Hazratganj' : 'हजरतगंज में रास्ता खो गया'}
        </h3>
        <p className="text-sm text-muted leading-relaxed font-medium">
          {language === 'en' ? 'The street or service category you are searching for does not exist in our system.' : 'आप जिस गली या सेवा श्रेणी की तलाश कर रहे हैं वह हमारे सिस्टम में मौजूद नहीं है।'}
        </p>
      </div>

      <Link
        href="/"
        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-canvas font-bold rounded-xl transition-all shadow-lg shadow-primary/10 mt-2"
      >
        <ArrowLeft size={16} />
        <span>{language === 'en' ? 'Back to Chowk' : 'मुख्य पृष्ठ पर वापस जाएं'}</span>
      </Link>
    </div>
  );
}
