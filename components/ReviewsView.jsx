'use client';

import React, { useState, useEffect } from 'react';
import { Star, FileText, User, Calendar, MessageSquare } from 'lucide-react';

export default function ReviewsView({ darkMode }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/admin/reviews', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setReviews(data.reviews || []);
                }
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className={`text-center py-12 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                <MessageSquare size={48} className={`mx-auto mb-4 ${darkMode ? 'text-slate-600' : 'text-slate-300'}`} />
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>No Reviews Yet</h3>
                <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Reviews from students will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <div className="grid gap-6">
                {reviews.map((review) => (
                    <div
                        key={review._id}
                        className={`p-6 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}
                    >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${darkMode ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'
                                    }`}>
                                    {review.rating}⭐
                                </div>
                                <div>
                                    <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                        {review.eventId?.title || 'Unknown Event'}
                                    </h3>
                                    <div className="flex items-center gap-4 mt-1">
                                        <div className={`flex items-center gap-1.5 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                            <User size={14} />
                                            {review.userName}
                                        </div>
                                        <div className={`flex items-center gap-1.5 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                            <Calendar size={14} />
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Public Comment */}
                            {review.comment && (
                                <div>
                                    <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                        Public Review
                                    </p>
                                    <p className={`p-3 rounded-xl text-sm ${darkMode ? 'bg-black/20 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                                        {review.comment}
                                    </p>
                                </div>
                            )}

                            {/* Private Feedback */}
                            {review.privateFeedback && (
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                                            Private Feedback
                                        </p>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${darkMode ? 'bg-pink-500/20 text-pink-300' : 'bg-pink-100 text-pink-700'
                                            }`}>
                                            Admin Only
                                        </span>
                                    </div>
                                    <p className={`p-3 rounded-xl text-sm ${darkMode ? 'bg-pink-900/10 border border-pink-500/10 text-slate-300' : 'bg-pink-50 border border-pink-100 text-slate-700'}`}>
                                        {review.privateFeedback}
                                    </p>
                                </div>
                            )}

                            {!review.comment && !review.privateFeedback && (
                                <p className={`text-sm italic ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                                    No written feedback provided.
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
