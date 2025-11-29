'use client';

import GlassPanel from '@/components/ui/GlassPanel';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Trash2, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CalendarHub (Enhanced)
 * 
 * Features:
 * - Real-time Month/Year display
 * - Year Switcher
 * - Mini Notes System (Persistence)
 * - Visual Indicator for Notes
 */

interface CalendarNote {
    [dateKey: string]: string[]; // "YYYY-MM-DD": ["Note 1", "Note 2"]
}

export default function CalendarHub() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [notes, setNotes] = useLocalStorage<CalendarNote>('dashboard-calendar-notes', {});
    const [newNote, setNewNote] = useState('');
    const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);

    // Calendar Logic
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sunday

    // Generate calendar grid
    const days = useMemo(() => {
        const daysArray = [];
        // Previous month padding
        for (let i = 0; i < firstDayOfMonth; i++) {
            daysArray.push(null);
        }
        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            daysArray.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
        }
        return daysArray;
    }, [currentDate, daysInMonth, firstDayOfMonth]);

    // Helpers
    const formatDateKey = (date: Date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleYearChange = (year: number) => {
        setCurrentDate(new Date(year, currentDate.getMonth(), 1));
        setIsYearPickerOpen(false);
    };

    const addNote = () => {
        if (!selectedDate || !newNote.trim()) return;
        const key = formatDateKey(selectedDate);
        const currentNotes = notes[key] || [];

        if (currentNotes.length >= 5) {
            alert('Max 5 notes per day');
            return;
        }

        setNotes({
            ...notes,
            [key]: [...currentNotes, newNote.trim().substring(0, 100)]
        });
        setNewNote('');
    };

    const deleteNote = (index: number) => {
        if (!selectedDate) return;
        const key = formatDateKey(selectedDate);
        const currentNotes = notes[key] || [];
        const updatedNotes = currentNotes.filter((_, i) => i !== index);

        if (updatedNotes.length === 0) {
            const { [key]: _, ...rest } = notes;
            setNotes(rest);
        } else {
            setNotes({ ...notes, [key]: updatedNotes });
        }
    };

    const hasNotes = (date: Date) => {
        const key = formatDateKey(date);
        return notes[key] && notes[key].length > 0;
    };

    // Render
    return (
        <GlassPanel side="left" delay={0} radius="large" className="p-6 flex flex-col h-full relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 z-20">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-[#5CE1E6]" />
                    <div className="relative">
                        <button
                            onClick={() => setIsYearPickerOpen(!isYearPickerOpen)}
                            className="text-[18px] font-bold text-slate-700 hover:text-[#5CE1E6] transition-colors flex items-center gap-1"
                        >
                            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </button>

                        {/* Year Picker Dropdown */}
                        <AnimatePresence>
                            {isYearPickerOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 mt-2 bg-white/90 backdrop-blur-xl border border-white/50 rounded-xl shadow-xl p-2 h-48 overflow-y-auto custom-scrollbar w-32 z-50"
                                >
                                    {Array.from({ length: 10 }, (_, i) => currentDate.getFullYear() - 5 + i).map(year => (
                                        <button
                                            key={year}
                                            onClick={() => handleYearChange(year)}
                                            className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${year === currentDate.getFullYear() ? 'bg-[#5CE1E6]/20 text-[#2CB1BC]' : 'hover:bg-slate-100 text-slate-600'}`}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex gap-1">
                    <button onClick={handlePrevMonth} className="p-1.5 hover:bg-white/40 rounded-full transition-colors">
                        <ChevronLeft className="w-4 h-4 text-slate-500" />
                    </button>
                    <button onClick={handleNextMonth} className="p-1.5 hover:bg-white/40 rounded-full transition-colors">
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1">
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <div key={i} className="text-center text-[11px] font-medium text-slate-400">
                            {d}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {days.map((date, i) => {
                        if (!date) return <div key={`empty-${i}`} />;

                        const isToday = new Date().toDateString() === date.toDateString();
                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                        const noteCount = hasNotes(date);

                        return (
                            <button
                                key={i}
                                onClick={() => setSelectedDate(date)}
                                className={`
                  relative aspect-square flex flex-col items-center justify-center rounded-xl transition-all
                  ${isSelected ? 'bg-[#5CE1E6] text-white shadow-md scale-105 z-10' : 'hover:bg-white/40 text-slate-600'}
                  ${isToday && !isSelected ? 'border border-[#5CE1E6]/50' : ''}
                `}
                            >
                                <span className="text-[13px] font-medium">{date.getDate()}</span>
                                {noteCount && (
                                    <div className={`w-1 h-1 rounded-full mt-0.5 ${isSelected ? 'bg-white' : 'bg-[#5CE1E6] shadow-[0_0_4px_#5CE1E6]'}`} />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Notes Section (Expandable) */}
            <AnimatePresence>
                {selectedDate && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 border-t border-white/30 pt-4 overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-wide">
                                Notes for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </h3>
                            <button onClick={() => setSelectedDate(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-3 h-3" />
                            </button>
                        </div>

                        {/* Note List */}
                        <div className="space-y-2 mb-3 max-h-[80px] overflow-y-auto custom-scrollbar">
                            {(notes[formatDateKey(selectedDate)] || []).map((note, idx) => (
                                <div key={idx} className="flex justify-between items-start gap-2 bg-white/40 p-2 rounded-lg text-[12px] text-slate-700 group">
                                    <span className="break-words flex-1">{note}</span>
                                    <button
                                        onClick={() => deleteNote(idx)}
                                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            {(!notes[formatDateKey(selectedDate)] || notes[formatDateKey(selectedDate)].length === 0) && (
                                <p className="text-[11px] text-slate-400 italic">No notes yet.</p>
                            )}
                        </div>

                        {/* Add Note Input */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addNote()}
                                placeholder="Add note..."
                                maxLength={100}
                                className="flex-1 bg-white/50 border border-white/50 rounded-lg px-2 py-1.5 text-[12px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#5CE1E6]"
                            />
                            <button
                                onClick={addNote}
                                disabled={!newNote.trim()}
                                className="p-1.5 bg-[#5CE1E6] text-white rounded-lg hover:bg-[#4BC5CA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassPanel>
    );
}
