'use client';

import { useClock } from '@/hooks/useClock';
import { GlassCard } from '@/components/ui/GlassCard';
import { formatTime, formatDate } from '@/lib/utils';
import { Clock, Bell, Plus } from 'lucide-react';
import { NeoButton } from '@/components/ui/NeoButton';

export default function TimeWidget() {
    const time = useClock();

    return (
        <GlassCard className="p-6 h-full flex flex-col justify-between group">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-xl text-blue-600">
                        <Clock className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Local Time
                    </span>
                </div>
                <NeoButton variant="ghost" size="icon" className="rounded-full">
                    <Plus className="w-4 h-4" />
                </NeoButton>
            </div>

            <div className="mt-4">
                <h2 className="text-5xl font-bold text-gray-900 tracking-tight tabular-nums">
                    {formatTime(time)}
                </h2>
                <p className="text-gray-500 font-medium mt-1">{formatDate(time)}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Bell className="w-4 h-4 text-blue-500" />
                        <span>07:00 AM</span>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                        Daily
                    </span>
                </div>
            </div>
        </GlassCard>
    );
}
