import { useEffect, useRef, useState } from 'react';
import {
    Battery,
    BatteryCharging,
    Folder,
    Home,
    Info,
    LayoutGrid,
    Settings as SettingsIcon,
    Terminal,
    User,
    Wallet,
    type LucideIcon,
} from 'lucide-react';
import { useWindowStore } from '@/store/windows';
import { useSettings } from '@/store/settings';
import { APPS } from '@/lib/apps';
import { useBrowserInfo } from '@/lib/browser-info';
import { phaseDotColor } from '@/lib/phase-theme';
import ClockPopover from './ClockPopover';
import SysInfoPopover from './SysInfoPopover';

const ICONS: Record<string, LucideIcon> = {
    Home,
    User,
    Folder,
    Wallet,
    Settings: SettingsIcon,
    TerminalSquare: Terminal,
};

export default function TopBar() {
    const windows = useWindowStore((s) => s.windows);
    const focusedId = useWindowStore((s) => s.focusedId);
    const toggleStartMenu = useWindowStore((s) => s.toggleStartMenu);
    const startMenuOpen = useWindowStore((s) => s.startMenuOpen);
    const toggleMinimize = useWindowStore((s) => s.toggleMinimize);
    const focus = useWindowStore((s) => s.focus);

    const hour24 = useSettings((s) => s.hour24);
    const showSeconds = useSettings((s) => s.showSeconds);

    const info = useBrowserInfo();

    const [now, setNow] = useState(() => new Date());
    const [clockOpen, setClockOpen] = useState(false);
    const [sysOpen, setSysOpen] = useState(false);
    const clockRef = useRef<HTMLButtonElement>(null);
    const sysRef = useRef<HTMLButtonElement>(null);
    const [clockAnchorRight, setClockAnchorRight] = useState(12);
    const [sysAnchorRight, setSysAnchorRight] = useState(12);

    useEffect(() => {
        const id = window.setInterval(() => setNow(new Date()), showSeconds ? 1000 : 15_000);
        return () => window.clearInterval(id);
    }, [showSeconds]);

    const hourNum = now.getHours();
    const dispHour = hour24 ? hourNum : ((hourNum % 12) || 12);
    const hh = String(dispHour).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const ampm = hour24 ? '' : hourNum >= 12 ? 'PM' : 'AM';

    const handleClockClick = () => {
        if (clockRef.current) {
            const rect = clockRef.current.getBoundingClientRect();
            setClockAnchorRight(window.innerWidth - rect.right);
        }
        setClockOpen((v) => !v);
        setSysOpen(false);
    };

    const handleSysClick = () => {
        if (sysRef.current) {
            const rect = sysRef.current.getBoundingClientRect();
            setSysAnchorRight(window.innerWidth - rect.right);
        }
        setSysOpen((v) => !v);
        setClockOpen(false);
    };

    const batteryPct = Math.round(info.battery.level * 100);
    const BatteryIcon = info.battery.charging ? BatteryCharging : Battery;
    const statusColor = info.online ? '#00f080' : '#ff3550';

    return (
        <>
            <div className="pointer-events-auto fixed top-2 left-2 right-2 z-[70] flex h-11 items-center gap-1.5 rounded-xl border-2 border-mauve/40 bg-base/70 px-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.45),0_0_10px_rgba(var(--accent-rgb),0.2)] backdrop-blur-md sm:left-3 sm:right-3 sm:gap-2 sm:px-2">
                {/* Start button — icon only, universally readable as "apps" */}
                <button
                    type="button"
                    onClick={toggleStartMenu}
                    title="arutOS menu"
                    className={`flex h-8 w-9 shrink-0 items-center justify-center rounded-md border transition-all ${
                        startMenuOpen
                            ? 'border-mauve bg-mauve/25 text-pink shadow-[0_0_8px_rgba(var(--accent-rgb),0.35)]'
                            : 'border-mauve/50 bg-mauve/10 text-mauve hover:bg-mauve/20 hover:shadow-[0_0_6px_rgba(var(--accent-rgb),0.35)]'
                    }`}
                    aria-label="Start menu"
                >
                    <LayoutGrid className="h-4 w-4" strokeWidth={2.25} />
                </button>

                <div className="mx-0.5 hidden h-6 w-px bg-surface1/50 sm:block" />

                {/* Open windows — text label hidden on mobile so more chips fit */}
                <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
                    {windows.map((w) => {
                        const app = APPS[w.appId];
                        const Icon = ICONS[app.icon] ?? Terminal;
                        const active = w.id === focusedId && !w.minimized;
                        const phaseHex = phaseDotColor(w.phase);
                        return (
                            <button
                                key={w.id}
                                type="button"
                                onClick={() => {
                                    if (active) toggleMinimize(w.id);
                                    else focus(w.id);
                                }}
                                title={`${w.title} · ${w.phase}${w.phaseMode === 'frozen' ? ' (pinned)' : ''}`}
                                className={`flex h-8 shrink-0 items-center gap-1.5 rounded-md border px-2 font-mono text-[11px] transition-all sm:gap-2 sm:px-3 ${
                                    active
                                        ? 'border-mauve/80 bg-mauve/15 text-pink shadow-[0_0_8px_rgba(var(--accent-rgb),0.35)]'
                                        : w.minimized
                                          ? 'border-surface1/40 bg-mantle/20 text-overlay0 hover:border-mauve/40 hover:text-text'
                                          : 'border-surface1/50 bg-mantle/40 text-subtext hover:border-mauve/40 hover:text-text'
                                }`}
                            >
                                <span
                                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                                    style={{
                                        background: phaseHex,
                                        boxShadow:
                                            w.phaseMode === 'frozen'
                                                ? `0 0 6px ${phaseHex}, inset 0 0 0 1px rgba(255,255,255,0.7)`
                                                : `0 0 4px ${phaseHex}`,
                                    }}
                                    aria-hidden="true"
                                />
                                <Icon className="h-3 w-3 shrink-0" strokeWidth={2} />
                                <span className="hidden sm:inline">{app.title}</span>
                            </button>
                        );
                    })}
                </div>

                {/* System tray — compact; text labels hide on mobile */}
                <div className="flex shrink-0 items-center gap-1 border-l-2 border-surface1/50 pl-1.5 sm:gap-1.5 sm:pl-2">
                    {/* Battery (when the API exposes it) */}
                    {info.battery.supported && (
                        <div
                            className={`flex h-7 items-center gap-1 rounded border px-1.5 font-mono text-[10px] sm:gap-1.5 sm:px-2 ${
                                info.battery.charging || batteryPct > 20
                                    ? 'border-surface1/50 text-green'
                                    : 'border-red/60 text-red'
                            }`}
                            title={info.battery.charging ? `charging · ${batteryPct}%` : `battery ${batteryPct}%`}
                        >
                            <BatteryIcon className="h-3 w-3" strokeWidth={2} />
                            <span className="hidden sm:inline">{batteryPct}%</span>
                        </div>
                    )}

                    {/* Sys info button — replaces the old chip cluster */}
                    <button
                        ref={sysRef}
                        type="button"
                        onClick={handleSysClick}
                        title="system info"
                        aria-label="system info"
                        className={`flex h-8 items-center gap-1.5 rounded-md border px-2 font-mono text-[10px] transition-all sm:px-2.5 ${
                            sysOpen
                                ? 'border-mauve bg-mauve/20 text-pink shadow-[0_0_8px_rgba(var(--accent-rgb),0.45)]'
                                : 'border-surface1/50 bg-mantle/30 text-subtext hover:border-mauve/40 hover:text-text'
                        }`}
                    >
                        <Info className="h-3 w-3" strokeWidth={2} />
                        <span className="hidden sm:inline">sys</span>
                        <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: statusColor, boxShadow: `0 0 6px ${statusColor}` }}
                            aria-hidden="true"
                        />
                    </button>

                    {/* Clock */}
                    <button
                        ref={clockRef}
                        type="button"
                        onClick={handleClockClick}
                        className={`flex h-8 items-center gap-1 rounded-md border px-2 font-display tabular-nums transition-all sm:gap-2 sm:px-3 ${
                            clockOpen
                                ? 'border-mauve bg-mauve/25 text-pink shadow-[0_0_8px_rgba(var(--accent-rgb),0.35)]'
                                : 'border-mauve/50 bg-mauve/10 text-mauve hover:bg-mauve/20'
                        }`}
                        aria-label="Clock and phase"
                    >
                        <span className="text-[13px] font-bold sm:text-[14px]">
                            {hh}:{mm}
                            {showSeconds && <span className="hidden text-subtext sm:inline">:{ss}</span>}
                        </span>
                        {ampm && <span className="hidden text-[9px] text-subtext sm:inline">{ampm}</span>}
                    </button>
                </div>
            </div>

            <ClockPopover open={clockOpen} onClose={() => setClockOpen(false)} anchorRight={clockAnchorRight} />
            <SysInfoPopover open={sysOpen} onClose={() => setSysOpen(false)} anchorRight={sysAnchorRight} />
        </>
    );
}
