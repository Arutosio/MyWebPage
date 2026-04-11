export type PhaseName = 'dawn' | 'noon' | 'sunset' | 'night';

export interface Slot {
    start: number;
    end: number;
    src: string;
    name: PhaseName;
}

export const SLOTS: Slot[] = [
    { start: 5, end: 11, src: '/Videos_webm/Toaru-Kagaku-no-Railgun.webm', name: 'dawn' },
    { start: 11, end: 16, src: '/Videos_webm/Toaru-Majutsu-no-Index2.webm', name: 'noon' },
    { start: 16, end: 20, src: '/Videos_webm/Toaru-Majutsu-no-Index1.webm', name: 'sunset' },
    { start: 20, end: 5, src: '/Videos_webm/Toaru-Kagaku-no-Accelerator.webm', name: 'night' },
];

export function getSlotForHour(hour: number): Slot {
    for (const s of SLOTS) {
        if (s.end > s.start) {
            if (hour >= s.start && hour < s.end) return s;
        } else if (hour >= s.start || hour < s.end) {
            return s;
        }
    }
    return SLOTS[SLOTS.length - 1];
}
