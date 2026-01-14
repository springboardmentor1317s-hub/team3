'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Moon, Lightbulb, Zap, Turtle, ThumbsUp } from 'lucide-react';

const reactions = [
    { type: 'interesting', icon: Flame, label: 'Interesting', color: 'from-orange-500 to-red-500', emoji: '🔥' },
    { type: 'boring', icon: Moon, label: 'Boring', color: 'from-gray-500 to-gray-600', emoji: '😴' },
    { type: 'confusing', icon: Lightbulb, label: 'Confusing', color: 'from-yellow-500 to-amber-500', emoji: '💡' },
    { type: 'tooFast', icon: Zap, label: 'Too Fast', color: 'from-red-500 to-pink-500', emoji: '⚡' },
    { type: 'tooSlow', icon: Turtle, label: 'Too Slow', color: 'from-blue-500 to-cyan-500', emoji: '🐢' },
    { type: 'clear', icon: ThumbsUp, label: 'Clear', color: 'from-green-500 to-emerald-500', emoji: '👍' }
];

export default function FeedbackModal({ event, onClose, onSubmit, darkMode }) {
    const handleReaction = (reactionType) => {
        onSubmit(reactionType);
        // Don't close modal - allow multiple taps
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden ${darkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'
                        }`}
                >
                    {/* Header */}
                    <div className={`p-6 border-b ${darkMode ? 'border-white/10' : 'border-slate-200'}`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                    💬 Live Feedback
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

                    {/* Reaction Buttons */}
                    <div className="p-8">
                        <p className={`text-center mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            How's the session going? Tap to share your feedback (anonymous)
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {reactions.map((reaction, index) => (
                                <motion.button
                                    key={reaction.type}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleReaction(reaction.type)}
                                    className={`relative p-6 rounded-2xl bg-gradient-to-br ${reaction.color} text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all group overflow-hidden`}
                                >
                                    {/* Ripple effect container */}
                                    <div className="absolute inset-0 bg-white/20 opacity-0 group-active:opacity-100 group-active:animate-ping rounded-2xl"></div>

                                    <div className="relative z-10 flex flex-col items-center gap-3">
                                        <span className="text-4xl">{reaction.emoji}</span>
                                        <span className="text-sm font-semibold">{reaction.label}</span>
                                    </div>
                                </motion.button>
                            ))}
                        </div>

                        <p className={`text-xs text-center mt-6 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            ✅ Anonymous • ✅ Tap multiple times • ✅ No typing required
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
