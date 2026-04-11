import { create } from 'zustand';
import { APPS } from '@/lib/apps';
import type { AppId, WindowState } from '@/types/window';
import { getSlotForHour, type PhaseName } from '@/lib/time-slots';
import { useSettings } from '@/store/settings';

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

    togglePhaseLock: (id: string) => void;
    refreshLivePhases: (currentPhase: PhaseName) => void;

    /** Clamp every window so it stays inside the current viewport (called on resize). */
    clampToViewport: (vw: number, vh: number, topSafe: number) => void;

    toggleStartMenu: () => void;
    closeStartMenu: () => void;
}

let zCounter = 10;
let idCounter = 0;

const TASKBAR_SAFE = 72;

function currentPhase(): PhaseName {
    return getSlotForHour(new Date().getHours()).name;
}

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
            // The Desktop root is rendered with `zoom: fontScale`, so the logical
            // coordinate space visible to the user is (innerWidth/scale × innerHeight/scale).
            const scale = useSettings.getState().fontScale || 1;
            const vw = window.innerWidth / scale;
            const vh = window.innerHeight / scale;
            const isMobile = vw < 640;
            const MARGIN = isMobile ? 10 : 16;
            const availH = vh - TASKBAR_SAFE - MARGIN;

            // Clamp default size so the window always fits the viewport,
            // including narrow mobile screens where desktop defaults would overflow.
            let width = Math.min(app.defaultWidth, vw - 2 * MARGIN);
            let height = Math.min(app.defaultHeight, availH);
            width = Math.max(Math.min(app.minWidth, vw - 2 * MARGIN), width);
            height = Math.max(Math.min(app.minHeight, availH), height);

            // "Natural" size — what the window would look like when the user
            // un-maximizes it. We remember this in prevBounds on mobile.
            const naturalW = width;
            const naturalH = height;
            const naturalX = Math.max(MARGIN, (vw - naturalW) / 2);
            const naturalY = Math.max(TASKBAR_SAFE + MARGIN, TASKBAR_SAFE + (availH - naturalH) / 2);

            // Mobile: spawn already MAXIMIZED so touch users don't fight tiny draggable boxes.
            if (isMobile) {
                width = vw - 2 * MARGIN;
                height = availH;
            }

            // Offset cascade + clamp position to viewport bounds.
            const offset = (state.windows.length % 6) * (isMobile ? 0 : 24);
            let x = isMobile ? MARGIN : (vw - width) / 2 + offset;
            let y = isMobile ? TASKBAR_SAFE : TASKBAR_SAFE + (availH - height) / 2 + offset;
            x = Math.min(Math.max(MARGIN, x), vw - width - MARGIN);
            y = Math.min(Math.max(TASKBAR_SAFE, y), vh - height - MARGIN);

            const win: WindowState = {
                id: `win-${idCounter}`,
                appId,
                title: app.title,
                icon: app.icon,
                x,
                y,
                width,
                height,
                minWidth: Math.min(app.minWidth, width),
                minHeight: Math.min(app.minHeight, height),
                zIndex: zCounter,
                minimized: false,
                maximized: isMobile,
                prevBounds: isMobile
                    ? { x: naturalX, y: naturalY, width: naturalW, height: naturalH }
                    : undefined,
                phase: currentPhase(),
                phaseMode: 'live',
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

    togglePhaseLock: (id) =>
        set((state) => ({
            windows: state.windows.map((w) => {
                if (w.id !== id) return w;
                // Going frozen → capture the current time's phase so the lock snapshot is accurate.
                // Going live → refresh phase to the current clock immediately.
                const nextMode = w.phaseMode === 'frozen' ? 'live' : 'frozen';
                return {
                    ...w,
                    phaseMode: nextMode,
                    phase: nextMode === 'live' ? currentPhase() : w.phase,
                };
            }),
        })),

    refreshLivePhases: (next) =>
        set((state) => {
            const needsUpdate = state.windows.some(
                (w) => w.phaseMode === 'live' && w.phase !== next,
            );
            if (!needsUpdate) return state;
            return {
                windows: state.windows.map((w) =>
                    w.phaseMode === 'live' ? { ...w, phase: next } : w,
                ),
            };
        }),

    clampToViewport: (vw, vh, topSafe) =>
        set((state) => {
            const availableH = vh - topSafe;
            const MARGIN = 8;
            let changed = false;
            const windows = state.windows.map((w) => {
                const minW = Math.min(w.minWidth, vw - 2 * MARGIN);
                const minH = Math.min(w.minHeight, availableH - 2 * MARGIN);
                const maxW = Math.max(minW, vw - 2 * MARGIN);
                const maxH = Math.max(minH, availableH - 2 * MARGIN);

                let width = Math.min(w.width, maxW);
                let height = Math.min(w.height, maxH);
                width = Math.max(minW, width);
                height = Math.max(minH, height);

                let x = w.x;
                let y = w.y;
                if (x + width > vw - MARGIN) x = vw - width - MARGIN;
                if (y + height > vh - MARGIN) y = vh - height - MARGIN;
                if (x < MARGIN) x = MARGIN;
                if (y < topSafe) y = topSafe;

                if (w.maximized) {
                    // Always re-fit a maximized window to the new viewport.
                    x = MARGIN * 2;
                    y = topSafe;
                    width = vw - 4 * MARGIN;
                    height = availableH - 2 * MARGIN;
                }

                if (
                    x !== w.x ||
                    y !== w.y ||
                    width !== w.width ||
                    height !== w.height
                ) {
                    changed = true;
                    return { ...w, x, y, width, height };
                }
                return w;
            });
            if (!changed) return state;
            return { windows };
        }),

    toggleStartMenu: () => set((state) => ({ startMenuOpen: !state.startMenuOpen })),
    closeStartMenu: () => set({ startMenuOpen: false }),
}));
