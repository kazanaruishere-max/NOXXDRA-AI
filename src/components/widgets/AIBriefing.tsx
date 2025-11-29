'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { Sun, Calendar, CheckSquare, Quote } from 'lucide-react';

export default function AIBriefing() {
    return (
        <GlassCard variant="highlight" className="p-6 h-full flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                        Daily Briefing
                    </span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Good Morning, User.
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                    It's a productive day ahead. You have 3 high-priority tasks and clear weather for your evening run.
                </p>
            </div>

            <div className="space-y-3 mt-6">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Sun className="w-4 h-4 text-orange-500" />
                    <span>Sunny, 28°C later today</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span>2 meetings scheduled</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckSquare className="w-4 h-4 text-green-500" />
                    <span>Finish project documentation</span>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-blue-200/50">
                <div className="flex gap-2 text-xs text-gray-500 italic">
                    <Quote className="w-3 h-3 text-blue-400" />
                    "The future belongs to those who prepare for it today."
                </div>
            </div>
        </GlassCard>
    );
}
