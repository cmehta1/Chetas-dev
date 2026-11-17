/* Custom glyphs for things the icon set doesn't cover, drawn in the same 24×24 stroke style. */

function Glyph({ size = 24, strokeWidth = 2, children, ...rest }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
            {children}
        </svg>
    );
}

export function CricketGlyph(props) {
    return (
        <Glyph {...props}>
            <rect x="10.5" y="2.5" width="5" height="14" rx="2" transform="rotate(45 13 9.5)" />
            <path d="M8.4 14.6 3.5 19.5" />
            <path d="M3 20l1-1" />
            <circle cx="18" cy="18" r="2.6" />
        </Glyph>
    );
}

export function FootballGlyph(props) {
    return (
        <Glyph {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="m12 8 3 2.2-1.1 3.6h-3.8L9 10.2z" />
            <path d="M12 8V3.5M15 10.2l4.2-1.4M13.9 13.8l2.6 3.7M10.1 13.8l-2.6 3.7M9 10.2 4.8 8.8" />
        </Glyph>
    );
}

export function GloveGlyph(props) {
    return (
        <Glyph {...props}>
            <path d="M7 21h9v-3.5l1.6-1.6A6 6 0 0 0 19.5 11.5V8.5A4.5 4.5 0 0 0 15 4h-4A4.5 4.5 0 0 0 6.5 8.5v1A2.5 2.5 0 0 0 4 12v1.5A4.5 4.5 0 0 0 7 17.7z" />
            <path d="M7 17.7h9" />
            <path d="M6.5 9.5c1.5 0 2.5 1 2.5 2.5" />
        </Glyph>
    );
}

export function RacketGlyph(props) {
    return (
        <Glyph {...props}>
            <ellipse cx="10" cy="9" rx="5.5" ry="6.5" transform="rotate(-45 10 9)" />
            <path d="M7.2 6.2l5.6 5.6M6 9l4.5 4.5M9 6l4.5 4.5" strokeWidth={(props.strokeWidth || 2) * 0.6} />
            <path d="m14.2 13.2 6.3 6.3" />
            <circle cx="19" cy="5" r="1.8" />
        </Glyph>
    );
}

export function TennisBallGlyph(props) {
    return (
        <Glyph {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="M18.4 5.6c-3.5 3.5-3.5 9.3 0 12.8M5.6 5.6c3.5 3.5 3.5 9.3 0 12.8" />
        </Glyph>
    );
}

export function KnightGlyph(props) {
    return (
        <Glyph {...props}>
            <path d="M6 21h12" />
            <path d="M7.5 21v-2h9v2" />
            <path d="M8.5 19c.3-2.7 2.6-4.3 2.6-6.3-1.3.6-3 .7-4.1-.4L8.4 9.6C8.4 6.2 11 3.5 14.8 3.5c1.9 2.2 2.6 5.2 2 9L16 19" />
            <circle cx="12" cy="7.5" r=".6" fill="currentColor" />
        </Glyph>
    );
}

export function ToothGlyph(props) {
    return (
        <Glyph {...props}>
            <path d="M7 3.5c-2 0-3.5 1.6-3.5 4 0 3 1.5 4.5 2 7.5.4 2.6.8 5.5 2.4 5.5s1.6-3 2.3-4.6c.4-.9 1.2-.9 1.6 0 .7 1.6.7 4.6 2.3 4.6s2-2.9 2.4-5.5c.5-3 2-4.5 2-7.5 0-2.4-1.5-4-3.5-4-1.8 0-2.7 1-5 1S8.8 3.5 7 3.5z" />
        </Glyph>
    );
}
