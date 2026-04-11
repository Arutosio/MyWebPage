import type { ComponentType } from 'react';
import type { AppId } from '@/types/window';
import Home from '@/apps/Home';
import Bio from '@/apps/Bio';
import Projects from '@/apps/Projects';
import Donate from '@/apps/Donate';
import Settings from '@/apps/Settings';
import Terminal from '@/apps/Terminal';

export interface AppDefinition {
    id: AppId;
    title: string;
    subtitle: string;
    icon: string; // lucide icon name, resolved at the call site
    component: ComponentType;
    defaultWidth: number;
    defaultHeight: number;
    minWidth: number;
    minHeight: number;
}

export const APPS: Record<AppId, AppDefinition> = {
    home: {
        id: 'home',
        title: 'welcome.sh',
        subtitle: 'boot splash',
        icon: 'Home',
        component: Home,
        defaultWidth: 620,
        defaultHeight: 440,
        minWidth: 380,
        minHeight: 280,
    },
    bio: {
        id: 'bio',
        title: 'personnel_file',
        subtitle: 'who dis',
        icon: 'User',
        component: Bio,
        defaultWidth: 600,
        defaultHeight: 560,
        minWidth: 380,
        minHeight: 340,
    },
    projects: {
        id: 'projects',
        title: 'github_uplink',
        subtitle: 'repos live',
        icon: 'Folder',
        component: Projects,
        defaultWidth: 720,
        defaultHeight: 560,
        minWidth: 440,
        minHeight: 340,
    },
    donate: {
        id: 'donate',
        title: 'crypto_wallet',
        subtitle: 'power up',
        icon: 'Wallet',
        component: Donate,
        defaultWidth: 560,
        defaultHeight: 540,
        minWidth: 380,
        minHeight: 420,
    },
    terminal: {
        id: 'terminal',
        title: 'terminal',
        subtitle: 'interactive shell',
        icon: 'TerminalSquare',
        component: Terminal,
        defaultWidth: 720,
        defaultHeight: 460,
        minWidth: 440,
        minHeight: 280,
    },
    settings: {
        id: 'settings',
        title: 'system_settings',
        subtitle: 'preferences',
        icon: 'Settings',
        component: Settings,
        defaultWidth: 560,
        defaultHeight: 620,
        minWidth: 420,
        minHeight: 440,
    },
};

export const APP_LIST: AppDefinition[] = Object.values(APPS);
