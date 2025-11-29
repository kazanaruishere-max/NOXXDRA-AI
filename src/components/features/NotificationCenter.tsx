'use client';

import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Info, AlertTriangle, CheckCircle } from 'lucide-react';

export default function NotificationCenter() {
    const { notifications, removeNotification } = useStore();

    return (
        <div className="fixed top-24 right-8 z-40 w-80 pointer-events-none">
            <AnimatePresence>
                {notifications.map((notification) => (
                    <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="mb-3 pointer-events-auto"
                    >
                        <div className="bg-white/90 backdrop-blur-xl border border-white/40 p-4 rounded-2xl shadow-lg flex gap-3 relative overflow-hidden">
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${notification.type === 'error' ? 'bg-red-500' :
                                    notification.type === 'warning' ? 'bg-yellow-500' :
                                        notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                                }`} />

                            <div className="mt-1">
                                {notification.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                                {notification.type === 'warning' && <Bell className="w-5 h-5 text-yellow-500" />}
                                {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                                {notification.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                            </div>

                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-sm">{notification.title}</h4>
                                <p className="text-gray-600 text-xs mt-1">{notification.message}</p>
                            </div>

                            <button
                                onClick={() => removeNotification(notification.id)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
