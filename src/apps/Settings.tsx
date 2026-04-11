import { Palette, Image, Clock, Trash2 } from 'lucide-react';
import { useSettings, type AccentColor } from '@/store/settings';
import { SLOTS, type PhaseName } from '@/lib/time-slots';

const ACCENTS: { id: AccentColor; hex: string; name: string }[] = [
    { id: 'mauve', hex: '#cba6f7', name: 'mauve' },
    { id: 'blue', hex: '#89b4fa', name: 'blue' },
    { id: 'pink', hex: '#f5c2e7', name: 'pink' },
    { id: 'green', hex: '#a6e3a1', name: 'green' },
    { id: 'peach', hex: '#fab387', name: 'peach' },
    { id: 'sky', hex: '#89dceb', name: 'sky' },
];

const PHASE_COLORS: Record<PhaseName, string> = {
    dawn: '#f5c2e7',
    noon: '#fab387',
    sunset: '#cba6f7',
    night: '#89b4fa',
};

const PHASE_VIDEO: Record<PhaseName, string> = {
    dawn: 'RAILGUN',
    noon: 'INDEX II',
    sunset: 'INDEX',
    night: 'ACCELERATOR',
};

export default function Settings() {
    const wallpaperMode = useSettings((s) => s.wallpaperMode);
    const manualPhase = useSettings((s) => s.manualPhase);
    const accentColor = useSettings((s) => s.accentColor);
    const hour24 = useSettings((s) => s.hour24);
    const showSeconds = useSettings((s) => s.showSeconds);
    const reducedBlur = useSettings((s) => s.reducedBlur);

    const setWallpaperMode = useSettings((s) => s.setWallpaperMode);
    const setManualPhase = useSettings((s) => s.setManualPhase);
    const setAccentColor = useSettings((s) => s.setAccentColor);
    const setHour24 = useSettings((s) => s.setHour24);
    const setShowSeconds = useSettings((s) => s.setShowSeconds);
    const setReducedBlur = useSettings((s) => s.setReducedBlur);
    const reset = useSettings((s) => s.reset);

    return (
        <div className="space-y-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-subtext">
                // system_settings
            </div>
            <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-mauve drop-shadow-[0_0_14px_rgba(203,166,247,0.4)]">
                [ SYSTEM PREFERENCES ]
            </h1>
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
                                            ? 'border-mauve bg-mauve/15 text-pink shadow-[0_0_12px_rgba(203,166,247,0.4)]'
                                            : 'border-surface1/50 bg-mantle/30 text-subtext hover:border-mauve/60 hover:text-text'
                                    }`}
                                >
                                    <span
                                        className="h-2 w-2 rounded-full"
                                        style={{ background: PHASE_COLORS[slot.name] }}
                                    />
                                    <span className="flex-1">{slot.name}</span>
                                    <span className="text-[9px] text-overlay0">{PHASE_VIDEO[slot.name]}</span>
                                </button>
                            );
                        })}
                    </div>
                </FieldRow>
            </Section>

            {/* Appearance */}
            <Section icon={<Palette className="h-4 w-4" />} title="Appearance">
                <FieldRow label="Accent" hint="used for window borders, highlights, controls">
                    <div className="flex flex-wrap gap-2">
                        {ACCENTS.map((a) => {
                            const active = accentColor === a.id;
                            return (
                                <button
                                    key={a.id}
                                    type="button"
                                    onClick={() => setAccentColor(a.id)}
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
                    className="rounded border border-red/50 bg-red/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-red transition-all hover:bg-red/20 hover:shadow-[0_0_12px_rgba(243,139,168,0.5)]"
                >
                    [ FACTORY RESET ]
                </button>
            </Section>
        </div>
    );
}

/* ---------- subcomponents ---------- */

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
                    ? 'border-mauve bg-mauve/30 shadow-[0_0_12px_rgba(203,166,247,0.5)]'
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
