'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * SplineRobot
 * 
 * Wraps the Spline iframe and handles the loading state.
 * Uses the "Clean Embed" pattern requested by the user.
 * The iframe URL is the "fixed" version that solves the bowing issue.
 */
export default function SplineRobot() {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className="absolute inset-0 z-0 w-full h-full bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">

            {/* Loading Overlay */}
            {!isLoaded && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center z-20 bg-slate-100"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Initializing R4X System...</p>
                    </div>
                </motion.div>
            )}

            {/* Spline Iframe */}
            <iframe
                src="https://my.spline.design/nexbotrobotcharacterconcept-u4ekwOdPH59ytHSO49f0Mt2o/"
                frameBorder="0"
                className="w-full h-full"
                onLoad={() => {
                    console.log('✅ R4X Robot Iframe Loaded');
                    setIsLoaded(true);

                    // Simulate "intro-done" message for demo purposes if the scene doesn't send it automatically
                    // In production, the Spline scene logic would send this.
                    setTimeout(() => {
                        window.postMessage('intro-done', '*');
                    }, 2500); // Match camera intro duration
                }}
                style={{
                    border: 'none',
                    outline: 'none',
                    pointerEvents: 'auto', // Allow interaction with the robot
                }}
            />

            {/* Gradient Overlay to Hide "Built on Spline" Watermark */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-100 via-slate-100/95 to-transparent pointer-events-none z-10" />
        </div>
    );
}
