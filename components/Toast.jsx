"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

const Toast = ({ message, type = "info", onClose, duration = 4000 }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);

    const variants = {
        initial: { opacity: 0, y: -20, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -20, scale: 0.9 }
    };

    const types = {
        success: { icon: CheckCircle, bg: "bg-green-500", border: "border-green-600" },
        error: { icon: XCircle, bg: "bg-red-500", border: "border-red-600" },
        info: { icon: Info, bg: "bg-blue-500", border: "border-blue-600" },
        warning: { icon: Info, bg: "bg-yellow-500", border: "border-yellow-600" }
    };

    const style = types[type] || types.info;
    const Icon = style.icon;

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl ${style.bg} text-white border ${style.border} min-w-[300px] max-w-md`}
                >
                    <Icon size={24} className="shrink-0" />
                    <p className="font-medium text-sm md:text-base grow">{message}</p>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X size={18} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
