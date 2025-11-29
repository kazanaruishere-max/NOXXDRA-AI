'use client';

import GlassPanel from '@/components/ui/GlassPanel';
import { useSystem } from '@/context/SystemContext';
import { CloudSun, AlertTriangle, MapPin, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * WeatherStation (Enhanced)
 * 
 * Features:
 * - Geolocation API (City Name)
 * - Enhanced Chart (Recharts)
 * - Auto-refresh (10 mins)
 * - Climate Warnings
 */

interface WeatherData {
    temp: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    city: string;
    forecast: { time: string; temp: number }[];
}

export default function WeatherStation() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    // Fetch Weather (Mock with Geolocation simulation)
    const fetchWeather = async (lat?: number, lon?: number) => {
        setLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock Data Generation based on coords
        const mockCity = lat ? (lat === -6.2088 ? 'Jakarta' : 'Local Area') : 'Jakarta';
        const baseTemp = 24 + Math.random() * 5;

        // Generate 24h forecast
        const forecast = Array.from({ length: 24 }, (_, i) => {
            const hour = (new Date().getHours() + i) % 24;
            return {
                time: `${hour}:00`,
                temp: Math.round(baseTemp + Math.sin(i / 3) * 3)
            };
        });

        setWeather({
            temp: Math.round(baseTemp),
            humidity: 65 + Math.round(Math.random() * 10),
            windSpeed: 12 + Math.round(Math.random() * 5),
            condition: 'Cloudy',
            city: mockCity,
            forecast
        });

        setLastUpdated(new Date());
        setLoading(false);
    };

    // Initialize Geolocation
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeather(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.warn('Geolocation denied/error:', error);
                    fetchWeather(-6.2088, 106.8456); // Fallback to Jakarta
                }
            );
        } else {
            fetchWeather(-6.2088, 106.8456);
        }

        // Auto-refresh every 10 mins
        const timer = setInterval(() => {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
                    () => fetchWeather(-6.2088, 106.8456)
                );
            }
        }, 600000);

        return () => clearInterval(timer);
    }, []);

    if (!weather && loading) return (
        <GlassPanel side="right" delay={0.36} radius="small" className="p-6 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-[#5CE1E6] animate-spin" />
        </GlassPanel>
    );

    if (!weather) return null;

    return (
        <GlassPanel side="right" delay={0.36} radius="small" className="p-6 flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <CloudSun className="w-4 h-4 text-[#5CE1E6]" />
                        <span className="text-[13px] font-medium text-slate-500 tracking-wide uppercase">Atmosphere</span>
                    </div>
                    <div className="flex items-center gap-1 text-[14px] font-medium text-slate-600">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {weather.city}
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-[42px] font-bold text-slate-700 leading-none tracking-tight">
                        {weather.temp}°
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                        Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </div>

            {/* Climate Warning */}
            <div className="mb-4 flex items-center gap-3 p-3 bg-amber-50/50 border border-amber-100 rounded-[14px]">
                <div className="p-1.5 bg-amber-100 rounded-full">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <span className="text-[12px] font-medium text-amber-700">
                    Wind rising in 18 min.
                </span>
            </div>

            {/* Recharts Graph */}
            <div className="mt-auto h-[80px] w-full -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weather.forecast}>
                        <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00E8FF" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#00E8FF" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                fontSize: '12px'
                            }}
                            itemStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                            labelStyle={{ color: '#6b7280', marginBottom: '2px' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="temp"
                            stroke="#00E8FF"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorTemp)"
                        />
                        <XAxis
                            dataKey="time"
                            hide={true} // Hide axis for cleaner look, tooltip shows time
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </GlassPanel>
    );
}
