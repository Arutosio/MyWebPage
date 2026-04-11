import { useEffect, useRef, useState } from 'react';
import {
    Battery,
    BatteryCharging,
    Circle,
    Cpu,
    Folder,
    Globe,
    MemoryStick,
    Monitor,
    Signal,
    SignalZero,
    Terminal,
    User,
    Wallet,
    Settings as SettingsIcon,
    type LucideIcon,
} from 'lucide-react';
import { useWindowStore } from '@/store/windows';
import { useSettings } from '@/store/settings';
import { APPS } from '@/lib/apps';
import { useBrowserInfo, shortTz } from '@/lib/browser-info';
import ClockPopover from './ClockPopover';

const ICONS: Record<string, LucideIcon> = {
    Terminal,
    User,
    Folder,
    Wallet,
    Settings: SettingsIcon,
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
    const clockRef = useRef<HTMLButtonElement>(null);
    const [clockAnchorRight, setClockAnchorRight] = useState(12);

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
    };

    const batteryPct = Math.round(info.battery.level * 100);
    const BatteryIcon = info.battery.charging ? BatteryCharging : Battery;
    const SignalIcon = info.online ? Signal : SignalZero;

    return (
        <>
            <div className="pointer-events-auto fixed top-3 left-3 right-3 z-[70] flex h-11 items-center gap-2 rounded-xl border border-mauve/30 bg-base/55 px-2 shadow-[0_4px_24px_rgba(0,0,0,0.35),0_0_38px_rgba(203,166,247,0.2)] backdrop-blur-2xl">
                {/* Start button */}
                <button
                    type="button"
                    onClick={toggleStartMenu}
                    className={`group flex h-8 items-center gap-2 rounded-lg border px-3 transition-all ${
                        startMenuOpen
                            ? 'border-mauve bg-mauve/20 text-pink shadow-[0_0_14px_rgba(203,166,247,0.5)]'
                            : 'border-mauve/40 bg-mauve/10 text-mauve hover:bg-mauve/20 hover:shadow-[0_0_12px_rgba(203,166,247,0.5)]'
                    }`}
                    aria-label="Start menu"
                >
                    <Circle className="h-3 w-3 fill-current" />
                    <span className="font-display text-[11px] font-bold uppercase tracking-[0.15em]">arutOS</span>
                </button>

                <Divider />

                {/* Open windows */}
                <div className="flex flex-1 items-center gap-1 overflow-x-auto">
                    {windows.map((w) => {
                        const app = APPS[w.appId];
                        const Icon = ICONS[app.icon] ?? Terminal;
                        const active = w.id === focusedId && !w.minimized;
                        return (
                            <button
                                key={w.id}
                                type="button"
                                onClick={() => {
                                    if (active) toggleMinimize(w.id);
                                    else focus(w.id);
                                }}
                                className={`group flex h-8 items-center gap-2 rounded-lg border px-3 font-mono text-[11px] transition-all ${
                                    active
                                        ? 'border-mauve/70 bg-mauve/15 text-pink shadow-[0_0_12px_rgba(203,166,247,0.35)]'
                                        : w.minimized
                                          ? 'border-surface1/30 bg-mantle/20 text-overlay0 hover:border-mauve/40 hover:text-text'
                                          : 'border-surface1/40 bg-mantle/40 text-subtext hover:border-mauve/40 hover:text-text'
                                }`}
                            >
                                <Icon className="h-3 w-3" strokeWidth={2} />
                                <span>{app.title}</span>
                            </button>
                        );
                    })}
                </div>

                {/* System tray */}
                <div className="flex items-center gap-1.5 border-l border-surface1/40 pl-2">
                    <Chip
                        icon={<SignalIcon className="h-3 w-3" strokeWidth={2} />}
                        label={info.online ? info.connection.type.toUpperCase() || 'NET' : 'OFF'}
                        tone={info.online ? 'ok' : 'warn'}
                        title={
                            info.online
                                ? `online · ${info.connection.supported ? `${info.connection.downlink} Mbps · ${info.connection.rtt}ms` : 'unknown'}`
                                : 'offline'
                        }
                    />
                    {info.battery.supported && (
                        <Chip
                            icon={<BatteryIcon className="h-3 w-3" strokeWidth={2} />}
                            label={`${batteryPct}%`}
                            tone={info.battery.charging || batteryPct > 20 ? 'ok' : 'warn'}
                            title={info.battery.charging ? `charging · ${batteryPct}%` : `battery ${batteryPct}%`}
                        />
                    )}
                    <Chip
                        icon={<Cpu className="h-3 w-3" strokeWidth={2} />}
                        label={`${info.cpuCores}×`}
                        title={`${info.cpuCores} logical cores · ${info.platform}`}
                    />
                    {info.deviceMemory !== null && (
                        <Chip
                            icon={<MemoryStick className="h-3 w-3" strokeWidth={2} />}
                            label={`${info.deviceMemory}G`}
                            title={`${info.deviceMemory} GB device memory`}
                        />
                    )}
                    <Chip
                        icon={<Monitor className="h-3 w-3" strokeWidth={2} />}
                        label={`${info.viewport.w}×${info.viewport.h}`}
                        title={`viewport ${info.viewport.w}×${info.viewport.h} · screen ${info.screen.w}×${info.screen.h} @ ${info.pixelRatio}x`}
                    />
                    <Chip
                        icon={<Globe className="h-3 w-3" strokeWidth={2} />}
                        label={`${info.language.slice(0, 2)}·${shortTz(info.timezone)}`}
                        title={`${info.language} · ${info.timezone}`}
                    />

                    <Divider />

                    {/* Clock */}
                    <button
                        ref={clockRef}
                        type="button"
                        onClick={handleClockClick}
                        className={`flex h-8 items-center gap-2 rounded-lg border px-3 font-display tabular-nums transition-all ${
                            clockOpen
                                ? 'border-mauve bg-mauve/20 text-pink shadow-[0_0_14px_rgba(203,166,247,0.45)]'
                                : 'border-mauve/40 bg-mauve/10 text-mauve hover:bg-mauve/20'
                        }`}
                        aria-label="Clock and phase"
                    >
                        <span className="text-[14px] font-bold">
                            {hh}:{mm}
                            {showSeconds && <span className="text-subtext">:{ss}</span>}
                        </span>
                        {ampm && <span className="text-[9px] text-subtext">{ampm}</span>}
                    </button>
                </div>
            </div>

            <ClockPopover open={clockOpen} onClose={() => setClockOpen(false)} anchorRight={clockAnchorRight} />
        </>
    );
}

/* ---------- subcomponents ---------- */

function Divider() {
    return <div className="mx-1 h-6 w-px bg-surface1/50" />;
}

function Chip({
    icon,
    label,
    tone = 'muted',
    title,
}: {
    icon: React.ReactNode;
    label: string;
    tone?: 'muted' | 'ok' | 'warn';
    title?: string;
}) {
    const toneCls =
        tone === 'ok'
            ? 'text-green border-surface1/40'
            : tone === 'warn'
              ? 'text-red border-red/50'
              : 'text-subtext border-surface1/40';
    return (
        <div
            className={`flex h-7 items-center gap-1.5 rounded border bg-mantle/30 px-2 font-mono text-[10px] ${toneCls}`}
            title={title}
        >
            {icon}
            <span>{label}</span>
        </div>
    );
}
