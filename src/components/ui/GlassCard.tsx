'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'highlight' | 'danger';
    hoverEffect?: boolean;
}

export function GlassCard({
    children,
    className,
    variant = 'default',
    hoverEffect = true,
    ...props
}: GlassCardProps) {
    const variants = {
        default: 'bg-white/60 border-white/40',
        highlight: 'bg-blue-50/80 border-blue-200',
        danger: 'bg-red-50/80 border-red-200',
    };

    return (
        <motion.div
            className={cn(
                'backdrop-blur-xl border rounded-3xl shadow-lg overflow-hidden relative',
                variants[variant],
                hoverEffect && 'hover:shadow-xl transition-shadow duration-300',
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
