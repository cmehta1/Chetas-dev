/* Ten illustration styles. Each draws on a 400×300 canvas whose background extends
   to x = −200…600 so the wide detail view (viewBox −100 0 600 300) is filled too.
   No SVG filters are used, which keeps grids of tilting cards smooth. */
import { Glyph, Center } from './parts';
import { mix, seeded, SLOTS } from './palettes';

const BG = { x: -200, y: -10, width: 800, height: 320 };

function pickSlots(rnd, n) {
    const skip = Math.floor(rnd() * SLOTS.length);
    return SLOTS.filter((_, i) => i !== skip).slice(0, n)
        .map(([x, y]) => [x + (rnd() - 0.5) * 14, y + (rnd() - 0.5) * 12]);
}
function edge(ax, ay, ar, bx, by, br) {
    const dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy) || 1;
    return [ax + (dx / d) * ar, ay + (dy / d) * ar, bx - (dx / d) * br, by - (dy / d) * br];
}
function SoftDot({ id, color }) {
    return (
        <radialGradient id={id}>
            <stop offset="0" stopColor={color} stopOpacity="0.85" />
            <stop offset="0.6" stopColor={color} stopOpacity="0.3" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
    );
}
function Sparkle({ x, y, s, color, opacity = 0.9 }) {
    return <path d={`M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z`} fill={color} opacity={opacity} />;
}

/* 1 ─ Glowing hub on a tabletop (the reference style) */
export function HubTheme({ art, pal, id, seed }) {
    const rnd = seeded(seed);
    const O = { x: 200, y: 136, r: 44 };
    const pts = pickSlots(rnd, art.nodes.length);
    const bokeh = Array.from({ length: 16 }, () => ({ x: -140 + rnd() * 680, y: rnd() * 200, r: 10 + rnd() * 42, c: Math.floor(rnd() * 3), o: 0.25 + rnd() * 0.5 }));
    const cols = [pal.accent, pal.soft, '#FFFFFF'];
    return (
        <>
            <defs>
                <linearGradient id={id('bg')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={pal.bg[0]} /><stop offset="1" stopColor={pal.bg[1]} /></linearGradient>
                {cols.map((c, i) => <SoftDot key={i} id={id(`b${i}`)} color={c} />)}
                <linearGradient id={id('wood')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8A6446" /><stop offset="1" stopColor="#5A3D29" /></linearGradient>
                <radialGradient id={id('orb')} cx="0.38" cy="0.32" r="0.8"><stop offset="0" stopColor={mix(pal.bg[1], '#FFFFFF', 0.25)} /><stop offset="1" stopColor={pal.bg[0]} /></radialGradient>
                <SoftDot id={id('halo')} color={pal.accent} />
                <linearGradient id={id('ped')} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5D6274" /><stop offset="0.45" stopColor="#D9DCE4" /><stop offset="1" stopColor="#4E5366" /></linearGradient>
            </defs>
            <rect {...BG} fill={`url(#${id('bg')})`} />
            {bokeh.map((b, i) => <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={`url(#${id(`b${b.c}`)})`} opacity={b.o} />)}
            <rect x="-200" y="206" width="800" height="110" fill={`url(#${id('wood')})`} />
            {[214, 226, 242, 263, 290].map(y => <line key={y} x1="-200" y1={y} x2="600" y2={y} stroke="#000" strokeOpacity="0.16" />)}
            <g stroke="#fff" strokeWidth="1.2" strokeOpacity="0.75">
                {pts.map(([x, y], i) => { const [a, b, c, d] = edge(O.x, O.y, O.r + 4, x, y, 19); return <line key={i} x1={a} y1={b} x2={c} y2={d} />; })}
            </g>
            <ellipse cx="200" cy="218" rx="66" ry="10" fill="#000" opacity="0.3" />
            <path d="M162 194 V212 A38 7 0 0 0 238 212 V194 Z" fill={`url(#${id('ped')})`} />
            <ellipse cx="200" cy="194" rx="38" ry="7" fill="#2A2E3D" />
            <ellipse cx="200" cy="194" rx="33" ry="5" fill="none" stroke={pal.accent} strokeWidth="2" className="cos-ill-ring" />
            <circle cx={O.x} cy={O.y} r={O.r + 26} fill={`url(#${id('halo')})`} opacity="0.6" className="cos-ill-halo" />
            <g className="cos-ill-orb">
                <circle cx={O.x} cy={O.y} r={O.r} fill={`url(#${id('orb')})`} stroke="#fff" strokeOpacity="0.85" strokeWidth="2.2" />
                <path d="M172 118 A36 36 0 0 1 206 101" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round" />
                <Center art={art} cx={O.x} cy={O.y} size={38} />
            </g>
            {pts.map(([x, y], i) => (
                <g key={i} className="cos-ill-node" style={{ animationDelay: `${i * 0.7}s` }}>
                    <circle cx={x} cy={y} r="19" fill="#fff" fillOpacity="0.14" stroke="#fff" strokeWidth="1.5" />
                    <Glyph name={art.nodes[i]} cx={x} cy={y} size={18} />
                </g>
            ))}
        </>
    );
}

/* 2 ─ Planet with rings and orbiting moons */
export function OrbitTheme({ art, pal, id, seed }) {
    const rnd = seeded(seed);
    const C = { x: 200, y: 148 };
    const stars = Array.from({ length: 70 }, () => ({ x: -180 + rnd() * 760, y: rnd() * 300, r: 0.4 + rnd() * 1.3, o: 0.3 + rnd() * 0.7 }));
    const orbits = [[96, 34], [146, 52], [194, 70]];
    const moons = art.nodes.map((n, i) => {
        const [rx, ry] = orbits[i % 3];
        const a = (i / art.nodes.length) * Math.PI * 2 + rnd() * 0.6;
        const x0 = Math.cos(a) * rx, y0 = Math.sin(a) * ry;
        const rot = -12 * Math.PI / 180;
        return { x: C.x + x0 * Math.cos(rot) - y0 * Math.sin(rot), y: C.y + x0 * Math.sin(rot) + y0 * Math.cos(rot), n };
    });
    const ring = (half) => `M${C.x - 76} ${C.y} A76 17 0 0 ${half === 'back' ? 1 : 0} ${C.x + 76} ${C.y}`;
    return (
        <>
            <defs>
                <radialGradient id={id('sky')} cx="0.5" cy="0.5" r="0.75"><stop offset="0" stopColor={mix(pal.bg[1], pal.bg[0], 0.45)} /><stop offset="0.6" stopColor={pal.bg[0]} /><stop offset="1" stopColor="#04040C" /></radialGradient>
                <radialGradient id={id('planet')} cx="0.35" cy="0.3" r="0.85"><stop offset="0" stopColor={mix(pal.soft, '#FFFFFF', 0.2)} /><stop offset="0.55" stopColor={pal.bg[1]} /><stop offset="1" stopColor={pal.bg[0]} /></radialGradient>
                <SoftDot id={id('glow')} color={pal.soft} />
            </defs>
            <rect {...BG} fill={`url(#${id('sky')})`} />
            {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o} />)}
            <line x1="40" y1="40" x2="96" y2="64" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="98" cy="65" r="2.2" fill="#fff" />
            <g transform={`rotate(-12 ${C.x} ${C.y})`} fill="none" stroke="#fff" strokeOpacity="0.22">
                {orbits.map(([rx, ry], i) => <ellipse key={i} cx={C.x} cy={C.y} rx={rx} ry={ry} strokeDasharray={i === 2 ? '3 5' : undefined} />)}
            </g>
            <circle cx={C.x} cy={C.y} r="78" fill={`url(#${id('glow')})`} opacity="0.35" className="cos-ill-halo" />
            <g transform={`rotate(-12 ${C.x} ${C.y})`}><path d={ring('back')} fill="none" stroke={pal.accent} strokeWidth="5" strokeOpacity="0.55" /></g>
            <circle cx={C.x} cy={C.y} r="46" fill={`url(#${id('planet')})`} />
            <path d={`M${C.x + 20} ${C.y - 41} A46 46 0 0 1 ${C.x + 20} ${C.y + 41} A58 58 0 0 0 ${C.x + 20} ${C.y - 41}Z`} fill="#000" opacity="0.18" />
            <Center art={art} cx={C.x} cy={C.y} size={40} />
            <g transform={`rotate(-12 ${C.x} ${C.y})`}><path d={ring('front')} fill="none" stroke={pal.accent} strokeWidth="5" strokeOpacity="0.95" /></g>
            {moons.map((m, i) => (
                <g key={i} className="cos-ill-node" style={{ animationDelay: `${i * 0.6}s` }}>
                    <circle cx={m.x} cy={m.y} r="16" fill={mix(pal.bg[0], pal.bg[1], 0.5)} stroke={i % 2 ? pal.soft : pal.accent} strokeWidth="1.5" />
                    <Glyph name={m.n} cx={m.x} cy={m.y} size={15} color="#fff" />
                </g>
            ))}
        </>
    );
}

/* 3 ─ Neon synthwave: striped sun, grid floor, glowing outline icons */
export function NeonTheme({ art, pal, id, seed }) {
    const rnd = seeded(seed);
    const H = 178;
    const neonA = pal.dark ? pal.accent : pal.accent;
    const neonB = pal.dark ? pal.soft : mix(pal.accent, '#FFFFFF', 0.3);
    const pts = pickSlots(rnd, art.nodes.length).map(([x, y]) => [x, Math.min(y, 150)]);
    const vlines = Array.from({ length: 17 }, (_, i) => i - 8);
    const hlines = Array.from({ length: 8 }, (_, i) => H + 122 * ((i + 1) / 8) ** 2);
    return (
        <>
            <defs>
                <linearGradient id={id('bg')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#07021A" /><stop offset="0.75" stopColor={mix(pal.bg[0], '#07021A', pal.dark ? 0 : 0.6)} /><stop offset="1" stopColor={mix(pal.bg[1], '#07021A', 0.4)} /></linearGradient>
                <linearGradient id={id('sun')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={neonA} /><stop offset="1" stopColor={mix(pal.bg[1], '#FF2E88', 0.4)} /></linearGradient>
                <mask id={id('stripes')}>
                    <rect x="100" y="60" width="200" height="130" fill="#fff" />
                    {[0, 1, 2, 3, 4, 5].map(i => <rect key={i} x="100" y={128 + i * 9 + i * i * 0.6} width="200" height={1.5 + i * 0.9} fill="#000" />)}
                </mask>
            </defs>
            <rect {...BG} fill={`url(#${id('bg')})`} />
            {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={-180 + ((i * 97) % 760)} cy={(i * 53) % 150} r={((i * 7) % 10) / 10 + 0.3} fill="#fff" opacity="0.5" />)}
            <circle cx="200" cy="140" r="70" fill={`url(#${id('sun')})`} mask={`url(#${id('stripes')})`} />
            <path d={`M-200 ${H} L40 ${H - 26} L90 ${H - 10} L140 ${H - 34} L180 ${H - 8} L250 ${H - 30} L300 ${H - 6} L350 ${H - 28} L600 ${H} Z`} fill="#0B0424" stroke={neonB} strokeWidth="1" strokeOpacity="0.7" />
            <rect x="-200" y={H} width="800" height="130" fill="#05010F" />
            <g stroke={neonB} strokeOpacity="0.75" strokeWidth="1.1">
                {vlines.map(k => <line key={k} x1={200 + k * 8} y1={H} x2={200 + k * 70} y2="300" />)}
                {hlines.map((y, i) => <line key={i} x1="-200" y1={y} x2="600" y2={y} />)}
            </g>
            <line x1="-200" y1={H} x2="600" y2={H} stroke={neonA} strokeWidth="2" />
            <g className="cos-ill-orb">
                <circle cx="200" cy="112" r="40" fill="#0B0420" fillOpacity="0.75" stroke={neonA} strokeWidth="6" strokeOpacity="0.25" />
                <circle cx="200" cy="112" r="40" fill="none" stroke={neonA} strokeWidth="2" />
                <Center art={art} cx={200} cy={112} size={40} color="#fff" />
            </g>
            {pts.map(([x, y], i) => (
                <g key={i} className="cos-ill-node" style={{ animationDelay: `${i * 0.5}s` }}>
                    <Glyph name={art.nodes[i]} cx={x} cy={y} size={30} color={i % 2 ? neonA : neonB} strokeWidth={4.5} />
                    <g opacity="0.25"><Glyph name={art.nodes[i]} cx={x} cy={y} size={30} color={i % 2 ? neonA : neonB} strokeWidth={6} /></g>
                    <Glyph name={art.nodes[i]} cx={x} cy={y} size={30} color="#fff" strokeWidth={1.3} />
                </g>
            ))}
        </>
    );
}

/* 4 ─ Layered paper-cut landscape */
export function PaperTheme({ art, pal, id, seed }) {
    const rnd = seeded(seed);
    const layers = pal.dark
        ? [mix(pal.bg[1], pal.soft, 0.35), pal.bg[1], mix(pal.bg[1], pal.bg[0], 0.45), mix(pal.bg[1], pal.bg[0], 0.75)]
        : [mix(pal.soft, pal.bg[1], 0.25), mix(pal.soft, pal.bg[1], 0.7), mix(pal.bg[1], pal.ink, 0.25), mix(pal.bg[1], pal.ink, 0.5)];
    const wave = (base, amp, k) => {
        const ph = rnd() * 6;
        let d = `M-200 ${base}`;
        for (let x = -200; x <= 600; x += 20) d += ` L${x} ${base + Math.sin(x / k + ph) * amp + Math.sin(x / (k * 0.43) + ph) * amp * 0.35}`;
        return `${d} L600 320 L-200 320 Z`;
    };
    const hills = [[176, 16, 60], [204, 14, 48], [232, 12, 40], [260, 10, 34]].map(([b, a, k]) => wave(b, a, k));
    const pts = pickSlots(rnd, art.nodes.length).map(([x, y]) => [x, Math.min(y, 148)]);
    const ink = pal.dark ? pal.bg[0] : pal.ink;
    return (
        <>
            <defs>
                <linearGradient id={id('sky')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={pal.bg[0]} /><stop offset="1" stopColor={mix(pal.bg[0], pal.bg[1], 0.55)} /></linearGradient>
            </defs>
            <rect {...BG} fill={`url(#${id('sky')})`} />
            <circle cx="318" cy="70" r="30" fill={pal.accent} opacity="0.9" />
            <circle cx="318" cy="70" r="42" fill={pal.accent} opacity="0.15" />
            {[[70, 54, 1], [250, 32, 0.8]].map(([x, y, s], i) => (
                <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
                    <path d="M4 22 h56 a14 14 0 0 0 -8 -26 a18 18 0 0 0 -34 4 a12 12 0 0 0 -14 22z" fill="#000" opacity="0.12" transform="translate(2 4)" />
                    <path d="M4 22 h56 a14 14 0 0 0 -8 -26 a18 18 0 0 0 -34 4 a12 12 0 0 0 -14 22z" fill="#fff" opacity="0.92" />
                </g>
            ))}
            {hills.map((d, i) => (
                <g key={i}>
                    <path d={d} fill="#000" opacity="0.16" transform="translate(0 -4)" />
                    <path d={d} fill={layers[i]} />
                </g>
            ))}
            <g className="cos-ill-orb">
                <circle cx="200" cy="120" r="42" fill="#000" opacity="0.15" transform="translate(3 5)" />
                <circle cx="200" cy="120" r="42" fill="#fff" />
                <circle cx="200" cy="120" r="35" fill="none" stroke={pal.accent} strokeWidth="2" strokeDasharray="3 4" />
                <Center art={art} cx={200} cy={120} size={40} color={ink} strokeWidth={1.8} plate={false} />
            </g>
            {pts.map(([x, y], i) => (
                <g key={i} className="cos-ill-node" style={{ animationDelay: `${i * 0.6}s` }}>
                    <circle cx={x + 2} cy={y + 3} r="16" fill="#000" opacity="0.13" />
                    <circle cx={x} cy={y} r="16" fill="#fff" />
                    <Glyph name={art.nodes[i]} cx={x} cy={y} size={16} color={i % 2 ? pal.accent : ink} strokeWidth={2} />
                </g>
            ))}
        </>
    );
}

/* 5 ─ Technical blueprint */
export function BlueprintTheme({ art, pal, id, seed }) {
    const rnd = seeded(seed);
    const base = pal.dark ? pal.bg[0] : mix(pal.ink, '#0B1F44', 0.3);
    const pts = [[64, 70], [336, 70], [60, 220], [340, 222], [116, 30], [286, 30]].slice(0, art.nodes.length);
    const fig = String(1 + Math.floor(rnd() * 9)).padStart(2, '0');
    return (
        <>
            <defs>
                <linearGradient id={id('bg')} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={base} /><stop offset="1" stopColor={mix(base, pal.bg[1], 0.45)} /></linearGradient>
                <pattern id={id('grid')} width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" stroke="#fff" strokeOpacity="0.07" /></pattern>
                <pattern id={id('grid2')} width="50" height="50" patternUnits="userSpaceOnUse"><path d="M50 0H0V50" fill="none" stroke="#fff" strokeOpacity="0.14" /></pattern>
            </defs>
            <rect {...BG} fill={`url(#${id('bg')})`} />
            <rect {...BG} fill={`url(#${id('grid')})`} />
            <rect {...BG} fill={`url(#${id('grid2')})`} />
            <g stroke="#fff" fill="none">
                <circle cx="200" cy="146" r="80" strokeOpacity="0.5" strokeDasharray="4 4" />
                <circle cx="200" cy="146" r="62" strokeOpacity="0.25" />
                <line x1="90" y1="146" x2="310" y2="146" strokeOpacity="0.3" strokeDasharray="10 4 2 4" />
                <line x1="200" y1="44" x2="200" y2="250" strokeOpacity="0.3" strokeDasharray="10 4 2 4" />
                <line x1="120" y1="262" x2="280" y2="262" strokeOpacity="0.7" />
                <path d="M120 258v8M280 258v8M126 259l-6 3 6 3M274 259l6 3-6 3" strokeOpacity="0.7" />
            </g>
            <text x="200" y="278" textAnchor="middle" fill="#fff" fillOpacity="0.75" fontSize="10" fontFamily="JetBrains Mono, monospace">Ø 160</text>
            <text x="18" y="22" fill="#fff" fillOpacity="0.8" fontSize="10" fontFamily="JetBrains Mono, monospace">FIG. {fig}</text>
            <rect x="300" y="268" width="88" height="22" fill="none" stroke="#fff" strokeOpacity="0.5" />
            <line x1="340" y1="268" x2="340" y2="290" stroke="#fff" strokeOpacity="0.5" />
            <g className="cos-ill-orb">
                {art.main === 'logo'
                    ? <Center art={art} cx={200} cy={146} size={56} />
                    : <Glyph name={art.main} cx={200} cy={146} size={96} color="#fff" strokeWidth={0.9} />}
            </g>
            {pts.map(([x, y], i) => {
                const elbowX = x < 200 ? x + 40 : x - 40;
                return (
                    <g key={i}>
                        <path d={`M${x + (x < 200 ? 15 : -15)} ${y} H${elbowX} L${200 + (x < 200 ? -1 : 1) * 56} ${146 + (y < 146 ? -1 : 1) * 40}`} fill="none" stroke="#fff" strokeOpacity="0.45" />
                        <circle cx={x} cy={y} r="15" fill={base} stroke="#fff" strokeOpacity="0.85" />
                        <Glyph name={art.nodes[i]} cx={x} cy={y} size={15} color="#fff" strokeWidth={1.5} />
                        <text x={x} y={y + 28} textAnchor="middle" fill="#fff" fillOpacity="0.6" fontSize="8" fontFamily="JetBrains Mono, monospace">{String.fromCharCode(65 + i)}</text>
                    </g>
                );
            })}
        </>
    );
}

/* 6 ─ Isometric platform with floating app tile */
function IsoCube({ x, y, s, h, top, left, right }) {
    return (
        <g>
            <path d={`M${x} ${y - s / 2} L${x + s} ${y} L${x} ${y + s / 2} L${x - s} ${y}Z`} transform={`translate(0 ${-h})`} fill={top} />
            <path d={`M${x - s} ${y - h} L${x} ${y + s / 2 - h} L${x} ${y + s / 2} L${x - s} ${y}Z`} fill={left} />
            <path d={`M${x} ${y + s / 2 - h} L${x + s} ${y - h} L${x + s} ${y} L${x} ${y + s / 2}Z`} fill={right} />
        </g>
    );
}
export function IsoTheme({ art, pal, id, seed }) {
    const rnd = seeded(seed);
    const top = pal.dark ? mix(pal.bg[1], '#FFFFFF', 0.25) : '#FFFFFF';
    const left = pal.dark ? mix(pal.bg[1], pal.bg[0], 0.35) : mix(pal.bg[1], pal.ink, 0.15);
    const right = pal.dark ? mix(pal.bg[1], pal.bg[0], 0.65) : mix(pal.bg[1], pal.ink, 0.32);
    const cubes = [[128, 196, 18, 26], [272, 192, 16, 40], [222, 230, 14, 16], [168, 236, 12, 30]];
    const floaters = [[56, 70], [344, 64], [70, 150], [336, 140], [120, 34], [282, 28]];
    const tile = mix(pal.accent, pal.dark ? '#000000' : pal.ink, 0.2);
    return (
        <>
            <defs>
                <linearGradient id={id('bg')} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={pal.bg[0]} /><stop offset="1" stopColor={pal.bg[1]} /></linearGradient>
                <linearGradient id={id('tile')} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={pal.accent} /><stop offset="1" stopColor={tile} /></linearGradient>
            </defs>
            <rect {...BG} fill={`url(#${id('bg')})`} />
            {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={-150 + rnd() * 700} cy={rnd() * 300} r={1 + rnd() * 1.6} fill={pal.dark ? '#fff' : pal.ink} opacity="0.18" />)}
            <IsoCube x={200} y={206} s={112} h={18} top={top} left={left} right={right} />
            <ellipse cx="200" cy="190" rx="38" ry="12" fill="#000" opacity="0.16" />
            {cubes.map(([x, y, s, h], i) => (
                <g key={i}>
                    <IsoCube x={x} y={y - 18} s={s} h={h} top={i % 2 ? pal.soft : mix(pal.accent, '#FFFFFF', 0.35)} left={mix(i % 2 ? pal.soft : pal.accent, '#000000', 0.2)} right={mix(i % 2 ? pal.soft : pal.accent, '#000000', 0.38)} />
                </g>
            ))}
            <g className="cos-ill-orb">
                <rect x="160" y="74" width="80" height="80" rx="20" fill="#000" opacity="0.12" transform="translate(4 8)" />
                <rect x="160" y="74" width="80" height="80" rx="20" fill={`url(#${id('tile')})`} />
                <rect x="160.5" y="74.5" width="79" height="79" rx="19.5" fill="none" stroke="#fff" strokeOpacity="0.45" />
                <Center art={art} cx={200} cy={114} size={42} color="#fff" />
            </g>
            {art.nodes.map((n, i) => {
                const [x, y] = floaters[i % floaters.length];
                return (
                    <g key={i} className="cos-ill-node" style={{ animationDelay: `${i * 0.5}s` }}>
                        <rect x={x - 17} y={y - 17} width="34" height="34" rx="10" fill={pal.dark ? '#FFFFFF' : '#FFFFFF'} fillOpacity={pal.dark ? 0.14 : 0.85} stroke={pal.dark ? '#fff' : pal.soft} strokeOpacity="0.7" />
                        <Glyph name={n} cx={x} cy={y} size={17} color={pal.dark ? '#fff' : pal.ink} strokeWidth={1.8} />
                    </g>
                );
            })}
        </>
    );
}

/* 7 ─ Frosted glass tiles over soft colour blobs */
export function GlassTheme({ art, pal, id, seed }) {
    const rnd = seeded(seed);
    const blobs = [[90, 80, 120, pal.accent], [320, 70, 110, pal.soft], [250, 250, 140, pal.bg[1]], [40, 260, 110, mix(pal.accent, pal.soft, 0.5)]];
    const ink = pal.dark ? '#fff' : pal.ink;
    const tiles = [[70, 74, -8], [330, 82, 7], [86, 210, 6], [318, 214, -6], [140, 34, 4], [262, 30, -5]];
    return (
        <>
            <defs>
                {blobs.map((b, i) => <SoftDot key={i} id={id(`g${i}`)} color={b[3]} />)}
                <linearGradient id={id('glass')} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.45" /><stop offset="1" stopColor="#fff" stopOpacity="0.1" /></linearGradient>
            </defs>
            <rect {...BG} fill={pal.bg[0]} />
            {blobs.map(([x, y, r], i) => <circle key={i} cx={x + (rnd() - 0.5) * 30} cy={y} r={r} fill={`url(#${id(`g${i}`)})`} opacity="0.9" />)}
            {art.nodes.map((n, i) => {
                const [x, y, rot] = tiles[i % tiles.length];
                return (
                    <g key={i} className="cos-ill-node" style={{ animationDelay: `${i * 0.6}s` }} transform={`rotate(${rot} ${x} ${y})`}>
                        <rect x={x - 22} y={y - 22} width="44" height="44" rx="13" fill={`url(#${id('glass')})`} stroke="#fff" strokeOpacity="0.6" />
                        <Glyph name={n} cx={x} cy={y} size={20} color={ink} strokeWidth={1.8} />
                    </g>
                );
            })}
            <g className="cos-ill-orb">
                <rect x="144" y="76" width="112" height="112" rx="28" fill="#000" opacity="0.08" transform="translate(4 8)" />
                <rect x="144" y="76" width="112" height="112" rx="28" fill={`url(#${id('glass')})`} stroke="#fff" strokeOpacity="0.75" strokeWidth="1.5" />
                <path d="M160 92 Q200 82 240 92" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" />
                <Center art={art} cx={200} cy={132} size={52} color={ink} strokeWidth={1.5} />
            </g>
            <Sparkle x={262} y={66} s={7} color="#fff" />
            <Sparkle x={128} y={204} s={5} color="#fff" opacity={0.7} />
        </>
    );
}

/* 8 ─ Circuit board with a central chip */
export function CircuitTheme({ art, pal, id, seed }) {
    const rnd = seeded(seed);
    const base = pal.dark ? pal.bg[0] : mix(pal.ink, '#000000', 0.35);
    const trace = pal.accent;
    const pts = pickSlots(rnd, art.nodes.length);
    // Right-angled traces from the nearest side of the chip to each component.
    const path = ([x, y]) => {
        if (x < 160 || x > 240) {
            const sx = x < 160 ? 156 : 244;
            const sy = Math.max(108, Math.min(164, y));
            const mx = (sx + x) / 2;
            return `M${sx} ${sy} H${mx} V${y} H${x}`;
        }
        const sx = Math.max(170, Math.min(230, x));
        const sy = y < 136 ? 98 : 174;
        const my = (sy + y) / 2;
        return `M${sx} ${sy} V${my} H${x} V${y}`;
    };
    return (
        <>
            <defs>
                <linearGradient id={id('bg')} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={base} /><stop offset="1" stopColor={mix(base, pal.bg[1], 0.35)} /></linearGradient>
                <pattern id={id('dots')} width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="0.9" fill="#fff" fillOpacity="0.1" /></pattern>
                <linearGradient id={id('chip')} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={mix(base, '#FFFFFF', 0.18)} /><stop offset="1" stopColor={mix(base, '#000000', 0.3)} /></linearGradient>
            </defs>
            <rect {...BG} fill={`url(#${id('bg')})`} />
            <rect {...BG} fill={`url(#${id('dots')})`} />
            {Array.from({ length: 10 }, (_, i) => {
                const y = 20 + rnd() * 260, x = -100 + rnd() * 600;
                return <path key={i} d={`M${x} ${y} h${30 + rnd() * 60} l12 12 h${20 + rnd() * 40}`} fill="none" stroke={trace} strokeOpacity="0.12" strokeWidth="2" />;
            })}
            <g fill="none" strokeLinejoin="round">
                {pts.map((p, i) => <path key={`g${i}`} d={path(p)} stroke={trace} strokeOpacity="0.18" strokeWidth="7" />)}
                {pts.map((p, i) => <path key={`t${i}`} d={path(p)} stroke={trace} strokeOpacity="0.9" strokeWidth="2" />)}
            </g>
            <g className="cos-ill-orb">
                {[0, 1, 2, 3, 4, 5].map(i => (
                    <g key={i} fill={mix(trace, '#FFFFFF', 0.3)}>
                        <rect x={164 + i * 13} y="92" width="6" height="8" rx="1" />
                        <rect x={164 + i * 13} y="172" width="6" height="8" rx="1" />
                        <rect x="148" y={108 + i * 11} width="8" height="6" rx="1" />
                        <rect x="244" y={108 + i * 11} width="8" height="6" rx="1" />
                    </g>
                ))}
                <rect x="156" y="98" width="88" height="76" rx="10" fill={`url(#${id('chip')})`} stroke={trace} strokeOpacity="0.7" />
                <rect x="166" y="106" width="68" height="60" rx="6" fill="none" stroke="#fff" strokeOpacity="0.12" />
                <Center art={art} cx={200} cy={136} size={38} color="#fff" />
            </g>
            {pts.map(([x, y], i) => (
                <g key={i} className="cos-ill-node" style={{ animationDelay: `${i * 0.5}s` }}>
                    <rect x={x - 16} y={y - 16} width="32" height="32" rx="7" fill={mix(base, '#000000', 0.2)} stroke={pal.soft} strokeOpacity="0.8" />
                    <circle cx={x - 16} cy={y} r="2.5" fill={trace} />
                    <Glyph name={art.nodes[i]} cx={x} cy={y} size={16} color={pal.soft} strokeWidth={1.8} />
                </g>
            ))}
        </>
    );
}

/* 9 ─ Underwater bubbles with light rays */
export function BubbleTheme({ art, pal, id, seed }) {
    const rnd = seeded(seed);
    const ink = pal.dark ? '#fff' : pal.ink;
    const pts = pickSlots(rnd, art.nodes.length);
    const tiny = Array.from({ length: 22 }, () => ({ x: -120 + rnd() * 640, y: rnd() * 300, r: 1.5 + rnd() * 4 }));
    return (
        <>
            <defs>
                <linearGradient id={id('bg')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={pal.dark ? pal.bg[1] : pal.bg[0]} /><stop offset="1" stopColor={pal.dark ? pal.bg[0] : pal.bg[1]} /></linearGradient>
                <radialGradient id={id('bub')} cx="0.35" cy="0.3" r="0.75"><stop offset="0" stopColor="#fff" stopOpacity="0.35" /><stop offset="0.6" stopColor="#fff" stopOpacity="0.06" /><stop offset="1" stopColor={pal.accent} stopOpacity="0.25" /></radialGradient>
            </defs>
            <rect {...BG} fill={`url(#${id('bg')})`} />
            {[-60, 40, 150, 260, 380].map((x, i) => <path key={i} d={`M${x} -10 L${x + 40} -10 L${x + 120} 320 L${x + 30} 320 Z`} fill="#fff" opacity={0.05 + (i % 2) * 0.04} />)}
            {tiny.map((b, i) => <circle key={i} cx={b.x} cy={b.y} r={b.r} fill="none" stroke="#fff" strokeOpacity="0.45" />)}
            <g className="cos-ill-orb">
                <circle cx="200" cy="146" r="56" fill={`url(#${id('bub')})`} stroke="#fff" strokeOpacity="0.75" strokeWidth="1.5" />
                <circle cx="200" cy="146" r="53" fill="none" stroke={pal.accent} strokeOpacity="0.35" strokeWidth="3" />
                <path d="M164 122 A42 42 0 0 1 196 100" fill="none" stroke="#fff" strokeOpacity="0.85" strokeWidth="3" strokeLinecap="round" />
                <circle cx="230" cy="114" r="3" fill="#fff" opacity="0.8" />
                <Center art={art} cx={200} cy={150} size={42} color={ink} strokeWidth={1.7} />
            </g>
            {pts.map(([x, y], i) => {
                const r = 15 + (i % 3) * 4;
                return (
                    <g key={i} className="cos-ill-node" style={{ animationDelay: `${i * 0.7}s` }}>
                        <circle cx={x} cy={y} r={r} fill={`url(#${id('bub')})`} stroke="#fff" strokeOpacity="0.7" />
                        <path d={`M${x - r * 0.6} ${y - r * 0.2} A${r * 0.7} ${r * 0.7} 0 0 1 ${x - r * 0.1} ${y - r * 0.68}`} fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="1.5" strokeLinecap="round" />
                        <Glyph name={art.nodes[i]} cx={x} cy={y} size={r * 0.95} color={ink} strokeWidth={1.8} />
                    </g>
                );
            })}
        </>
    );
}

/* 10 ─ Retro poster badge with sunburst */
export function PosterTheme({ art, pal, id }) {
    const ink = pal.dark ? '#fff' : pal.ink;
    const paper = pal.dark ? pal.bg[0] : pal.bg[0];
    const C = { x: 200, y: 140 };
    const rays = Array.from({ length: 18 }, (_, i) => {
        const a1 = (i * 2 * Math.PI) / 18, a2 = a1 + Math.PI / 18;
        return `M${C.x} ${C.y} L${C.x + Math.cos(a1) * 420} ${C.y + Math.sin(a1) * 420} L${C.x + Math.cos(a2) * 420} ${C.y + Math.sin(a2) * 420}Z`;
    });
    const around = art.nodes.map((n, i) => {
        const a = -Math.PI / 2 + ((i + 0.5) / art.nodes.length) * Math.PI * 2;
        return { n, x: C.x + Math.cos(a) * 98, y: C.y + Math.sin(a) * 82 };
    });
    return (
        <>
            <defs>
                <radialGradient id={id('bg')} cx="0.5" cy="0.45" r="0.7"><stop offset="0" stopColor={mix(paper, pal.bg[1], 0.35)} /><stop offset="1" stopColor={paper} /></radialGradient>
            </defs>
            <rect {...BG} fill={`url(#${id('bg')})`} />
            <g fill={pal.accent} opacity={pal.dark ? 0.16 : 0.2}>{rays.map((d, i) => <path key={i} d={d} />)}</g>
            <rect x="12" y="12" width="376" height="276" rx="8" fill="none" stroke={ink} strokeOpacity="0.25" strokeWidth="1.5" />
            <g className="cos-ill-orb">
                <circle cx={C.x} cy={C.y} r="64" fill={pal.accent} />
                <circle cx={C.x} cy={C.y} r="56" fill={paper} />
                <circle cx={C.x} cy={C.y} r="50" fill="none" stroke={ink} strokeOpacity="0.4" strokeDasharray="2 4" />
                <Center art={art} cx={C.x} cy={C.y} size={50} color={ink} strokeWidth={1.7} plate={false} />
            </g>
            <path d={`M${C.x - 92} 214 h184 l-10 13 10 13 h-184 l10 -13z`} fill={pal.dark ? pal.accent : pal.ink} />
            {[-24, 0, 24].map(dx => <path key={dx} d={`M${C.x + dx} 220 l2.4 5 5.4.6-4 3.7 1.1 5.3-4.9-2.8-4.9 2.8 1.1-5.3-4-3.7 5.4-.6z`} fill={paper} />)}
            {around.map((p, i) => (
                <g key={i} className="cos-ill-node" style={{ animationDelay: `${i * 0.5}s` }}>
                    <circle cx={p.x} cy={p.y} r="15" fill={paper} stroke={ink} strokeOpacity="0.55" strokeWidth="1.5" />
                    <Glyph name={p.n} cx={p.x} cy={p.y} size={15} color={ink} strokeWidth={1.9} />
                </g>
            ))}
        </>
    );
}
