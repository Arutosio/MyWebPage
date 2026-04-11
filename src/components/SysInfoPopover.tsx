import { motion, AnimatePresence } from 'framer-motion';
import { useBrowserInfo, usePublicIp, formatUptime, shortTz } from '@/lib/browser-info';

interface Props {
    open: boolean;
    onClose: () => void;
    anchorRight: number;
}

type RowTone = 'ok' | 'warn' | 'muted' | 'info';

/**
 * Consolidated browser telemetry — used to live as chips in the top bar,
 * now lives here so the bar stays compact. Click the sys button to open.
 * Public IP + reverse-geolocation are fetched lazily from ipapi.co the
 * first time this popover is opened, then cached at module level.
 */
export default function SysInfoPopover({ open, onClose, anchorRight }: Props) {
    const info = useBrowserInfo();
    const geo = usePublicIp(open);

    const ipText =
        geo.state === 'ok'
            ? geo.ip
            : geo.state === 'loading'
              ? 'resolving…'
              : geo.state === 'error'
                ? 'unavailable'
                : '--';
    const ipTone: RowTone = geo.state === 'ok' ? 'info' : geo.state === 'error' ? 'warn' : 'muted';

    const locationText =
        geo.state === 'ok'
            ? [geo.city, geo.region, geo.country].filter((x) => x && x !== '--').join(', ') || '--'
            : geo.state === 'loading'
              ? '…'
              : '--';

    const rows: Array<[string, string, RowTone]> = [
        [
            'network',
            info.online
                ? `${info.connection.type.toUpperCase() || 'online'}${info.connection.supported ? ` · ${info.connection.downlink}Mbps · ${info.connection.rtt}ms` : ''}`
                : 'offline',
            info.online ? 'ok' : 'warn',
        ],
        ['public ip', ipText, ipTone],
        ['location', locationText, geo.state === 'ok' ? 'info' : 'muted'],
        ['isp', geo.state === 'ok' ? geo.org || '--' : '--', 'muted'],
        [
            'battery',
            info.battery.supported
                ? `${Math.round(info.battery.level * 100)}% ${info.battery.charging ? '⚡ charging' : ''}`
                : 'n/a',
            info.battery.supported ? (info.battery.charging || info.battery.level > 0.2 ? 'ok' : 'warn') : 'muted',
        ],
        ['cpu', `${info.cpuCores || '?'} cores`, 'muted'],
        ['memory', info.deviceMemory !== null ? `${info.deviceMemory} GB` : 'n/a', 'muted'],
        ['platform', info.platform, 'muted'],
        ['viewport', `${info.viewport.w} × ${info.viewport.h}`, 'muted'],
        ['screen', `${info.screen.w} × ${info.screen.h} @ ${info.pixelRatio}x`, 'muted'],
        ['locale', info.language, 'muted'],
        ['timezone', shortTz(info.timezone), 'muted'],
        ['uptime', formatUptime(info.uptimeMs), 'muted'],
        ['visibility', info.visibility, 'muted'],
    ];

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-[89]"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
                        style={{ right: anchorRight }}
                        className="fixed top-[60px] z-[90] w-[320px] overflow-hidden rounded-lg border-2 border-mauve/60 bg-base/95 shadow-[0_0_14px_rgba(var(--accent-rgb),0.3),0_4px_10px_rgba(0,0,0,0.45)] backdrop-blur-md"
                    >
                        <div className="flex items-center justify-between border-b-2 border-surface0/80 bg-mantle/90 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em]">
                            <span className="text-mauve">// sys.info</span>
                            <span className="text-overlay0">browser telemetry</span>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto divide-y divide-surface0/70">
                            {rows.map(([k, v, tone]) => (
                                <div
                                    key={k}
                                    className="grid grid-cols-[100px_1fr] items-center px-4 py-1.5 font-mono text-[11px]"
                                >
                                    <span className="uppercase tracking-wide text-subtext">{k}</span>
                                    <span
                                        className={
                                            tone === 'ok'
                                                ? 'text-green'
                                                : tone === 'warn'
                                                  ? 'text-red'
                                                  : tone === 'info'
                                                    ? 'text-mauve'
                                                    : 'text-text'
                                        }
                                    >
                                        {v || '--'}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t-2 border-surface0/80 bg-mantle/60 px-4 py-2 font-mono text-[9px] italic text-overlay0">
                            {info.userAgent.slice(0, 80)}
                            {info.userAgent.length > 80 ? '…' : ''}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
