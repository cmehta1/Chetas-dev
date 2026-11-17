import { useCallback, useEffect, useRef, useState } from 'react';
import TradingCard from './TradingCard';
import CardDetail from './CardDetail';
import Icon from './Icons';

const SWIPE_AT = 80;
const GYRO_MAX_X = 6;  // degrees, gentler than the desktop pointer tilt
const GYRO_MAX_Y = 8;

/* Phone tilt for every card in the deck. Writes CSS variables on the deck element each
   frame (no React re-renders); cards read them in CSS. On iPhone the system asks for
   motion access once, on the first tap inside the deck. */
function useDeckGyro(deckRef, enabled) {
    useEffect(() => {
        const deck = deckRef.current;
        const DOE = window.DeviceOrientationEvent;
        if (!enabled || !deck || typeof DOE === 'undefined') return undefined;

        let base = null;
        let frame = 0;
        const target = { x: 0, y: 0 };
        const cur = { x: 0, y: 0 };
        const tick = () => {
            cur.x += (target.x - cur.x) * 0.15;
            cur.y += (target.y - cur.y) * 0.15;
            deck.style.setProperty('--gy', `${(cur.x * GYRO_MAX_Y).toFixed(2)}deg`);
            deck.style.setProperty('--gx', `${(-cur.y * GYRO_MAX_X).toFixed(2)}deg`);
            deck.style.setProperty('--gmx', `${(50 + cur.x * 45).toFixed(1)}%`);
            deck.style.setProperty('--gmy', `${(50 + cur.y * 45).toFixed(1)}%`);
            frame = Math.abs(target.x - cur.x) + Math.abs(target.y - cur.y) > 0.002 ? requestAnimationFrame(tick) : 0;
        };
        const onOrient = (e) => {
            if (e.beta == null || e.gamma == null) return;
            if (base == null) base = e.beta;
            target.x = Math.max(-1, Math.min(1, e.gamma / 30));
            target.y = Math.max(-1, Math.min(1, (e.beta - base) / 30));
            deck.classList.add('has-gyro');
            if (!frame) frame = requestAnimationFrame(tick);
        };
        const listen = () => window.addEventListener('deviceorientation', onOrient);

        let asked = false;
        const askOnce = () => {
            if (asked) return;
            asked = true;
            DOE.requestPermission().then(res => { if (res === 'granted') listen(); }).catch(() => {});
        };
        // iPhone only allows the request inside a tap (click), so ask on the first one.
        if (typeof DOE.requestPermission === 'function') deck.addEventListener('click', askOnce, { once: true, capture: true });
        else listen();

        return () => {
            deck.removeEventListener('click', askOnce, { capture: true });
            window.removeEventListener('deviceorientation', onOrient);
            cancelAnimationFrame(frame);
            deck.classList.remove('has-gyro');
        };
    }, [deckRef, enabled]);
}

export default function CardDeck({ cards: allCards, heading, intro, mobile }) {
    const [view, setView] = useState('grid');
    const [group, setGroup] = useState('All');
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(() => new Set());
    const [detailId, setDetailId] = useState(null);
    const [dx, setDx] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const [entering, setEntering] = useState(0); // bumps to replay the "slide back in" animation
    const [dragging, setDragging] = useState(false);
    const drag = useRef(null);
    const moved = useRef(false);
    const deckRef = useRef(null);

    useDeckGyro(deckRef, mobile && !detailId);

    const groups = ['All', ...new Set(allCards.map(c => c.group).filter(Boolean))];
    const cards = group === 'All' ? allCards : allCards.filter(c => c.group === group);
    const n = cards.length;

    const toggleFlip = (id) => setFlipped(s => {
        const next = new Set(s);
        if (next.has(id)) next.delete(id); else next.add(id);
        return next;
    });

    const pickGroup = (g) => {
        setGroup(g);
        setIndex(0);
        setFlipped(new Set());
    };

    /* ── detail view (Back button on phones closes it) ── */
    const openDetail = (id) => {
        if (mobile) window.history.pushState({ ...(window.history.state || {}), cosDetail: id }, '');
        setDetailId(id);
    };
    const closeDetail = useCallback(() => {
        if (mobile && window.history.state?.cosDetail) window.history.back();
        else setDetailId(null);
    }, [mobile]);
    useEffect(() => {
        if (!mobile) return undefined;
        const onPop = (e) => { if (!e.state?.cosDetail) setDetailId(null); };
        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
    }, [mobile]);

    const detailIndex = cards.findIndex(c => c.id === detailId);
    const stepDetail = useCallback((dir) => {
        if (detailIndex < 0) return;
        const next = cards[(detailIndex + dir + n) % n];
        if (mobile && window.history.state?.cosDetail) {
            window.history.replaceState({ ...window.history.state, cosDetail: next.id }, '');
        }
        setDetailId(next.id);
    }, [cards, detailIndex, n, mobile]);
    const prevDetail = useCallback(() => stepDetail(-1), [stepDetail]);
    const nextDetail = useCallback(() => stepDetail(1), [stepDetail]);

    /* ── stack: next = top card flies off to the left; previous = it slides back in ── */
    const next = () => {
        if (leaving || n < 2) return;
        setLeaving(true);
        setTimeout(() => {
            setIndex(i => (i + 1) % n);
            setLeaving(false);
            setDx(0);
            setFlipped(new Set());
        }, 230);
    };
    const prev = () => {
        if (leaving || n < 2) return;
        setIndex(i => (i - 1 + n) % n);
        setDx(0);
        setFlipped(new Set());
        setEntering(e => e + 1);
    };

    const onPointerDown = (e) => {
        if (leaving) return;
        drag.current = { x: e.clientX, id: e.pointerId };
        moved.current = false;
    };
    const onPointerMove = (e) => {
        const d = drag.current;
        if (!d || d.id !== e.pointerId) return;
        const delta = e.clientX - d.x;
        if (Math.abs(delta) > 6) {
            moved.current = true;
            setDragging(true);
            if (!e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.setPointerCapture(e.pointerId);
        }
        setDx(delta);
    };
    const onPointerUp = () => {
        if (!drag.current) return;
        drag.current = null;
        setDragging(false);
        if (dx < -SWIPE_AT) next();
        else if (dx > SWIPE_AT) prev();
        else setDx(0);
    };

    const onKeyDown = (e) => {
        if (view !== 'stack') return;
        if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    };

    const safeIndex = n ? index % n : 0;
    const stack = [0, 1, 2].map(o => cards[(safeIndex + o) % n]).filter((c, i, arr) => c && arr.indexOf(c) === i);
    const detailCard = detailIndex >= 0 ? cards[detailIndex] : null;

    return (
        <div className="cos-app cos-deck" ref={deckRef}>
            <header className="cos-deck-head">
                <div>
                    <p className="cos-kicker">{allCards.length} cards</p>
                    <h1>{heading}</h1>
                    <p className="cos-app-sub">{intro}</p>
                </div>
                <div className="cos-deck-tools">
                    <div className="cos-seg" role="group" aria-label="Deck view">
                        <button type="button" aria-pressed={view === 'grid'} onClick={() => setView('grid')}>
                            <Icon name="grid" size={15} /> <span>All</span>
                        </button>
                        <button type="button" aria-pressed={view === 'stack'} onClick={() => setView('stack')}>
                            <Icon name="stack" size={15} /> <span>Stack</span>
                        </button>
                    </div>
                </div>
            </header>

            {groups.length > 2 && (
                <div className="cos-filters" role="group" aria-label="Filter cards">
                    {groups.map(g => (
                        <button key={g} type="button" aria-pressed={group === g} onClick={() => pickGroup(g)}>
                            {g}
                            <span>{g === 'All' ? allCards.length : allCards.filter(c => c.group === g).length}</span>
                        </button>
                    ))}
                </div>
            )}

            {view === 'grid' ? (
                <div className="cos-deck-grid">
                    {cards.map(c => (
                        <TradingCard key={c.id} card={c} flipped={flipped.has(c.id)}
                            onFlip={() => toggleFlip(c.id)} onOpen={() => openDetail(c.id)} />
                    ))}
                </div>
            ) : (
                <div className="cos-deck-stage" tabIndex={0} onKeyDown={onKeyDown} aria-roledescription="carousel"
                    aria-label={`${heading}: card ${safeIndex + 1} of ${n}. Use arrow keys or swipe.`}>
                    <div
                        className="cos-deck-stack"
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerCancel={onPointerUp}
                        onClickCapture={(e) => { if (moved.current) { e.stopPropagation(); e.preventDefault(); moved.current = false; } }}
                    >
                        {stack.slice().reverse().map(c => {
                            const depth = stack.indexOf(c);
                            const isTop = depth === 0;
                            // Dragging left pulls the card away; dragging right only nudges it
                            // (letting go past the threshold brings the previous card back).
                            const drift = isTop ? (dx < 0 ? dx : dx * 0.25) : 0;
                            const offX = isTop && leaving ? -560 : drift;
                            const rot = isTop ? offX * 0.05 : 0;
                            return (
                                <div
                                    key={c.id}
                                    className={`cos-deck-slot ${isTop ? 'is-top' : ''}`}
                                    style={{
                                        '--depth': depth,
                                        transform: `translateX(${offX}px) rotate(${rot}deg) translateY(${depth * 14}px) scale(${1 - depth * 0.05})`,
                                        opacity: isTop && leaving ? 0 : 1,
                                        transition: isTop && dragging ? 'none' : undefined,
                                    }}
                                    aria-hidden={!isTop}
                                >
                                    <div key={isTop ? `enter-${entering}` : 'still'} className={isTop && entering ? 'cos-deck-enter' : undefined}>
                                        <TradingCard
                                            card={c}
                                            interactive={isTop}
                                            flipped={isTop && flipped.has(c.id)}
                                            onFlip={() => isTop && toggleFlip(c.id)}
                                            onOpen={() => openDetail(c.id)}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="cos-deck-nav">
                        <button type="button" aria-label="Previous card" onClick={prev}><Icon name="chevronLeft" size={20} /></button>
                        <span className="cos-deck-count">{safeIndex + 1} / {n}</span>
                        <button type="button" aria-label="Next card" onClick={next}><Icon name="chevronRight" size={20} /></button>
                    </div>
                    <p className="cos-deck-hint">{mobile ? 'Swipe left for next, right to go back · tap to flip' : 'Drag or use ← → · click to flip'}</p>
                </div>
            )}

            {detailCard && (
                <CardDetail
                    card={detailCard}
                    onClose={closeDetail}
                    onPrev={prevDetail}
                    onNext={nextDetail}
                    position={`${detailIndex + 1} / ${n}`}
                />
            )}
        </div>
    );
}
