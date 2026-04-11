import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { SLOTS, getSlotForHour, type PhaseName, type Slot } from '@/lib/time-slots';

interface Props {
    open: boolean;
    onClose: () => void;
    anchorRight: number; // px offset from right of viewport for popover position
}

const R = 54;
const CX = 64;
const CY = 64;
const STROKE = 14;
const C = 2 * Math.PI * R;

const PHASE_COLORS: Record<PhaseName, string> = {
    dawn: '#f5c2e7',    // pink
    noon: '#fab387',    // peach
    sunset: '#cba6f7',  // mauve
    night: '#89b4fa',   // blue
};

const PHASE_VIDEO: Record<PhaseName, string> = {
    dawn: 'RAILGUN',
    noon: 'INDEX II',
    sunset: 'INDEX',
    night: 'ACCELERATOR',
};

function durationHours(slot: Slot): number {
    return (slot.end - slot.start + 24) % 24 || 24;
}

function fractionOfCircle(startH: number) {
    return startH / 24;
}

function nextBoundary(now: Date): { nextSlot: Slot; nextTime: Date; minutesTo: number } {
    const h = now.getHours();
    const current = getSlotForHour(h);
    const nextStartH = current.end % 24;
    const next = new Date(now);
    next.setHours(nextStartH, 0, 0, 0);
    if (next.getTime() <= now.getTime()) {
        next.setDate(next.getDate() + 1);
    }
    const minutesTo = Math.floor((next.getTime() - now.getTime()) / 60_000);
    const nextSlot = SLOTS.find((s) => s.start === nextStartH) ?? SLOTS[0];
    return { nextSlot, nextTime: next, minutesTo };
}

function formatHourLabel(h: number): string {
    return String(h).padStart(2, '0') + ':00';
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
    const { nextSlot, nextTime, minutesTo } = nextBoundary(now);
    const hoursTo = Math.floor(minutesTo / 60);
    const mins = minutesTo % 60;
    const timeStr = `${String(nextTime.getHours()).padStart(2, '0')}:${String(nextTime.getMinutes()).padStart(2, '0')}`;

    // Current time marker (decimal hour)
    const nowDecimal = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    const markerAngle = (nowDecimal / 24) * Math.PI * 2 - Math.PI / 2;
    const markerX = CX + Math.cos(markerAngle) * R;
    const markerY = CY + Math.sin(markerAngle) * R;

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
                        initial={{ opacity: 0, y: -10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                        style={{ right: anchorRight }}
                        className="fixed top-[54px] z-[90] w-[300px] overflow-hidden rounded-xl border border-mauve/40 bg-base/85 shadow-[0_0_60px_rgba(203,166,247,0.35)] backdrop-blur-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-surface0/70 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em]">
                            <span className="text-mauve">// phase_orbit</span>
                            <span className="text-overlay0">24h</span>
                        </div>

                        {/* Donut chart */}
                        <div className="flex justify-center py-4">
                            <svg width={128} height={128} viewBox="0 0 128 128">
                                {/* Background ring */}
                                <circle
                                    cx={CX}
                                    cy={CY}
                                    r={R}
                                    fill="none"
                                    stroke="rgba(255,255,255,0.04)"
                                    strokeWidth={STROKE}
                                />

                                {/* Phase arcs */}
                                {SLOTS.map((slot) => {
                                    const dur = durationHours(slot);
                                    const arcLen = (dur / 24) * C;
                                    const startOffset = fractionOfCircle(slot.start) * C;
                                    const isCurrent = slot.name === currentSlot.name;
                                    return (
                                        <circle
                                            key={slot.name}
                                            cx={CX}
                                            cy={CY}
                                            r={R}
                                            fill="none"
                                            stroke={PHASE_COLORS[slot.name]}
                                            strokeWidth={STROKE}
                                            strokeDasharray={`${arcLen} ${C - arcLen}`}
                                            strokeDashoffset={-startOffset}
                                            opacity={isCurrent ? 1 : 0.35}
                                            style={{
                                                transform: 'rotate(-90deg)',
                                                transformOrigin: `${CX}px ${CY}px`,
                                                filter: isCurrent
                                                    ? `drop-shadow(0 0 6px ${PHASE_COLORS[slot.name]})`
                                                    : undefined,
                                                transition: 'opacity 0.3s ease',
                                            }}
                                        />
                                    );
                                })}

                                {/* Hour ticks */}
                                {[0, 6, 12, 18].map((h) => {
                                    const angle = (h / 24) * Math.PI * 2 - Math.PI / 2;
                                    const x1 = CX + Math.cos(angle) * (R + STROKE / 2 + 2);
                                    const y1 = CY + Math.sin(angle) * (R + STROKE / 2 + 2);
                                    const x2 = CX + Math.cos(angle) * (R + STROKE / 2 + 6);
                                    const y2 = CY + Math.sin(angle) * (R + STROKE / 2 + 6);
                                    return (
                                        <line
                                            key={h}
                                            x1={x1}
                                            y1={y1}
                                            x2={x2}
                                            y2={y2}
                                            stroke="rgba(205,214,244,0.4)"
                                            strokeWidth={1}
                                        />
                                    );
                                })}

                                {/* Current time marker (outer dot) */}
                                <circle cx={markerX} cy={markerY} r={4} fill="#f0fbff" />
                                <circle
                                    cx={markerX}
                                    cy={markerY}
                                    r={7}
                                    fill="none"
                                    stroke="#f0fbff"
                                    strokeOpacity={0.5}
                                    strokeWidth={1.5}
                                />

                                {/* Center text */}
                                <text
                                    x={CX}
                                    y={CY - 2}
                                    textAnchor="middle"
                                    fontFamily="JetBrains Mono, monospace"
                                    fontSize="18"
                                    fontWeight="700"
                                    fill="#cdd6f4"
                                >
                                    {String(now.getHours()).padStart(2, '0')}:{String(now.getMinutes()).padStart(2, '0')}
                                </text>
                                <text
                                    x={CX}
                                    y={CY + 12}
                                    textAnchor="middle"
                                    fontFamily="JetBrains Mono, monospace"
                                    fontSize="8"
                                    fill={PHASE_COLORS[currentSlot.name]}
                                >
                                    {currentSlot.name.toUpperCase()}
                                </text>
                            </svg>
                        </div>

                        {/* Info rows */}
                        <div className="space-y-1.5 border-t border-surface0/70 px-4 py-3 font-mono text-[11px]">
                            <div className="flex items-center justify-between">
                                <span className="text-subtext">NOW</span>
                                <span className="flex items-center gap-2">
                                    <span
                                        className="h-2 w-2 rounded-full"
                                        style={{ background: PHASE_COLORS[currentSlot.name] }}
                                    />
                                    <span style={{ color: PHASE_COLORS[currentSlot.name] }}>
                                        {currentSlot.name.toUpperCase()}
                                    </span>
                                    <span className="text-overlay0">·</span>
                                    <span className="text-text">{PHASE_VIDEO[currentSlot.name]}</span>
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-subtext">NEXT</span>
                                <span className="flex items-center gap-2">
                                    <span
                                        className="h-2 w-2 rounded-full"
                                        style={{ background: PHASE_COLORS[nextSlot.name] }}
                                    />
                                    <span style={{ color: PHASE_COLORS[nextSlot.name] }}>
                                        {nextSlot.name.toUpperCase()}
                                    </span>
                                    <span className="text-overlay0">·</span>
                                    <span className="text-text">{timeStr}</span>
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-t border-surface0/50 pt-1.5 mt-1.5">
                                <span className="text-subtext">COUNTDOWN</span>
                                <span className="text-pink">
                                    {hoursTo > 0 ? `${hoursTo}h ${mins}m` : `${mins}m`}
                                </span>
                            </div>
                        </div>

                        {/* Phase list */}
                        <div className="space-y-1 border-t border-surface0/70 bg-mantle/30 px-4 py-3 font-mono text-[10px]">
                            {SLOTS.map((slot) => {
                                const active = slot.name === currentSlot.name;
                                return (
                                    <div
                                        key={slot.name}
                                        className={`flex items-center justify-between ${active ? 'text-text' : 'text-subtext'}`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span
                                                className="h-1.5 w-1.5 rounded-full"
                                                style={{ background: PHASE_COLORS[slot.name] }}
                                            />
                                            {formatHourLabel(slot.start)}
                                        </span>
                                        <span className="uppercase">{slot.name}</span>
                                        <span className="text-overlay0">{PHASE_VIDEO[slot.name]}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
