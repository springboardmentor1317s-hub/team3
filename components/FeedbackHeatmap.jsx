'use client';

import { motion } from 'framer-motion';
import { Flame, Moon, Lightbulb, Zap, Turtle, ThumbsUp, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

const reactions = [
    { type: 'interesting', icon: Flame, label: 'Interesting', emoji: '🔥', color: 'bg-orange-500' },
    { type: 'boring', icon: Moon, label: 'Boring', emoji: '😴', color: 'bg-gray-500' },
    { type: 'confusing', icon: Lightbulb, label: 'Confusing', emoji: '💡', color: 'bg-yellow-500' },
    { type: 'tooFast', icon: Zap, label: 'Too Fast', emoji: '⚡', color: 'bg-red-500' },
    { type: 'tooSlow', icon: Turtle, label: 'Too Slow', emoji: '🐢', color: 'bg-blue-500' },
    { type: 'clear', icon: ThumbsUp, label: 'Clear', emoji: '👍', color: 'bg-green-500' }
];

export default function FeedbackHeatmap({ data, darkMode }) {
    if (!data || !data.timeBuckets || data.timeBuckets.length === 0) {
        return (
            <div className={`p-12 text-center rounded-3xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    No feedback data yet. Feedback will appear here during the event.
                </p>
            </div>
        );
    }

    const { timeBuckets, insights } = data;

    // Get max count for color intensity calculation
    const maxCount = Math.max(...timeBuckets.flatMap(bucket =>
        Object.values(bucket.reactions)
    ));

    // Calculate color intensity (0-1)
    const getIntensity = (count) => {
        if (count === 0) return 0;
        return Math.min(count / Math.max(maxCount, 10), 1);
    };

    // Get color with opacity based on count
    const getCellColor = (reactionType, count) => {
        const reaction = reactions.find(r => r.type === reactionType);
        if (!reaction || count === 0) {
            return darkMode ? 'bg-white/5' : 'bg-slate-100';
        }

        const intensity = getIntensity(count);
        const opacity = Math.max(0.2, intensity);

        return `${reaction.color}/[${opacity}]`;
    };

    return (
        <div className="space-y-6">
            {/* Insights Panel */}
            {insights && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Peak Engagement */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-6 rounded-2xl border ${darkMode ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'}`}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="text-green-500" size={24} />
                            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Peak Engagement</h3>
                        </div>
                        <p className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                            {insights.peakEngagement.time} min
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {insights.peakEngagement.count} 🔥 reactions
                        </p>
                    </motion.div>

                    {/* Drop-off Time */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`p-6 rounded-2xl border ${darkMode ? 'bg-gradient-to-br from-red-500/20 to-rose-500/20 border-red-500/30' : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'}`}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingDown className="text-red-500" size={24} />
                            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Drop-off Time</h3>
                        </div>
                        <p className={`text-2xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                            {insights.dropOff.time} min
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {insights.dropOff.count} 😴 reactions
                        </p>
                    </motion.div>

                    {/* Confusing Segment */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`p-6 rounded-2xl border ${darkMode ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-500/30' : 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200'}`}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle className="text-yellow-500" size={24} />
                            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Most Confusing</h3>
                        </div>
                        <p className={`text-2xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                            {insights.mostConfusing.time} min
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {insights.mostConfusing.count} 💡 reactions
                        </p>
                    </motion.div>
                </div>
            )}

            {/* Heatmap */}
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Feedback Heatmap
                </h3>

                <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                        {/* Header - Time slots */}
                        <div className="flex mb-2">
                            <div className="w-32"></div>
                            {timeBuckets.map((bucket, i) => (
                                <div key={i} className="flex-1 text-center">
                                    <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {bucket.time}min
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Rows - Each reaction type */}
                        {reactions.map((reaction) => (
                            <div key={reaction.type} className="flex items-center mb-2">
                                {/* Y-axis label */}
                                <div className="w-32 flex items-center gap-2">
                                    <span className="text-xl">{reaction.emoji}</span>
                                    <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        {reaction.label}
                                    </span>
                                </div>

                                {/* Cells */}
                                {timeBuckets.map((bucket, i) => {
                                    const count = bucket.reactions[reaction.type] || 0;
                                    return (
                                        <div
                                            key={i}
                                            className="flex-1 aspect-square mx-1 rounded-lg transition-all hover:scale-110 cursor-pointer relative group"
                                            style={{
                                                backgroundColor: count > 0
                                                    ? `rgba(${reaction.type === 'interesting' ? '249, 115, 22' :
                                                        reaction.type === 'boring' ? '107, 114, 128' :
                                                            reaction.type === 'confusing' ? '234, 179, 8' :
                                                                reaction.type === 'tooFast' ? '239, 68, 68' :
                                                                    reaction.type === 'tooSlow' ? '59, 130, 246' :
                                                                        '34, 197, 94'}, ${getIntensity(count)})`
                                                    : darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                                            }}
                                        >
                                            {count > 0 && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className={`text-xs font-bold ${count > 5 ? 'text-white' : darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                        {count}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                                {count} {reaction.label} at {bucket.time}min
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-6 flex items-center justify-center gap-4">
                    <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Less</span>
                    <div className="flex gap-1">
                        {[0.2, 0.4, 0.6, 0.8, 1].map((opacity, i) => (
                            <div
                                key={i}
                                className="w-6 h-6 rounded"
                                style={{ backgroundColor: `rgba(249, 115, 22, ${opacity})` }}
                            ></div>
                        ))}
                    </div>
                    <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>More</span>
                </div>
            </div>
        </div>
    );
}
