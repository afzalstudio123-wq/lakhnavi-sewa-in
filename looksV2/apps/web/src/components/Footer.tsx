'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from './AppContext';
import { Sparkles, Landmark, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useApp();

  return (
    <footer className="bg-ink text-canvas border-t border-borderColor/10 pt-16 pb-8 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-canvas font-bold text-xl">
              LS
            </span>
            <div className="flex flex-col text-left">
              <span className="text-lg font-bold text-canvas tracking-tight">
                {t('brand')}
              </span>
              <span className="text-[10px] text-muted -mt-1 font-semibold tracking-wider uppercase">
                Lucknow
              </span>
            </div>
          </Link>
          <p className="text-sm text-muted mt-2 leading-relaxed">
            {t('subTagline')} Local solutions built with premium quality standards for Lucknow city.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-canvas uppercase tracking-wider mb-6 flex items-center gap-2">
            <Landmark size={14} className="text-accent" /> Verticals
          </h4>
          <ul className="space-y-3 text-sm text-muted">
            <li>Beauty & Grooming</li>
            <li>Home Repairs & Maintenance</li>
            <li>Cleaning & Pest Control</li>
            <li>Native Smart Products</li>
            <li>Indian Labours & Contractors</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-canvas uppercase tracking-wider mb-6 flex items-center gap-2">
            <Sparkles size={14} className="text-primary" /> Key Localities
          </h4>
          <ul className="space-y-3 text-sm text-muted">
            <li>Hazratganj, Chowk</li>
            <li>Gomti Nagar, Aliganj</li>
            <li>Indiranagar, Aminabad</li>
            <li>Janki Puram, Mahanagar</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-canvas uppercase tracking-wider mb-6 flex items-center gap-2">
            <Award size={14} className="text-semantic-success" /> Trust & Support
          </h4>
          <ul className="space-y-3 text-sm text-muted">
            <li><Link href="/about" className="hover:text-canvas transition-colors">About Team</Link></li>
            <li><Link href="/contact" className="hover:text-canvas transition-colors">Help Desk</Link></li>
            <li><Link href="/faq" className="hover:text-canvas transition-colors">FAQs</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-borderColor/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted">
        <div>
          {t('copyright')}
        </div>
        <div className="flex gap-6">
          <span className="hover:text-canvas cursor-pointer">Terms & Conditions</span>
          <span className="hover:text-canvas cursor-pointer">Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
