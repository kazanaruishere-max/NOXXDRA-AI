'use client';

import { useState, useEffect, useRef } from 'react';
import { Clock, Bell, Plus, Trash2, StickyNote, X, Save } from 'lucide-react';

interface Alarm {
    id: string;
    time: string; // HH:MM format
    label: string;
    isActive: boolean;
}

export default function TimeModule() {
    const [time, setTime] = useState<Date | null>(null);
    const [alarms, setAlarms] = useState<Alarm[]>([]);
    const [note, setNote] = useState('');
    const [isAddingAlarm, setIsAddingAlarm] = useState(false);
    const [newAlarmTime, setNewAlarmTime] = useState('');
    const [newAlarmLabel, setNewAlarmLabel] = useState('');
    const [activeTab, setActiveTab] = useState<'clock' | 'alarm' | 'notes'>('clock');

    // Load data from localStorage
    useEffect(() => {
        setTime(new Date());
        const savedAlarms = localStorage.getItem('dashboard_alarms');
        if (savedAlarms) setAlarms(JSON.parse(savedAlarms));

        const savedNote = localStorage.getItem('dashboard_quick_note');
        if (savedNote) setNote(savedNote);

        const timer = setInterval(() => {
            const now = new Date();
            setTime(now);
            checkAlarms(now);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Save alarms to localStorage
    useEffect(() => {
        localStorage.setItem('dashboard_alarms', JSON.stringify(alarms));
    }, [alarms]);

    // Save note to localStorage
    useEffect(() => {
        localStorage.setItem('dashboard_quick_note', note);
    }, [note]);

    const checkAlarms = (now: Date) => {
        const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        const currentSeconds = now.getSeconds();

        // Only trigger at 00 seconds to avoid multiple triggers
        if (currentSeconds === 0) {
            alarms.forEach(alarm => {
                if (alarm.isActive && alarm.time === currentTime) {
                    // Play sound and show notification
                    new Audio('/alarm.mp3').play().catch(() => console.log('Audio play failed')); // Placeholder for audio
                    if (Notification.permission === 'granted') {
                        new Notification(`Alarm: ${alarm.label}`, { body: `It's ${alarm.time}` });
                    } else if (Notification.permission !== 'denied') {
                        Notification.requestPermission().then(permission => {
                            if (permission === 'granted') {
                                new Notification(`Alarm: ${alarm.label}`, { body: `It's ${alarm.time}` });
                            }
                        });
                    }
                    alert(`ALARM: ${alarm.label}`); // Fallback
                }
            });
        }
    };

    const addAlarm = () => {
        if (!newAlarmTime) return;
        const newAlarm: Alarm = {
            id: Date.now().toString(),
            time: newAlarmTime,
            label: newAlarmLabel || 'Alarm',
            isActive: true
        };
        setAlarms([...alarms, newAlarm]);
        setNewAlarmTime('');
        setNewAlarmLabel('');
        setIsAddingAlarm(false);
    };

    const toggleAlarm = (id: string) => {
        setAlarms(alarms.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
    };

    const deleteAlarm = (id: string) => {
        setAlarms(alarms.filter(a => a.id !== id));
    };

    if (!time) return null;

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Clock Section */}
            <div className="relative overflow-hidden bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-lg transition-all hover:shadow-xl group">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Time Center</h3>
                        <p className="text-sm text-gray-500">Jakarta, Indonesia</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 font-mono tracking-tight">
                        {time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        <span className="text-3xl text-gray-400">:{time.getSeconds().toString().padStart(2, '0')}</span>
                    </div>
                    <p className="text-lg text-gray-600 font-medium mt-2">
                        {time.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            {/* Alarms & Notes Tabs */}
            <div className="flex-1 bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-lg flex flex-col overflow-hidden">
                <div className="flex gap-2 mb-4 border-b border-gray-200/50 pb-2">
                    <button
                        onClick={() => setActiveTab('alarm')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeTab === 'alarm' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Bell className="w-4 h-4" /> Alarms
                    </button>
                    <button
                        onClick={() => setActiveTab('notes')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeTab === 'notes' ? 'bg-yellow-50 text-yellow-600 font-medium' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <StickyNote className="w-4 h-4" /> Notes
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {activeTab === 'alarm' && (
                        <div className="space-y-3">
                            {alarms.map(alarm => (
                                <div key={alarm.id} className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-white/60 hover:border-blue-200 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${alarm.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`} />
                                        <div>
                                            <p className="font-mono text-xl font-bold text-gray-800">{alarm.time}</p>
                                            <p className="text-xs text-gray-500">{alarm.label}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleAlarm(alarm.id)}
                                            className={`w-10 h-6 rounded-full p-1 transition-colors ${alarm.isActive ? 'bg-blue-500' : 'bg-gray-300'}`}
                                        >
                                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${alarm.isActive ? 'translate-x-4' : ''}`} />
                                        </button>
                                        <button onClick={() => deleteAlarm(alarm.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {isAddingAlarm ? (
                                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="time"
                                            value={newAlarmTime}
                                            onChange={(e) => setNewAlarmTime(e.target.value)}
                                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Label (e.g. Wake up)"
                                        value={newAlarmLabel}
                                        onChange={(e) => setNewAlarmLabel(e.target.value)}
                                        className="w-full px-3 py-2 mb-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={addAlarm} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Save</button>
                                        <button onClick={() => setIsAddingAlarm(false)} className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"><X className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsAddingAlarm(true)}
                                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2 font-medium"
                                >
                                    <Plus className="w-4 h-4" /> Add Alarm
                                </button>
                            )}
                        </div>
                    )}

                    {activeTab === 'notes' && (
                        <div className="h-full flex flex-col">
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Write your quick notes here..."
                                className="flex-1 w-full bg-yellow-50/50 rounded-xl border border-yellow-100 p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none text-sm leading-relaxed"
                            />
                            <div className="flex justify-between items-center mt-2 text-xs text-gray-400 px-1">
                                <span>Auto-saved to local storage</span>
                                <Save className="w-3 h-3" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
