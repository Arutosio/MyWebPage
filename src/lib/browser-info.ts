import { useEffect, useState } from 'react';

/* --------------------------------------------------------------
 * Browser info — a bundle of reactive system stats the OS-style
 * top bar can display. Everything is pulled from standard Web APIs
 * (falls back gracefully when an API is missing).
 * -------------------------------------------------------------- */

export interface BatteryInfo {
    level: number; // 0..1
    charging: boolean;
    supported: boolean;
}

export interface ConnectionInfo {
    type: string;       // 4g, 3g, slow-2g, …
    downlink: number;   // Mbps
    rtt: number;        // ms
    supported: boolean;
}

export interface BrowserInfo {
    online: boolean;
    language: string;
    timezone: string;
    cpuCores: number;
    deviceMemory: number | null; // GB (Chrome only)
    viewport: { w: number; h: number };
    screen: { w: number; h: number };
    pixelRatio: number;
    battery: BatteryInfo;
    connection: ConnectionInfo;
    platform: string;
    userAgent: string;
    visibility: 'visible' | 'hidden';
    uptimeMs: number; // since app mount
}

/* ---------- small helpers ---------- */

function getLanguage(): string {
    return (navigator.language || 'en').toUpperCase();
}

function getTimezone(): string {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch {
        return 'UTC';
    }
}

function getCpuCores(): number {
    return navigator.hardwareConcurrency || 0;
}

function getDeviceMemory(): number | null {
    const n = navigator as Navigator & { deviceMemory?: number };
    return typeof n.deviceMemory === 'number' ? n.deviceMemory : null;
}

function getPlatform(): string {
    const uaData = (navigator as Navigator & {
        userAgentData?: { platform: string };
    }).userAgentData;
    if (uaData?.platform) return uaData.platform;
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('windows')) return 'Windows';
    if (ua.includes('mac')) return 'macOS';
    if (ua.includes('linux')) return 'Linux';
    if (ua.includes('android')) return 'Android';
    if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS';
    return 'Unknown';
}

function getConnection(): ConnectionInfo {
    const c = (navigator as Navigator & {
        connection?: { effectiveType: string; downlink: number; rtt: number };
    }).connection;
    if (!c) return { type: '--', downlink: 0, rtt: 0, supported: false };
    return {
        type: c.effectiveType ?? '--',
        downlink: c.downlink ?? 0,
        rtt: c.rtt ?? 0,
        supported: true,
    };
}

/* ---------- hook ---------- */

const MOUNT_TIME = Date.now();

export function useBrowserInfo(): BrowserInfo {
    const [info, setInfo] = useState<BrowserInfo>(() => ({
        online: navigator.onLine,
        language: getLanguage(),
        timezone: getTimezone(),
        cpuCores: getCpuCores(),
        deviceMemory: getDeviceMemory(),
        viewport: { w: window.innerWidth, h: window.innerHeight },
        screen: { w: window.screen.width, h: window.screen.height },
        pixelRatio: window.devicePixelRatio || 1,
        battery: { level: 1, charging: false, supported: false },
        connection: getConnection(),
        platform: getPlatform(),
        userAgent: navigator.userAgent,
        visibility: document.visibilityState as 'visible' | 'hidden',
        uptimeMs: 0,
    }));

    useEffect(() => {
        const syncOnline = () => setInfo((s) => ({ ...s, online: navigator.onLine }));
        const syncViewport = () =>
            setInfo((s) => ({
                ...s,
                viewport: { w: window.innerWidth, h: window.innerHeight },
            }));
        const syncConnection = () =>
            setInfo((s) => ({ ...s, connection: getConnection() }));
        const syncVisibility = () =>
            setInfo((s) => ({
                ...s,
                visibility: document.visibilityState as 'visible' | 'hidden',
            }));
        const tickUptime = () =>
            setInfo((s) => ({ ...s, uptimeMs: Date.now() - MOUNT_TIME }));

        window.addEventListener('online', syncOnline);
        window.addEventListener('offline', syncOnline);
        window.addEventListener('resize', syncViewport);
        document.addEventListener('visibilitychange', syncVisibility);
        const nav = navigator as Navigator & {
            connection?: { addEventListener?: (ev: string, cb: () => void) => void; removeEventListener?: (ev: string, cb: () => void) => void };
        };
        nav.connection?.addEventListener?.('change', syncConnection);

        const uptimeId = window.setInterval(tickUptime, 1000);

        // Battery API (Chrome-only, async)
        const navBat = navigator as Navigator & {
            getBattery?: () => Promise<BatteryManagerLike>;
        };
        let battery: BatteryManagerLike | null = null;
        const onBatChange = () => {
            if (!battery) return;
            setInfo((s) => ({
                ...s,
                battery: {
                    level: battery!.level,
                    charging: battery!.charging,
                    supported: true,
                },
            }));
        };
        navBat.getBattery?.().then((bat) => {
            battery = bat;
            onBatChange();
            bat.addEventListener?.('levelchange', onBatChange);
            bat.addEventListener?.('chargingchange', onBatChange);
        }).catch(() => {});

        return () => {
            window.removeEventListener('online', syncOnline);
            window.removeEventListener('offline', syncOnline);
            window.removeEventListener('resize', syncViewport);
            document.removeEventListener('visibilitychange', syncVisibility);
            nav.connection?.removeEventListener?.('change', syncConnection);
            window.clearInterval(uptimeId);
            battery?.removeEventListener?.('levelchange', onBatChange);
            battery?.removeEventListener?.('chargingchange', onBatChange);
        };
    }, []);

    return info;
}

interface BatteryManagerLike {
    level: number;
    charging: boolean;
    addEventListener?: (ev: string, cb: () => void) => void;
    removeEventListener?: (ev: string, cb: () => void) => void;
}

/* ---------- utilities ---------- */

export function formatUptime(ms: number): string {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}h ${m % 60}m`;
    if (m > 0) return `${m}m ${s % 60}s`;
    return `${s}s`;
}

export function shortTz(tz: string): string {
    return tz.split('/').pop() ?? tz;
}
