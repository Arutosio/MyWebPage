import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PhaseName } from '@/lib/time-slots';

export type AccentColor = 'mauve' | 'blue' | 'pink' | 'green' | 'peach' | 'sky';
export type WallpaperMode = 'auto' | 'manual';

export interface SettingsState {
    wallpaperMode: WallpaperMode;
    manualPhase: PhaseName;
    accentColor: AccentColor;
    hour24: boolean;
    showSeconds: boolean;
    topbarDensity: 'compact' | 'comfortable';
    reducedBlur: boolean;

    setWallpaperMode: (m: WallpaperMode) => void;
    setManualPhase: (p: PhaseName) => void;
    setAccentColor: (c: AccentColor) => void;
    setHour24: (v: boolean) => void;
    setShowSeconds: (v: boolean) => void;
    setTopbarDensity: (d: 'compact' | 'comfortable') => void;
    setReducedBlur: (v: boolean) => void;
    reset: () => void;
}

const DEFAULTS: Omit<SettingsState,
    'setWallpaperMode' | 'setManualPhase' | 'setAccentColor' | 'setHour24' |
    'setShowSeconds' | 'setTopbarDensity' | 'setReducedBlur' | 'reset'> = {
    wallpaperMode: 'auto',
    manualPhase: 'dawn',
    accentColor: 'mauve',
    hour24: true,
    showSeconds: false,
    topbarDensity: 'compact',
    reducedBlur: false,
};

export const useSettings = create<SettingsState>()(
    persist(
        (set) => ({
            ...DEFAULTS,
            setWallpaperMode: (wallpaperMode) => set({ wallpaperMode }),
            setManualPhase: (manualPhase) => set({ manualPhase, wallpaperMode: 'manual' }),
            setAccentColor: (accentColor) => set({ accentColor }),
            setHour24: (hour24) => set({ hour24 }),
            setShowSeconds: (showSeconds) => set({ showSeconds }),
            setTopbarDensity: (topbarDensity) => set({ topbarDensity }),
            setReducedBlur: (reducedBlur) => set({ reducedBlur }),
            reset: () => set({ ...DEFAULTS }),
        }),
        {
            name: 'arutOS.settings.v1',
            storage: createJSONStorage(() => localStorage),
        },
    ),
);

export const ACCENT_TAILWIND: Record<AccentColor, { text: string; border: string; bg: string; glow: string }> = {
    mauve:  { text: 'text-mauve',  border: 'border-mauve',  bg: 'bg-mauve',  glow: 'shadow-[0_0_18px_rgba(203,166,247,0.5)]' },
    blue:   { text: 'text-blue',   border: 'border-blue',   bg: 'bg-blue',   glow: 'shadow-[0_0_18px_rgba(137,180,250,0.5)]' },
    pink:   { text: 'text-pink',   border: 'border-pink',   bg: 'bg-pink',   glow: 'shadow-[0_0_18px_rgba(245,194,231,0.5)]' },
    green:  { text: 'text-green',  border: 'border-green',  bg: 'bg-green',  glow: 'shadow-[0_0_18px_rgba(166,227,161,0.45)]' },
    peach:  { text: 'text-peach',  border: 'border-peach',  bg: 'bg-peach',  glow: 'shadow-[0_0_18px_rgba(250,179,135,0.45)]' },
    sky:    { text: 'text-sky',    border: 'border-sky',    bg: 'bg-sky',    glow: 'shadow-[0_0_18px_rgba(137,220,235,0.5)]' },
};
