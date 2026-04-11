import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { SLOTS, getSlotForHour, type PhaseName, type Slot } from '@/lib/time-slots';

interface Props {
    open: boolean;
    onClose: () => void;
    anchorRight: number;
}

const PHASE_COLORS: Record<PhaseName, string> = {
    dawn: '#ff3aa8',   // pink
    noon: '#ffd000',   // yellow
    sunset: '#ff8a40', // peach
    night: '#4477ff',  // blue
};

const PHASE_VIDEO: Record<PhaseName, string> = {
    dawn: 'railgun',
    noon: 'index ii',
    sunset: 'index',
    night: 'accelerator',
};

interface Segment {
    name: PhaseName;
    leftPct: number;
    widthPct: number;
    color: string;
}

function segmentsForSlot(slot: Slot): Segment[] {
    if (slot.end > slot.start) {
        return [
            {
                name: slot.name,
                leftPct: (slot.start / 24) * 100,
                widthPct: ((slot.end - slot.start) / 24) * 100,
                color: PHASE_COLORS[slot.name],
            },
        ];
    }
    // Wraps past midnight (e.g. 20..5) → two visual segments
    return [
        {
            name: slot.name,
            leftPct: (slot.start / 24) * 100,
            widthPct: ((24 - slot.start) / 24) * 100,
            color: PHASE_COLORS[slot.name],
        },
        {
            name: slot.name,
            leftPct: 0,
            widthPct: (slot.end / 24) * 100,
            color: PHASE_COLORS[slot.name],
        },
    ];
}

function nextBoundary(now: Date): { nextSlot: Slot; nextTime: Date; secondsTo: number } {
    const h = now.getHours();
    const current = getSlotForHour(h);
    const nextStartH = current.end % 24;
    const next = new Date(now);
    next.setHours(nextStartH, 0, 0, 0);
    if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 1);
    const secondsTo = Math.max(0, Math.floor((next.getTime() - now.getTime()) / 1000));
    const nextSlot = SLOTS.find((s) => s.start === nextStartH) ?? SLOTS[0];
    return { nextSlot, nextTime: next, secondsTo };
}

function formatCountdown(totalSeconds: number): string {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    if (h > 0) return `${h}h ${pad(m)}m ${pad(s)}s`;
    if (m > 0) return `${m}m ${pad(s)}s`;
    return `${s}s`;
}

export default function ClockPopover({ open, onClose, anchorRight }: Props) {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        if (!open) return;
        setNow(new Date());
        const id = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(id);
    }, [open]);

    const currentSlot = getSlotForHour(now.getHours());
    const { nextSlot, nextTime, secondsTo } = nextBoundary(now);
    const countdownStr = formatCountdown(secondsTo);
    const nextStr = `${String(nextTime.getHours()).padStart(2, '0')}:${String(nextTime.getMinutes()).padStart(2, '0')}`;

    const nowDecimal = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    const markerPct = (nowDecimal / 24) * 100;

    // Build all segments
    const allSegments = SLOTS.flatMap((s) => segmentsForSlot(s));

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
                        className="fixed top-[60px] z-[90] w-[340px] overflow-hidden rounded-lg border border-mauve/60 bg-base/95 shadow-[0_0_60px_rgba(var(--accent-rgb),0.4),0_20px_56px_rgba(0,0,0,0.65)] backdrop-blur-md"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-surface0/80 bg-mantle/90 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em]">
                            <span className="text-mauve">// phase.orbit</span>
                            <span className="tabular-nums text-overlay0">
                                {String(now.getHours()).padStart(2, '0')}:{String(now.getMinutes()).padStart(2, '0')}:{String(now.getSeconds()).padStart(2, '0')}
                            </span>
                        </div>

                        {/* Current phase big label */}
                        <div className="flex items-end justify-between px-5 pt-4">
                            <div>
                                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-overlay0">
                                    current phase
                                </div>
                                <div
                                    className="font-display text-2xl font-bold uppercase tracking-wider"
                                    style={{ color: PHASE_COLORS[currentSlot.name], textShadow: `0 0 12px ${PHASE_COLORS[currentSlot.name]}80` }}
                                >
                                    {currentSlot.name}
                                </div>
                                <div className="font-mono text-[10px] text-subtext">
                                    · {PHASE_VIDEO[currentSlot.name]}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-overlay0">
                                    next in
                                </div>
                                <div className="font-display text-lg font-bold tabular-nums text-pink">
                                    {countdownStr}
                                </div>
                                <div className="font-mono text-[10px] text-subtext">→ {nextStr}</div>
                            </div>
                        </div>

                        {/* Timeline bar */}
                        <div className="px-5 pt-5 pb-3">
                            <div className="relative h-7 overflow-hidden rounded border border-surface0/80 bg-crust/80">
                                {/* Segments */}
                                {allSegments.map((seg, i) => (
                                    <div
                                        key={`${seg.name}-${i}`}
                                        className="absolute inset-y-0"
                                        style={{
                                            left: `${seg.leftPct}%`,
                                            width: `${seg.widthPct}%`,
                                            background: `linear-gradient(180deg, ${seg.color}26 0%, ${seg.color}55 100%)`,
                                            borderLeft: `1px solid ${seg.color}99`,
                                        }}
                                    />
                                ))}

                                {/* Hour ticks at 6, 12, 18 */}
                                {[6, 12, 18].map((h) => (
                                    <div
                                        key={h}
                                        className="absolute inset-y-0 w-px bg-overlay0/40"
                                        style={{ left: `${(h / 24) * 100}%` }}
                                    />
                                ))}

                                {/* Current time marker (animated) */}
                                <div
                                    className="absolute inset-y-0 w-[2px] bg-text"
                                    style={{
                                        left: `${markerPct}%`,
                                        boxShadow: '0 0 10px #eef2ff, 0 0 22px rgba(238,242,255,0.6)',
                                        transition: 'left 0.9s linear',
                                    }}
                                />
                                <div
                                    className="absolute -top-0.5 h-2 w-2 -translate-x-1/2 rounded-full bg-text"
                                    style={{
                                        left: `${markerPct}%`,
                                        boxShadow: '0 0 10px #eef2ff',
                                        transition: 'left 0.9s linear',
                                    }}
                                />
                                <div
                                    className="absolute -bottom-0.5 h-2 w-2 -translate-x-1/2 rounded-full bg-text"
                                    style={{
                                        left: `${markerPct}%`,
                                        boxShadow: '0 0 10px #eef2ff',
                                        transition: 'left 0.9s linear',
                                    }}
                                />
                            </div>

                            {/* Hour labels */}
                            <div className="mt-1.5 flex justify-between font-mono text-[9px] tabular-nums text-overlay0">
                                <span>00</span>
                                <span>06</span>
                                <span>12</span>
                                <span>18</span>
                                <span>24</span>
                            </div>
                        </div>

                        {/* Phase legend */}
                        <div className="border-t border-surface0/80 bg-mantle/70 px-5 py-3">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono text-[10px]">
                                {SLOTS.map((s) => {
                                    const active = s.name === currentSlot.name;
                                    const nextIs = s.name === nextSlot.name;
                                    return (
                                        <div
                                            key={s.name}
                                            className={`flex items-center gap-2 ${active ? 'text-text' : 'text-subtext'}`}
                                        >
                                            <span
                                                className="h-1.5 w-1.5 rounded-full"
                                                style={{ background: PHASE_COLORS[s.name] }}
                                            />
                                            <span className="w-8 tabular-nums text-overlay0">
                                                {String(s.start).padStart(2, '0')}
                                            </span>
                                            <span className="flex-1 uppercase">{s.name}</span>
                                            {active && <span className="text-[8px] text-pink">● now</span>}
                                            {nextIs && !active && (
                                                <span className="text-[8px] text-overlay0">next</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
