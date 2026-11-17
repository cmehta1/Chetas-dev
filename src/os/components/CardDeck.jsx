import { useEffect, useRef, useState } from 'react';
import TradingCard from './TradingCard';
import Icon from './Icons';

const SWIPE_AT = 90;

function needsTiltPermission() {
    return typeof window.DeviceOrientationEvent !== 'undefined'
        && typeof window.DeviceOrientationEvent.requestPermission === 'function';
}

/** Phone tilt → {x, y} in 0..1, smoothed with rAF. Only active when `enabled`. */
function useDeviceTilt(enabled) {
    const [tilt, setTilt] = useState(null);
    useEffect(() => {
        if (!enabled || typeof window.DeviceOrientationEvent === 'undefined') return undefined;
        let base = null;
        let frame = 0;
        let latest = null;
        const onOrient = (e) => {
            if (e.beta == null || e.gamma == null) return;
            if (base == null) base = e.beta;
            latest = {
                x: Math.min(1, Math.max(0, 0.5 + e.gamma / 50)),
                y: Math.min(1, Math.max(0, 0.5 + (e.beta - base) / 50)),
            };
            if (!frame) frame = requestAnimationFrame(() => { frame = 0; setTilt(latest); });
        };
        window.addEventListener('deviceorientation', onOrient);
        return () => {
            window.removeEventListener('deviceorientation', onOrient);
            cancelAnimationFrame(frame);
            setTilt(null);
        };
    }, [enabled]);
    return tilt;
}

export default function CardDeck({ cards, heading, intro, mobile }) {
    const [view, setView] = useState(mobile ? 'stack' : 'grid');
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(() => new Set());
    const [dx, setDx] = useState(0);
    const [leaving, setLeaving] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [tiltOn, setTiltOn] = useState(() => mobile && !needsTiltPermission());
    const drag = useRef(null);
    const moved = useRef(false);
    const deckRef = useRef(null);

    const tilt = useDeviceTilt(tiltOn && view === 'stack');
    const n = cards.length;

    const toggleFlip = (id) => setFlipped(s => {
        const next = new Set(s);
        if (next.has(id)) next.delete(id); else next.add(id);
        return next;
    });

    const go = (dir) => {
        if (leaving) return;
        setLeaving(dir);
        setTimeout(() => {
            setIndex(i => (i + (dir > 0 ? 1 : -1) + n) % n);
            setLeaving(0);
            setDx(0);
            setFlipped(new Set());
        }, 230);
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
        if (Math.abs(dx) > SWIPE_AT) go(dx < 0 ? 1 : -1);
        else setDx(0);
    };

    const onKeyDown = (e) => {
        if (view !== 'stack') return;
        if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    };

    const enableTilt = async () => {
        try {
            const res = await window.DeviceOrientationEvent.requestPermission();
            if (res === 'granted') setTiltOn(true);
        } catch { /* user declined or unsupported */ }
    };

    const stack = [0, 1, 2].map(o => cards[(index + o) % n]).filter((c, i, arr) => arr.indexOf(c) === i);

    return (
        <div className="cos-app cos-deck" ref={deckRef}>
            <header className="cos-deck-head">
                <div>
                    <p className="cos-kicker">{n} cards</p>
                    <h1>{heading}</h1>
                    <p className="cos-app-sub">{intro}</p>
                </div>
                <div className="cos-deck-tools">
                    {mobile && view === 'stack' && !tiltOn && needsTiltPermission() && (
                        <button type="button" className="cos-pill" onClick={enableTilt}>
                            <Icon name="sparkle" size={14} /> Tilt
                        </button>
                    )}
                    <div className="cos-seg" role="group" aria-label="Deck view">
                        <button type="button" aria-pressed={view === 'stack'} onClick={() => setView('stack')}>
                            <Icon name="stack" size={15} /> <span>Stack</span>
                        </button>
                        <button type="button" aria-pressed={view === 'grid'} onClick={() => setView('grid')}>
                            <Icon name="grid" size={15} /> <span>All</span>
                        </button>
                    </div>
                </div>
            </header>

            {view === 'grid' ? (
                <div className="cos-deck-grid">
                    {cards.map(c => (
                        <TradingCard key={c.id} card={c} flipped={flipped.has(c.id)} onFlip={() => toggleFlip(c.id)} />
                    ))}
                </div>
            ) : (
                <div className="cos-deck-stage" tabIndex={0} onKeyDown={onKeyDown} aria-roledescription="carousel"
                    aria-label={`${heading}: card ${index + 1} of ${n}. Use arrow keys or swipe.`}>
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
                            const offX = isTop ? (leaving ? leaving * -560 : dx) : 0;
                            const rot = isTop ? offX * 0.05 : 0;
                            return (
                                <div
                                    key={c.id}
                                    className={`cos-deck-slot ${isTop ? 'is-top' : ''} ${isTop && (dx || leaving) ? 'is-dragging' : ''}`}
                                    style={{
                                        '--depth': depth,
                                        transform: `translateX(${offX}px) rotate(${rot}deg) translateY(${depth * 14}px) scale(${1 - depth * 0.05})`,
                                        opacity: isTop && leaving ? 0 : 1,
                                        transition: isTop && dragging ? 'none' : undefined,
                                    }}
                                    aria-hidden={!isTop}
                                >
                                    <TradingCard
                                        card={c}
                                        interactive={isTop}
                                        flipped={isTop && flipped.has(c.id)}
                                        onFlip={() => isTop && toggleFlip(c.id)}
                                        tilt={isTop ? tilt : null}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <div className="cos-deck-nav">
                        <button type="button" aria-label="Previous card" onClick={() => go(-1)}><Icon name="chevronLeft" size={20} /></button>
                        <span className="cos-deck-count">{index + 1} / {n}</span>
                        <button type="button" aria-label="Next card" onClick={() => go(1)}><Icon name="chevronRight" size={20} /></button>
                    </div>
                    <p className="cos-deck-hint">{mobile ? 'Swipe to deal · tap to flip' : 'Drag or use ← → · click to flip'}</p>
                </div>
            )}
        </div>
    );
}
