'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * SystemContext
 * 
 * Global state management for the dashboard.
 * - guiVisible: Controls the entrance animation of the dashboard widgets.
 * - time: Centralized clock tick (updates every second).
 * - weather: Cached weather data.
 * - tasks: Global task list.
 * - alarms: Alarm settings.
 */

interface Task {
    id: string;
    text: string;
    status: 'next' | 'waiting' | 'done';
    checked: boolean;
}

interface WeatherData {
    temp: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    forecast: number[]; // 24h sparkline data
}

interface SystemContextType {
    guiVisible: boolean;
    setGuiVisible: (visible: boolean) => void;
    time: Date;
    weather: WeatherData | null;
    tasks: Task[];
    toggleTask: (id: string) => void;
    alarms: { enabled: boolean; time: string };
    toggleAlarm: () => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const useSystem = () => {
    const context = useContext(SystemContext);
    if (!context) {
        throw new Error('useSystem must be used within a SystemProvider');
    }
    return context;
};

export const SystemProvider = ({ children }: { children: ReactNode }) => {
    const [guiVisible, setGuiVisible] = useState(false);
    const [time, setTime] = useState(new Date());
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [alarms, setAlarms] = useState({ enabled: true, time: '07:00' });

    // Mock Tasks
    const [tasks, setTasks] = useState<Task[]>([
        { id: '1', text: 'Review R4X Diagnostics', status: 'next', checked: false },
        { id: '2', text: 'System Optimization', status: 'next', checked: false },
        { id: '3', text: 'Update Firmware v2.4', status: 'waiting', checked: false },
        { id: '4', text: 'Calibrate Sensors', status: 'done', checked: true },
        { id: '5', text: 'Sync Neural Net', status: 'done', checked: true },
    ]);

    // Clock Tick (Global)
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Weather Fetch (Mock with Cache Logic)
    useEffect(() => {
        const fetchWeather = () => {
            // In a real app, check localStorage cache validity (15 mins)
            // For now, we set static mock data to avoid API keys/rate limits in this demo
            setWeather({
                temp: 24,
                humidity: 65,
                windSpeed: 12,
                condition: 'Cloudy',
                forecast: [22, 23, 24, 24, 25, 24, 23, 22, 21, 21, 20, 20, 21, 22, 24, 26, 27, 27, 26, 25, 24, 23, 23, 22]
            });
        };
        fetchWeather();
    }, []);

    const toggleTask = (id: string) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
    };

    const toggleAlarm = () => {
        setAlarms(prev => ({ ...prev, enabled: !prev.enabled }));
    };

    return (
        <SystemContext.Provider value={{
            guiVisible,
            setGuiVisible,
            time,
            weather,
            tasks,
            toggleTask,
            alarms,
            toggleAlarm
        }}>
            {children}
        </SystemContext.Provider>
    );
};
