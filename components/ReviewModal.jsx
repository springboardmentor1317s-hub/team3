'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';
import StarRating from './StarRating';

export default function ReviewModal({ event, onClose, onSubmit, darkMode }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [privateFeedback, setPrivateFeedback] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        setSubmitting(true);
        try {
            await onSubmit(rating, comment, privateFeedback);
            onClose();
        } catch (error) {
            console.error('Review submission failed:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden ${darkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'
                    }`}
            >
                {/* Header */}
                <div className={`p-6 border-b ${darkMode ? 'border-white/10' : 'border-slate-200'}`}>
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                ⭐ Rate Event
                            </h2>
                            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                {event?.title}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-700'
                                }`}
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Star Rating */}
                    <div>
                        <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Your Rating *
                        </label>
                        <div className="flex justify-center">
                            <StarRating value={rating} onChange={setRating} size={40} />
                        </div>
                        {rating > 0 && (
                            <p className={`text-center mt-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                {rating === 1 && 'Poor'}
                                {rating === 2 && 'Fair'}
                                {rating === 3 && 'Good'}
                                {rating === 4 && 'Very Good'}
                                {rating === 5 && 'Excellent'}
                            </p>
                        )}
                    </div>

                    {/* Comment */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Your Review (Public) (Optional)
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            maxLength={500}
                            rows={3}
                            placeholder="Share your experience with everyone..."
                            className={`w-full p-4 rounded-xl border resize-none ${darkMode
                                ? 'bg-slate-800 border-white/10 text-white placeholder-slate-500'
                                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                                }`}
                        />
                        <p className={`text-xs mt-1 text-right ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            {comment.length}/500
                        </p>
                    </div>

                    {/* Private Feedback */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Private Feedback to Organizers (Only visible to admins)
                        </label>
                        <textarea
                            value={privateFeedback}
                            onChange={(e) => setPrivateFeedback(e.target.value)}
                            maxLength={1000}
                            rows={3}
                            placeholder="Constructive feedback, complaints, or private suggestions..."
                            className={`w-full p-4 rounded-xl border resize-none ${darkMode
                                ? 'bg-slate-800 border-white/10 text-white placeholder-slate-500'
                                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                                }`}
                        />
                        <p className={`text-xs mt-1 text-right ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            {privateFeedback.length}/1000
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={submitting}
                            className={`flex-1 py-3 rounded-xl font-medium transition-all ${darkMode
                                ? 'bg-white/10 hover:bg-white/20 text-white'
                                : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                                }`}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || rating === 0}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all ${submitting || rating === 0
                                ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                                : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg'
                                }`}
                        >
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
