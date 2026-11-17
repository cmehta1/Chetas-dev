import { useRef } from 'react';
import { CARD_KIND_LABEL } from '../data';
import CardIllustration from './CardIllustration';

/* A collectible card, built from three layers:
   .cos-card       – perspective + pointer handling
   .cos-card-tilt  – tilt toward the pointer (desktop) or phone tilt (deck-wide CSS vars)
   .cos-card-inner – the flip, animated on its own so tilt updates never interrupt it.
   A flipped card lies flat so its back is easy to read. */

const MAX_X = 7;   // degrees
const MAX_Y = 9;

export default function TradingCard({ card, flipped, onFlip, onOpen, interactive = true, style, className = '' }) {
    const ref = useRef(null);

    const onPointerMove = (e) => {
        if (!interactive || e.pointerType === 'touch' || flipped) return;
        const el = ref.current;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--rx', `${(0.5 - py) * MAX_X * 2}deg`);
        el.style.setProperty('--ry', `${(px - 0.5) * MAX_Y * 2}deg`);
        el.style.setProperty('--mx', `${px * 100}%`);
        el.style.setProperty('--my', `${py * 100}%`);
        el.classList.add('is-hovered');
    };
    const onPointerLeave = () => {
        const el = ref.current;
        if (!el) return;
        el.classList.remove('is-hovered');
        ['--rx', '--ry', '--mx', '--my'].forEach(p => el.style.removeProperty(p));
    };

    const kindLabel = CARD_KIND_LABEL[card.kind];
    const frontFocusable = interactive && !flipped;
    const backFocusable = interactive && flipped;

    return (
        <div
            ref={ref}
            className={`cos-card cos-card-${card.kind} ${flipped ? 'is-flipped' : ''} ${className}`}
            style={style}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
        >
            <div className="cos-card-tilt">
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
                            <span className="cos-card-shine" />
                            <span className="cos-card-glare" />
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
        </div>
    );
}
