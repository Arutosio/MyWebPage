import { useEffect, useRef, useState } from 'react';
import { SLOTS, getSlotForHour, type Slot } from '@/lib/time-slots';
import { useSettings } from '@/store/settings';

/**
 * Hyprland-style animated wallpaper.
 * - `auto` mode (default): switches video clip based on hour of day.
 * - `manual` mode: locks to the user-picked phase from system settings.
 * Polls once a minute in auto mode to catch boundary crossings.
 */
export default function Wallpaper() {
    const wallpaperMode = useSettings((s) => s.wallpaperMode);
    const manualPhase = useSettings((s) => s.manualPhase);

    const pickSlot = (): Slot => {
        if (wallpaperMode === 'manual') {
            return SLOTS.find((s) => s.name === manualPhase) ?? SLOTS[0];
        }
        return getSlotForHour(new Date().getHours());
    };

    const [slot, setSlot] = useState<Slot>(pickSlot);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Re-pick when settings change (mode or manual phase)
    useEffect(() => {
        setSlot(pickSlot());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallpaperMode, manualPhase]);

    // Auto-mode polling
    useEffect(() => {
        if (wallpaperMode !== 'auto') return;
        const tick = () => {
            const next = getSlotForHour(new Date().getHours());
            setSlot((prev) => (prev.src === next.src ? prev : next));
        };
        const id = window.setInterval(tick, 60_000);
        return () => window.clearInterval(id);
    }, [wallpaperMode]);

    return (
        <div className="pointer-events-none fixed inset-0 -z-10">
            <video
                ref={videoRef}
                key={slot.src}
                src={slot.src}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
                style={{ filter: 'brightness(0.55) saturate(1.05)' }}
            />
            {/* Subtle gradient veil so foreground UI stays readable */}
            <div className="absolute inset-0 bg-gradient-to-br from-crust/55 via-transparent to-crust/75" />
        </div>
    );
}
