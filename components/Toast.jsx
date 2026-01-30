'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle size={20} className="text-green-500" />,
        error: <XCircle size={20} className="text-red-500" />,
        info: <AlertCircle size={20} className="text-blue-500" />
    };

    const colors = {
        success: 'from-green-500/20 to-emerald-500/20 border-green-500/50',
        error: 'from-red-500/20 to-rose-500/20 border-red-500/50',
        info: 'from-blue-500/20 to-cyan-500/20 border-blue-500/50'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9999] max-w-md w-full mx-4 bg-gradient-to-r ${colors[type]} backdrop-blur-xl border rounded-2xl shadow-2xl p-4`}
        >
            <div className="flex items-center gap-3">
                {icons[type]}
                <p className="text-white font-medium flex-1">{message}</p>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                    <X size={18} className="text-white/70" />
                </button>
            </div>
        </motion.div>
    );
}

export function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] flex flex-col items-center p-4 space-y-3 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => removeToast(toast.id)}
                            duration={toast.duration}
                        />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
}
