import { create } from 'zustand';
import { APPS } from '@/lib/apps';
import type { AppId, WindowState } from '@/types/window';

interface WindowStore {
    windows: WindowState[];
    focusedId: string | null;
    startMenuOpen: boolean;

    open: (appId: AppId) => void;
    close: (id: string) => void;
    focus: (id: string) => void;
    minimize: (id: string) => void;
    toggleMinimize: (id: string) => void;
    toggleMaximize: (id: string) => void;
    updateBounds: (id: string, bounds: Partial<Pick<WindowState, 'x' | 'y' | 'width' | 'height'>>) => void;

    toggleStartMenu: () => void;
    closeStartMenu: () => void;
}

let zCounter = 10;
let idCounter = 0;

const TASKBAR_SAFE = 72;

export const useWindowStore = create<WindowStore>((set) => ({
    windows: [],
    focusedId: null,
    startMenuOpen: false,

    open: (appId) =>
        set((state) => {
            const existing = state.windows.find((w) => w.appId === appId);
            if (existing) {
                zCounter++;
                return {
                    windows: state.windows.map((w) =>
                        w.id === existing.id ? { ...w, minimized: false, zIndex: zCounter } : w,
                    ),
                    focusedId: existing.id,
                    startMenuOpen: false,
                };
            }

            const app = APPS[appId];
            zCounter++;
            idCounter++;
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const offset = (state.windows.length % 6) * 26;
            const x = Math.max(20, (vw - app.defaultWidth) / 2 + offset);
            const y = Math.max(20, (vh - app.defaultHeight - TASKBAR_SAFE) / 2 + offset);

            const win: WindowState = {
                id: `win-${idCounter}`,
                appId,
                title: app.title,
                icon: app.icon,
                x,
                y,
                width: app.defaultWidth,
                height: app.defaultHeight,
                minWidth: app.minWidth,
                minHeight: app.minHeight,
                zIndex: zCounter,
                minimized: false,
                maximized: false,
            };

            return {
                windows: [...state.windows, win],
                focusedId: win.id,
                startMenuOpen: false,
            };
        }),

    close: (id) =>
        set((state) => ({
            windows: state.windows.filter((w) => w.id !== id),
            focusedId: state.focusedId === id ? null : state.focusedId,
        })),

    focus: (id) =>
        set((state) => {
            zCounter++;
            return {
                windows: state.windows.map((w) =>
                    w.id === id ? { ...w, zIndex: zCounter, minimized: false } : w,
                ),
                focusedId: id,
            };
        }),

    minimize: (id) =>
        set((state) => ({
            windows: state.windows.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
            focusedId: state.focusedId === id ? null : state.focusedId,
        })),

    toggleMinimize: (id) =>
        set((state) => {
            const target = state.windows.find((w) => w.id === id);
            if (!target) return state;
            if (target.minimized) {
                zCounter++;
                return {
                    windows: state.windows.map((w) =>
                        w.id === id ? { ...w, minimized: false, zIndex: zCounter } : w,
                    ),
                    focusedId: id,
                };
            }
            return {
                windows: state.windows.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
                focusedId: state.focusedId === id ? null : state.focusedId,
            };
        }),

    toggleMaximize: (id) =>
        set((state) => ({
            windows: state.windows.map((w) => {
                if (w.id !== id) return w;
                if (w.maximized && w.prevBounds) {
                    return {
                        ...w,
                        maximized: false,
                        x: w.prevBounds.x,
                        y: w.prevBounds.y,
                        width: w.prevBounds.width,
                        height: w.prevBounds.height,
                        prevBounds: undefined,
                    };
                }
                return {
                    ...w,
                    maximized: true,
                    prevBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
                    x: 16,
                    y: 16,
                    width: window.innerWidth - 32,
                    height: window.innerHeight - TASKBAR_SAFE - 16,
                };
            }),
        })),

    updateBounds: (id, bounds) =>
        set((state) => ({
            windows: state.windows.map((w) => (w.id === id ? { ...w, ...bounds } : w)),
        })),

    toggleStartMenu: () => set((state) => ({ startMenuOpen: !state.startMenuOpen })),
    closeStartMenu: () => set({ startMenuOpen: false }),
}));
