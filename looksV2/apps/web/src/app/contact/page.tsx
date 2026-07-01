'use client';

import React, { useState } from 'react';
import { useApp } from '@/components/AppContext';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const { t, language, showToast } = useApp();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill all fields', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      showToast('Your message has been sent successfully (Simulated)!');
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-16">
      <div className="flex flex-col gap-8 justify-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-ink">
            {language === 'en' ? 'Get in Touch' : 'हमसे संपर्क करें'}
          </h1>
          <p className="text-muted leading-relaxed font-medium">
            {t('contactDesc')}
          </p>
        </div>

        <div className="flex flex-col gap-6 mt-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-xs text-muted font-bold uppercase tracking-wider">Phone Support</p>
              <p className="font-bold text-ink">+91 98765 43210</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-xs text-muted font-bold uppercase tracking-wider">Email Address</p>
              <p className="font-bold text-ink">support@lakhnavisewa.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-semantic-success/10 flex items-center justify-center text-semantic-success">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-xs text-muted font-bold uppercase tracking-wider">Lucknow Office</p>
              <p className="font-bold text-ink">4th Floor, Halwasiya Market, Hazratganj, Lucknow, UP - 226001</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface p-8 rounded-3xl border border-borderColor shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <h3 className="text-xl font-bold text-ink">Send a Direct Query</h3>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase">Your Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-canvas border border-borderColor rounded-xl p-3.5 outline-none font-semibold text-sm focus:border-primary transition-all"
              placeholder="e.g. Arjun Mishra"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase">Your Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-canvas border border-borderColor rounded-xl p-3.5 outline-none font-semibold text-sm focus:border-primary transition-all"
              placeholder="e.g. arjun@example.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase">Message Details</label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="bg-canvas border border-borderColor rounded-xl p-3.5 outline-none font-semibold text-sm focus:border-primary transition-all resize-none"
              placeholder="Describe your service inquiry..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-hover text-canvas font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            <Send size={16} />
            <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
