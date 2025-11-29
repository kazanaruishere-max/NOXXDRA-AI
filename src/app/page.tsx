'use client';

import { SystemProvider } from '@/context/SystemContext';
import SplineRobot from '@/components/robot/SplineRobot';
import DashboardOverlay from '@/components/dashboard/overlay/DashboardOverlay';

/**
 * Page (Home)
 * 
 * The root composition for the Single Page Dashboard.
 * Wraps the entire application in the SystemProvider context.
 * Renders the 3D Robot layer (z-0) and the Dashboard Overlay layer (z-10).
 */
export default function Page() {
  return (
    <SystemProvider>
      <main className="relative w-full h-screen overflow-hidden bg-black">

        {/* Layer 0: 3D Robot (Background) */}
        <SplineRobot />

        {/* Layer 1: GUI Overlay (Foreground) */}
        <DashboardOverlay />

      </main>
    </SystemProvider>
  );
}
