'use client';

import { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, MapPin, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface WeatherData {
    current: {
        temperature_2m: number;
        relative_humidity_2m: number;
        weather_code: number;
        wind_speed_10m: number;
    };
    hourly: {
        time: string[];
        temperature_2m: number[];
        relative_humidity_2m: number[];
        wind_speed_10m: number[];
    };
}

export default function WeatherModule() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeChart, setActiveChart] = useState<'temp' | 'wind' | 'humidity'>('temp');

    const fetchWeather = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                'https://api.open-meteo.com/v1/forecast?latitude=-6.2088&longitude=106.8456&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Asia/Jakarta&forecast_days=1'
            );
            const data = await response.json();
            setWeather(data);
        } catch (error) {
            console.error('Weather fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
        const interval = setInterval(fetchWeather, 600000); // 10 mins
        return () => clearInterval(interval);
    }, []);

    const getWeatherIcon = (code: number) => {
        if (code === 0) return <Sun className="w-8 h-8 text-yellow-500" />;
        if (code <= 3) return <Cloud className="w-8 h-8 text-gray-400" />;
        if (code <= 67) return <CloudRain className="w-8 h-8 text-blue-500" />;
        return <Wind className="w-8 h-8 text-gray-500" />;
    };

    const getChartData = () => {
        if (!weather) return [];
        const now = new Date();
        const currentHour = now.getHours();

        // Get next 24 hours data
        return weather.hourly.time.slice(currentHour, currentHour + 12).map((time, index) => {
            const i = currentHour + index;
            return {
                time: new Date(time).getHours() + ':00',
                temp: weather.hourly.temperature_2m[i],
                humidity: weather.hourly.relative_humidity_2m[i],
                wind: weather.hourly.wind_speed_10m[i]
            };
        });
    };

    const chartData = getChartData();

    if (loading && !weather) {
        return (
            <div className="h-full bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!weather) return null;

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Current Weather Card */}
            <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-lg transition-all hover:shadow-xl group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Cloud className="w-32 h-32" />
                </div>

                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm font-medium">Jakarta, Indonesia</span>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                            {getWeatherIcon(weather.current.weather_code)}
                            <div className="text-6xl font-bold text-gray-800 tracking-tighter">
                                {Math.round(weather.current.temperature_2m)}°
                            </div>
                        </div>
                        <p className="text-lg text-gray-600 mt-2 font-medium">
                            {weather.current.weather_code === 0 ? 'Clear Sky' :
                                weather.current.weather_code <= 3 ? 'Partly Cloudy' :
                                    weather.current.weather_code <= 67 ? 'Rainy' : 'Windy'}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="bg-white/50 p-3 rounded-xl border border-white/60 flex items-center gap-3 w-32">
                            <Wind className="w-5 h-5 text-blue-500" />
                            <div>
                                <p className="text-xs text-gray-500">Wind</p>
                                <p className="font-semibold text-gray-700">{weather.current.wind_speed_10m} <span className="text-xs">km/h</span></p>
                            </div>
                        </div>
                        <div className="bg-white/50 p-3 rounded-xl border border-white/60 flex items-center gap-3 w-32">
                            <Droplets className="w-5 h-5 text-cyan-500" />
                            <div>
                                <p className="text-xs text-gray-500">Humidity</p>
                                <p className="font-semibold text-gray-700">{weather.current.relative_humidity_2m}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="flex-1 bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-lg flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Forecast Analysis</h3>
                    <div className="flex bg-gray-100/50 p-1 rounded-lg">
                        {(['temp', 'wind', 'humidity'] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => setActiveChart(type)}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${activeChart === type
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 w-full min-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        {activeChart === 'temp' ? (
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                            </AreaChart>
                        ) : activeChart === 'wind' ? (
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="wind" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        ) : (
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="humidity" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorHum)" />
                            </AreaChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
