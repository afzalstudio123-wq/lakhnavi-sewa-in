'use client';

import React, { useState } from 'react';
import { useApp } from '@/components/AppContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQPage() {
  const { t, language } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q_en: "How do you verify your professionals and daily laborers?",
      q_hi: "आप अपने पेशेवरों और दैनिक मजदूरों को कैसे सत्यापित करते हैं?",
      a_en: "All partners undergo structural background screening, reference checks, and local validation in Lucknow. For builder and contractor verticles, we inspect licenses and past projects.",
      a_hi: "सभी पार्टनर्स लखनऊ में ढांचागत पृष्ठभूमि स्क्रीनिंग, संदर्भ जांच और स्थानीय सत्यापन से गुजरते हैं। बिल्डर और ठेकेदार श्रेणियों के लिए, हम लाइसेंस और पिछले प्रोजेक्ट्स की जांच करते हैं।"
    },
    {
      q_en: "Is there a service coverage warranty?",
      q_hi: "क्या कोई सेवा कवरेज वारंटी है?",
      a_en: "Yes. Lakhnavi Sewa provides a flat 7-day guarantee on most repair, cleaning, and tech installations. If the issue is not fixed, our local Hazratganj response desk will deploy a resolving partner for free.",
      a_hi: "हाँ। लखनवी सेवा अधिकांश मरम्मत, सफाई और तकनीकी सेटअप पर 7 दिनों की गारंटी प्रदान करती है। यदि समस्या ठीक नहीं होती है, तो हमारी हजरतगंज प्रतिक्रिया टीम मुफ्त में अन्य पार्टनर भेजेगी।"
    },
    {
      q_en: "How are prices calculated?",
      q_hi: "कीमतों की गणना कैसे की जाती है?",
      a_en: "Our marketplace uses standardized rates tailored to Lucknow local standard costs. Masons and helper labor prices conform to hourly indices. The platform eliminates price haggling.",
      a_hi: "हमारा मार्केटप्लेस लखनऊ की स्थानीय मानक लागतों के अनुकूल मानकीकृत दरों का उपयोग करता है। राजमिस्त्री और सहायक मजदूरों की कीमतें प्रति घंटा सूचकांकों के अनुरूप होती हैं।"
    },
    {
      q_en: "Can I register as both provider and customer?",
      q_hi: "क्या मैं प्रदाता और ग्राहक दोनों के रूप में पंजीकरण कर सकता हूँ?",
      a_en: "Your account is bound to your phone number and selected role. To operate as both, you can register two accounts using separate active phone numbers.",
      a_hi: "आपका खाता आपके फोन नंबर और चुनी गई भूमिका से बंधा होता है। दोनों के रूप में काम करने के लिए, आप अलग-अलग सक्रिय फोन नंबरों का उपयोग करके दो खाते दर्ज कर सकते हैं।"
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 flex flex-col gap-12">
      <div className="text-center flex flex-col gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">
          {t('faqTitle')}
        </h1>
        <p className="text-muted font-medium">
          {language === 'en' ? 'Quick answers to clarify booking protocols and partner vetting.' : 'बुकिंग प्रक्रियाओं और पार्टनर स्क्रीनिंग को स्पष्ट करने के लिए त्वरित उत्तर।'}
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-borderColor rounded-2xl bg-surface overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-6 text-left flex justify-between items-center font-bold text-ink hover:bg-surface2 transition-colors gap-4"
              >
                <span>{language === 'en' ? faq.q_en : faq.q_hi}</span>
                {isOpen ? <ChevronUp size={18} className="text-primary shrink-0" /> : <ChevronDown size={18} className="text-muted shrink-0" />}
              </button>
              {isOpen && (
                <div className="p-6 pt-0 text-sm text-muted leading-relaxed border-t border-borderColor/50 bg-canvas">
                  {language === 'en' ? faq.a_en : faq.a_hi}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
