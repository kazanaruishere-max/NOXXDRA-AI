'use client';

import ClockWidget from './ClockWidget';
import WeatherChart from './WeatherChart';
import CalendarNotes from './CalendarNotes';

export default function DashboardWidgets() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl mx-auto">
            <ClockWidget />
            <WeatherChart />
            <CalendarNotes />
        </div>
    );
}
