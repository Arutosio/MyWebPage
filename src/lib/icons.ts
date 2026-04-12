import {
    Folder,
    Home,
    Settings as SettingsIcon,
    Terminal,
    User,
    Wallet,
    type LucideIcon,
} from 'lucide-react';

/** Shared icon map — used by TopBar, StartMenu, and anywhere that resolves app icon names. */
export const APP_ICONS: Record<string, LucideIcon> = {
    Home,
    User,
    Folder,
    Wallet,
    Settings: SettingsIcon,
    TerminalSquare: Terminal,
};
