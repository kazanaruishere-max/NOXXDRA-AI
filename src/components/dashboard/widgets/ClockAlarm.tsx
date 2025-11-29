'use client';

import GlassPanel from '@/components/ui/GlassPanel';
import { useClockTick } from '@/hooks/useClockTick';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Bell, BellOff, Clock, Plus, Trash2, X } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ClockAlarm (Enhanced)
 * 
 * Features:
 * - Alarm Management (Add, Delete, Toggle)
 * - Browser Notifications
 * - Audio Sound
 * - Next Alarm Display
 */

interface Alarm {
    id: string;
    time: string; // "HH:MM"
    label: string;
    active: boolean;
}

export default function ClockAlarm() {
    const { hours, minutes, dateString } = useClockTick();
    const [alarms, setAlarms] = useLocalStorage<Alarm[]>('dashboard-alarms', []);
    const [isAdding, setIsAdding] = useState(false);
    const [newTime, setNewTime] = useState('07:00');
    const [newLabel, setNewLabel] = useState('Wake up');

    // Audio Ref
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize Audio
    useEffect(() => {
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); // Simple beep sound
    }, []);

    // Request Notification Permission
    useEffect(() => {
        if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    // Trigger Alarm Function
    const triggerAlarm = useCallback((alarm: Alarm) => {
        // Play Sound
        if (audioRef.current) {
            audioRef.current.play().catch(e => {
                console.warn('Audio play failed (user interaction required):', e);
            });
        }

        // Show Notification
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            try {
                new Notification(`⏰ ${alarm.label}`, {
                    body: `It's ${alarm.time}!`,
                    icon: '/icon.png',
                    requireInteraction: true
                });
            } catch (e) {
                console.warn('Notification failed:', e);
            }
        }
    }, []);

    // Check Alarms
    useEffect(() => {
        const checkAlarms = () => {
            const now = new Date();
            const currentHM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            const currentS = now.getSeconds();

            // Only trigger at 00 seconds to avoid multiple triggers
            if (currentS === 0) {
                alarms.forEach(alarm => {
                    if (alarm.active && alarm.time === currentHM) {
                        triggerAlarm(alarm);
                    }
                });
            }
        };

        const timer = setInterval(checkAlarms, 1000);
        return () => clearInterval(timer);
    }, [alarms, triggerAlarm]);

    const addAlarm = () => {
        const newAlarm: Alarm = {
            id: Date.now().toString(),
            time: newTime,
            label: newLabel,
            active: true
        };
        setAlarms([...alarms, newAlarm]);
        setIsAdding(false);
    };

    const deleteAlarm = (id: string) => {
        setAlarms(alarms.filter(a => a.id !== id));
    };

    const toggleAlarm = (id: string) => {
        setAlarms(alarms.map(a => a.id === id ? { ...a, active: !a.active } : a));
    };

    // Get Next Active Alarm
    const nextAlarm = alarms
        .filter(a => a.active)
        .sort((a, b) => a.time.localeCompare(b.time))
        .find(a => {
            const now = new Date();
            const currentHM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            return a.time > currentHM;
        }) || alarms.filter(a => a.active).sort((a, b) => a.time.localeCompare(b.time))[0];

    return (
        <GlassPanel side="left" delay={0.12} radius="small" className="p-6 flex flex-col justify-between relative">
            {/* Header */}
            <div className="flex justify-between items-start z-20">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#C7A6FF]" />
                    <span className="text-[13px] font-medium text-slate-500 tracking-wide uppercase">Local Time</span>
                </div>

                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="w-7 h-7 rounded-full bg-slate-200 hover:bg-[#C7A6FF]/20 hover:text-[#C7A6FF] flex items-center justify-center transition-colors"
                >
                    {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
            </div>

            {/* Add Alarm Form */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-2 bg-white/40 rounded-xl p-3 border border-white/50"
                    >
                        <div className="flex gap-2 mb-2">
                            <input
                                type="time"
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                                className="bg-white/60 rounded px-2 py-1 text-sm font-mono text-slate-700 focus:outline-none focus:ring-1 ring-[#C7A6FF]"
                            />
                            <input
                                type="text"
                                value={newLabel}
                                onChange={(e) => setNewLabel(e.target.value)}
                                placeholder="Label"
                                className="flex-1 bg-white/60 rounded px-2 py-1 text-sm text-slate-700 focus:outline-none focus:ring-1 ring-[#C7A6FF]"
                            />
                        </div>
                        <button
                            onClick={addAlarm}
                            className="w-full py-1 bg-[#C7A6FF] text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-[#B794F4] transition-colors"
                        >
                            Save Alarm
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Time Display */}
            {!isAdding && (
                <div className="flex flex-col items-center justify-center flex-1">
                    <div className="text-[64px] font-light text-slate-700 leading-none tracking-tighter tabular-nums">
                        {hours}:{minutes}
                    </div>
                    <div className="text-[15px] font-medium text-slate-400 mt-2">
                        {dateString}
                    </div>
                </div>
            )}

            {/* Alarm List (Collapsible/Scrollable) */}
            <div className="mt-auto space-y-2 max-h-[100px] overflow-y-auto custom-scrollbar pr-1">
                {alarms.length === 0 ? (
                    <div className="bg-white/30 rounded-[14px] p-3 flex items-center justify-between border border-white/40">
                        <span className="text-[12px] font-medium text-slate-500">No Alarms Set</span>
                    </div>
                ) : (
                    alarms.map(alarm => (
                        <div key={alarm.id} className="bg-white/30 rounded-[14px] p-2 flex items-center justify-between border border-white/40 group hover:bg-white/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <button onClick={() => toggleAlarm(alarm.id)}>
                                    {alarm.active
                                        ? <Bell className="w-4 h-4 text-[#C7A6FF]" />
                                        : <BellOff className="w-4 h-4 text-slate-400" />
                                    }
                                </button>
                                <div>
                                    <div className={`text-[13px] font-bold font-mono leading-none ${alarm.active ? 'text-slate-700' : 'text-slate-400'}`}>
                                        {alarm.time}
                                    </div>
                                    <div className="text-[10px] text-slate-500">{alarm.label}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteAlarm(alarm.id)}
                                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity p-1"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Next Alarm Indicator */}
            {nextAlarm && !isAdding && (
                <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 pointer-events-none opacity-10 flex justify-center">
                    <span className="text-[80px] font-bold text-slate-900">{nextAlarm.time}</span>
                </div>
            )}
        </GlassPanel>
    );
}
