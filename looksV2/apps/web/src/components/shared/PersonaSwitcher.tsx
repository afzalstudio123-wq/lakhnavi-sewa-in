'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PersonaSwitcherProps {
  currentPersona: 'customer' | 'provider' | 'admin';
  onPersonaChange: (persona: 'customer' | 'provider' | 'admin') => void;
}

export const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({
  currentPersona,
  onPersonaChange,
}) => {
  const personas = [
    { id: 'customer', label: 'Customer / ग्राहक' },
    { id: 'provider', label: 'Provider / प्रदाता' },
  ] as const;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#1A1A2E] border border-[#DDE2F0] shadow-2xl rounded-full p-2 flex items-center space-x-2">
      {personas.map((persona) => {
        const isActive = currentPersona === persona.id;
        return (
          <button
            key={persona.id}
            onClick={() => onPersonaChange(persona.id)}
            className={`relative px-4 py-2 rounded-full text-xs font-semibold transition-colors duration-200 uppercase tracking-wider ${
              isActive ? 'text-white' : 'text-[#6E7191] hover:text-[#EEF0F8]'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activePersonaIndicator"
                className="absolute inset-0 bg-[#5C33F6] rounded-full -z-10"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            {persona.label}
          </button>
        );
      })}
    </div>
  );
};
export default PersonaSwitcher;
