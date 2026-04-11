import { motion, AnimatePresence } from 'framer-motion';
import { Folder, Terminal, User, Wallet, type LucideIcon } from 'lucide-react';
import { useWindowStore } from '@/store/windows';
import { APP_LIST } from '@/lib/apps';
import type { AppId } from '@/types/window';

const ICONS: Record<string, LucideIcon> = {
    Terminal,
    User,
    Folder,
    Wallet,
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
                        className="fixed inset-0 z-[80] bg-crust/30"
                        onClick={closeStartMenu}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 14, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                        className="fixed bottom-[68px] left-4 z-[85] w-[360px] overflow-hidden rounded-xl border border-mauve/40 bg-base/80 shadow-[0_0_60px_rgba(203,166,247,0.35)] backdrop-blur-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-surface0/70 px-4 py-3">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 animate-pulse rounded-full bg-green shadow-[0_0_6px_#a6e3a1]" />
                                <div className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-mauve">
                                    arutOS
                                </div>
                                <div className="font-mono text-[9px] text-subtext">v1.0</div>
                            </div>
                            <div className="font-mono text-[9px] text-overlay0">// apps</div>
                        </div>

                        {/* App grid */}
                        <div className="grid grid-cols-2 gap-2 p-3">
                            {APP_LIST.map((app) => {
                                const Icon = ICONS[app.icon] ?? Terminal;
                                return (
                                    <button
                                        key={app.id}
                                        type="button"
                                        onClick={() => open(app.id as AppId)}
                                        className="group flex flex-col items-start gap-2 rounded-lg border border-surface0/70 bg-mantle/50 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-mauve/60 hover:bg-mauve/10 hover:shadow-[0_0_18px_rgba(203,166,247,0.3)]"
                                    >
                                        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-mauve/40 bg-mauve/10 text-mauve transition-colors group-hover:border-pink group-hover:text-pink">
                                            <Icon className="h-4 w-4" strokeWidth={2} />
                                        </div>
                                        <div className="w-full">
                                            <div className="truncate font-display text-[12px] font-semibold uppercase tracking-wider text-text group-hover:text-pink">
                                                {app.title.replace(/_/g, ' ')}
                                            </div>
                                            <div className="truncate font-mono text-[9px] text-subtext">
                                                {app.subtitle}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t border-surface0/70 bg-mantle/40 px-4 py-2 font-mono text-[9px] text-overlay0">
                            <span>@arutosio</span>
                            <span>hyprland · ricing</span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
