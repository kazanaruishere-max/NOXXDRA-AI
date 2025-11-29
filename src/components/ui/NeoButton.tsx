'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface NeoButtonProps extends HTMLMotionProps<'button'> {
    children: ReactNode;
    className?: string;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
}

export function NeoButton({
    children,
    className,
    variant = 'primary',
    size = 'md',
    ...props
}: NeoButtonProps) {
    const variants = {
        primary: 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-900/20',
        secondary: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50',
        ghost: 'bg-transparent text-gray-600 hover:bg-gray-100/50',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
        icon: 'p-2',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                'rounded-xl font-medium transition-colors flex items-center justify-center gap-2',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
}
