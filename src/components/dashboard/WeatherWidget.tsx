'use client';

import { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Loader2, RefreshCw } from 'lucide-react';

interface WeatherData {
    temperature: number;
    humidity: number;
    weatherCode: number;
    windSpeed: number;
}

export default function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                'https://api.open-meteo.com/v1/forecast?latitude=-6.2088&longitude=106.8456&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia/Jakarta'
            );
            if (!response.ok) throw new Error('Weather fetch failed');
            const data = await response.json();

            setWeather({
                temperature: data.current.temperature_2m,
                humidity: data.current.relative_humidity_2m,
                weatherCode: data.current.weather_code,
                windSpeed: data.current.wind_speed_10m
            });
            setError(null);
        } catch (error) {
            console.error('Weather error:', error);
            setError('Unable to fetch weather');
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
        if (code <= 3) return <Cloud className="w-8 h-8 text-gray-500" />;
        if (code <= 67) return <CloudRain className="w-8 h-8 text-blue-500" />;
        return <Wind className="w-8 h-8 text-gray-600" />;
    };

    const getWeatherLabel = (code: number) => {
        if (code === 0) return 'Clear Sky';
        if (code <= 3) return 'Cloudy';
        if (code <= 67) return 'Rainy';
        return 'Windy';
    };

    return (
        <div className="relative overflow-hidden bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group h-full">
            <div className="flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                            <Cloud className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Weather</h3>
                            <p className="text-sm text-gray-500">Jakarta, ID</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchWeather}
                        disabled={loading}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {error ? (
                    <div className="flex flex-col items-center justify-center h-32 text-red-500 gap-2">
                        <CloudRain className="w-8 h-8 opacity-50" />
                        <p className="text-sm">{error}</p>
                        <button onClick={fetchWeather} className="text-xs underline">Retry</button>
                    </div>
                ) : loading && !weather ? (
                    <div className="flex items-center justify-center h-32">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                ) : weather ? (
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {getWeatherIcon(weather.weatherCode)}
                                <div>
                                    <div className="text-4xl font-bold text-gray-800">
                                        {Math.round(weather.temperature)}°
                                    </div>
                                    <div className="text-sm text-gray-500 font-medium">
                                        {getWeatherLabel(weather.weatherCode)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/40 rounded-2xl p-3 border border-white/20">
                                <p className="text-xs text-gray-500 mb-1">Humidity</p>
                                <p className="text-lg font-semibold text-gray-700">{weather.humidity}%</p>
                            </div>
                            <div className="bg-white/40 rounded-2xl p-3 border border-white/20">
                                <p className="text-xs text-gray-500 mb-1">Wind</p>
                                <p className="text-lg font-semibold text-gray-700">{weather.windSpeed} <span className="text-xs">km/h</span></p>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
