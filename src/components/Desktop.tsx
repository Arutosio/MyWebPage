import { useEffect } from 'react';
import Wallpaper from './Wallpaper';
import Window from './Window';
import TopBar from './TopBar';
import StartMenu from './StartMenu';
import { useWindowStore } from '@/store/windows';
import { useSettings } from '@/store/settings';
import { usePhaseClock } from '@/lib/phase-clock';

import { TOP_BAR_SAFE } from '@/lib/constants';

export default function Desktop() {
    const windows = useWindowStore((s) => s.windows);
    const open = useWindowStore((s) => s.open);
    const fontScale = useSettings((s) => s.fontScale);
    const phase = usePhaseClock((s) => s.phase);

    // Boot: open the welcome window after a short delay (once)
    useEffect(() => {
        const t = window.setTimeout(() => open('home'), 700);
        return () => window.clearTimeout(t);
    }, [open]);

    // Refresh live windows whenever the shared phase clock ticks over.
    useEffect(() => {
        useWindowStore.getState().refreshLivePhases(phase);
    }, [phase]);

    // Viewport clamp: on every resize OR font-scale change, rAF-debounce and
    // re-fit windows into bounds. The effective logical viewport is
    // (innerWidth / fontScale, innerHeight / fontScale) because we apply
    // `zoom: fontScale` on the desktop root below.
    useEffect(() => {
        let rafId = 0;
        const doClamp = () => {
            const scale = useSettings.getState().fontScale || 1;
            useWindowStore
                .getState()
                .clampToViewport(
                    window.innerWidth / scale,
                    window.innerHeight / scale,
                    TOP_BAR_SAFE,
                );
        };
        const onResize = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(doClamp);
        };
        doClamp(); // also clamp when fontScale prop changes
        window.addEventListener('resize', onResize);
        window.addEventListener('orientationchange', onResize);
        const vv = window.visualViewport;
        vv?.addEventListener('resize', onResize);
        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('orientationchange', onResize);
            vv?.removeEventListener('resize', onResize);
        };
    }, [fontScale]);

    return (
        <>
            {/* Wallpaper sits OUTSIDE the zoomed root so the video stays full viewport */}
            <Wallpaper />

            {/* Zoomed root: scales ALL UI (top bar, windows, popovers) by fontScale.
                CSS `zoom` propagates size to every descendant while keeping position:fixed
                elements anchored to the viewport — exactly what we need for an OS shell. */}
            <div
                className="fixed inset-0 overflow-hidden"
                style={{ zoom: fontScale }}
            >
                {/* Windows layer (bounds container for react-rnd) */}
                <div
                    className="absolute inset-x-0 bottom-0"
                    style={{ top: `${TOP_BAR_SAFE}px` }}
                >
                    {windows.map((w) => (
                        <Window key={w.id} win={w} />
                    ))}
                </div>

                <StartMenu />
                <TopBar />
            </div>
        </>
    );
}
