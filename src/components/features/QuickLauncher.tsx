'use client';

import { motion } from 'framer-motion';
import {
    LayoutGrid,
    Calendar,
    CheckSquare,
    Cloud,
    Music,
    Settings,
    Clock
} from 'lucide-react';

const apps = [
    { icon: LayoutGrid, label: 'Dashboard', color: 'bg-blue-500' },
    { icon: Clock, label: 'Focus', color: 'bg-orange-500' },
    { icon: Calendar, label: 'Calendar', color: 'bg-red-500' },
    { icon: CheckSquare, label: 'Tasks', color: 'bg-green-500' },
    { icon: Cloud, label: 'Weather', color: 'bg-cyan-500' },
    { icon: Music, label: 'Music', color: 'bg-purple-500' },
    { icon: Settings, label: 'Settings', color: 'bg-gray-500' },
];

export default function QuickLauncher() {
    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
        >
            <div className="bg-white/70 backdrop-blur-2xl border border-white/40 p-2 rounded-3xl shadow-2xl flex items-center gap-2">
                {apps.map((app, index) => (
                    <motion.button
                        key={index}
                        whileHover={{ scale: 1.2, y: -10 }}
                        whileTap={{ scale: 0.9 }}
                        className="relative group p-3 rounded-2xl hover:bg-white/50 transition-colors"
                    >
                        <div className={`w-10 h-10 rounded-xl ${app.color} text-white flex items-center justify-center shadow-lg`}>
                            <app.icon className="w-5 h-5" />
                        </div>

                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            {app.label}
                        </div>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
}
