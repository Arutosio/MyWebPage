import { useWindowStore } from '@/store/windows';

interface Props {
    id: string;
    maximized: boolean;
}

/**
 * Original window controls — monospace text commands inside square brackets.
 * NOT macOS dots. Three adjacent buttons with unique hover fills.
 *
 *   [_]   minimize → yellow
 *   [▢]   maximize → green
 *   [×]   close    → red
 */
export default function WindowControls({ id, maximized }: Props) {
    const minimize = useWindowStore((s) => s.minimize);
    const toggleMaximize = useWindowStore((s) => s.toggleMaximize);
    const close = useWindowStore((s) => s.close);

    return (
        <div className="flex items-center">
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    minimize(id);
                }}
                className="group flex h-6 w-8 items-center justify-center border border-surface1/70 bg-mantle/30 font-mono text-[11px] text-subtext transition-all hover:border-yellow hover:bg-yellow hover:text-crust hover:shadow-[0_0_10px_rgba(249,226,175,0.5)]"
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
                className="group flex h-6 w-8 items-center justify-center border border-l-0 border-surface1/70 bg-mantle/30 font-mono text-[11px] text-subtext transition-all hover:border-green hover:bg-green hover:text-crust hover:shadow-[0_0_10px_rgba(166,227,161,0.5)]"
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
                className="group flex h-6 w-8 items-center justify-center border border-l-0 border-surface1/70 bg-mantle/30 font-mono text-[11px] text-subtext transition-all hover:border-red hover:bg-red hover:text-crust hover:shadow-[0_0_10px_rgba(243,139,168,0.5)]"
                aria-label="Close"
                title="close"
            >
                [×]
            </button>
        </div>
    );
}
