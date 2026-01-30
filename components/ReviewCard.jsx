'use client';

import { motion } from 'framer-motion';
import StarRating from './StarRating';

export default function ReviewCard({ userName, rating, comment, date, darkMode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}
        >
            <div className="flex items-start justify-between mb-2">
                <div>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {userName}
                    </p>
                    <StarRating value={rating} readonly size={16} />
                </div>
                <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {new Date(date).toLocaleDateString()}
                </span>
            </div>
            {comment && (
                <p className={`text-sm mt-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {comment}
                </p>
            )}
        </motion.div>
    );
}
