/* Small hand-drawn stroke icons used across ChetasOS. */

const PATHS = {
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M3 13h18" /></>,
    cards: <><rect x="8" y="3" width="12" height="16" rx="2" /><path d="M5 6.5V19a2 2 0 0 0 2 2h9" /><path d="m14 8 1 2 2 .3-1.5 1.4.4 2.1-1.9-1-1.9 1 .4-2.1L11 10.3l2-.3z" /></>,
    award: <><circle cx="12" cy="9" r="6" /><path d="M8.5 14 7 22l5-3 5 3-1.5-8" /><path d="m12 6 .9 1.8 2 .3-1.4 1.4.3 2-1.8-1-1.8 1 .3-2-1.4-1.4 2-.3z" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>,
    activity: <><path d="M3 12h4l3-8 4 16 3-8h4" /></>,
    terminal: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m7 9 3 3-3 3" /><path d="M13 15h4" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    gamepad: <><path d="M6.5 8h11A4.5 4.5 0 0 1 22 12.5v1a3 3 0 0 1-5.3 1.9L15 13.5H9l-1.7 1.9A3 3 0 0 1 2 13.5v-1A4.5 4.5 0 0 1 6.5 8z" /><path d="M7 10.5v4M5 12.5h4" /><circle cx="15.5" cy="11.5" r=".6" fill="currentColor" /><circle cx="17.5" cy="13.5" r=".6" fill="currentColor" /></>,
    close: <><path d="M6 6l12 12M18 6 6 18" /></>,
    minus: <><path d="M5 12h14" /></>,
    maximize: <><rect x="5" y="5" width="14" height="14" rx="2" /></>,
    restore: <><rect x="4" y="8" width="12" height="12" rx="2" /><path d="M8 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2" /></>,
    back: <><path d="m15 5-7 7 7 7" /></>,
    external: <><path d="M14 4h6v6" /><path d="M20 4 10 14" /><path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" /></>,
    grid: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
    stack: <><rect x="6" y="6" width="12" height="15" rx="2" /><path d="M8 3h8" /><path d="M7 4.5h10" /></>,
    flip: <><path d="M4 9a8 8 0 0 1 14-3l2 2" /><path d="M20 4v4h-4" /><path d="M20 15a8 8 0 0 1-14 3l-2-2" /><path d="M4 20v-4h4" /></>,
    chevronLeft: <><path d="m15 6-6 6 6 6" /></>,
    chevronRight: <><path d="m9 6 6 6-6 6" /></>,
    pin: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
    play: <><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none" /></>,
    sparkle: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></>,
    linkedin: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10.5V17M8 7.2v.1M12 17v-3.8a2.3 2.3 0 0 1 4.6 0V17M12 10.5V17" /></>,
    github: <><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" /></>,
    x: <><path d="M4 4l16 16M20 4 4 20" /></>,
};

export default function Icon({ name, size = 20, strokeWidth = 1.8, className, style }) {
    return (
        <svg
            className={className}
            style={style}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            {PATHS[name]}
        </svg>
    );
}
