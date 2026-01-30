'use client';

import { motion } from 'framer-motion';
import { Flame, Moon, Lightbulb, Zap, Turtle, ThumbsUp, TrendingUp, TrendingDown, AlertTriangle, Play, Info } from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart,
    ReferenceLine
} from 'recharts';

const reactions = [
    { type: 'interesting', icon: Flame, label: 'Interesting', emoji: '🔥', color: '#f97316' }, // orange-500
    { type: 'boring', icon: Moon, label: 'Boring', emoji: '😴', color: '#6b7280' },      // gray-500
    { type: 'confusing', icon: Lightbulb, label: 'Confusing', emoji: '💡', color: '#eab308' }, // yellow-500
    { type: 'tooFast', icon: Zap, label: 'Too Fast', emoji: '⚡', color: '#ef4444' },     // red-500
    { type: 'tooSlow', icon: Turtle, label: 'Too Slow', emoji: '🐢', color: '#3b82f6' },    // blue-500
    { type: 'clear', icon: ThumbsUp, label: 'Clear', emoji: '👍', color: '#22c55e' }       // green-500
];

export default function FeedbackHeatmap({ data, startTime, darkMode }) {
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

    // Helper to format ms from start into absolute time with seconds
    const formatTime = (msFromStart) => {
        if (!startTime) return `${Math.floor(msFromStart / 60000)}m`;
        try {
            const date = new Date(new Date(startTime).getTime() + msFromStart);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        } catch (e) {
            return `${Math.floor(msFromStart / 60000)}m`;
        }
    };

    // Transform data for Recharts
    const chartData = timeBuckets.map(bucket => {
        const entry = { name: formatTime(bucket.time) };
        reactions.forEach(r => {
            entry[r.label] = bucket.reactions[r.type] || 0;
        });

        // Calculate Sentiment Score
        // Positive: Interesting (+1), Clear (+1)
        // Negative: Boring (-1), Confusing (-1)
        // Mild Negative: Too Fast (-0.5), Too Slow (-0.5)
        let score = 0;
        score += (bucket.reactions['interesting'] || 0) * 1;
        score += (bucket.reactions['clear'] || 0) * 1;
        score += (bucket.reactions['boring'] || 0) * -1;
        score += (bucket.reactions['confusing'] || 0) * -1;
        score += (bucket.reactions['tooFast'] || 0) * -0.5;
        score += (bucket.reactions['tooSlow'] || 0) * -0.5;

        entry['Net Sentiment'] = score;

        return entry;
    });

    // Calculate Summary Statistics
    const summaryStats = reactions.map(r => {
        const total = timeBuckets.reduce((acc, bucket) => acc + (bucket.reactions[r.type] || 0), 0);
        // Average per minute recorded
        const average = (total / Math.max(timeBuckets.length, 1)).toFixed(2);

        return {
            ...r,
            total,
            average
        };
    });

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={`p-4 rounded-xl shadow-xl border ${darkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
                    <p className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm mb-1">
                            <span style={{ color: entry.color }}>●</span>
                            <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
                                {entry.name}: <span className="font-bold">{Number(entry.value).toFixed(1)}</span>
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
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
                            {formatTime(insights.peakEngagement.time)}
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
                            {formatTime(insights.dropOff.time)}
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
                            {formatTime(insights.mostConfusing.time)}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {insights.mostConfusing.count} 💡 reactions
                        </p>
                    </motion.div>
                </div>
            )}

            {/* Main Chart Container */}
            <div className={`p-6 rounded-3xl border overflow-hidden ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className={`text-xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            Engagement Trends
                        </h3>
                        <div className={`mt-1 text-xs flex flex-wrap gap-x-4 gap-y-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            <span className="font-medium">Net Sentiment Score:</span>
                            <span><span className="text-green-500 font-bold">+1</span> Interesting/Clear</span>
                            <span><span className="text-red-500 font-bold">-1</span> Boring/Confusing</span>
                            <span><span className="text-amber-500 font-bold">-0.5</span> Pace</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${darkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                            DATA: TOTAL
                        </div>
                    </div>
                </div>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <defs>
                                <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#d946ef" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#d946ef" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#334155" : "#e2e8f0"} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }}
                                domain={['auto', 'auto']}
                            />
                            <Tooltip content={<CustomTooltip />} />

                            <ReferenceLine y={0} stroke={darkMode ? "#64748b" : "#cbd5e1"} strokeDasharray="3 3" />

                            {/* Sentiment Line - The "Curve" */}
                            <Line
                                type="monotone"
                                dataKey="Net Sentiment"
                                stroke="#d946ef"
                                strokeWidth={4}
                                dot={{ r: 4, fill: '#d946ef', strokeWidth: 2, stroke: darkMode ? '#0f172a' : '#fff' }}
                                activeDot={{ r: 8, strokeWidth: 0 }}
                                connectNulls
                                animationDuration={1000}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Summary Statistics Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {summaryStats.map((stat) => (
                    <div
                        key={stat.type}
                        className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg`} style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                                    <stat.icon size={20} />
                                </div>
                                <div>
                                    <p className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stat.label}</p>
                                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Event Reaction</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-500/5">
                                <div className="flex items-center gap-2">
                                    <Info size={14} className="opacity-50" />
                                    <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Total Reactions</span>
                                </div>
                                <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stat.total}</span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-500/5">
                                <div className="flex items-center gap-2">
                                    <TrendingUp size={14} className="opacity-50" />
                                    <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Avg / min</span>
                                </div>
                                <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stat.average}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
