import { useEffect } from 'react';
import Wallpaper from './Wallpaper';
import Window from './Window';
import TopBar from './TopBar';
import StartMenu from './StartMenu';
import { useWindowStore } from '@/store/windows';
import { useSettings } from '@/store/settings';
import { getSlotForHour } from '@/lib/time-slots';

const TOP_BAR_SAFE = 68; // px reserved at top for the bar
const PHASE_POLL_MS = 60_000;

export default function Desktop() {
    const windows = useWindowStore((s) => s.windows);
    const open = useWindowStore((s) => s.open);
    const fontScale = useSettings((s) => s.fontScale);

    // Boot: open the welcome window after a short delay (once)
    useEffect(() => {
        const t = window.setTimeout(() => open('home'), 700);
        return () => window.clearTimeout(t);
    }, [open]);

    // Phase poll: refresh live windows when the real clock crosses a phase boundary
    useEffect(() => {
        const refresh = () => {
            const phase = getSlotForHour(new Date().getHours()).name;
            useWindowStore.getState().refreshLivePhases(phase);
        };
        refresh();
        const id = window.setInterval(refresh, PHASE_POLL_MS);
        return () => window.clearInterval(id);
    }, []);

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
        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', onResize);
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
