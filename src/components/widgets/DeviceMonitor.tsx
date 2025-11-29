'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Battery, Wifi, Cpu, Activity } from 'lucide-react';

export default function DeviceMonitor() {
    const [battery, setBattery] = useState(100);
    const [latency, setLatency] = useState(24);
    const [cpu, setCpu] = useState(12);

    useEffect(() => {
        const interval = setInterval(() => {
            setLatency(Math.floor(Math.random() * 20) + 20);
            setCpu(Math.floor(Math.random() * 30) + 10);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <GlassCard className="p-6 h-full flex flex-col justify-between">
            <h3 className="font-bold text-gray-900 text-lg mb-4">System Status</h3>

            <div className="space-y-4">
                {/* Battery */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <Battery className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">Battery</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 transition-all duration-500"
                                style={{ width: `${battery}%` }}
                            />
                        </div>
                        <span className="text-sm font-bold text-gray-900">{battery}%</span>
                    </div>
                </div>

                {/* Network */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Wifi className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">Network</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">5G</span>
                        <span className="text-sm font-bold text-gray-900">{latency}ms</span>
                    </div>
                </div>

                {/* CPU */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <Cpu className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">CPU Load</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-purple-500 transition-all duration-500"
                                style={{ width: `${cpu}%` }}
                            />
                        </div>
                        <span className="text-sm font-bold text-gray-900">{cpu}%</span>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
