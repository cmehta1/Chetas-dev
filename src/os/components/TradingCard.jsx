import { useRef } from 'react';
import { CARD_KIND_LABEL } from '../data';
import CardIllustration from './CardIllustration';

/* A collectible card. Tilts toward the pointer (or the phone's tilt, via `tilt`),
   with a holographic sheen. Tapping the front flips it; the back has a short write-up
   and a button that opens the full detail view. */
export default function TradingCard({ card, flipped, onFlip, onOpen, tilt, interactive = true, style, className = '' }) {
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

    const kindLabel = CARD_KIND_LABEL[card.kind];
    const frontFocusable = interactive && !flipped;
    const backFocusable = interactive && flipped;

    return (
        <div
            ref={ref}
            className={`cos-card cos-card-${card.kind} ${flipped ? 'is-flipped' : ''} ${tilt ? 'is-tilting' : ''} ${className}`}
            style={{ ...style, ...tiltStyle }}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
        >
            <div className="cos-card-inner">
                {/* front */}
                <button
                    type="button"
                    className="cos-card-face cos-card-front"
                    onClick={onFlip}
                    tabIndex={frontFocusable ? 0 : -1}
                    aria-hidden={flipped}
                    aria-label={`${card.title}. ${kindLabel}${card.subtitle ? `, ${card.subtitle}` : ''}. Flip for details.`}
                >
                    <span className="cos-card-top">
                        <span className="cos-card-title">{card.title}</span>
                        {card.year && <span className="cos-card-year">{card.year}</span>}
                    </span>
                    <span className="cos-card-art-wrap">
                        <CardIllustration card={card} />
                        {card.badge && <span className="cos-card-badge">{card.badge}</span>}
                    </span>
                    <span className="cos-card-type">
                        <span>{kindLabel}</span>
                        {card.subtitle && <span className="cos-card-type-sub">· {card.subtitle}</span>}
                    </span>
                    <span className="cos-card-text">{card.summary}</span>
                    <span className="cos-card-foot">
                        <span className="cos-card-set">◆ CHETAS</span>
                        <span className="cos-card-num">{card.number}</span>
                    </span>
                    <span className="cos-card-shine" />
                    <span className="cos-card-glare" />
                </button>

                {/* back */}
                <div className="cos-card-face cos-card-back" aria-hidden={!flipped}>
                    <span className="cos-card-back-title">{card.title}</span>
                    {card.subtitle && <span className="cos-card-back-sub">{card.subtitle}</span>}
                    <span className="cos-card-back-desc">{card.description || card.summary}</span>
                    <dl className="cos-card-back-facts">
                        {card.facts.slice(0, 3).map(f => (
                            <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
                        ))}
                    </dl>
                    <span className="cos-card-back-actions">
                        <button type="button" className="cos-card-more" onClick={onOpen} tabIndex={backFocusable ? 0 : -1}>
                            Full details
                        </button>
                        <button type="button" className="cos-card-flipback" onClick={onFlip} tabIndex={backFocusable ? 0 : -1} aria-label="Flip back">
                            ↺
                        </button>
                    </span>
                </div>
            </div>
        </div>
    );
}
