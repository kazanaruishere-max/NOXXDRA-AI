'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeoButton } from '@/components/ui/NeoButton';
import { Play, Pause, RotateCcw, Coffee, Zap, Brain } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function Pomodoro() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
    const { setFocusMode } = useStore();

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            setFocusMode(false);
            // Play sound
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, setFocusMode]);

    const toggleTimer = () => {
        setIsActive(!isActive);
        if (mode === 'focus') setFocusMode(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setFocusMode(false);
        if (mode === 'focus') setTimeLeft(25 * 60);
        if (mode === 'short') setTimeLeft(5 * 60);
        if (mode === 'long') setTimeLeft(15 * 60);
    };

    const changeMode = (newMode: 'focus' | 'short' | 'long') => {
        setMode(newMode);
        setIsActive(false);
        setFocusMode(false);
        if (newMode === 'focus') setTimeLeft(25 * 60);
        if (newMode === 'short') setTimeLeft(5 * 60);
        if (newMode === 'long') setTimeLeft(15 * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <GlassCard className="p-6 h-full flex flex-col items-center justify-center relative overflow-hidden">
            {isActive && (
                <div className="absolute inset-0 bg-blue-500/5 animate-pulse pointer-events-none" />
            )}

            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => changeMode('focus')}
                    className={`p-2 rounded-xl transition-all ${mode === 'focus' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                    <Brain className="w-5 h-5" />
                </button>
                <button
                    onClick={() => changeMode('short')}
                    className={`p-2 rounded-xl transition-all ${mode === 'short' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                    <Coffee className="w-5 h-5" />
                </button>
                <button
                    onClick={() => changeMode('long')}
                    className={`p-2 rounded-xl transition-all ${mode === 'long' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                    <Zap className="w-5 h-5" />
                </button>
            </div>

            <div className="text-6xl font-bold text-gray-900 font-mono tracking-wider mb-8">
                {formatTime(timeLeft)}
            </div>

            <div className="flex gap-4">
                <NeoButton
                    size="lg"
                    onClick={toggleTimer}
                    className={isActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}
                >
                    {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isActive ? 'Pause' : 'Start Focus'}
                </NeoButton>
                <NeoButton variant="secondary" size="icon" onClick={resetTimer}>
                    <RotateCcw className="w-5 h-5" />
                </NeoButton>
            </div>
        </GlassCard>
    );
}
