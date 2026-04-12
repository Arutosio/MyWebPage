import { SLOTS, type Slot } from '@/lib/time-slots';
import { useSettings } from '@/store/settings';
import { usePhaseClock } from '@/lib/phase-clock';

/**
 * arutOS animated wallpaper.
 * - `auto` mode (default): switches video clip based on hour of day.
 * - `manual` mode: locks to the user-picked phase from system settings.
 * Auto mode subscribes to the shared phase clock for boundary crossings.
 */
export default function Wallpaper() {
    const wallpaperMode = useSettings((s) => s.wallpaperMode);
    const manualPhase = useSettings((s) => s.manualPhase);
    const autoPhase = usePhaseClock((s) => s.phase);

    const activePhase = wallpaperMode === 'manual' ? manualPhase : autoPhase;
    const slot: Slot = SLOTS.find((s) => s.name === activePhase) ?? SLOTS[0];

    return (
        <div className="pointer-events-none fixed inset-0 -z-10">
            <video
                key={slot.src}
                src={slot.src}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover object-left"
                style={{ filter: 'brightness(0.55) saturate(1.05)' }}
            />
            {/* Subtle gradient veil so foreground UI stays readable */}
            <div className="absolute inset-0 bg-gradient-to-br from-crust/55 via-transparent to-crust/75" />
        </div>
    );
}
