import type { PhaseName } from './time-slots';
import type { AccentColor } from '@/store/settings';

/**
 * Phase theming — maps the 4 time-of-day phases to their visual color identity
 * and (optionally) to a system accent color when `accentFollowsPhase` is on.
 */

export interface PhaseVisual {
    hex: string;
    rgb: string;
    label: string;
}

export const PHASE_COLORS: Record<PhaseName, PhaseVisual> = {
    dawn:   { hex: '#ff3aa8', rgb: '255, 58, 168', label: 'dawn' },
    noon:   { hex: '#ffd000', rgb: '255, 208, 0',  label: 'noon' },
    sunset: { hex: '#ff8a40', rgb: '255, 138, 64', label: 'sunset' },
    night:  { hex: '#4477ff', rgb: '68, 119, 255', label: 'night' },
};

/**
 * Phase → system accent color mapping (used when `accentFollowsPhase` is true).
 * Picked so each phase gets a visually coordinated UI chrome: pink for dawn's
 * magenta skies, peach for the warm sun of noon, mauve for twilight, and sky
 * for the cold blue of night.
 */
export const PHASE_ACCENT: Record<PhaseName, AccentColor> = {
    dawn:   'pink',
    noon:   'peach',
    sunset: 'mauve',
    night:  'sky',
};

/** `box-shadow` value (no leading prop name) for a phase glow ring. */
export function phaseGlow(phase: PhaseName, alpha = 0.35, radius = 32): string {
    const { rgb } = PHASE_COLORS[phase];
    return `0 0 ${radius}px rgba(${rgb}, ${alpha})`;
}

/** Inline-style dot color for phase indicators. */
export function phaseDotColor(phase: PhaseName): string {
    return PHASE_COLORS[phase].hex;
}
