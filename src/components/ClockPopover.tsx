import { useEffect, useState } from 'react';
import { SLOTS, getSlotForHour, type PhaseName, type Slot } from '@/lib/time-slots';
import { PHASE_COLOR_HEX, PHASE_VIDEO } from '@/lib/phase-theme';
import { pad2 } from '@/lib/time';
import Popover from './ui/Popover';

interface Props {
    open: boolean;
    onClose: () => void;
    anchorRight: number;
}

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
                color: PHASE_COLOR_HEX[slot.name],
            },
        ];
    }
    return [
        {
            name: slot.name,
            leftPct: (slot.start / 24) * 100,
            widthPct: ((24 - slot.start) / 24) * 100,
            color: PHASE_COLOR_HEX[slot.name],
        },
        {
            name: slot.name,
            leftPct: 0,
            widthPct: (slot.end / 24) * 100,
            color: PHASE_COLOR_HEX[slot.name],
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
    if (h > 0) return `${h}h ${pad2(m)}m ${pad2(s)}s`;
    if (m > 0) return `${m}m ${pad2(s)}s`;
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
    const nextStr = `${pad2(nextTime.getHours())}:${pad2(nextTime.getMinutes())}`;

    const nowDecimal = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    const markerPct = (nowDecimal / 24) * 100;

    const allSegments = SLOTS.flatMap((s) => segmentsForSlot(s));

    return (
        <Popover
            open={open}
            onClose={onClose}
            style={{ right: anchorRight }}
            width="w-[340px]"
            headerLeft="// phase.orbit"
            headerRight={
                <span className="tabular-nums">
                    {pad2(now.getHours())}:{pad2(now.getMinutes())}:{pad2(now.getSeconds())}
                </span>
            }
        >
            {/* Current phase big label */}
            <div className="flex items-end justify-between px-5 pt-4">
                <div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-overlay0">
                        current phase
                    </div>
                    <div
                        className="font-display text-2xl font-bold uppercase tracking-wider"
                        style={{ color: PHASE_COLOR_HEX[currentSlot.name], textShadow: `0 0 12px ${PHASE_COLOR_HEX[currentSlot.name]}80` }}
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

                    {[6, 12, 18].map((h) => (
                        <div
                            key={h}
                            className="absolute inset-y-0 w-px bg-overlay0/40"
                            style={{ left: `${(h / 24) * 100}%` }}
                        />
                    ))}

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
                                    style={{ background: PHASE_COLOR_HEX[s.name] }}
                                />
                                <span className="w-8 tabular-nums text-overlay0">
                                    {pad2(s.start)}
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
        </Popover>
    );
}
