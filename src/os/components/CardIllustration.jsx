import { memo, useId } from 'react';
import {
    HubTheme, OrbitTheme, NeonTheme, PaperTheme, BlueprintTheme, IsoTheme, GlassTheme, CircuitTheme, BubbleTheme, PosterTheme,
} from '../illustration/themes';
import { PALETTES } from '../illustration/palettes';

const THEMES = {
    hub: HubTheme,
    orbit: OrbitTheme,
    neon: NeonTheme,
    paper: PaperTheme,
    blueprint: BlueprintTheme,
    iso: IsoTheme,
    glass: GlassTheme,
    circuit: CircuitTheme,
    bubbles: BubbleTheme,
    poster: PosterTheme,
};

/** Code-drawn card art. Each card's `art` picks a style (`theme`) and a `palette`. */
function CardIllustration({ card, wide = false, className = '' }) {
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
    const art = card.art || { main: 'Sparkles', nodes: [], theme: 'hub', palette: 'violet' };
    const Theme = THEMES[art.theme] || HubTheme;
    const pal = PALETTES[art.palette] || PALETTES.violet;
    const id = (s) => `${uid}-${s}`;

    return (
        <svg className={`cos-ill ${className}`} viewBox={wide ? '-100 0 600 300' : '0 0 400 300'}
            preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
            <Theme art={art} pal={pal} id={id} seed={card.id || card.title} />
        </svg>
    );
}

export default memo(CardIllustration);
