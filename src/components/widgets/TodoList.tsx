'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeoButton } from '@/components/ui/NeoButton';
import { Check, Plus, Trash2, GripVertical } from 'lucide-react';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

export default function TodoList() {
    const { tasks, addTask, toggleTask, deleteTask } = useStore();
    const [newTask, setNewTask] = useState('');

    const handleAdd = () => {
        if (!newTask.trim()) return;
        addTask({
            title: newTask,
            completed: false,
            priority: 'medium',
            category: 'personal',
        });
        setNewTask('');
    };

    return (
        <GlassCard className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-lg">Tasks</h3>
                <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-md text-gray-500">
                    {tasks.filter((t) => !t.completed).length} Pending
                </span>
            </div>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    placeholder="Add new task..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <NeoButton size="icon" onClick={handleAdd}>
                    <Plus className="w-4 h-4" />
                </NeoButton>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                <AnimatePresence initial={false}>
                    {tasks.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-gray-400 py-8 text-sm"
                        >
                            No tasks yet. Stay productive!
                        </motion.div>
                    ) : (
                        tasks.map((task) => (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="group flex items-center gap-3 p-3 bg-white/50 border border-white/60 rounded-xl hover:border-blue-200 transition-colors"
                            >
                                <button
                                    onClick={() => toggleTask(task.id)}
                                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${task.completed
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : 'border-gray-300 hover:border-blue-400'
                                        }`}
                                >
                                    {task.completed && <Check className="w-3 h-3" />}
                                </button>
                                <span
                                    className={`flex-1 text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                                        }`}
                                >
                                    {task.title}
                                </span>
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </GlassCard>
    );
}
