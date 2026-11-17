import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icons';
import CardIllustration from './CardIllustration';
import { CARD_KIND_LABEL } from '../data';

/** Full write-up for one card, shown over the OS. Esc closes, ← → browse the current deck. */
export default function CardDetail({ card, onClose, onPrev, onNext, position }) {
    const closeRef = useRef(null);
    // Render inside the OS root so the OS theme variables apply.
    const host = document.querySelector('.cos-root');

    useEffect(() => {
        closeRef.current?.focus({ preventScroll: true });
    }, [card.id]);

    useEffect(() => {
        // Capture phase so Esc closes this view before the desktop closes the whole window.
        const onKey = (e) => {
            if (e.key === 'Escape') { e.stopPropagation(); onClose(); }
            else if (e.key === 'ArrowRight') { e.stopPropagation(); onNext(); }
            else if (e.key === 'ArrowLeft') { e.stopPropagation(); onPrev(); }
        };
        window.addEventListener('keydown', onKey, true);
        return () => window.removeEventListener('keydown', onKey, true);
    }, [onClose, onNext, onPrev]);

    const view = (
        <div className="cos-detail-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <article className={`cos-detail cos-detail-${card.kind}`} role="dialog" aria-modal="true" aria-label={card.title}>
                <div className="cos-detail-hero">
                    <CardIllustration card={card} wide className="cos-detail-art" />
                    <div className="cos-detail-hero-shade" />
                    <div className="cos-detail-nav">
                        <button type="button" onClick={onPrev} aria-label="Previous card"><Icon name="chevronLeft" size={18} /></button>
                        <span>{position}</span>
                        <button type="button" onClick={onNext} aria-label="Next card"><Icon name="chevronRight" size={18} /></button>
                    </div>
                    <button type="button" ref={closeRef} className="cos-detail-close" onClick={onClose} aria-label="Close details">
                        <Icon name="close" size={18} />
                    </button>
                    <div className="cos-detail-heading">
                        <p className="cos-kicker">{CARD_KIND_LABEL[card.kind]}{card.subtitle ? ` · ${card.subtitle}` : ''}</p>
                        <h2>{card.title}</h2>
                    </div>
                </div>

                <div className="cos-detail-body">
                    {card.summary && <p className="cos-detail-lead">{card.summary}</p>}
                    {card.description && card.description !== card.summary && (
                        <p className="cos-detail-desc">{card.description}</p>
                    )}

                    {card.link && (
                        <a className="cos-btn cos-btn-primary cos-detail-link" href={card.link} target="_blank" rel="noopener noreferrer">
                            Visit {card.link.replace(/^https?:\/\//, '')} <Icon name="external" size={14} />
                        </a>
                    )}

                    <dl className="cos-detail-facts">
                        {card.facts.map(f => (
                            <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
                        ))}
                        {card.badge && <div><dt>Highlight</dt><dd>{card.badge}</dd></div>}
                    </dl>

                    {card.bullets.length > 0 && (
                        <section>
                            <h3>{card.kind === 'experience' ? 'What I did' : 'Highlights'}</h3>
                            <ul className="cos-bullets">
                                {card.bullets.map((b, i) => <li key={i}>{b}</li>)}
                            </ul>
                        </section>
                    )}

                    {card.story?.length > 0 && (
                        <section>
                            <h3>The story</h3>
                            {card.story.map(s => (
                                <div key={s.title} className="cos-detail-story">
                                    <h4>{s.title}</h4>
                                    <p>{s.text}</p>
                                </div>
                            ))}
                        </section>
                    )}

                    {card.stack.length > 0 && (
                        <section>
                            <h3>{card.kind === 'cert' ? 'Topics' : 'Stack'}</h3>
                            <div className="cos-chips">
                                {card.stack.map(s => <span key={s} className="cos-chip">{s}</span>)}
                            </div>
                        </section>
                    )}

                </div>
            </article>
        </div>
    );

    return host ? createPortal(view, host) : view;
}
