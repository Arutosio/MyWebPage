import { phaseDotColor } from '@/lib/phase-theme';
import type { PhaseName } from '@/lib/time-slots';

interface Props {
    phase: PhaseName;
    /** Glow radius in px. Defaults to 4. */
    glow?: number;
    /** Extra box-shadow rules (e.g. frozen indicator ring). */
    extraShadow?: string;
    className?: string;
}

/** Tiny colored dot that represents the current phase. */
export default function PhaseDot({ phase, glow = 4, extraShadow, className = '' }: Props) {
    const hex = phaseDotColor(phase);
    const shadow = extraShadow
        ? `0 0 ${glow}px ${hex}, ${extraShadow}`
        : `0 0 ${glow}px ${hex}`;

    return (
        <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${className}`}
            style={{ background: hex, boxShadow: shadow }}
            aria-hidden="true"
        />
    );
}
