'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * GlassPanel (Soft Glassmorphism 2.0)
 * 
 * The core container for the new "Premium 10/10" design.
 * Features:
 * - Ultra-soft background (6-8% opacity)
 * - Heavy blur (20px)
 * - Golden Ratio Radius (21px or 34px)
 * - Cinematic Entrance Animation (0.8s, cubic-bezier)
 * - "Glow Sync" border flash effect
 */

interface GlassPanelProps {
    children: ReactNode;
    className?: string;
    side?: 'left' | 'right'; // Determines slide direction
    delay?: number;
    radius?: 'small' | 'large'; // 21px or 34px
}

export default function GlassPanel({
    children,
    className = '',
    side = 'left',
    delay = 0,
    radius = 'small'
}: GlassPanelProps) {

    const xOffset = side === 'left' ? -35 : 35;
    const borderRadius = radius === 'large' ? '34px' : '21px';

    return (
        <motion.div
            initial={{
                opacity: 0,
                x: xOffset,
                scale: 0.98 // Subtle scale for "bounce" feel
            }}
            animate={{
                opacity: 1,
                x: 0,
                scale: 1
            }}
            transition={{
                duration: 0.8,
                ease: [0.19, 1, 0.22, 1], // Custom cubic-bezier
                delay: delay
            }}
            style={{ borderRadius }}
            className={`
        relative overflow-hidden
        bg-[#F3F5FA]/[0.07] backdrop-blur-[20px]
        border border-white/20
        shadow-[0_8px_22px_rgba(0,0,0,0.08)]
        will-change-transform
        group
        ${className}
      `}
        >
            {/* Glow Sync Effect (Border Flash) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{
                    duration: 0.6,
                    delay: delay + 0.4, // Sync with entrance
                    times: [0, 0.5, 1]
                }}
                className="absolute inset-0 z-0 pointer-events-none rounded-[inherit] border-2 border-[#00E8FF] shadow-[0_0_15px_rgba(0,232,255,0.2)]"
            />

            {/* Content Container */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </motion.div>
    );
}
