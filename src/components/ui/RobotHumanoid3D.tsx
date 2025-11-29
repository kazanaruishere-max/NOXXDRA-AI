// src/app/components/RobotHumanoid3D.tsx
'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';

// Dinamis import untuk memastikan hanya di client
const Spline = dynamic(() => import('@splinetool/loader').then((mod) => mod.Spline), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
      Loading 3D robot...
    </div>
  ),
});

export default function RobotHumanoid3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Opsional: disable scroll atau interaksi lain saat fokus ke 3D
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ contain: 'layout style paint' }}
    >
      <Spline
        scene="https://prod.spline.design/zTI9YYJSoNLYkzol/scene.splinecode"
        className="w-full h-full"
      />
    </div>
  );
}