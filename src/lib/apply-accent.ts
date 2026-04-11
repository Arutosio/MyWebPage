import { useEffect, useState } from 'react';
import { useSettings, type AccentColor } from '@/store/settings';
import { getSlotForHour, type PhaseName } from '@/lib/time-slots';
import { PHASE_ACCENT } from '@/lib/phase-theme';

/**
 * Maps the accent name to the actual hex we baked into the Tailwind 4 @theme.
 * These MUST match `src/index.css`.
 */
const ACCENT_HEX: Record<AccentColor, string> = {
    mauve: '#b860ff',
    blue: '#4477ff',
    pink: '#ff3aa8',
    green: '#00f080',
    peach: '#ff8a40',
    sky: '#00d4ff',
};

function hexToRgbTriple(hex: string): string {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
}

/**
 * Overrides the Tailwind `--color-mauve` CSS variable at runtime so every
 * `text-mauve`, `border-mauve`, `bg-mauve`, `fill-mauve` utility instantly
 * picks up the accent color the user selected in Settings.
 *
 * When `accentFollowsPhase` is on, the accent is derived automatically from
 * the current time-of-day phase. Otherwise it uses the user's manual pick.
 */
export function useApplyAccent() {
    const accent = useSettings((s) => s.accentColor);
    const followsPhase = useSettings((s) => s.accentFollowsPhase);
    const [currentPhase, setCurrentPhase] = useState<PhaseName>(
        () => getSlotForHour(new Date().getHours()).name,
    );

    // Poll for phase boundary crossings every 60s while auto mode is on.
    useEffect(() => {
        if (!followsPhase) return;
        const tick = () => {
            const p = getSlotForHour(new Date().getHours()).name;
            setCurrentPhase((prev) => (prev === p ? prev : p));
        };
        tick();
        const id = window.setInterval(tick, 60_000);
        return () => window.clearInterval(id);
    }, [followsPhase]);

    const effective = followsPhase ? PHASE_ACCENT[currentPhase] : accent;

    useEffect(() => {
        const hex = ACCENT_HEX[effective] ?? ACCENT_HEX.mauve;
        const rgb = hexToRgbTriple(hex);
        const root = document.documentElement;
        root.style.setProperty('--color-mauve', hex);
        root.style.setProperty('--accent-rgb', rgb);
    }, [effective]);
}
