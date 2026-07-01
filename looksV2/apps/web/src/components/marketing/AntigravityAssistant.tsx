'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, Send } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'system';
  text: string;
  timestamp: string;
}

export const AntigravityAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'system', text: 'नमस्कार! मैं Antigravity AI हूँ। लखनऊ में आपको किस प्रकार के ठेकेदार या लेबर की आवश्यकता है?', timestamp: '15:00' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const triggerMockAnalysis = (userQuery: string) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      let replyText = "I parsed your query but couldn't find a matching local trade group. Try typing 'labor' or 'builder'.";
      
      if (userQuery.toLowerCase().includes('labour') || userQuery.includes('लेबर') || userQuery.includes('काम')) {
        replyText = "I found 12 Verified Indian Labours available immediately in Hazratganj & Aliganj sector pools. Budget ranges: ₹400-₹600/day.";
      } else if (userQuery.toLowerCase().includes('builder') || userQuery.includes('ठेकेदार') || userQuery.includes('construction') || userQuery.toLowerCase().includes('contractor')) {
        replyText = "Top matching action: 'Awadh Structural Builders (Gomti Nagar)' and 'Sanjay Bajpai' are ready to issue custom project cost estimations.";
      } else if (userQuery.toLowerCase().includes('plumbing') || userQuery.toLowerCase().includes('plumber') || userQuery.includes('नल')) {
        replyText = "Emergency plumbing services available in Hazratganj. Standard diagnostics fee ₹490.";
      } else if (userQuery.toLowerCase().includes('salon') || userQuery.toLowerCase().includes('beauty') || userQuery.includes('सैलून')) {
        replyText = "Premium Salon at Home package is available today. Vetted provider: Priya Sharma.";
      }

      setMessages((prev) => [
        ...prev,
        { id: Math.random().toString(), sender: 'system', text: replyText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 1400);
  };

  const handleFormSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMsg: Message = { 
      id: Math.random().toString(), 
      sender: 'user', 
      text: inputValue, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setMessages((prev) => [...prev, newMsg]);
    const storedQuery = inputValue;
    setInputValue('');
    triggerMockAnalysis(storedQuery);
  };

  return (
    <div className="w-full bg-white border border-[#DDE2F0] rounded-2xl shadow-xl overflow-hidden flex flex-col h-[400px]">
      <div className="bg-[#5C33F6] p-4 flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-[#10B981] rounded-full animate-pulse" />
          <div>
            <h3 className="text-sm font-semibold tracking-wide flex items-center gap-1">
              <Sparkles size={14} className="text-accent" />
              Antigravity AI Assistant
            </h3>
            <p className="text-[10px] text-[#EEF0F8]">Hyperlocal Lucknow Support Engine</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8F9FC]">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                msg.sender === 'user' ? 'bg-[#5C33F6] text-white rounded-br-none' : 'bg-[#EEF0F8] text-[#1A1A2E] rounded-bl-none border border-[#DDE2F0]'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isAnalyzing && (
          <div className="flex justify-start space-x-2 p-2">
            <div className="h-4 w-24 bg-[#EEF0F8] animate-pulse rounded-full" />
            <div className="h-4 w-12 bg-[#EEF0F8] animate-pulse rounded-full" />
          </div>
        )}
      </div>

      <form onSubmit={handleFormSubmission} className="p-3 border-t border-[#DDE2F0] bg-white flex space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask AI: e.g., 'Labour chahiye Hazratganj me'..."
          className="flex-1 px-4 py-2 border border-[#DDE2F0] rounded-xl text-xs focus:outline-none focus:border-[#5C33F6] text-[#1A1A2E]"
        />
        <button type="submit" className="bg-[#5C33F6] hover:bg-[#4B29D4] text-white p-2.5 rounded-xl transition-colors">
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};
export default AntigravityAssistant;
