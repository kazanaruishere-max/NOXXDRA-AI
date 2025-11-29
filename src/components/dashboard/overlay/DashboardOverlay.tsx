'use client';

import { useSystem } from '@/context/SystemContext';
import { useGuiIntro } from '@/hooks/useGuiIntro';
import CalendarHub from '@/components/dashboard/widgets/CalendarHub';
import ClockAlarm from '@/components/dashboard/widgets/ClockAlarm';
import TaskTracker from '@/components/dashboard/widgets/TaskTracker';
import WeatherStation from '@/components/dashboard/widgets/WeatherStation';

/**
 * DashboardOverlay (Redesigned)
 * 
 * Implements the new Layout Architecture:
 * - 80px Offsets from edges
 * - 61% / 39% Vertical Split
 * - 34px Gap
 */
export default function DashboardOverlay() {
    const { guiVisible } = useSystem();

    // Initialize the intro listener
    useGuiIntro();

    if (!guiVisible) return null;

    return (
        <div className="absolute inset-0 z-10 pointer-events-none">
            {/* 
        Grid Layout with explicit padding for offsets 
        px-[80px] = 80px side offsets
        py-[80px] = 80px top/bottom offsets (optional, usually vertical center is better, keeping full height for now)
      */}
            <div className="grid grid-cols-[28%_1fr_28%] h-screen w-full px-[80px] py-[60px]">

                {/* LEFT PANEL */}
                <div className="flex flex-col h-full gap-[34px] pointer-events-auto">
                    {/* Top: Calendar (61%) */}
                    <div className="h-[61%]">
                        <CalendarHub />
                    </div>

                    {/* Bottom: Clock (39%) */}
                    <div className="h-[39%]">
                        <ClockAlarm />
                    </div>
                </div>

                {/* CENTER SAFE ZONE */}
                <div className="relative flex items-center justify-center min-w-[520px] max-w-[760px] mx-auto pointer-events-none">
                    {/* Robot Visibility Zone */}
                </div>

                {/* RIGHT PANEL */}
                <div className="flex flex-col h-full gap-[34px] pointer-events-auto">
                    {/* Top: Tasks (61%) */}
                    <div className="h-[61%]">
                        <TaskTracker />
                    </div>

                    {/* Bottom: Weather (39%) */}
                    <div className="h-[39%]">
                        <WeatherStation />
                    </div>
                </div>

            </div>
        </div>
    );
}
