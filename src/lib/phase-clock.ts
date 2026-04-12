import { create } from 'zustand';
import { getSlotForHour, type PhaseName } from '@/lib/time-slots';

/**
 * Single source of truth for the current time-of-day phase.
 *
 * Schedules a timeout to fire exactly at the next phase boundary (hours
 * 5, 11, 16, 20) rather than polling every minute. This keeps wallpaper,
 * accent, and window chrome in lock-step, survives tab throttling and
 * device sleep, and avoids a one-minute drift across the three subsystems.
 */
const BOUNDARIES = [5, 11, 16, 20] as const;

function currentPhase(): PhaseName {
    return getSlotForHour(new Date().getHours()).name;
}

function msUntilNextBoundary(now = new Date()): number {
    const h = now.getHours();
    const next = BOUNDARIES.find((b) => b > h) ?? BOUNDARIES[0] + 24;
    const target = new Date(now);
    target.setHours(next, 0, 0, 100);
    return Math.max(1000, target.getTime() - now.getTime());
}

interface PhaseClockState {
    phase: PhaseName;
}

export const usePhaseClock = create<PhaseClockState>(() => ({
    phase: currentPhase(),
}));

let handle: ReturnType<typeof setTimeout> | null = null;

function schedule() {
    if (handle !== null) clearTimeout(handle);
    handle = setTimeout(() => {
        usePhaseClock.setState({ phase: currentPhase() });
        schedule();
    }, msUntilNextBoundary());
}

function recompute() {
    usePhaseClock.setState((s) => {
        const next = currentPhase();
        return next === s.phase ? s : { phase: next };
    });
    schedule();
}

// Auto-start once per module load.
schedule();

// Catch up after tab becomes visible again (throttling/sleep).
if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') recompute();
    });
}
