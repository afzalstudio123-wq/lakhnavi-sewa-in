'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from './AppContext';
import { Globe, User, LogOut, LayoutGrid, HelpCircle, Info, Mail } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t, user, logout } = useApp();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/auth';
    if (user.role === 'PROVIDER') return '/dashboard/provider';
    if (user.role === 'ADMIN') return '/antigravity-admin-gate';
    return '/dashboard/customer';
  };

  return (
    <nav className="sticky top-0 z-40 bg-canvas/80 backdrop-blur-md border-b border-borderColor py-4 px-6 md:px-12 flex justify-between items-center transition-all">
      <Link href="/" className="flex items-center gap-2 group">
        <span className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-canvas font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
          LS
        </span>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-ink tracking-tight group-hover:text-primary transition-colors">
            {t('brand')}
          </span>
          <span className="text-[10px] text-muted -mt-1 font-semibold tracking-wider uppercase">
            Lucknow
          </span>
        </div>
      </Link>

      <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-muted">
        <Link href="/catalog" className="flex items-center gap-1.5 hover:text-primary transition-colors">
          <LayoutGrid size={16} />
          {t('categories')}
        </Link>
        <Link href="/about" className="flex items-center gap-1.5 hover:text-primary transition-colors">
          <Info size={16} />
          {t('about')}
        </Link>
        <Link href="/contact" className="flex items-center gap-1.5 hover:text-primary transition-colors">
          <Mail size={16} />
          {t('contact')}
        </Link>
        <Link href="/faq" className="flex items-center gap-1.5 hover:text-primary transition-colors">
          <HelpCircle size={16} />
          {t('faq')}
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Toggler */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-borderColor hover:bg-surface2 text-xs font-bold transition-all"
        >
          <Globe size={14} className="text-primary" />
          <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
        </button>

        {user ? (
          <div className="flex items-center gap-3">
            <Link
              href={getDashboardLink()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-surface2 border border-borderColor text-sm font-bold text-ink transition-all"
            >
              <User size={16} className="text-primary" />
              <span className="max-w-[100px] truncate">{user.name || 'Dashboard'}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl border border-borderColor hover:bg-semantic-error/10 hover:text-semantic-error transition-all"
              title={t('logout')}
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/auth?role=CUSTOMER"
              className="text-sm font-semibold hover:text-primary transition-colors px-3 py-2"
            >
              {t('login')}
            </Link>
            <Link
              href="/auth?role=PROVIDER"
              className="text-sm font-bold bg-primary text-canvas px-4 py-2.5 rounded-xl hover:bg-primary-hover shadow-md shadow-primary/10 transition-all hover:translate-y-[-1px]"
            >
              {t('signup')}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
