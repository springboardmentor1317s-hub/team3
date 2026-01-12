'use client';

import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StarRating({ value = 0, onChange, readonly = false, size = 24 }) {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="flex gap-1">
            {stars.map((star) => (
                <motion.button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => !readonly && onChange && onChange(star)}
                    whileHover={!readonly ? { scale: 1.2 } : {}}
                    whileTap={!readonly ? { scale: 0.9 } : {}}
                    className={`${readonly ? 'cursor-default' : 'cursor-pointer'} transition-colors`}
                >
                    <Star
                        size={size}
                        className={`${star <= value
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-none text-gray-300'
                            } transition-all`}
                    />
                </motion.button>
            ))}
        </div>
    );
}
