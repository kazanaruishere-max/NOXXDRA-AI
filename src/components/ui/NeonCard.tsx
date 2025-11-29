'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * NeonCard
 * 
 * A reusable glassmorphism card with dual-layer neon shadow.
 * Optimized for performance (will-change-transform).
 */

interface NeonCardProps {
    children: ReactNode;
    className?: string;
    delay?: number; // Stagger delay in seconds
}

export default function NeonCard({ children, className = '', delay = 0 }: NeonCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.65,
                ease: "easeOut",
                delay: delay
            }}
            className={`
        relative overflow-hidden
        bg-white/10 backdrop-blur-md border border-white/20
        rounded-2xl
        shadow-[0_0_6px_rgba(59,130,246,0.25),0_0_18px_rgba(59,130,246,0.45)]
        will-change-transform
        ${className}
      `}
        >
            {children}
        </motion.div>
    );
}
