import { useId } from 'react';

/* The ChetasOS mark: a rounded diamond in the site's saffron → gold → red,
   with a white "C" whose opening holds a single dot, like a stop on the route. */
export default function ChetasLogo({ size = 64, className = '', title }) {
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
    const grad = `${uid}-g`;
    const gloss = `${uid}-s`;
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 100 100"
            role={title ? 'img' : undefined}
            aria-label={title}
            aria-hidden={title ? undefined : 'true'}
        >
            <defs>
                <linearGradient id={grad} x1="0.15" y1="0" x2="0.85" y2="1">
                    <stop offset="0" stopColor="#FFD54F" />
                    <stop offset="0.5" stopColor="#FF9933" />
                    <stop offset="1" stopColor="#E8483B" />
                </linearGradient>
                <linearGradient id={gloss} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
                    <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
            </defs>
            <rect x="17" y="17" width="66" height="66" rx="17" transform="rotate(45 50 50)" fill={`url(#${grad})`} />
            <rect x="17" y="17" width="66" height="66" rx="17" transform="rotate(45 50 50)" fill={`url(#${gloss})`} />
            {/* the C: an arc open to the right */}
            <path d="M61.3 38.7 A16 16 0 1 0 61.3 61.3" fill="none" stroke="#fff" strokeWidth="7.5" strokeLinecap="round" />
            {/* the stop on the route, sitting in the C's opening */}
            <circle cx="64.5" cy="50" r="4.6" fill="#fff" />
        </svg>
    );
}
