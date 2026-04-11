import { useEffect } from 'react';
import Wallpaper from './Wallpaper';
import Window from './Window';
import TopBar from './TopBar';
import StartMenu from './StartMenu';
import { useWindowStore } from '@/store/windows';

const TOP_BAR_SAFE = 68; // px reserved at top for the bar

export default function Desktop() {
    const windows = useWindowStore((s) => s.windows);
    const open = useWindowStore((s) => s.open);

    // Boot: open the welcome window after a short delay (once)
    useEffect(() => {
        const t = window.setTimeout(() => open('home'), 700);
        return () => window.clearTimeout(t);
    }, [open]);

    return (
        <div className="fixed inset-0 overflow-hidden">
            <Wallpaper />

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
    );
}
