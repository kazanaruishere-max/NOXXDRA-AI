'use client';

import GlassPanel from '@/components/ui/GlassPanel';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Check, Layers, Plus, Trash2, Edit2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

/**
 * TaskTracker (Enhanced)
 * 
 * Features:
 * - Full CRUD (Add, Edit, Delete, Complete)
 * - Persistence (localStorage)
 * - Task Counter
 * - Empty State
 */

interface Task {
    id: string;
    text: string;
    completed: boolean;
    category: 'System' | 'Work' | 'Personal' | 'Health';
    createdAt: number;
}

export default function TaskTracker() {
    const [tasks, setTasks] = useLocalStorage<Task[]>('dashboard-tasks', []);
    const [newTaskText, setNewTaskText] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');

    // Stats
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const progress = total === 0 ? 0 : (completed / total) * 100;

    // Progress Ring
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    // Actions
    const addTask = () => {
        if (!newTaskText.trim()) return;
        const newTask: Task = {
            id: Date.now().toString(),
            text: newTaskText.trim(),
            completed: false,
            category: 'Personal', // Default
            createdAt: Date.now()
        };
        setTasks([newTask, ...tasks]);
        setNewTaskText('');
        setIsAdding(false);
    };

    const toggleTask = (id: string) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const startEdit = (task: Task) => {
        setEditingId(task.id);
        setEditText(task.text);
    };

    const saveEdit = () => {
        if (editingId) {
            setTasks(tasks.map(t => t.id === editingId ? { ...t, text: editText } : t));
            setEditingId(null);
        }
    };

    // Helper for category badge
    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case 'System': return 'bg-slate-100 text-slate-500';
            case 'Work': return 'bg-[#5CE1E6]/10 text-[#2CB1BC]';
            case 'Personal': return 'bg-[#C7A6FF]/10 text-[#9F7AEA]';
            case 'Health': return 'bg-emerald-100 text-emerald-600';
            default: return 'bg-slate-100 text-slate-500';
        }
    };

    return (
        <GlassPanel side="right" delay={0.24} radius="large" className="p-6 flex flex-col h-full relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 z-20">
                <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#00E8FF]" />
                    <div>
                        <span className="text-[13px] font-medium text-slate-500 tracking-wide uppercase block leading-none">My Tasks</span>
                        <span className="text-[10px] text-slate-400 font-mono">{completed}/{total} Completed</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#00E8FF]/20 hover:text-[#00E8FF] flex items-center justify-center transition-colors"
                    >
                        {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>

                    {/* Progress Ring */}
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="20" cy="20" r={radius} stroke="#E2E8F0" strokeWidth="3" fill="transparent" />
                            <circle
                                cx="20" cy="20" r={radius}
                                stroke="#00E8FF" strokeWidth="3" fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                className="transition-all duration-500 ease-out"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Add Task Input */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginBottom: 12 }}
                        exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTaskText}
                                onChange={(e) => setNewTaskText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                                placeholder="New task..."
                                className="flex-1 bg-white/60 border border-white/50 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-[#00E8FF]"
                                autoFocus
                            />
                            <button
                                onClick={addTask}
                                disabled={!newTaskText.trim()}
                                className="px-3 bg-[#00E8FF] text-white rounded-lg hover:bg-[#00D1E6] disabled:opacity-50 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                <AnimatePresence mode='popLayout'>
                    {tasks.length === 0 && !isAdding ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-full text-slate-400"
                        >
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                                <Check className="w-6 h-6 text-slate-300" />
                            </div>
                            <p className="text-sm">All caught up!</p>
                        </motion.div>
                    ) : (
                        tasks.map((task) => (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: task.completed ? 0.6 : 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                layout
                                className={`
                  group flex items-center gap-3 p-3.5 rounded-[16px] border transition-all
                  ${task.completed
                                        ? 'bg-slate-50/50 border-transparent'
                                        : 'bg-white/40 border-white/50 hover:bg-white/60 hover:shadow-sm'}
                `}
                            >
                                {/* Checkbox */}
                                <button
                                    onClick={() => toggleTask(task.id)}
                                    className={`
                    w-5 h-5 rounded-full border flex items-center justify-center transition-all flex-shrink-0
                    ${task.completed
                                            ? 'bg-[#00E8FF] border-[#00E8FF]'
                                            : 'border-slate-300 group-hover:border-[#00E8FF]'}
                  `}
                                >
                                    {task.completed && <Check className="w-3 h-3 text-white" />}
                                </button>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    {editingId === task.id ? (
                                        <input
                                            type="text"
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            onBlur={saveEdit}
                                            onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                                            className="w-full bg-transparent border-b border-[#00E8FF] focus:outline-none text-[14px] font-medium text-slate-700"
                                            autoFocus
                                        />
                                    ) : (
                                        <p
                                            onClick={() => startEdit(task)}
                                            className={`text-[14px] font-medium truncate transition-colors cursor-text ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}
                                        >
                                            {task.text}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${getCategoryColor(task.category)}`}>
                                            {task.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => startEdit(task)} className="p-1 text-slate-400 hover:text-[#00E8FF]">
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => deleteTask(task.id)} className="p-1 text-slate-400 hover:text-red-500">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </GlassPanel>
    );
}
