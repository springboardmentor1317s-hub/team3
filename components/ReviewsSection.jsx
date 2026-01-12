'use client';

import { motion } from 'framer-motion';
import StarRating from './StarRating';
import ReviewCard from './ReviewCard';
import { useEffect, useState } from 'react';

export default function ReviewsSection({ eventId, darkMode }) {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`/api/reviews/${eventId}`);
                if (res.ok) {
                    const data = await res.json();
                    setReviews(data.reviews);
                    setAverageRating(data.averageRating);
                    setTotalReviews(data.totalReviews);
                }
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            fetchReviews();
        }
    }, [eventId]);

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Average Rating */}
            {totalReviews > 0 && (
                <div className={`p-6 rounded-2xl border text-center ${darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}>
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <span className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            {averageRating.toFixed(1)}
                        </span>
                        <div>
                            <StarRating value={Math.round(averageRating)} readonly size={24} />
                            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div>
                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Reviews
                </h3>
                {reviews.length > 0 ? (
                    <div className="space-y-3">
                        {reviews.map((review) => (
                            <ReviewCard
                                key={review._id}
                                userName={review.userName}
                                rating={review.rating}
                                comment={review.comment}
                                date={review.createdAt}
                                darkMode={darkMode}
                            />
                        ))}
                    </div>
                ) : (
                    <div className={`text-center py-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        <p>No reviews yet. Be the first to review this event!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
