'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gavel, IndianRupee } from 'lucide-react';

interface BidProposal {
  id: string;
  providerName: string;
  amountINR: number;
  daysRequired: number;
  notesHindi: string;
}

export const BiddingEngine: React.FC = () => {
  const [bids, setBids] = useState<BidProposal[]>([
    { id: '1', providerName: 'Awadh Structural Builders', amountINR: 42000, daysRequired: 5, notesHindi: 'मटेरियल के साथ काम पक्का करके देंगे।' },
    { id: '2', providerName: 'Lucknow Masonry Contractors', amountINR: 39500, daysRequired: 7, notesHindi: 'लेबर कॉस्ट कम रहेगी, काम समय पर होगा।' }
  ]);
  const [customBidPrice, setCustomBidPrice] = useState('40000');

  const insertSystemGeneratedBid = () => {
    const userVal = parseFloat(customBidPrice) || 40000;
    const computedCounterProposal: BidProposal = {
      id: Math.random().toString(),
      providerName: 'Aminabad Labour Union Agent',
      amountINR: Math.round(userVal * 0.92),
      daysRequired: 4,
      notesHindi: 'कम बजट में तेज़ काम की गारंटी।'
    };
    setBids((prev) => [computedCounterProposal, ...prev]);
  };

  return (
    <div className="w-full bg-white border border-[#DDE2F0] rounded-2xl p-6 shadow-lg">
      <div className="border-b border-[#DDE2F0] pb-4 mb-6">
        <span className="bg-[#EEF0F8] text-[#5C33F6] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 w-fit">
          <Gavel size={12} /> Bidding Sandbox / टेंडर प्रणाली
        </span>
        <h2 className="text-xl font-bold text-[#1A1A2E] mt-2">Custom Project Procurement Engine</h2>
        <p className="text-xs text-[#6E7191] mt-1">Simulating variable marketplace adjustments for Lucknow Builders.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2">
          <label className="block text-[10px] font-bold text-[#1A1A2E] uppercase tracking-wider mb-2">
            Target Job Valuation / अपेक्षित बजट (₹)
          </label>
          <div className="flex items-center gap-2 bg-[#F8F9FC] border border-[#DDE2F0] rounded-xl px-4 py-2">
            <IndianRupee size={16} className="text-muted" />
            <input
              type="number"
              value={customBidPrice}
              onChange={(e) => setCustomBidPrice(e.target.value)}
              className="w-full bg-transparent outline-none text-sm font-bold text-[#1A1A2E]"
            />
          </div>
        </div>
        <div className="flex items-end">
          <button
            onClick={insertSystemGeneratedBid}
            className="w-full bg-[#5C33F6] text-white py-3.5 px-4 rounded-xl text-xs font-bold hover:bg-[#4B29D4] transition-all tracking-wide uppercase shadow-md shadow-[#5C33F6]/20"
          >
            Trigger Contractor Bids
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#6E7191] uppercase tracking-wider">Active Incoming Bids ({bids.length})</h3>
        {bids.map((bid) => (
          <motion.div
            key={bid.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="border border-[#DDE2F0] bg-[#F8F9FC] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0"
          >
            <div>
              <h4 className="text-sm font-bold text-[#1A1A2E]">{bid.providerName}</h4>
              <p className="text-xs text-[#6E7191] mt-0.5 italic">"{bid.notesHindi}"</p>
              <span className="inline-block mt-2 bg-[#EEF0F8] text-[#6E7191] text-[10px] px-2 py-0.5 rounded font-bold">
                Timeline: {bid.daysRequired} Days
              </span>
            </div>
            <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-0 border-[#DDE2F0] pt-2 sm:pt-0">
              <span className="text-base font-black text-[#1A1A2E] font-mono">
                ₹{bid.amountINR.toLocaleString('en-IN')}
              </span>
              <button className="sm:mt-2 bg-white border border-[#DDE2F0] text-[#1A1A2E] px-3 py-1.5 rounded-lg text-[11px] font-semibold hover:bg-[#EEF0F8] transition-colors">
                Accept Proposal
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default BiddingEngine;
