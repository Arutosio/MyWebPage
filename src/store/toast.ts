import { create } from 'zustand';

export type ToastKind = 'info' | 'success' | 'error' | 'warn';

export interface Toast {
    id: number;
    kind: ToastKind;
    title: string;
    message?: string;
    duration: number;
}

interface ToastState {
    toasts: Toast[];
    push: (t: Omit<Toast, 'id' | 'duration'> & { duration?: number }) => number;
    dismiss: (id: number) => void;
    clear: () => void;
}

let seq = 1;
const timers = new Map<number, ReturnType<typeof setTimeout>>();

function clearTimer(id: number) {
    const t = timers.get(id);
    if (t !== undefined) {
        clearTimeout(t);
        timers.delete(id);
    }
}

export const useToast = create<ToastState>((set) => ({
    toasts: [],
    push: ({ kind, title, message, duration = 4000 }) => {
        const id = seq++;
        set((s) => ({ toasts: [...s.toasts, { id, kind, title, message, duration }] }));
        if (duration > 0) {
            const handle = setTimeout(() => {
                timers.delete(id);
                set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
            }, duration);
            timers.set(id, handle);
        }
        return id;
    },
    dismiss: (id) => {
        clearTimer(id);
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    },
    clear: () => {
        timers.forEach((t) => clearTimeout(t));
        timers.clear();
        set({ toasts: [] });
    },
}));

export const toast = {
    info: (title: string, message?: string) => useToast.getState().push({ kind: 'info', title, message }),
    success: (title: string, message?: string) => useToast.getState().push({ kind: 'success', title, message }),
    error: (title: string, message?: string) => useToast.getState().push({ kind: 'error', title, message }),
    warn: (title: string, message?: string) => useToast.getState().push({ kind: 'warn', title, message }),
};
