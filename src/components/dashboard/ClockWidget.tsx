'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function ClockWidget() {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!time) return null; // Prevent hydration mismatch

    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');

    const dateStr = time.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="relative overflow-hidden bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group h-full">
            <div className="flex flex-col h-full justify-between">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                        <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Time</h3>
                        <p className="text-sm text-gray-500">Jakarta, Indonesia</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 font-mono tracking-tight">
                        {hours}:{minutes}<span className="text-3xl text-gray-400">:{seconds}</span>
                    </div>
                    <p className="text-lg text-gray-600 font-medium mt-2">
                        {dateStr}
                    </p>
                </div>
            </div>
        </div>
    );
}
