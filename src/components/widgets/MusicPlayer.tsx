'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Play, Pause, SkipBack, SkipForward, Music } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <GlassCard className="p-6 h-full flex flex-col relative overflow-hidden">
            {/* Background Blur Art */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-xl" />

            <div className="relative z-10 flex gap-4 items-center mb-4">
                <div className="w-16 h-16 rounded-xl bg-gray-900 flex items-center justify-center shadow-lg">
                    <Music className="w-8 h-8 text-white/50" />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900">Midnight City</h4>
                    <p className="text-sm text-gray-500">M83 • Hurry Up, We're Dreaming</p>
                </div>
            </div>

            {/* Visualizer */}
            <div className="flex items-end justify-center gap-1 h-12 mb-6">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-1 bg-indigo-500 rounded-full"
                        animate={{
                            height: isPlaying ? [10, 30, 15, 40, 20] : 4,
                        }}
                        transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            delay: i * 0.1,
                        }}
                    />
                ))}
            </div>

            <div className="flex items-center justify-center gap-6 relative z-10">
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <SkipBack className="w-6 h-6" />
                </button>
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-gray-900/20"
                >
                    {isPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                    ) : (
                        <Play className="w-5 h-5 fill-current ml-1" />
                    )}
                </button>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <SkipForward className="w-6 h-6" />
                </button>
            </div>
        </GlassCard>
    );
}
