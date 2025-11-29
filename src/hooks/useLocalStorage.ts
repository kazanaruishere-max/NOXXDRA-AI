'use client';

import { useState, useEffect } from 'react';

/**
'use client';

import { useState, useEffect } from 'react';

/**
 * useLocalStorage Hook
 * 
'use client';

import { useState, useEffect } from 'react';

/**
'use client';

import { useState, useEffect } from 'react';

/**
 * useLocalStorage Hook
 * 
 * A custom hook for persisting state to localStorage with type safety.
 * Handles hydration issues in Next.js by waiting for mount.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
    // State to store our value
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setStoredValue(JSON.parse(item));
            } else {
                window.localStorage.setItem(key, JSON.stringify(initialValue));
            }
            setIsInitialized(true);
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            setIsInitialized(true);
        }
    }, [key, initialValue]);

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue, isInitialized] as const;
}
