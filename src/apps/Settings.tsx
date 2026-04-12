import { useEffect, useState } from 'react';
import { Palette, Image, Clock, Trash2, Type } from 'lucide-react';
import {
    useSettings,
    FONT_SCALE_MIN,
    FONT_SCALE_MAX,
    FONT_SCALE_STEP,
    type AccentColor,
} from '@/store/settings';
import { SLOTS, type PhaseName } from '@/lib/time-slots';
import { PHASE_COLOR_HEX, PHASE_VIDEO } from '@/lib/phase-theme';
import AppHeader from '@/components/ui/AppHeader';

const ACCENTS: { id: AccentColor; hex: string; name: string }[] = [
    { id: 'mauve', hex: '#cba6f7', name: 'mauve' },
    { id: 'blue', hex: '#89b4fa', name: 'blue' },
    { id: 'pink', hex: '#f5c2e7', name: 'pink' },
    { id: 'green', hex: '#a6e3a1', name: 'green' },
    { id: 'peach', hex: '#fab387', name: 'peach' },
    { id: 'sky', hex: '#89dceb', name: 'sky' },
];

export default function Settings() {
    const wallpaperMode = useSettings((s) => s.wallpaperMode);
    const manualPhase = useSettings((s) => s.manualPhase);
    const accentColor = useSettings((s) => s.accentColor);
    const accentFollowsPhase = useSettings((s) => s.accentFollowsPhase);
    const hour24 = useSettings((s) => s.hour24);
    const showSeconds = useSettings((s) => s.showSeconds);
    const reducedBlur = useSettings((s) => s.reducedBlur);
    const fontScale = useSettings((s) => s.fontScale);

    const setWallpaperMode = useSettings((s) => s.setWallpaperMode);
    const setManualPhase = useSettings((s) => s.setManualPhase);
    const setAccentColor = useSettings((s) => s.setAccentColor);
    const setAccentFollowsPhase = useSettings((s) => s.setAccentFollowsPhase);
    const setHour24 = useSettings((s) => s.setHour24);
    const setShowSeconds = useSettings((s) => s.setShowSeconds);
    const setReducedBlur = useSettings((s) => s.setReducedBlur);
    const setFontScale = useSettings((s) => s.setFontScale);
    const reset = useSettings((s) => s.reset);

    return (
        <div className="space-y-6">
            <AppHeader label="// system_settings" title="[ SYSTEM PREFERENCES ]" />
            <p className="text-[12px] text-subtext">
                Changes are saved automatically and persist across sessions in your browser.
            </p>

            {/* Wallpaper section */}
            <Section icon={<Image className="h-4 w-4" />} title="Wallpaper">
                <FieldRow label="Mode" hint="auto = pick by time of day, manual = lock one clip">
                    <Segment
                        options={[
                            { id: 'auto', label: 'AUTO' },
                            { id: 'manual', label: 'MANUAL' },
                        ]}
                        value={wallpaperMode}
                        onChange={(v) => setWallpaperMode(v as 'auto' | 'manual')}
                    />
                </FieldRow>

                <FieldRow label="Phase" hint={wallpaperMode === 'manual' ? 'picked clip' : 'follows clock — switch to MANUAL to force'}>
                    <div className="grid grid-cols-2 gap-2">
                        {SLOTS.map((slot) => {
                            const active = wallpaperMode === 'manual' && manualPhase === slot.name;
                            return (
                                <button
                                    key={slot.name}
                                    type="button"
                                    onClick={() => setManualPhase(slot.name)}
                                    className={`group flex items-center gap-2 rounded border px-3 py-2 text-left font-mono text-[10px] uppercase tracking-wider transition-all ${
                                        active
                                            ? 'border-mauve bg-mauve/15 text-pink shadow-[0_0_12px_rgba(var(--accent-rgb),0.4)]'
                                            : 'border-surface1/50 bg-mantle/30 text-subtext hover:border-mauve/60 hover:text-text'
                                    }`}
                                >
                                    <span
                                        className="h-2 w-2 rounded-full"
                                        style={{ background: PHASE_COLOR_HEX[slot.name] }}
                                    />
                                    <span className="flex-1">{slot.name}</span>
                                    <span className="text-[9px] text-overlay0">{PHASE_VIDEO[slot.name].toUpperCase()}</span>
                                </button>
                            );
                        })}
                    </div>
                </FieldRow>
            </Section>

            {/* Appearance */}
            <Section icon={<Palette className="h-4 w-4" />} title="Appearance">
                <FieldRow label="Follow phase" hint="accent derives from time of day (pink/peach/mauve/sky)">
                    <Toggle value={accentFollowsPhase} onChange={setAccentFollowsPhase} />
                </FieldRow>

                <FieldRow
                    label="Accent"
                    hint={accentFollowsPhase ? 'locked — turn off Follow phase to pick manually' : 'used for window borders, highlights, controls'}
                >
                    <div className={`flex flex-wrap gap-2 ${accentFollowsPhase ? 'pointer-events-none opacity-40' : ''}`}>
                        {ACCENTS.map((a) => {
                            const active = accentColor === a.id && !accentFollowsPhase;
                            return (
                                <button
                                    key={a.id}
                                    type="button"
                                    onClick={() => setAccentColor(a.id)}
                                    disabled={accentFollowsPhase}
                                    className={`group flex items-center gap-2 rounded border px-2.5 py-1.5 font-mono text-[10px] uppercase transition-all ${
                                        active
                                            ? 'border-current text-text'
                                            : 'border-surface1/50 text-subtext hover:text-text'
                                    }`}
                                    style={{
                                        color: active ? a.hex : undefined,
                                        boxShadow: active ? `0 0 12px ${a.hex}60` : undefined,
                                    }}
                                >
                                    <span className="h-3 w-3 rounded-full" style={{ background: a.hex }} />
                                    {a.name}
                                </button>
                            );
                        })}
                    </div>
                </FieldRow>

                <FieldRow label="Reduced blur" hint="turn off heavy backdrop blurs for perf">
                    <Toggle value={reducedBlur} onChange={setReducedBlur} />
                </FieldRow>
            </Section>

            {/* Typography */}
            <Section icon={<Type className="h-4 w-4" />} title="Typography">
                <FontScaleRow fontScale={fontScale} setFontScale={setFontScale} />
            </Section>

            {/* Clock */}
            <Section icon={<Clock className="h-4 w-4" />} title="Clock">
                <FieldRow label="Format">
                    <Segment
                        options={[
                            { id: '24', label: '24 H' },
                            { id: '12', label: '12 H' },
                        ]}
                        value={hour24 ? '24' : '12'}
                        onChange={(v) => setHour24(v === '24')}
                    />
                </FieldRow>
                <FieldRow label="Show seconds">
                    <Toggle value={showSeconds} onChange={setShowSeconds} />
                </FieldRow>
            </Section>

            {/* Danger zone */}
            <Section icon={<Trash2 className="h-4 w-4" />} title="Reset">
                <button
                    type="button"
                    onClick={() => {
                        if (confirm('Reset all settings to defaults?')) reset();
                    }}
                    className="rounded border border-red/50 bg-red/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-red transition-all hover:bg-red/20 hover:shadow-[0_0_12px_rgba(255, 53, 80,0.5)]"
                >
                    [ FACTORY RESET ]
                </button>
            </Section>
        </div>
    );
}

/* ---------- subcomponents ---------- */

function FontScaleRow({
    fontScale,
    setFontScale,
}: {
    fontScale: number;
    setFontScale: (v: number) => void;
}) {
    const [local, setLocal] = useState(fontScale);
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        if (!dragging) setLocal(fontScale);
    }, [fontScale, dragging]);

    const commit = () => {
        if (!dragging) return;
        setDragging(false);
        if (local !== fontScale) setFontScale(local);
    };

    return (
        <FieldRow label="Font size" hint={`${Math.round(local * 100)}% · scales the whole system`}>
            <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-subtext">A</span>
                <input
                    type="range"
                    min={FONT_SCALE_MIN}
                    max={FONT_SCALE_MAX}
                    step={FONT_SCALE_STEP}
                    value={local}
                    onChange={(e) => {
                        setDragging(true);
                        setLocal(parseFloat(e.target.value));
                    }}
                    onPointerUp={commit}
                    onPointerCancel={commit}
                    onMouseUp={commit}
                    onTouchEnd={commit}
                    onKeyUp={commit}
                    onBlur={commit}
                    className="rg-slider flex-1"
                    aria-label="Font size"
                />
                <span className="font-mono text-[16px] text-mauve">A</span>
                <button
                    type="button"
                    onClick={() => {
                        setDragging(false);
                        setLocal(1);
                        setFontScale(1);
                    }}
                    className="rounded border border-surface1/60 bg-mantle/30 px-2 py-0.5 font-mono text-[9px] uppercase text-subtext transition-all hover:border-mauve/60 hover:text-text"
                    title="Reset to 100%"
                >
                    reset
                </button>
            </div>
        </FieldRow>
    );
}

function Section({
    icon,
    title,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="space-y-3">
            <h2 className="flex items-center gap-2 border-b border-surface0/60 pb-1.5 font-display text-[11px] uppercase tracking-[0.2em] text-mauve">
                <span className="text-pink">{icon}</span>
                // {title}
            </h2>
            <div className="space-y-3 pl-1">{children}</div>
        </section>
    );
}

function FieldRow({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[11px] uppercase tracking-wider text-text">{label}</span>
                {hint && <span className="text-right font-mono text-[9px] italic text-overlay0">{hint}</span>}
            </div>
            {children}
        </div>
    );
}

function Segment({
    options,
    value,
    onChange,
}: {
    options: { id: string; label: string }[];
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div className="inline-flex overflow-hidden rounded border border-surface1/50">
            {options.map((opt, i) => {
                const active = opt.id === value;
                return (
                    <button
                        key={opt.id}
                        type="button"
                        onClick={() => onChange(opt.id)}
                        className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all ${
                            i > 0 ? 'border-l border-surface1/50' : ''
                        } ${
                            active
                                ? 'bg-mauve/20 text-pink'
                                : 'bg-mantle/30 text-subtext hover:text-text'
                        }`}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={value}
            onClick={() => onChange(!value)}
            className={`relative h-6 w-11 rounded-full border transition-all ${
                value
                    ? 'border-mauve bg-mauve/30 shadow-[0_0_12px_rgba(var(--accent-rgb),0.5)]'
                    : 'border-surface1/60 bg-mantle/40'
            }`}
        >
            <span
                className={`absolute top-0.5 h-4 w-4 rounded-full transition-all ${
                    value ? 'left-[22px] bg-pink' : 'left-0.5 bg-subtext'
                }`}
            />
        </button>
    );
}
