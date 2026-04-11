import { Rnd } from 'react-rnd';
import { useWindowStore } from '@/store/windows';
import { APPS } from '@/lib/apps';
import type { WindowState } from '@/types/window';
import WindowControls from './WindowControls';

interface Props {
    win: WindowState;
}

export default function Window({ win }: Props) {
    const focus = useWindowStore((s) => s.focus);
    const updateBounds = useWindowStore((s) => s.updateBounds);
    const focusedId = useWindowStore((s) => s.focusedId);

    const isFocused = focusedId === win.id;
    const app = APPS[win.appId];
    const Content = app.component;

    if (win.minimized) return null;

    return (
        <Rnd
            size={{ width: win.width, height: win.height }}
            position={{ x: win.x, y: win.y }}
            minWidth={win.minWidth}
            minHeight={win.minHeight}
            bounds="parent"
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
                className={[
                    'rg-win-enter flex h-full w-full flex-col overflow-hidden rounded-lg border backdrop-blur-2xl transition-shadow duration-200',
                    isFocused
                        ? 'border-mauve/60 bg-base/75 shadow-[0_0_42px_rgba(203,166,247,0.28),0_16px_48px_rgba(0,0,0,0.5)]'
                        : 'border-surface1/40 bg-base/55 shadow-[0_12px_32px_rgba(0,0,0,0.4)]',
                ].join(' ')}
            >
                {/* Titlebar */}
                <div className="rg-win-titlebar flex h-9 cursor-grab select-none items-center gap-3 border-b border-surface0/60 bg-mantle/70 px-3 active:cursor-grabbing">
                    {/* Title + indicator */}
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                        <span
                            className={`h-1.5 w-1.5 rounded-full transition-colors ${
                                isFocused ? 'bg-pink shadow-[0_0_6px_#f5c2e7]' : 'bg-overlay0'
                            }`}
                        />
                        <span
                            className={`truncate font-mono text-[11px] tracking-wider ${
                                isFocused ? 'text-pink' : 'text-subtext'
                            }`}
                        >
                            {win.title}
                        </span>
                    </div>

                    {/* Controls */}
                    <WindowControls id={win.id} maximized={win.maximized} />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto px-6 py-5 font-body text-sm text-text">
                    <Content />
                </div>
            </div>
        </Rnd>
    );
}
