/**
 * Shared time utilities used across apps (Projects, Terminal, Clock, …).
 */

/** Zero-pad a number to 2 digits. */
export function pad2(n: number): string {
    return String(n).padStart(2, '0');
}

/**
 * Convert a date string (or Date) into a compact relative duration from now.
 * Examples: `5m`, `3h`, `2d`, `4mo`, `1y`.
 * Returns `"now"` for events less than a minute in the past.
 */
export function relativeTime(input: string | Date): string {
    const now = new Date();
    const date = input instanceof Date ? input : new Date(input);
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return 'now';
    const diffMin = Math.floor(diffMs / 60_000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    const diffMo = Math.floor(diffDay / 30);
    const diffYr = Math.floor(diffDay / 365);
    if (diffYr > 0) return `${diffYr}y`;
    if (diffMo > 0) return `${diffMo}mo`;
    if (diffDay > 0) return `${diffDay}d`;
    if (diffHr > 0) return `${diffHr}h`;
    if (diffMin > 0) return `${diffMin}m`;
    return 'now';
}
