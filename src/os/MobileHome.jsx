import { useCallback, useEffect, useRef, useState } from 'react';
import Wallpaper from './components/Wallpaper';
import HeroCharacter from './components/HeroCharacter';
import AppIcon from './components/AppIcon';
import Icon from './components/Icons';
import { Avatar, Walker } from './components/Avatar';
import AppContent from './AppContent';
import { APPS, MOBILE_DOCK, MOBILE_PAGES, openExternal } from './apps';
import { PROFILE, JOURNEY_STOPS, yearsOfExperience } from './data';
import { useClock, prefetchGame } from './hooks';

function AppGrid({ ids, onOpen }) {
    return (
        <div className="cos-m-grid">
            {ids.map(id => (
                <button key={id} type="button" className="cos-m-app" onClick={() => onOpen(id)}
                    onTouchStart={APPS[id].game ? prefetchGame : undefined}>
                    <span className="cos-m-app-icon">
                        <AppIcon id={id} size={60} />
                        {APPS[id].url && <span className="cos-m-app-link" aria-hidden="true"><Icon name="external" size={10} strokeWidth={2.4} /></span>}
                    </span>
                    <span>{APPS[id].short}</span>
                </button>
            ))}
        </div>
    );
}

export default function MobileHome({ onPlay }) {
    const now = useClock();
    // Re-open the app the visitor was in if they come back (e.g. Back from the game).
    const [appId, setAppId] = useState(() => {
        const id = window.history.state?.cosApp;
        return id && APPS[id] && !APPS[id].game && !APPS[id].url ? id : null;
    });
    const [closing, setClosing] = useState(false);
    const [page, setPage] = useState(0);
    const pagesRef = useRef(null);

    const openApp = useCallback((id) => {
        if (!APPS[id]) return;
        if (APPS[id].game) { onPlay(); return; }
        if (openExternal(id)) return;
        if (window.history.state?.cosApp) window.history.replaceState({ cosApp: id }, '');
        else window.history.pushState({ cosApp: id }, '');
        setClosing(false);
        setAppId(id);
    }, [onPlay]);

    const close = useCallback(() => {
        if (window.history.state?.cosApp) window.history.back();
        else setAppId(null);
    }, []);

    // The phone's Back button closes the open app instead of leaving the site.
    useEffect(() => {
        const onPop = (e) => {
            const id = e.state?.cosApp;
            if (id && APPS[id]) { setClosing(false); setAppId(id); return; }
            setClosing(true);
            setTimeout(() => { setAppId(null); setClosing(false); }, 220);
        };
        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
    }, []);

    const onPagesScroll = () => {
        const el = pagesRef.current;
        if (!el) return;
        const p = Math.round(el.scrollLeft / el.clientWidth);
        if (p !== page) setPage(p);
    };
    const goToPage = (p) => {
        const el = pagesRef.current;
        if (el) el.scrollTo({ left: p * el.clientWidth, behavior: 'smooth' });
    };

    const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M$/i, '');

    return (
        <div className="cos-root cos-mobile">
            <Wallpaper />
            <HeroCharacter mobile paused={!!appId} />

            <div className="cos-m-status" aria-hidden="true">
                <span className="cos-m-time">{time}</span>
                <span className="cos-m-os"><span className="cos-logo-mark">◆</span> ChetasOS</span>
                <span className="cos-m-sys">
                    <svg width="18" height="11" viewBox="0 0 18 11"><rect x="0" y="7" width="3" height="4" rx="1" fill="currentColor" /><rect x="5" y="5" width="3" height="6" rx="1" fill="currentColor" /><rect x="10" y="2.5" width="3" height="8.5" rx="1" fill="currentColor" /><rect x="15" y="0" width="3" height="11" rx="1" fill="currentColor" /></svg>
                    <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke="currentColor" opacity="0.5" /><rect x="2" y="2" width="16" height="8" rx="1.8" fill="currentColor" /><rect x="22.5" y="4" width="2" height="4" rx="1" fill="currentColor" opacity="0.5" /></svg>
                </span>
            </div>

            <div className="cos-m-pages" ref={pagesRef} onScroll={onPagesScroll} aria-hidden={appId ? 'true' : undefined}>
                {/* Page 1: greeting, play card, main apps */}
                <main className="cos-m-page" aria-label="Home screen, page 1">
                    <section className="cos-m-hero">
                        <div className="cos-m-hero-top">
                            <Avatar size={58} className="cos-widget-avatar" />
                            <div>
                                <p className="cos-m-hello">Hi, I'm {PROFILE.firstName}</p>
                                <p className="cos-m-role">{PROFILE.title} · {PROFILE.company}</p>
                                <p className="cos-m-meta"><Icon name="pin" size={12} /> {PROFILE.location} · {yearsOfExperience()} yrs</p>
                            </div>
                        </div>
                        <button type="button" className="cos-m-play" onClick={onPlay} onTouchStart={prefetchGame}>
                            <span className="cos-play-scene">
                                <span className="cos-play-ground" />
                                <Walker height={58} />
                            </span>
                            <span className="cos-play-copy">
                                <span className="cos-play-title">Play my journey</span>
                                <span className="cos-play-sub">5 levels · Gujarat to Kansas</span>
                            </span>
                            <span className="cos-play-btn"><Icon name="play" size={15} /></span>
                        </button>
                    </section>

                    <AppGrid ids={MOBILE_PAGES[0]} onOpen={openApp} />

                    <button type="button" className="cos-m-more" onClick={() => goToPage(1)}>
                        More apps <Icon name="chevronRight" size={14} />
                    </button>
                </main>

                {/* Page 2: the route and profile links */}
                <section className="cos-m-page" aria-label="Home screen, page 2">
                    <button type="button" className="cos-widget cos-widget-route cos-m-route" onClick={() => openApp('route')}>
                        <span className="cos-widget-label">The route</span>
                        <ol>
                            {JOURNEY_STOPS.map(s => (
                                <li key={s.city}><span>{s.city}, {s.region}</span><span>{s.year}</span></li>
                            ))}
                        </ol>
                    </button>

                    <AppGrid ids={MOBILE_PAGES[1]} onOpen={openApp} />
                </section>
            </div>

            <div className="cos-m-dots" role="tablist" aria-label="Home screen pages">
                {MOBILE_PAGES.map((_, i) => (
                    <button key={i} type="button" role="tab" aria-selected={page === i}
                        aria-label={`Page ${i + 1}`} onClick={() => goToPage(i)} />
                ))}
            </div>

            <nav className="cos-m-dock" aria-label="Dock">
                {MOBILE_DOCK.map(id => (
                    <button key={id} type="button" aria-label={APPS[id].title} onClick={() => openApp(id)}>
                        <AppIcon id={id} size={56} />
                    </button>
                ))}
            </nav>

            {appId && (
                <section className={`cos-m-sheet ${closing ? 'is-closing' : ''}`} role="dialog" aria-label={APPS[appId].title}>
                    <header className="cos-m-sheet-bar">
                        <button type="button" className="cos-m-back" onClick={close}>
                            <Icon name="back" size={20} /> Home
                        </button>
                        <span className="cos-m-sheet-title">{APPS[appId].title}</span>
                        <span className="cos-m-sheet-icon"><AppIcon id={appId} size={26} /></span>
                    </header>
                    <div className="cos-m-sheet-body">
                        <AppContent key={appId} id={appId} api={{ openApp, launchGame: onPlay, close, mobile: true }} />
                    </div>
                    <button type="button" className="cos-m-homebar" aria-label="Back to home" onClick={close} />
                </section>
            )}
        </div>
    );
}
