'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { CheckCircle2, Circle } from 'lucide-react';

const habits = [
    { id: 1, name: 'Drink Water', streak: 12, completed: true },
    { id: 2, name: 'Read 30 mins', streak: 5, completed: false },
    { id: 3, name: 'Workout', streak: 8, completed: false },
    { id: 4, name: 'Meditation', streak: 3, completed: true },
];

export default function HabitTracker() {
    return (
        <GlassCard className="p-6 h-full flex flex-col">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Habit Streak</h3>

            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
                {habits.map((habit) => (
                    <div
                        key={habit.id}
                        className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-white/60 hover:border-blue-200 transition-all group cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <div className={habit.completed ? 'text-green-500' : 'text-gray-300 group-hover:text-blue-400'}>
                                {habit.completed ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                    <Circle className="w-5 h-5" />
                                )}
                            </div>
                            <span className={`text-sm font-medium ${habit.completed ? 'text-gray-900' : 'text-gray-600'}`}>
                                {habit.name}
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <div className="flex gap-[2px]">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-1 h-4 rounded-full ${i < (habit.streak % 5) + 1 ? 'bg-blue-500' : 'bg-gray-200'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs font-bold text-gray-400 ml-2">{habit.streak}</span>
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
