/* The game's character, redrawn in SVG so ChetasOS can use him without loading Phaser. */

const SKIN = '#C68642';
const SKIN_SH = '#AA7030';
const HAIR = '#1A1A1A';
const SHIRT = '#C62828';
const SHIRT_HI = '#E53935';

function Head({ cx, cy, r }) {
    return (
        <g>
            {/* ears */}
            <ellipse cx={cx - r * 0.95} cy={cy + r * 0.1} rx={r * 0.16} ry={r * 0.22} fill={SKIN_SH} />
            <ellipse cx={cx + r * 0.95} cy={cy + r * 0.1} rx={r * 0.16} ry={r * 0.22} fill={SKIN_SH} />
            <circle cx={cx} cy={cy} r={r} fill={SKIN} />
            {/* spiky hair */}
            <path
                d={`M${cx - r * 1.02} ${cy - r * 0.05}
                   C ${cx - r * 1.1} ${cy - r * 0.9}, ${cx - r * 0.5} ${cy - r * 1.25}, ${cx - r * 0.2} ${cy - r * 1.05}
                   L ${cx - r * 0.05} ${cy - r * 1.35} L ${cx + r * 0.15} ${cy - r * 1.05}
                   L ${cx + r * 0.45} ${cy - r * 1.3} L ${cx + r * 0.55} ${cy - r * 0.95}
                   C ${cx + r * 1.0} ${cy - r * 1.0}, ${cx + r * 1.15} ${cy - r * 0.5}, ${cx + r * 1.02} ${cy - r * 0.05}
                   C ${cx + r * 0.7} ${cy - r * 0.55}, ${cx - r * 0.6} ${cy - r * 0.6}, ${cx - r * 1.02} ${cy - r * 0.05} Z`}
                fill={HAIR}
            />
            {/* glasses */}
            <g fill="rgba(255,255,255,0.18)" stroke="#111" strokeWidth={r * 0.09}>
                <circle cx={cx - r * 0.38} cy={cy + r * 0.12} r={r * 0.27} />
                <circle cx={cx + r * 0.38} cy={cy + r * 0.12} r={r * 0.27} />
                <path d={`M${cx - r * 0.11} ${cy + r * 0.1} H ${cx + r * 0.11}`} fill="none" />
            </g>
            <circle cx={cx - r * 0.36} cy={cy + r * 0.14} r={r * 0.08} fill="#111" />
            <circle cx={cx + r * 0.4} cy={cy + r * 0.14} r={r * 0.08} fill="#111" />
            {/* smile */}
            <path
                d={`M${cx - r * 0.25} ${cy + r * 0.55} Q ${cx} ${cy + r * 0.78} ${cx + r * 0.25} ${cy + r * 0.55}`}
                fill="none" stroke="#5D2E0C" strokeWidth={r * 0.08} strokeLinecap="round"
            />
        </g>
    );
}

/** Head-and-shoulders portrait. */
export function Avatar({ size = 64, className }) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
            <path d="M14 100 C 16 76, 30 68, 50 68 C 70 68, 84 76, 86 100 Z" fill={SHIRT} />
            <path d="M40 69 L50 82 L60 69" fill="none" stroke={SHIRT_HI} strokeWidth="3" />
            <rect x="62" y="80" width="11" height="8" rx="1.5" fill="#fff" />
            <rect x="44" y="58" width="12" height="12" rx="3" fill={SKIN_SH} />
            <Head cx={50} cy={42} r={22} />
        </svg>
    );
}

/** Full-body walker, legs and arms animated with CSS (see .cos-walker in os.css). */
export function Walker({ height = 96, className }) {
    return (
        <svg className={`cos-walker ${className || ''}`} height={height} viewBox="0 0 60 110" aria-hidden="true">
            <ellipse cx="30" cy="106" rx="14" ry="3" fill="rgba(0,0,0,0.25)" />
            <g className="cos-walker-body">
                <g className="cos-walker-leg cos-walker-leg-back">
                    <rect x="25" y="66" width="8" height="34" rx="3" fill="#0A0A14" />
                    <rect x="23" y="96" width="13" height="6" rx="2.5" fill="#111" />
                </g>
                <g className="cos-walker-arm cos-walker-arm-back">
                    <rect x="26" y="40" width="7" height="26" rx="3.5" fill="#A51F1F" />
                </g>
                <rect x="18" y="36" width="24" height="34" rx="7" fill={SHIRT} />
                <rect x="31" y="46" width="7" height="5" rx="1" fill="#fff" />
                <g className="cos-walker-leg cos-walker-leg-front">
                    <rect x="26" y="66" width="8" height="34" rx="3" fill="#1A1A2E" />
                    <rect x="25" y="96" width="13" height="6" rx="2.5" fill="#111" />
                </g>
                <g className="cos-walker-arm cos-walker-arm-front">
                    <rect x="27" y="40" width="7" height="26" rx="3.5" fill={SHIRT_HI} />
                    <circle cx="30.5" cy="66" r="3.6" fill={SKIN} />
                </g>
                <Head cx={30} cy={20} r={15} />
            </g>
        </svg>
    );
}
