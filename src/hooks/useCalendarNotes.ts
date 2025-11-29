'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export interface CalendarNote {
    date: string; // YYYY-MM-DD
    content: string;
}

const STORAGE_KEY = 'calendar-notes';

export function useCalendarNotes() {
    const [notes, setNotes] = useState<Record<string, string>>({});

    // Load notes from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setNotes(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Failed to load calendar notes:', error);
        }
    }, []);

    // Save notes to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
        } catch (error) {
            console.error('Failed to save calendar notes:', error);
        }
    }, [notes]);

    const getNote = (date: Date): string => {
        const key = format(date, 'yyyy-MM-dd');
        return notes[key] || '';
    };

    const setNote = (date: Date, content: string) => {
        const key = format(date, 'yyyy-MM-dd');
        setNotes((prev) => ({
            ...prev,
            [key]: content,
        }));
    };

    const deleteNote = (date: Date) => {
        const key = format(date, 'yyyy-MM-dd');
        setNotes((prev) => {
            const newNotes = { ...prev };
            delete newNotes[key];
            return newNotes;
        });
    };

    const hasNote = (date: Date): boolean => {
        const key = format(date, 'yyyy-MM-dd');
        return !!notes[key];
    };

    return {
        getNote,
        setNote,
        deleteNote,
        hasNote,
    };
}
