import { Rnd } from 'react-rnd';
import { useWindowStore } from '@/store/windows';
import { useSettings } from '@/store/settings';
import { APPS } from '@/lib/apps';
import type { WindowState } from '@/types/window';
import { phaseGlow, phaseDotColor } from '@/lib/phase-theme';
import PhaseDot from './ui/PhaseDot';
import WindowControls from './WindowControls';

interface Props {
    win: WindowState;
}

export default function Window({ win }: Props) {
    const focus = useWindowStore((s) => s.focus);
    const updateBounds = useWindowStore((s) => s.updateBounds);
    const isFocused = useWindowStore((s) => s.focusedId === win.id);
    const fontScale = useSettings((s) => s.fontScale);
    const app = APPS[win.appId];
    const Content = app.component;

    if (win.minimized) return null;

    const baseShadow = isFocused
        ? '0 0 10px rgba(var(--accent-rgb, 184, 96, 255), 0.35), 0 3px 8px rgba(0,0,0,0.45)'
        : '0 0 6px rgba(var(--accent-rgb, 184, 96, 255), 0.15), 0 2px 6px rgba(0,0,0,0.4)';
    const phaseShadow = phaseGlow(win.phase, isFocused ? 0.28 : 0.14, isFocused ? 8 : 6);
    const combinedShadow = `${baseShadow}, ${phaseShadow}`;
    const phaseHex = phaseDotColor(win.phase);

    return (
        <Rnd
            size={{ width: win.width, height: win.height }}
            position={{ x: win.x, y: win.y }}
            minWidth={win.minWidth}
            minHeight={win.minHeight}
            bounds="parent"
            scale={fontScale}
            dragHandleClassName="rg-win-titlebar"
            onDragStart={() => focus(win.id)}
            onDragStop={(_e, d) => updateBounds(win.id, { x: d.x, y: d.y })}
            onResizeStart={() => focus(win.id)}
            onResizeStop={(_e, _dir, ref, _delta, position) =>
                updateBounds(win.id, {
                    width: parseInt(ref.style.width),
                    height: parseInt(ref.style.height),
                    x: position.x,
                    y: position.y,
                })
            }
            disableDragging={win.maximized}
            enableResizing={!win.maximized}
            style={{ zIndex: win.zIndex }}
        >
            <div
                onMouseDown={() => focus(win.id)}
                style={{ boxShadow: combinedShadow }}
                className={[
                    'rg-win-enter flex h-full w-full flex-col overflow-hidden rounded-lg border-2 backdrop-blur-md transition-all duration-200',
                    isFocused
                        ? 'border-mauve/80 bg-base/95'
                        : 'border-surface1/70 bg-base/85',
                ].join(' ')}
            >
                {/* Titlebar */}
                <div className="rg-win-titlebar flex h-9 cursor-grab select-none items-center gap-3 border-b border-surface0/80 bg-mantle/95 px-3 active:cursor-grabbing">
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                        <PhaseDot
                            phase={win.phase}
                            glow={isFocused ? 8 : 4}
                            className="transition-all"
                        />
                        <span
                            className={`truncate font-mono text-[11px] tracking-wider ${
                                isFocused ? 'text-text' : 'text-subtext'
                            }`}
                        >
                            {win.title}
                        </span>
                        <span
                            className="ml-1 shrink-0 font-mono text-[9px] uppercase tracking-[0.18em] italic"
                            style={{ color: phaseHex }}
                        >
                            · {win.phase}
                            {win.phaseMode === 'frozen' && <span className="ml-1 not-italic">[●]</span>}
                        </span>
                    </div>

                    <WindowControls
                        id={win.id}
                        maximized={win.maximized}
                        phase={win.phase}
                        phaseMode={win.phaseMode}
                    />
                </div>

                <div className="flex-1 overflow-auto bg-base/90 px-6 py-5 font-body text-[13px] leading-relaxed text-text">
                    <Content />
                </div>
            </div>
        </Rnd>
    );
}
