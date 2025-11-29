'use client';

import { useEffect, useState, useRef } from 'react';

interface CursorPosition {
    x: number; // -1 to 1
    y: number; // -1 to 1
}

export function useCursorTracking() {
    const [target, setTarget] = useState<CursorPosition>({ x: 0, y: 0 });
    const [current, setCurrent] = useState<CursorPosition>({ x: 0, y: 0 });
    const rafRef = useRef<number>();

    useEffect(() => {
        // Mouse movement handler
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            setTarget({ x, y });
        };

        // Mobile gyroscope fallback
        const handleOrientation = (e: DeviceOrientationEvent) => {
            if (e.gamma !== null && e.beta !== null) {
                // gamma: left/right tilt (-90 to 90)
                // beta: front/back tilt (-180 to 180)
                const x = Math.max(-1, Math.min(1, e.gamma / 45));
                const y = Math.max(-1, Math.min(1, (e.beta - 90) / 45));
                setTarget({ x, y });
            }
        };

        // Request permission for iOS 13+
        const requestPermission = async () => {
            if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
                try {
                    const permission = await (DeviceOrientationEvent as any).requestPermission();
                    if (permission === 'granted') {
                        window.addEventListener('deviceorientation', handleOrientation);
                    }
                } catch (error) {
                    console.error('Device orientation permission denied');
                }
            } else {
                // Non-iOS devices
                window.addEventListener('deviceorientation', handleOrientation);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Check if mobile
        if (window.matchMedia('(max-width: 768px)').matches) {
            requestPermission();
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    // Smooth lerp animation
    useEffect(() => {
        const lerp = (start: number, end: number, factor: number) => {
            return start + (end - start) * factor;
        };

        const animate = () => {
            setCurrent((prev) => ({
                x: lerp(prev.x, target.x, 0.1),
                y: lerp(prev.y, target.y, 0.1),
            }));
            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [target]);

    return current;
}
