'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * SplineHeroIframe Component
 * Using direct Spline iframe embed for maximum stability and perfect camera angle
 * This ensures idle animations work perfectly as designed in Spline editor
 */
export default function SplineHeroIframe() {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className="w-full h-full relative bg-gradient-to-b from-slate-50 to-slate-100">

            {/* Loading Overlay */}
            {!isLoaded && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center z-20 bg-gradient-to-b from-slate-50 to-slate-100"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isLoaded ? 0 : 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <p className="text-sm font-semibold text-slate-600">Loading Neural Core...</p>
                    </div>
                </motion.div>
            )}

            {/* Spline Iframe - NEW URL with perfect idle animation */}
            <motion.iframe
                src="https://my.spline.design/nexbotrobotcharacterconcept-FeaRGmKnw4s7OKkCo9DEn1z2/"
                frameBorder="0"
                className="w-full h-full"
                onLoad={() => {
                    console.log('✅ Spline scene loaded');
                    setIsLoaded(true);
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                    border: 'none',
                    outline: 'none',
                }}
            />
        </div>
    );
}
