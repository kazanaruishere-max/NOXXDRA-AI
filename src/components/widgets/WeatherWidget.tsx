'use client';

import { useWeather } from '@/hooks/useWeather';
import { GlassCard } from '@/components/ui/GlassCard';
import { Cloud, Wind, Droplets, Sun } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
    { time: '10:00', temp: 24 },
    { time: '11:00', temp: 26 },
    { time: '12:00', temp: 28 },
    { time: '13:00', temp: 29 },
    { time: '14:00', temp: 28 },
    { time: '15:00', temp: 27 },
    { time: '16:00', temp: 26 },
];

export default function WeatherWidget() {
    const { weather, loading } = useWeather();

    if (loading || !weather) {
        return (
            <GlassCard className="p-6 h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </GlassCard>
        );
    }

    return (
        <GlassCard className="p-6 h-full flex flex-col relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl -mr-10 -mt-10" />

            <div className="flex justify-between items-start z-10">
                <div>
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <span className="text-sm font-medium uppercase tracking-wider">
                            {weather.location}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                        <Cloud className="w-8 h-8 text-blue-500" />
                        <span className="text-4xl font-bold text-gray-900">
                            {weather.temp}°
                        </span>
                    </div>
                    <p className="text-gray-600 font-medium mt-1">{weather.condition}</p>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/50 px-3 py-1.5 rounded-lg">
                        <Wind className="w-4 h-4 text-blue-400" />
                        <span>{weather.windSpeed} km/h</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/50 px-3 py-1.5 rounded-lg">
                        <Droplets className="w-4 h-4 text-cyan-400" />
                        <span>{weather.humidity}%</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 mt-6 min-h-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            cursor={{ stroke: '#9ca3af', strokeDasharray: '3 3' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="temp"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorTemp)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
}
