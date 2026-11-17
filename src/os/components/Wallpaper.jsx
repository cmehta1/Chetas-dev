import { memo } from 'react';

/* Dusk sky over a skyline of the places in the journey:
   temple + townhouses (Gujarat), school bell tower, GTU dome,
   Binghamton clock tower, Midway's arched office, Cerner's campus, Oracle's tower. */

function rand(seed) {
    let s = seed;
    return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

const STARS = (() => {
    const r = rand(42);
    return Array.from({ length: 90 }, () => ({
        x: r() * 1440, y: r() * 430, s: 0.4 + r() * 1.2, o: 0.3 + r() * 0.6, tw: r() < 0.18,
    }));
})();

const FAR = (() => {
    const r = rand(7);
    const out = [];
    let x = 0;
    while (x < 1440) {
        const w = 26 + r() * 46;
        const h = 30 + r() * 70;
        out.push({ x, w, h });
        x += w + r() * 6;
    }
    return out;
})();

const LIT = (() => {
    const r = rand(99);
    // [x0, x1, y0, y1] areas with windows
    const areas = [[244, 276, 148, 192], [478, 562, 160, 194], [646, 684, 140, 194], [728, 784, 150, 194],
        [988, 1094, 130, 194], [1232, 1288, 72, 190]];
    const out = [];
    areas.forEach(([x0, x1, y0, y1]) => {
        for (let y = y0; y < y1; y += 11) {
            for (let x = x0; x < x1; x += 9) {
                if (r() < 0.32) out.push({ x, y });
            }
        }
    });
    return out;
})();

function Wallpaper() {
    return (
        <div className="cos-wallpaper" aria-hidden="true">
            <svg className="cos-wall-stars" viewBox="0 0 1440 430" preserveAspectRatio="xMidYMin slice">
                {STARS.map((st, i) => (
                    <circle key={i} cx={st.x} cy={st.y} r={st.s} fill="#fff" opacity={st.o}
                        className={st.tw ? 'cos-twinkle' : undefined}
                        style={st.tw ? { animationDelay: `${(i % 7) * 0.6}s` } : undefined} />
                ))}
                {/* moon */}
                <circle cx="1180" cy="96" r="26" fill="#FFF3D6" opacity="0.92" />
                <circle cx="1192" cy="88" r="24" fill="#1A1B4B" opacity="0.55" />
                {/* the flight to the USA */}
                <g className="cos-wall-plane" opacity="0.85">
                    <path d="M520 210 C 640 150, 780 130, 900 140" fill="none" stroke="#fff" strokeOpacity="0.25" strokeDasharray="4 7" />
                    <path d="M900 140 l16 -3 l-6 6 l8 7 l-5 1 l-8 -5 l-6 5 l-2 -1 l3 -6 l-6 -3 z" fill="#fff" />
                </g>
            </svg>
            <svg className="cos-wall-skyline" viewBox="0 0 1440 220" preserveAspectRatio="xMidYMax slice">
                <g fill="#2B2457" opacity="0.85">
                    {FAR.map((b, i) => <rect key={i} x={b.x} y={200 - b.h - 40} width={b.w} height={b.h + 60} />)}
                </g>
                <g fill="#0D0F24">
                    {/* Gujarat: temple with flag */}
                    <rect x="70" y="150" width="80" height="60" />
                    <polygon points="86,150 110,88 134,150" />
                    <path d="M110 88 V64" stroke="#0D0F24" strokeWidth="2" />
                    <polygon points="111,64 128,70 111,76" fill="#FF9933" />
                    {/* banyan tree */}
                    <circle cx="185" cy="160" r="22" /><circle cx="205" cy="150" r="24" /><circle cx="225" cy="164" r="20" />
                    <rect x="200" y="165" width="8" height="40" />
                    {/* townhouses */}
                    <rect x="240" y="140" width="40" height="70" />
                    <rect x="284" y="156" width="36" height="54" />
                    {/* school bell tower */}
                    <rect x="336" y="146" width="88" height="64" />
                    <rect x="370" y="104" width="20" height="44" />
                    <polygon points="364,104 380,84 396,104" />
                    {/* GTU dome */}
                    <rect x="470" y="152" width="100" height="58" />
                    <path d="M490 152 A30 28 0 0 1 550 152 Z" />
                    <rect x="518" y="112" width="4" height="14" />
                    {/* Binghamton clock tower + campus */}
                    <rect x="640" y="132" width="50" height="78" />
                    <rect x="690" y="70" width="30" height="140" />
                    <polygon points="684,70 705,36 726,70" />
                    <circle cx="705" cy="90" r="8" fill="#F6E7B8" opacity="0.85" />
                    <rect x="720" y="142" width="70" height="68" />
                    {/* Midway arched office */}
                    <path d="M840 210 V150 H940 V210 Z" />
                    <rect x="836" y="144" width="108" height="8" />
                    {/* Cerner campus */}
                    <rect x="980" y="122" width="120" height="88" />
                    <rect x="1100" y="152" width="44" height="58" />
                    <rect x="1022" y="108" width="36" height="16" />
                    {/* Oracle tower */}
                    <rect x="1200" y="166" width="120" height="44" />
                    <rect x="1226" y="62" width="68" height="148" />
                    <rect x="1236" y="52" width="48" height="12" />
                    <rect x="1258" y="18" width="4" height="36" />
                    <circle cx="1260" cy="18" r="3" fill="#E8483B" className="cos-twinkle" />
                    {/* trees + lamps */}
                    <circle cx="1370" cy="170" r="20" /><rect x="1366" y="170" width="8" height="40" />
                    <circle cx="610" cy="176" r="16" /><rect x="606" y="176" width="7" height="34" />
                    <circle cx="960" cy="178" r="14" /><rect x="957" y="178" width="6" height="32" />
                    <rect x="0" y="204" width="1440" height="20" />
                </g>
                <g fill="#FFC94A">
                    {LIT.map((w, i) => <rect key={i} x={w.x} y={w.y} width="4" height="5" opacity="0.75" />)}
                </g>
                <g fill="#FFE8B0" opacity="0.6">
                    {/* Midway arched windows */}
                    {[852, 874, 896, 918].map(x => <path key={x} d={`M${x} 196 V172 a6 6 0 0 1 12 0 V196 Z`} />)}
                </g>
            </svg>
        </div>
    );
}

export default memo(Wallpaper);
