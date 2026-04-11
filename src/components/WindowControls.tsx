import { useWindowStore } from '@/store/windows';
import { phaseDotColor } from '@/lib/phase-theme';
import type { PhaseMode } from '@/types/window';
import type { PhaseName } from '@/lib/time-slots';

interface Props {
    id: string;
    maximized: boolean;
    phase: PhaseName;
    phaseMode: PhaseMode;
}

/**
 * Original window controls — monospace text commands inside square brackets.
 * Left→right: pin (phase lock) · minimize · maximize · close.
 * Pin is unique to arutOS: frozen windows keep their phase color forever.
 */
export default function WindowControls({ id, maximized, phase, phaseMode }: Props) {
    const minimize = useWindowStore((s) => s.minimize);
    const toggleMaximize = useWindowStore((s) => s.toggleMaximize);
    const close = useWindowStore((s) => s.close);
    const togglePhaseLock = useWindowStore((s) => s.togglePhaseLock);

    const frozen = phaseMode === 'frozen';
    const pinGlow = phaseDotColor(phase);

    return (
        <div className="flex items-center">
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    togglePhaseLock(id);
                }}
                className={`group flex h-6 w-8 items-center justify-center border font-mono text-[11px] transition-all ${
                    frozen
                        ? 'border-transparent text-crust'
                        : 'border-surface1/70 bg-mantle/30 text-subtext hover:text-text'
                }`}
                style={
                    frozen
                        ? {
                              background: pinGlow,
                              boxShadow: `0 0 10px ${pinGlow}aa, inset 0 0 0 1px ${pinGlow}`,
                          }
                        : undefined
                }
                aria-label={frozen ? 'Unlock phase' : 'Lock phase'}
                title={
                    frozen
                        ? `phase locked → ${phase} (click to unfreeze)`
                        : `phase live → ${phase} (click to pin)`
                }
            >
                {frozen ? '[●]' : '[○]'}
            </button>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    minimize(id);
                }}
                className="group flex h-6 w-8 items-center justify-center border border-l-0 border-surface1/70 bg-mantle/30 font-mono text-[11px] text-subtext transition-all hover:border-yellow hover:bg-yellow hover:text-crust hover:shadow-[0_0_10px_rgba(255,208,0,0.5)]"
                aria-label="Minimize"
                title="minimize"
            >
                [_]
            </button>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    toggleMaximize(id);
                }}
                className="group flex h-6 w-8 items-center justify-center border border-l-0 border-surface1/70 bg-mantle/30 font-mono text-[11px] text-subtext transition-all hover:border-green hover:bg-green hover:text-crust hover:shadow-[0_0_10px_rgba(0,240,128,0.5)]"
                aria-label={maximized ? 'Restore' : 'Maximize'}
                title={maximized ? 'restore' : 'maximize'}
            >
                {maximized ? '[◱]' : '[▢]'}
            </button>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    close(id);
                }}
                className="group flex h-6 w-8 items-center justify-center border border-l-0 border-surface1/70 bg-mantle/30 font-mono text-[11px] text-subtext transition-all hover:border-red hover:bg-red hover:text-crust hover:shadow-[0_0_10px_rgba(255,53,80,0.5)]"
                aria-label="Close"
                title="close"
            >
                [×]
            </button>
        </div>
    );
}
