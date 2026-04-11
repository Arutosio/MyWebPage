import type { PhaseName } from '@/lib/time-slots';

export type AppId = 'home' | 'bio' | 'projects' | 'donate' | 'settings' | 'terminal';

export type PhaseMode = 'live' | 'frozen';

export interface WindowBounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface WindowState extends WindowBounds {
    id: string;
    appId: AppId;
    title: string;
    icon: string;
    minWidth: number;
    minHeight: number;
    zIndex: number;
    minimized: boolean;
    maximized: boolean;
    prevBounds?: WindowBounds;

    /**
     * The time-of-day phase this window is tinted by. When `phaseMode` is
     * `'live'` this field is refreshed to the current clock phase whenever it
     * crosses a boundary. When `'frozen'` it stays at whatever value it had
     * at the moment the user pinned it.
     */
    phase: PhaseName;
    phaseMode: PhaseMode;
}
