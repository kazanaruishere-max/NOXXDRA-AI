'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function SplineRobotIframe() {
    const [isLoading, setIsLoading] = useState(true);
    const [isReady, setIsReady] = useState(false);

    // Handle iframe load
    const handleLoad = () => {
        setIsLoading(false);
        // Add a small delay to ensure the scene inside is actually rendering
        setTimeout(() => setIsReady(true), 500);
    };

    return (
        <div className="w-full h-full relative overflow-hidden bg-[#e5e7eb]">
            {/* 
        Cinematic Intro & Idle Animation Wrapper 
        - Initial: Scale 1.2 (Zoomed in/Close), Opacity 0
        - Animate: Scale 1.0 (Normal), Opacity 1
        - Idle: Subtle breathing (y-axis movement)
      */}
            <motion.div
                initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                animate={{
                    opacity: isReady ? 1 : 0,
                    scale: isReady ? 1 : 1.1,
                    filter: isReady ? 'blur(0px)' : 'blur(10px)'
                }}
                transition={{
                    duration: 1.5,
                    ease: [0.22, 1, 0.36, 1] // Cubic-bezier for smooth cinematic feel
                }}
                className="w-full h-full flex items-center justify-center"
            >
                {/* Idle Animation Layer (Subtle Float) */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-full h-full"
                >
                    <iframe
                        src="https://my.spline.design/nexbotrobotcharacterconcept-88D4hLg8wcIkgQXXvwWuTxk4/"
                        frameBorder="0"
                        width="100%"
                        height="100%"
                        className="w-full h-full pointer-events-auto"
                        onLoad={handleLoad}
                        title="Future OS Robot"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                </motion.div>
            </motion.div>

            {/* Loading State Overlay */}
            {(!isReady) && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#e5e7eb] z-10">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                        <p className="text-sm font-medium text-gray-400 tracking-widest uppercase animate-pulse">
                            Initializing Neural Link...
                        </p>
                    </div>
                </div>
            )}

            {/* Overlay Gradient for seamless integration with dashboard */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#f8fafc] via-transparent to-transparent opacity-60" />
        </div>
    );
}
