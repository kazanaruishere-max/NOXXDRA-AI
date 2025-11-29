'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NeoButton } from '@/components/ui/NeoButton';
import { cn } from '@/lib/utils';

export default function CalendarWidget() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    ).getDate();

    const firstDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    ).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDay }, (_, i) => i);

    const today = new Date();
    const isCurrentMonth =
        today.getMonth() === currentDate.getMonth() &&
        today.getFullYear() === currentDate.getFullYear();

    return (
        <GlassCard className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 text-lg">
                    {currentDate.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                    })}
                </h3>
                <div className="flex gap-1">
                    <NeoButton
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                            setCurrentDate(
                                new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
                            )
                        }
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </NeoButton>
                    <NeoButton
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                            setCurrentDate(
                                new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
                            )
                        }
                    >
                        <ChevronRight className="w-4 h-4" />
                    </NeoButton>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={`${day}-${i}`} className="text-xs font-medium text-gray-400 py-1">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 flex-1">
                {blanks.map((i) => (
                    <div key={`blank-${i}`} />
                ))}
                {days.map((day) => {
                    const isToday = isCurrentMonth && day === today.getDate();
                    return (
                        <div
                            key={day}
                            className={cn(
                                'aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all cursor-pointer hover:bg-gray-100',
                                isToday
                                    ? 'bg-gray-900 text-white shadow-md hover:bg-gray-800'
                                    : 'text-gray-700'
                            )}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
        </GlassCard>
    );
}
