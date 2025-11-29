'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Dashboard Page - R4X Robot
 * Updated with fixed Spline scene (tracking behavior adjusted in editor)
 * URL: https://my.spline.design/r4xbot-temcK062m9taZfou9hzLXEXZ/
 */
export default function DashboardPage() {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 relative overflow-hidden">

            {/* Loading Overlay */}
            {!isLoaded && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center z-20 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isLoaded ? 0 : 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl">
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                        <p className="text-sm font-semibold text-slate-600">Loading R4X Robot...</p>
                    </div>
                </motion.div>
            )}

            {/* R4X Robot Spline Iframe - New Fixed Scene */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full h-screen"
            >
                <iframe
                    src="https://my.spline.design/r4xbot-temcK062m9taZfou9hzLXEXZ/"
                    frameBorder="0"
                    className="w-full h-full"
                    onLoad={() => {
                        console.log('✅ R4X Robot loaded - Fixed Scene');
                        setIsLoaded(true);
                    }}
                    style={{
                        border: 'none',
                        outline: 'none',
                    }}
                />
            </motion.div>

            {/* Overlay UI - Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.618 }}
                className="absolute top-0 left-0 right-0 z-30 p-[34px] pointer-events-none"
            >
                <div className="max-w-[1597px] mx-auto">
                    <div className="flex justify-between items-center">
                        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[21px] px-[21px] py-[13px] shadow-lg pointer-events-auto">
                            <h1 className="text-[21px] font-bold text-gray-900 tracking-tight">
                                R4X Dashboard
                            </h1>
                            <p className="text-[13px] text-gray-500 font-medium">
                                Visual Prototype
                            </p>
                        </div>

                        <div className="flex items-center gap-[13px] pointer-events-auto">
                            {/* Status Indicator */}
                            <div className="flex items-center gap-[8px] px-[13px] py-[8px] bg-white/80 backdrop-blur-xl rounded-full border border-emerald-200 shadow-lg">
                                <div className="w-[8px] h-[8px] bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[13px] font-medium text-emerald-700">Online</span>
                            </div>

                            {/* Avatar */}
                            <div className="w-[55px] h-[55px] rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-[3px] border-white shadow-lg" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Overlay UI - Bottom Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.618 }}
                className="absolute bottom-0 left-0 right-0 z-30 p-[34px] pointer-events-none"
            >
                <div className="max-w-[1597px] mx-auto">
                    <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[21px] p-[21px] shadow-lg pointer-events-auto">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[13px] font-semibold text-gray-900 mb-[4px]">
                                    🤖 R4X Robot Prototype
                                </p>
                                <p className="text-[13px] text-gray-500">
                                    Updated Scene • Optimized Tracking Behavior
                                </p>
                            </div>
                            <div className="flex items-center gap-[8px] text-[13px] text-gray-500">
                                <div className="w-[8px] h-[8px] bg-blue-500 rounded-full animate-pulse" />
                                <span>Interactive Mode</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Gradient Overlay - Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-100 via-slate-100/80 to-transparent pointer-events-none z-20" />

        </div>
    );
}
