'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useState } from 'react';

const MOODS = [
    { emoji: '😍', label: 'Excellent', value: 5 },
    { emoji: '🙂', label: 'Good', value: 4 },
    { emoji: '😐', label: 'Average', value: 3 },
    { emoji: '😕', label: 'Poor', value: 2 },
    { emoji: '😡', label: 'Terrible', value: 1 },
];

const FEEDBACK_TAGS = [
    'Well Organized', 'Fun Activities', 'Late Start', 'Poor Audio', 'Great Speakers', 'Bad Location', 'Good Food'
];

export default function ReviewModal({ event, onClose, onSubmit, darkMode }) {
    const [mood, setMood] = useState(null); // value 1-5
    const [selectedTags, setSelectedTags] = useState([]);
    const [showNotes, setShowNotes] = useState(false);
    const [publicNote, setPublicNote] = useState('');
    const [privateNote, setPrivateNote] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleTagToggle = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleSubmit = async () => {
        if (!mood) return;

        setSubmitting(true);
        try {
            const finalPublicComment = selectedTags.length > 0
                ? `[Tags: ${selectedTags.join(', ')}] ${publicNote}`
                : publicNote;

            await onSubmit(mood, finalPublicComment, privateNote);
            onClose();
        } catch (error) {
            console.error('Review submission failed:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl transition-colors duration-300 ${darkMode ? 'bg-slate-950 border border-white/10 text-white' : 'bg-white border border-slate-200 text-slate-900'
                    }`}
            >
                <div className="relative p-6 space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-1.5 relative">
                        <button
                            onClick={onClose}
                            className={`absolute -top-2 -right-2 p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-bold tracking-tight">
                            How was the event?
                        </h2>
                        <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {event?.title}
                        </p>
                    </div>

                    {/* Step 1: Mood Selection */}
                    <div className="flex justify-center gap-3 sm:gap-4">
                        {MOODS.map((m) => (
                            <button
                                key={m.value}
                                onClick={() => setMood(m.value)}
                                className={`relative p-3 rounded-full transition-all duration-200 focus:outline-none ${mood === m.value
                                        ? "bg-slate-100 dark:bg-slate-800 scale-110 shadow-sm"
                                        : "opacity-70 hover:opacity-100 hover:scale-105"
                                    }`}
                            >
                                <span className="text-3xl sm:text-4xl filter drop-shadow-sm">{m.emoji}</span>
                                {mood === m.value && (
                                    <motion.div
                                        layoutId="activeMood"
                                        className="absolute inset-0 rounded-full border-2 border-blue-500"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Step 2: Quick Feedback Tags */}
                    <div className="space-y-3">
                        <label className={`text-center block text-xs uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            What stood out?
                        </label>
                        <div className="flex flex-wrap justify-center gap-2">
                            {FEEDBACK_TAGS.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => handleTagToggle(tag)}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all border ${selectedTags.includes(tag)
                                            ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                                            : darkMode
                                                ? "bg-transparent border-slate-700 text-slate-300 hover:border-slate-500"
                                                : "bg-transparent border-slate-200 text-slate-600 hover:border-slate-400"
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 3: Optional Notes */}
                    <div className={`space-y-2 pt-4 border-t ${darkMode ? 'border-white/10' : 'border-slate-100'}`}>
                        <button
                            onClick={() => setShowNotes(!showNotes)}
                            className={`flex items-center justify-center w-full text-xs font-medium transition-colors gap-2 py-2 ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            {showNotes ? "Hide details" : "Add more details"}
                            {showNotes ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>

                        <AnimatePresence>
                            {showNotes && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden space-y-4"
                                >
                                    <div className="space-y-2">
                                        <label className={`text-xs block ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Public Review</label>
                                        <textarea
                                            placeholder="Sharing your experience helps others..."
                                            value={publicNote}
                                            onChange={(e) => setPublicNote(e.target.value)}
                                            className={`w-full min-h-[80px] p-3 rounded-xl resize-none text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${darkMode ? 'bg-white/5 text-white placeholder:text-slate-600' : 'bg-slate-50 text-slate-900 placeholder:text-slate-400'
                                                }`}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className={`text-xs block ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Private Note</label>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${darkMode ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>Admins Only</span>
                                        </div>
                                        <textarea
                                            placeholder="Feedback for the organizers..."
                                            value={privateNote}
                                            onChange={(e) => setPrivateNote(e.target.value)}
                                            className={`w-full min-h-[80px] p-3 rounded-xl resize-none text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${darkMode ? 'bg-white/5 text-white placeholder:text-slate-600' : 'bg-slate-50 text-slate-900 placeholder:text-slate-400'
                                                }`}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Step 4: Submit Bar */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className={`flex-1 py-3 rounded-xl font-medium text-sm transition-colors ${darkMode ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            Skip
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!mood || submitting}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${!mood || submitting
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600"
                                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-[1.02] shadow-blue-500/25"
                                }`}
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Sending...
                                </span>
                            ) : (
                                "Submit Feedback"
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
