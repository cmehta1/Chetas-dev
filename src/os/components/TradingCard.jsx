import { useRef } from 'react';
import { CARD_KIND_LABEL } from '../data';

/* A collectible card. Tilts toward the pointer (or the phone's tilt, via `tilt` prop),
   with a holographic sheen that follows. Click / tap flips it to the details side. */
export default function TradingCard({ card, flipped, onFlip, tilt, interactive = true, style, className = '' }) {
    const ref = useRef(null);

    const setTilt = (px, py) => {
        const el = ref.current;
        if (!el) return;
        el.style.setProperty('--rx', `${(0.5 - py) * 16}deg`);
        el.style.setProperty('--ry', `${(px - 0.5) * 20}deg`);
        el.style.setProperty('--mx', `${px * 100}%`);
        el.style.setProperty('--my', `${py * 100}%`);
        el.style.setProperty('--hyp', `${Math.min(1, Math.hypot(px - 0.5, py - 0.5) * 2)}`);
    };

    const onPointerMove = (e) => {
        if (!interactive || e.pointerType === 'touch') return;
        const r = ref.current.getBoundingClientRect();
        setTilt((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
        ref.current.classList.add('is-tilting');
    };
    const onPointerLeave = () => {
        const el = ref.current;
        if (!el) return;
        el.classList.remove('is-tilting');
        ['--rx', '--ry', '--mx', '--my', '--hyp'].forEach(p => el.style.removeProperty(p));
    };

    const tiltStyle = tilt ? {
        '--rx': `${(0.5 - tilt.y) * 16}deg`,
        '--ry': `${(tilt.x - 0.5) * 20}deg`,
        '--mx': `${tilt.x * 100}%`,
        '--my': `${tilt.y * 100}%`,
        '--hyp': Math.min(1, Math.hypot(tilt.x - 0.5, tilt.y - 0.5) * 2),
    } : null;

    return (
        <div
            ref={ref}
            className={`cos-card cos-card-${card.kind} ${flipped ? 'is-flipped' : ''} ${tilt ? 'is-tilting' : ''} ${className}`}
            style={{ ...style, ...tiltStyle }}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
        >
            <button
                type="button"
                className="cos-card-inner"
                onClick={onFlip}
                aria-pressed={!!flipped}
                aria-label={`${card.title}, ${CARD_KIND_LABEL[card.kind]} card. ${flipped ? 'Showing details' : 'Flip for details'}`}
                tabIndex={interactive ? 0 : -1}
            >
                {/* front */}
                <span className="cos-card-face cos-card-front">
                    <span className="cos-card-top">
                        <span className="cos-card-title">{card.title}</span>
                        {card.year && <span className="cos-card-year">{card.year}</span>}
                    </span>
                    <span className="cos-card-art">
                        <span className="cos-card-art-pattern" />
                        <span className="cos-card-emoji">{card.icon}</span>
                        {card.badge && <span className="cos-card-badge">{card.badge}</span>}
                    </span>
                    <span className="cos-card-type">
                        <span>{CARD_KIND_LABEL[card.kind]}</span>
                        {card.subtitle && <span className="cos-card-type-sub">· {card.subtitle}</span>}
                    </span>
                    <span className="cos-card-text">{card.flavor || card.bullets[0] || ''}</span>
                    <span className="cos-card-foot">
                        <span className="cos-card-set">◆ CHETAS</span>
                        <span className="cos-card-num">{card.number}</span>
                    </span>
                    <span className="cos-card-shine" />
                    <span className="cos-card-glare" />
                </span>

                {/* back */}
                <span className="cos-card-face cos-card-back">
                    <span className="cos-card-back-title">{card.title}</span>
                    {card.subtitle && <span className="cos-card-back-sub">{card.subtitle}{card.year ? ` · ${card.year}` : ''}</span>}
                    {card.bullets.length > 0 && (
                        <span className="cos-card-back-list">
                            {card.bullets.map((b, i) => <span key={i} className="cos-card-back-li">{b}</span>)}
                        </span>
                    )}
                    {card.flavor && <span className="cos-card-back-flavor">{card.flavor}</span>}
                    {card.stack.length > 0 && (
                        <span className="cos-card-back-chips">
                            {card.stack.map(s => <span key={s}>{s}</span>)}
                        </span>
                    )}
                    <span className="cos-card-back-hint">tap to flip back</span>
                </span>
            </button>
        </div>
    );
}
