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

    /**
     * Clamp every window so it stays inside the current viewport.
     * Arguments are in LOGICAL (pre-zoom) pixels and represent the full
     * Desktop root (not the bounds container).
     */
    clampToViewport: (vw: number, vh: number, topSafe: number) => void;

    toggleStartMenu: () => void;
    closeStartMenu: () => void;
}

let zCounter = 10;
let idCounter = 0;

import { TOP_BAR_SAFE } from '@/lib/constants';

function currentPhase(): PhaseName {
    return getSlotForHour(new Date().getHours()).name;
}

/**
 * Window coordinates are in **bounds-container space**, i.e. relative to
 * the div that wraps react-rnd (which itself starts at `top: TOP_BAR_SAFE`
 * within the Desktop root). That means:
 *   - x = 0   → left edge of bounds container
 *   - y = 0   → top edge of bounds container (right under the top bar)
 *   - boundsW = logical viewport width
 *   - boundsH = logical viewport height − TOP_BAR_SAFE
 * Any code that computes or clamps x/y MUST stay inside this space.
 */

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

            // Bounds container dimensions (where windows are placed)
            const boundsW = vw;
            const boundsH = vh - TOP_BAR_SAFE;
            const availW = boundsW - 2 * MARGIN;
            const availH = boundsH - 2 * MARGIN;

            // Clamp default size so the window always fits the bounds container.
            let width = Math.min(app.defaultWidth, availW);
            let height = Math.min(app.defaultHeight, availH);
            width = Math.max(Math.min(app.minWidth, availW), width);
            height = Math.max(Math.min(app.minHeight, availH), height);

            // "Natural" size — what the window looks like when the user
            // un-maximizes it. Kept in prevBounds for mobile + native maximize.
            const naturalW = width;
            const naturalH = height;
            const naturalX = Math.max(MARGIN, (boundsW - naturalW) / 2);
            const naturalY = Math.max(MARGIN, (boundsH - naturalH) / 2);

            // Mobile: spawn already MAXIMIZED so touch users don't fight small boxes.
            if (isMobile) {
                width = availW;
                height = availH;
            }

            // Desktop cascade offset (center-biased, capped by clamp below)
            const offset = (state.windows.length % 6) * (isMobile ? 0 : 24);

            // Starting position — ALL in bounds-container space (y=0 is the top
            // of the bounds container, NOT the viewport).
            let x = isMobile ? MARGIN : (boundsW - width) / 2 + offset;
            let y = isMobile ? MARGIN : (boundsH - height) / 2 + offset;

            // Clamp: keep the whole window inside the bounds container with margin.
            x = Math.min(Math.max(MARGIN, x), boundsW - width - MARGIN);
            y = Math.min(Math.max(MARGIN, y), boundsH - height - MARGIN);

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
        set((state) => {
            const scale = useSettings.getState().fontScale || 1;
            const vw = window.innerWidth / scale;
            const vh = window.innerHeight / scale;
            const boundsW = vw;
            const boundsH = vh - TOP_BAR_SAFE;
            const MARGIN = 10;

            return {
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
                        x: MARGIN,
                        y: MARGIN,
                        width: boundsW - 2 * MARGIN,
                        height: boundsH - 2 * MARGIN,
                    };
                }),
            };
        }),

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
            const boundsW = vw;
            const boundsH = vh - topSafe;
            const MARGIN = 8;
            let changed = false;

            const windows = state.windows.map((w) => {
                // Shrink the window if it's too big for the bounds container.
                const minW = Math.min(w.minWidth, boundsW - 2 * MARGIN);
                const minH = Math.min(w.minHeight, boundsH - 2 * MARGIN);
                const maxW = Math.max(minW, boundsW - 2 * MARGIN);
                const maxH = Math.max(minH, boundsH - 2 * MARGIN);

                let width = Math.min(w.width, maxW);
                let height = Math.min(w.height, maxH);
                width = Math.max(minW, width);
                height = Math.max(minH, height);

                // Position is in bounds-container space: y in [0, boundsH].
                let x = w.x;
                let y = w.y;
                if (x + width > boundsW - MARGIN) x = boundsW - width - MARGIN;
                if (y + height > boundsH - MARGIN) y = boundsH - height - MARGIN;
                if (x < MARGIN) x = MARGIN;
                if (y < MARGIN) y = MARGIN;

                if (w.maximized) {
                    // Re-fit a maximized window to the new bounds.
                    x = MARGIN;
                    y = MARGIN;
                    width = boundsW - 2 * MARGIN;
                    height = boundsH - 2 * MARGIN;
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
