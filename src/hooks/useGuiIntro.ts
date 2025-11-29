'use client';

import { useEffect } from 'react';
import { useSystem } from '@/context/SystemContext';

/**
 * useGuiIntro
 * 
 * Listens for the "intro-done" message from the Spline scene.
 * Triggers the GUI entrance animation via SystemContext.
 * Includes a fallback timeout in case the message is missed.
 */
export const useGuiIntro = () => {
    const { setGuiVisible } = useSystem();

    useEffect(() => {
        const handleMessage = (e: MessageEvent) => {
            // Security check: ensure origin is trusted if needed (omitted for demo)
            if (e.data === 'intro-done') {
                console.log('🤖 Robot Intro Finished (Signal Received)');
                setGuiVisible(true);
            }
        };

        window.addEventListener('message', handleMessage);

        // Fallback: If no signal received after 3.5s (2.5s intro + buffer), force show GUI
        const fallbackTimer = setTimeout(() => {
            setGuiVisible((prev) => {
                if (!prev) {
                    console.log('⚠️ Robot Intro Signal Timeout - Forcing GUI');
                    return true;
                }
                return prev;
            });
        }, 3500);

        return () => {
            window.removeEventListener('message', handleMessage);
            clearTimeout(fallbackTimer);
        };
    }, [setGuiVisible]);
};
