import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'aurora' | 'cyber';

interface Task {
    id: string;
    title: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    category: 'work' | 'personal' | 'urgent';
}

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: number;
}

interface FutureOSState {
    // Theme
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;

    // Notifications
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;

    // Tasks
    tasks: Task[];
    addTask: (task: Omit<Task, 'id'>) => void;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;
    reorderTasks: (tasks: Task[]) => void;

    // Focus Mode
    isFocusMode: boolean;
    setFocusMode: (isFocus: boolean) => void;
}

export const useStore = create<FutureOSState>()(
    persist(
        (set) => ({
            // Theme
            theme: 'light',
            setTheme: (theme) => set({ theme }),

            // Notifications
            notifications: [],
            addNotification: (notification) =>
                set((state) => ({
                    notifications: [
                        { ...notification, id: crypto.randomUUID(), timestamp: Date.now() },
                        ...state.notifications,
                    ],
                })),
            removeNotification: (id) =>
                set((state) => ({
                    notifications: state.notifications.filter((n) => n.id !== id),
                })),
            clearNotifications: () => set({ notifications: [] }),

            // Tasks
            tasks: [],
            addTask: (task) =>
                set((state) => ({
                    tasks: [...state.tasks, { ...task, id: crypto.randomUUID() }],
                })),
            toggleTask: (id) =>
                set((state) => ({
                    tasks: state.tasks.map((t) =>
                        t.id === id ? { ...t, completed: !t.completed } : t
                    ),
                })),
            deleteTask: (id) =>
                set((state) => ({
                    tasks: state.tasks.filter((t) => t.id !== id),
                })),
            reorderTasks: (tasks) => set({ tasks }),

            // Focus Mode
            isFocusMode: false,
            setFocusMode: (isFocus) => set({ isFocusMode: isFocus }),
        }),
        {
            name: 'future-os-storage',
        }
    )
);
