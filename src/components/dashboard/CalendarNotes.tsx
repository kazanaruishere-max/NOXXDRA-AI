'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, Plus, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { useCalendarNotes } from '@/hooks/useCalendarNotes';

export default function CalendarNotes() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [noteContent, setNoteContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const { getNote, setNote, deleteNote, hasNote } = useCalendarNotes();

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Get first day of month (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = monthStart.getDay();
    const paddingDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setNoteContent(getNote(date));
        setIsEditing(true);
    };

    const handleSaveNote = () => {
        if (selectedDate && noteContent.trim()) {
            setNote(selectedDate, noteContent);
        } else if (selectedDate && !noteContent.trim()) {
            deleteNote(selectedDate);
        }
        setIsEditing(false);
        setSelectedDate(null);
        setNoteContent('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setSelectedDate(null);
        setNoteContent('');
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    return (
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-gray-500">
                    <CalendarIcon className="w-5 h-5" />
                    <span className="text-sm font-medium uppercase tracking-wider">Calendar Notes</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={prevMonth}
                        className="p-1 hover:bg-gray-200/50 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <span className="text-sm font-medium min-w-[120px] text-center">
                        {format(currentDate, 'MMMM yyyy')}
                    </span>
                    <button
                        onClick={nextMonth}
                        className="p-1 hover:bg-gray-200/50 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={`day-${d}-${i}`} className="text-gray-400 font-medium py-1">
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {paddingDays.map((i) => (
                    <div key={`pad-${i}`} />
                ))}
                {daysInMonth.map((day) => {
                    const hasNoteForDay = hasNote(day);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);

                    return (
                        <button
                            key={day.toISOString()}
                            onClick={() => handleDayClick(day)}
                            className={`
                relative py-2 rounded-lg transition-all duration-200
                ${isToday(day) ? 'bg-gray-900 text-white font-bold' : 'text-gray-600 hover:bg-gray-200/50'}
                ${isSelected ? 'ring-2 ring-blue-500' : ''}
                ${hasNoteForDay && !isToday(day) ? 'bg-blue-100 font-medium' : ''}
              `}
                        >
                            {format(day, 'd')}
                            {hasNoteForDay && (
                                <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>

            {isEditing && selectedDate && (
                <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                            Note for {format(selectedDate, 'MMMM d, yyyy')}
                        </span>
                        <button
                            onClick={handleCancel}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <textarea
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="Add a note..."
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            onClick={handleCancel}
                            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveNote}
                            className="px-3 py-1 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
