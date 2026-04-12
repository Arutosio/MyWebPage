import { Terminal as TerminalIcon } from 'lucide-react';
import { useWindowStore } from '@/store/windows';
import { APP_LIST } from '@/lib/apps';
import { APP_ICONS } from '@/lib/icons';
import type { AppId } from '@/types/window';
import Popover from './ui/Popover';

export default function StartMenu() {
    const open = useWindowStore((s) => s.open);
    const startMenuOpen = useWindowStore((s) => s.startMenuOpen);
    const closeStartMenu = useWindowStore((s) => s.closeStartMenu);

    return (
        <Popover
            open={startMenuOpen}
            onClose={closeStartMenu}
            className="left-3"
            zBackdrop={80}
            headerLeft={
                <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mauve shadow-[0_0_6px_#b860ff]" />
                    <span className="font-display text-[10px] font-bold uppercase tracking-[0.22em] text-mauve">
                        arutOS
                    </span>
                </span>
            }
            headerRight="// applications"
            footer={
                <span className="flex items-center justify-between">
                    <span>@arutosio</span>
                    <span>v1.0</span>
                </span>
            }
        >
            <ul className="max-h-[360px] overflow-y-auto py-1">
                {APP_LIST.map((app) => {
                    const Icon = APP_ICONS[app.icon] ?? TerminalIcon;
                    return (
                        <li key={app.id}>
                            <button
                                type="button"
                                onClick={() => open(app.id as AppId)}
                                className="group flex w-full items-center gap-3 px-4 py-2 text-left transition-all hover:bg-mauve/10"
                            >
                                <Icon
                                    className="h-3.5 w-3.5 shrink-0 text-overlay1 transition-colors group-hover:text-mauve"
                                    strokeWidth={2}
                                />
                                <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-text group-hover:text-mauve">
                                    {app.title}
                                </span>
                                <span className="shrink-0 truncate font-mono text-[9px] italic text-overlay0 group-hover:text-subtext">
                                    {app.subtitle}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </Popover>
    );
}
