'use client';

import { useSystem } from '@/context/SystemContext';

/**
 * useClockTick
 * 
 * Helper hook to get formatted time strings.
 * Uses the centralized time from SystemContext.
 */
export const useClockTick = () => {
    const { time } = useSystem();

    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');

    const dateString = time.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    return { hours, minutes, seconds, dateString, raw: time };
};
