// src/hooks/useCursorTracker.ts
/**
 * Ultra-responsive cursor tracking for 120-240 FPS
 * Supports desktop mouse and mobile device orientation
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { mapRange, clamp, expSmooth, SMOOTHING } from '@/lib/math';

interface CursorPosition {
    nx: number; // Normalized X: -1 (left) to 1 (right)
    ny: number; // Normalized Y: -1 (bottom) to 1 (top)
}

export function useCursorTracker() {
    const [position, setPosition] = useState<CursorPosition>({ nx: 0, ny: 0 });

    // Refs for high-frequency updates
    const rafRef = useRef<number>();
    const targetRef = useRef<CursorPosition>({ nx: 0, ny: 0 });
    const currentRef = useRef<CursorPosition>({ nx: 0, ny: 0 });
    const lastTimeRef = useRef<number>(performance.now());
    const isMobileRef = useRef(false);

    useEffect(() => {
        // ========================================================================
        // DESKTOP: Mouse tracking
        // ========================================================================
        const handleMouseMove = (e: MouseEvent) => {
            if (isMobileRef.current) return;

            // Map to normalized range [-1, 1]
            const nx = mapRange(e.clientX, 0, window.innerWidth, -1, 1);
            const ny = mapRange(e.clientY, 0, window.innerHeight, 1, -1); // Inverted Y

            targetRef.current = { nx, ny };
        };

        // ========================================================================
        // MOBILE: Device orientation
        // ========================================================================
        const handleOrientation = (e: DeviceOrientationEvent) => {
            if (e.gamma !== null && e.beta !== null) {
                // gamma: left/right tilt (-90 to 90)
                // beta: front/back tilt (-180 to 180)
                const nx = clamp(e.gamma / 45, -1, 1);
                const ny = clamp((e.beta - 90) / 45, -1, 1);

                targetRef.current = { nx, ny };
            }
        };

        // Request permission for iOS 13+
        const requestOrientationPermission = async () => {
            if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
                try {
                    const permission = await (DeviceOrientationEvent as any).requestPermission();
                    if (permission === 'granted') {
                        window.addEventListener('deviceorientation', handleOrientation);
                    }
                } catch (error) {
                    console.warn('Device orientation permission denied');
                }
            } else {
                // Non-iOS devices
                window.addEventListener('deviceorientation', handleOrientation);
            }
        };

        // ========================================================================
        // SETUP: Detect mobile and attach listeners
        // ========================================================================
        const setup = () => {
            isMobileRef.current = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
                window.matchMedia('(max-width: 768px)').matches;

            if (isMobileRef.current) {
                requestOrientationPermission();
            } else {
                window.addEventListener('mousemove', handleMouseMove, { passive: true });
            }
        };

        setup();

        // ========================================================================
        // ANIMATION LOOP: Frame-rate independent smoothing
        // ========================================================================
        const animate = (currentTime: number) => {
            // Calculate delta time (capped at 100ms to prevent large jumps)
            const dt = Math.min((currentTime - lastTimeRef.current) / 1000, 0.1);
            lastTimeRef.current = currentTime;

            // Exponential smoothing for ultra-smooth motion
            currentRef.current.nx = expSmooth(
                currentRef.current.nx,
                targetRef.current.nx,
                SMOOTHING.CURSOR,
                dt
            );
            currentRef.current.ny = expSmooth(
                currentRef.current.ny,
                targetRef.current.ny,
                SMOOTHING.CURSOR,
                dt
            );

            // Update state (React will batch this)
            setPosition({ ...currentRef.current });

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        // ========================================================================
        // CLEANUP
        // ========================================================================
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    return position;
}
