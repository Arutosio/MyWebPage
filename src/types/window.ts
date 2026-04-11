export type AppId = 'home' | 'bio' | 'projects' | 'donate' | 'settings';

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
}
