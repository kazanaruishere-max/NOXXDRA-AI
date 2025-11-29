import { useState, useEffect } from 'react';

interface WeatherData {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    location: string;
}

export function useWeather() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data for now, or replace with real API call
        const fetchWeather = async () => {
            try {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                setWeather({
                    temp: 28,
                    condition: 'Cloudy',
                    humidity: 65,
                    windSpeed: 12,
                    location: 'Jakarta, ID'
                });
            } catch (error) {
                console.error('Failed to fetch weather', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    return { weather, loading };
}
