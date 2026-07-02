'use client';

import React, { useState, useEffect } from 'react';
import { mockServices } from '../../services/mockServices';
import { Testimonial } from '../../mock/database';
import { Star, ShieldCheck, Search, Filter, ArrowLeft, ArrowRight, MessageSquarePlus } from 'lucide-react';
import { THEME } from '../../utils/theme';

export const TestimonialsHub: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'CUSTOMER' | 'PROVIDER'>('ALL');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  
  // Submit Form States
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'CUSTOMER' | 'PROVIDER'>('CUSTOMER');
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const loadData = () => {
    setTestimonials(mockServices.getTestimonials());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || !newName.trim()) return;

    mockServices.submitTestimonial({
      authorName: newName,
      role: newRole,
      rating: newRating,
      reviewText: newText
    });

    setShowSubmitModal(false);
    setNewName('');
    setNewText('');
    setNewRating(5);
    loadData();
    alert('Thank you! Your testimonial has been submitted and is pending administrator moderation review.');
  };

  // Filtering
  const filtered = testimonials.filter(t => {
    if (t.status !== 'APPROVED') return false; // Hide unmoderated ones
    const matchesSearch = t.authorName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.reviewText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' ? true : t.role === roleFilter;
    const matchesRating = ratingFilter === 0 ? true : t.rating >= ratingFilter;
    return matchesSearch && matchesRole && matchesRating;
  });

  // Pagination bounds
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className={THEME.heading}>Lakhnavi Vetted Testimonials</h2>
          <p className={THEME.subheading}>Real reviews from customers and registered partners across Lucknow.</p>
        </div>
        <button 
          onClick={() => setShowSubmitModal(true)}
          className={THEME.buttonPrimary}
        >
          <MessageSquarePlus size={16} />
          <span>Write Review</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface border border-borderColor p-4 rounded-2xl">
        <div className="flex items-center gap-2 bg-white border border-borderColor rounded-xl px-3 py-2">
          <Search size={16} className="text-muted" />
          <input 
            type="text" 
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="outline-none text-xs font-semibold text-ink w-full"
          />
        </div>

        <div className="flex items-center gap-2 bg-white border border-borderColor rounded-xl px-3 py-2">
          <Filter size={16} className="text-muted" />
          <select 
            value={roleFilter}
            onChange={(e: any) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
            className="outline-none text-xs font-semibold text-ink w-full"
          >
            <option value="ALL">All Roles</option>
            <option value="CUSTOMER">Customers Only</option>
            <option value="PROVIDER">Partners Only</option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-white border border-borderColor rounded-xl px-3 py-2">
          <Star size={16} className="text-muted" />
          <select 
            value={ratingFilter}
            onChange={(e) => { setRatingFilter(Number(e.target.value)); setCurrentPage(1); }}
            className="outline-none text-xs font-semibold text-ink w-full"
          >
            <option value={0}>All Ratings</option>
            <option value={5}>5 Stars Only</option>
            <option value={4}>4+ Stars</option>
            <option value={3}>3+ Stars</option>
          </select>
        </div>
      </div>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 gap-4">
        {paginatedItems.length === 0 ? (
          <div className="text-center py-12 bg-white border border-borderColor rounded-2xl">
            <span className="text-3xl">📭</span>
            <p className="text-xs font-bold text-muted mt-2">No matching testimonials found.</p>
          </div>
        ) : (
          paginatedItems.map(item => (
            <div key={item.id} className={THEME.card}>
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <img src={item.authorAvatar} alt={item.authorName} className="w-10 h-10 rounded-full border border-borderColor object-cover" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-sm text-ink">{item.authorName}</h4>
                      {item.isVerified && (
                        <span className="text-semantic-success flex items-center gap-0.5" title="Verified Member">
                          <ShieldCheck size={14} className="fill-semantic-success/10" />
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wide bg-primary/5 px-2 py-0.5 rounded-md">
                      {item.role}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      className={i < Math.floor(item.rating) ? 'fill-amber-400 text-amber-400' : 'text-borderColor'} 
                    />
                  ))}
                  <span className="text-xs font-black text-ink ml-1">{item.rating}</span>
                </div>
              </div>

              <p className="text-xs text-muted font-semibold leading-relaxed mt-4 bg-surface p-3.5 rounded-xl border border-borderColor/60">
                "{item.reviewText}"
              </p>
              
              <span className="text-[9px] text-[#6E7191] font-bold uppercase tracking-wider block mt-3 text-right">
                {item.timestamp}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 border-t border-borderColor pt-4">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="p-2 border border-borderColor hover:bg-surface disabled:opacity-30 rounded-xl transition-all"
          >
            <ArrowLeft size={16} />
          </button>
          <span className="text-xs font-black text-ink">Page {currentPage} of {totalPages}</span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="p-2 border border-borderColor hover:bg-surface disabled:opacity-30 rounded-xl transition-all"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Submit Testimonial Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl w-full max-w-md p-6 border border-borderColor flex flex-col gap-4 shadow-2xl animate-in zoom-in-95 duration-150 text-left">
            <h3 className="font-extrabold text-base text-ink">Submit Vetted Testimonial</h3>
            
            <div className="flex flex-col gap-1">
              <label className={THEME.label}>Your Name</label>
              <input 
                type="text" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter full name"
                className={THEME.input}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className={THEME.label}>Designation / Role</label>
              <select 
                value={newRole}
                onChange={(e: any) => setNewRole(e.target.value)}
                className={THEME.input}
              >
                <option value="CUSTOMER">Customer / ग्राहक</option>
                <option value="PROVIDER">Partner / सेवा प्रदाता</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className={THEME.label}>Rating Stars</label>
              <select 
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className={THEME.input}
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                <option value={3}>⭐⭐⭐ (3/5)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className={THEME.label}>Your Review Feedback</label>
              <textarea 
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Share your experience working with LakhnaviSewa..."
                className="bg-surface border border-borderColor rounded-xl px-4 py-3 text-xs font-semibold text-ink outline-none focus:border-primary transition-all w-full min-h-[100px] resize-none"
                required
              />
            </div>

            <div className="flex gap-3 mt-2">
              <button 
                type="button" 
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 border border-borderColor hover:bg-surface text-ink font-bold rounded-xl text-xs uppercase"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-xs uppercase tracking-wider"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
