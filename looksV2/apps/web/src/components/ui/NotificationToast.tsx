'use client';

import React from 'react';
import { useApp } from '../AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Info, CheckCircle, AlertTriangle } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications } = useApp();

  return (
    <div className="fixed top-6 right-6 z-50 space-y-3.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {notifications.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 50, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="pointer-events-auto bg-[#1A1A2E]/95 backdrop-blur-md border border-[#DDE2F0]/20 text-white rounded-2xl p-4 shadow-2xl flex items-start space-x-3.5"
          >
            <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
              item.type === 'success' ? 'bg-[#10B981]/20 text-[#10B981]' : 
              item.type === 'warning' ? 'bg-[#FF6B6B]/20 text-[#FF6B6B]' : 
              'bg-primary/20 text-primary'
            }`}>
              {item.type === 'success' ? <CheckCircle size={16} /> : 
               item.type === 'warning' ? <AlertTriangle size={16} /> : 
               <Info size={16} />}
            </div>
            
            <div className="flex-grow flex flex-col gap-0.5">
              <p className="text-xs font-semibold leading-relaxed text-slate-100">{item.message}</p>
              <span className="text-[9px] text-[#6E7191] font-bold uppercase">{item.timestamp}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
export default NotificationToast;
