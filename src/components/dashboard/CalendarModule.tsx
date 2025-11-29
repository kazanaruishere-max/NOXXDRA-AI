'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MoreHorizontal, X } from 'lucide-react';

interface DateNote {
    [key: string]: string; // "YYYY-MM-DD": "Note content"
}

export default function CalendarModule() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [notes, setNotes] = useState<DateNote>({});
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [noteInput, setNoteInput] = useState('');

    // Load notes from localStorage
    useEffect(() => {
        const savedNotes = localStorage.getItem('dashboard_calendar_notes');
        if (savedNotes) setNotes(JSON.parse(savedNotes));
    }, []);

    // Save notes to localStorage
    useEffect(() => {
        localStorage.setItem('dashboard_calendar_notes', JSON.stringify(notes));
    }, [notes]);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const handleDateClick = (day: number) => {
        const dateKey = `${year}-${month + 1}-${day}`;
        setSelectedDate(dateKey);
        setNoteInput(notes[dateKey] || '');
    };

    const saveNote = () => {
        if (selectedDate) {
            if (noteInput.trim()) {
                setNotes({ ...notes, [selectedDate]: noteInput });
            } else {
                const newNotes = { ...notes };
                delete newNotes[selectedDate];
                setNotes(newNotes);
            }
            setSelectedDate(null);
        }
    };

    return (
        <div className="h-full bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <CalendarIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h3>
                        <p className="text-sm text-gray-500">Schedule & Notes</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={prevMonth}
                        className="p-2 rounded-xl hover:bg-white/50 border border-transparent hover:border-white/40 transition-all text-gray-600 hover:text-gray-900"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-2 rounded-xl hover:bg-white/50 border border-transparent hover:border-white/40 transition-all text-gray-600 hover:text-gray-900"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
                {weekDays.map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-400 uppercase tracking-wider py-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => {
                    if (day === null) return <div key={index} />;

                    const dateKey = `${year}-${month + 1}-${day}`;
                    const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
                    const hasNote = !!notes[dateKey];

                    return (
                        <div
                            key={index}
                            onClick={() => handleDateClick(day)}
                            className={`
                aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all duration-200 cursor-pointer relative group
                ${isToday
                                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30 scale-105'
                                    : 'text-gray-700 hover:bg-white/50 hover:scale-105'}
              `}
                        >
                            {day}
                            {hasNote && (
                                <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isToday ? 'bg-white' : 'bg-purple-500'}`} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Note Popup */}
            {selectedDate && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-10 rounded-3xl p-6 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-gray-800">
                            Note for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </h4>
                        <button onClick={() => setSelectedDate(null)} className="p-1 hover:bg-gray-100 rounded-full">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                    <textarea
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Add a note..."
                        className="flex-1 w-full bg-gray-50 rounded-xl border border-gray-200 p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none text-sm mb-4"
                        autoFocus
                    />
                    <button
                        onClick={saveNote}
                        className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all"
                    >
                        Save Note
                    </button>
                </div>
            )}
        </div>
    );
}
