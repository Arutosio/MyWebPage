import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PhaseName } from '@/lib/time-slots';

export type AccentColor = 'mauve' | 'blue' | 'pink' | 'green' | 'peach' | 'sky';
export type WallpaperMode = 'auto' | 'manual';

export interface SettingsState {
    wallpaperMode: WallpaperMode;
    manualPhase: PhaseName;
    accentColor: AccentColor;
    accentFollowsPhase: boolean;
    hour24: boolean;
    showSeconds: boolean;
    topbarDensity: 'compact' | 'comfortable';
    reducedBlur: boolean;
    fontScale: number;

    setWallpaperMode: (m: WallpaperMode) => void;
    setManualPhase: (p: PhaseName) => void;
    setAccentColor: (c: AccentColor) => void;
    setAccentFollowsPhase: (v: boolean) => void;
    setHour24: (v: boolean) => void;
    setShowSeconds: (v: boolean) => void;
    setTopbarDensity: (d: 'compact' | 'comfortable') => void;
    setReducedBlur: (v: boolean) => void;
    setFontScale: (v: number) => void;
    reset: () => void;
}

export const FONT_SCALE_MIN = 0.8;
export const FONT_SCALE_MAX = 1.5;
export const FONT_SCALE_STEP = 0.05;

const DEFAULTS: Omit<SettingsState,
    'setWallpaperMode' | 'setManualPhase' | 'setAccentColor' | 'setAccentFollowsPhase' | 'setHour24' |
    'setShowSeconds' | 'setTopbarDensity' | 'setReducedBlur' | 'setFontScale' | 'reset'> = {
    wallpaperMode: 'auto',
    manualPhase: 'dawn',
    accentColor: 'mauve',
    accentFollowsPhase: true,
    hour24: true,
    showSeconds: false,
    topbarDensity: 'compact',
    reducedBlur: false,
    fontScale: 1,
};

function clampFontScale(v: number): number {
    if (Number.isNaN(v)) return 1;
    return Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, Math.round(v * 100) / 100));
}

export const useSettings = create<SettingsState>()(
    persist(
        (set) => ({
            ...DEFAULTS,
            setWallpaperMode: (wallpaperMode) => set({ wallpaperMode }),
            setManualPhase: (manualPhase) => set({ manualPhase, wallpaperMode: 'manual' }),
            setAccentColor: (accentColor) => set({ accentColor, accentFollowsPhase: false }),
            setAccentFollowsPhase: (accentFollowsPhase) => set({ accentFollowsPhase }),
            setHour24: (hour24) => set({ hour24 }),
            setShowSeconds: (showSeconds) => set({ showSeconds }),
            setTopbarDensity: (topbarDensity) => set({ topbarDensity }),
            setReducedBlur: (reducedBlur) => set({ reducedBlur }),
            setFontScale: (fontScale) => set({ fontScale: clampFontScale(fontScale) }),
            reset: () => set({ ...DEFAULTS }),
        }),
        {
            name: 'arutOS.settings.v1',
            storage: createJSONStorage(() => localStorage),
        },
    ),
);

export const ACCENT_TAILWIND: Record<AccentColor, { text: string; border: string; bg: string; glow: string }> = {
    mauve:  { text: 'text-mauve',  border: 'border-mauve',  bg: 'bg-mauve',  glow: 'shadow-[0_0_18px_rgba(var(--accent-rgb),0.5)]' },
    blue:   { text: 'text-blue',   border: 'border-blue',   bg: 'bg-blue',   glow: 'shadow-[0_0_18px_rgba(68, 119, 255,0.5)]' },
    pink:   { text: 'text-pink',   border: 'border-pink',   bg: 'bg-pink',   glow: 'shadow-[0_0_18px_rgba(255, 58, 168,0.5)]' },
    green:  { text: 'text-green',  border: 'border-green',  bg: 'bg-green',  glow: 'shadow-[0_0_18px_rgba(0, 240, 128,0.45)]' },
    peach:  { text: 'text-peach',  border: 'border-peach',  bg: 'bg-peach',  glow: 'shadow-[0_0_18px_rgba(255, 138, 64,0.45)]' },
    sky:    { text: 'text-sky',    border: 'border-sky',    bg: 'bg-sky',    glow: 'shadow-[0_0_18px_rgba(137,220,235,0.5)]' },
};
