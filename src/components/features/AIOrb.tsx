'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Sparkles } from 'lucide-react';

export default function AIOrb() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');

    return (
        <>
            {/* Orb Trigger */}
            <motion.div
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                className="fixed bottom-8 right-8 z-50 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl animate-pulse opacity-50" />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full shadow-lg border-2 border-white/20 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                        <Sparkles className="w-8 h-8 text-white animate-pulse" />
                    </div>
                </div>
            </motion.div>

            {/* Chat Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-28 right-8 w-80 md:w-96 bg-white/80 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-2xl z-40 overflow-hidden"
                    >
                        <div className="p-4 border-b border-white/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-blue-500" />
                                <span className="font-bold text-gray-900">AI Assistant</span>
                            </div>
                        </div>

                        <div className="h-64 p-4 overflow-y-auto space-y-4 custom-scrollbar">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex-shrink-0" />
                                <div className="bg-white/50 p-3 rounded-2xl rounded-tl-none text-sm text-gray-700 shadow-sm">
                                    Hello! I'm your Future OS assistant. How can I help you optimize your workflow today?
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-white/50 border-t border-white/20">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Ask anything..."
                                    className="flex-1 bg-white/80 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20"
                                />
                                <button className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
