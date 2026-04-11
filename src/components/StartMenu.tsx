import { motion, AnimatePresence } from 'framer-motion';
import {
    Folder,
    Home,
    Settings as SettingsIcon,
    Terminal as TerminalIcon,
    User,
    Wallet,
    type LucideIcon,
} from 'lucide-react';
import { useWindowStore } from '@/store/windows';
import { APP_LIST } from '@/lib/apps';
import type { AppId } from '@/types/window';

const ICONS: Record<string, LucideIcon> = {
    Home,
    User,
    Folder,
    Wallet,
    Settings: SettingsIcon,
    TerminalSquare: TerminalIcon,
};

export default function StartMenu() {
    const open = useWindowStore((s) => s.open);
    const startMenuOpen = useWindowStore((s) => s.startMenuOpen);
    const closeStartMenu = useWindowStore((s) => s.closeStartMenu);

    return (
        <AnimatePresence>
            {startMenuOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-[80]"
                        onClick={closeStartMenu}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
                        className="fixed left-3 top-[60px] z-[85] w-[320px] overflow-hidden rounded-lg border border-mauve/60 bg-base/95 shadow-[0_0_60px_rgba(var(--accent-rgb),0.4),0_20px_56px_rgba(0,0,0,0.65)] backdrop-blur-md"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-surface0/80 bg-mantle/90 px-4 py-2.5">
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mauve shadow-[0_0_6px_#b860ff]" />
                                <span className="font-display text-[10px] font-bold uppercase tracking-[0.22em] text-mauve">
                                    arutOS
                                </span>
                            </div>
                            <span className="font-mono text-[9px] text-overlay0">// applications</span>
                        </div>

                        {/* Text list of windows to launch */}
                        <ul className="max-h-[360px] overflow-y-auto py-1">
                            {APP_LIST.map((app) => {
                                const Icon = ICONS[app.icon] ?? TerminalIcon;
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

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t border-surface0/80 bg-mantle/90 px-4 py-2 font-mono text-[9px] text-overlay0">
                            <span>@arutosio</span>
                            <span>v1.0</span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
