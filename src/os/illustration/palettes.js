/* Colour palettes and small helpers for the card illustrations. */

export const PALETTES = {
    violet: { bg: ['#1B1040', '#6D3FD1'], accent: '#FFB86B', soft: '#C4B5FD', ink: '#FFFFFF', dark: true },
    teal: { bg: ['#032B2F', '#0F8B8D'], accent: '#FDE68A', soft: '#99F6E4', ink: '#FFFFFF', dark: true },
    sunset: { bg: ['#2B0F3A', '#F2545B'], accent: '#FFD166', soft: '#FFB199', ink: '#FFFFFF', dark: true },
    ocean: { bg: ['#06204A', '#2563EB'], accent: '#7DD3FC', soft: '#F0ABFC', ink: '#FFFFFF', dark: true },
    forest: { bg: ['#0B2A1A', '#2F855A'], accent: '#F6E05E', soft: '#9AE6B4', ink: '#FFFFFF', dark: true },
    magenta: { bg: ['#22062A', '#C026D3'], accent: '#22D3EE', soft: '#F9A8D4', ink: '#FFFFFF', dark: true },
    crimson: { bg: ['#2A0A12', '#B91C1C'], accent: '#FDBA74', soft: '#FECACA', ink: '#FFFFFF', dark: true },
    slate: { bg: ['#0F172A', '#475569'], accent: '#38BDF8', soft: '#E2E8F0', ink: '#FFFFFF', dark: true },
    lime: { bg: ['#142405', '#65A30D'], accent: '#FEF08A', soft: '#D9F99D', ink: '#FFFFFF', dark: true },
    peach: { bg: ['#FFF1E6', '#FFB38A'], accent: '#FF6B3D', soft: '#FFD8C2', ink: '#7C2D12', dark: false },
    mint: { bg: ['#ECFFF8', '#86E3C3'], accent: '#10B981', soft: '#C8F5E6', ink: '#065F46', dark: false },
    lavender: { bg: ['#F5EFFF', '#C4B0FF'], accent: '#8B5CF6', soft: '#E4DAFF', ink: '#4C1D95', dark: false },
    sand: { bg: ['#FFF7E0', '#F5C96A'], accent: '#F59E0B', soft: '#FCE7B2', ink: '#7A4E05', dark: false },
    sky: { bg: ['#E8F6FF', '#8CCBFF'], accent: '#2563EB', soft: '#CFE9FF', ink: '#0B3D91', dark: false },
};

/** Blend two #rrggbb colours (t = 0 → a, 1 → b). */
export function mix(a, b, t) {
    const pa = parseInt(a.slice(1), 16);
    const pb = parseInt(b.slice(1), 16);
    const ch = (p, s) => (p >> s) & 255;
    const out = [16, 8, 0].map(s => Math.round(ch(pa, s) + (ch(pb, s) - ch(pa, s)) * t));
    return `#${out.map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

/** Deterministic pseudo-random generator seeded by a string. */
export function seeded(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return () => {
        h += 0x6D2B79F5;
        let t = h;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/* Positions around the centre object used by the scattered layouts (400×300 canvas). */
export const SLOTS = [[80, 92], [134, 44], [214, 30], [292, 58], [326, 122], [312, 186], [88, 176]];
