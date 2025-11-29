'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Cloud, Sun, CloudRain, Wind } from 'lucide-react';
import { format, subDays, addDays } from 'date-fns';

interface WeatherData {
    date: string;
    temp: number;
    humidity: number;
    condition: string;
}

export default function WeatherChart() {
    const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const today = new Date();
                const startDate = format(subDays(today, 7), 'yyyy-MM-dd');
                const endDate = format(addDays(today, 7), 'yyyy-MM-dd');

                // Open-Meteo API for Jakarta
                const url = `https://api.open-meteo.com/v1/forecast?latitude=-6.2088&longitude=106.8456&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean,weather_code&timezone=Asia/Jakarta&start_date=${startDate}&end_date=${endDate}`;

                const response = await fetch(url);
                const data = await response.json();

                if (data.daily) {
                    const formattedData: WeatherData[] = data.daily.time.map((date: string, index: number) => {
                        const avgTemp = (data.daily.temperature_2m_max[index] + data.daily.temperature_2m_min[index]) / 2;
                        const weatherCode = data.daily.weather_code[index];

                        let condition = 'Clear';
                        if (weatherCode > 0 && weatherCode < 3) condition = 'Cloudy';
                        else if (weatherCode >= 3 && weatherCode < 50) condition = 'Overcast';
                        else if (weatherCode >= 50) condition = 'Rain';

                        return {
                            date: format(new Date(date), 'MMM dd'),
                            temp: Math.round(avgTemp),
                            humidity: data.daily.relative_humidity_2m_mean[index],
                            condition,
                        };
                    });

                    setWeatherData(formattedData);

                    // Set current weather (middle of the array, which is today)
                    const todayIndex = 7;
                    setCurrentWeather(formattedData[todayIndex]);
                }

                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch weather:', error);
                setLoading(false);
            }
        };

        fetchWeather();

        // Refresh every hour
        const interval = setInterval(fetchWeather, 3600000);
        return () => clearInterval(interval);
    }, []);

    const getWeatherIcon = (condition: string) => {
        switch (condition) {
            case 'Clear':
                return <Sun className="w-8 h-8 text-yellow-500" />;
            case 'Cloudy':
            case 'Overcast':
                return <Cloud className="w-8 h-8 text-gray-400" />;
            case 'Rain':
                return <CloudRain className="w-8 h-8 text-blue-500" />;
            default:
                return <Wind className="w-8 h-8 text-gray-400" />;
        }
    };

    if (loading) {
        return (
            <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-sm">
                <div className="animate-pulse h-64 bg-gray-200/50 rounded-xl" />
            </div>
        );
    }

    return (
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 col-span-1 md:col-span-2">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2 text-gray-500">
                        <Cloud className="w-5 h-5" />
                        <span className="text-sm font-medium uppercase tracking-wider">14-Day Weather</span>
                    </div>
                    {currentWeather && (
                        <div className="flex items-center gap-4">
                            {getWeatherIcon(currentWeather.condition)}
                            <div>
                                <div className="text-4xl font-bold text-gray-800">{currentWeather.temp}°C</div>
                                <div className="text-sm text-gray-500">Humidity: {currentWeather.humidity}%</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weatherData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        stroke="#9ca3af"
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        stroke="#9ca3af"
                        domain={['dataMin - 2', 'dataMax + 2']}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            padding: '8px 12px',
                        }}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="temp"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Temperature (°C)"
                    />
                    <Line
                        type="monotone"
                        dataKey="humidity"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ fill: '#10b981', r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Humidity (%)"
                    />
                </LineChart>
            </ResponsiveContainer>

            <div className="mt-4 text-xs text-gray-400 text-center">
                7 days past • Today • 7 days forecast
            </div>
        </div>
    );
}
