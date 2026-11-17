import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Wallpaper from './components/Wallpaper';
import AppIcon from './components/AppIcon';
import Icon from './components/Icons';
import { Avatar, Walker } from './components/Avatar';
import Window from './Window';
import AppContent from './AppContent';
import { APPS, DESKTOP_ORDER } from './apps';
import { PROFILE, JOURNEY_STOPS, yearsOfExperience } from './data';
import { useClock, prefetchGame } from './hooks';

const MENUBAR_H = 34;
const DOCK_SPACE = 104;

function initialRect(id, count) {
    const vw = window.innerWidth, vh = window.innerHeight;
    const [dw, dh] = APPS[id].size;
    const w = Math.min(dw, vw - 48);
    const h = Math.min(dh, vh - MENUBAR_H - DOCK_SPACE - 12);
    const offset = (count % 6) * 28;
    const x = Math.max(16, Math.round((vw - w) / 2) + offset - 56);
    const y = Math.max(MENUBAR_H + 10, Math.round((vh - MENUBAR_H - DOCK_SPACE - h) / 2) + MENUBAR_H + offset - 20);
    return { x, y, w, h };
}

export default function Desktop({ onPlay }) {
    const [windows, setWindows] = useState(() => [{ id: 'about', z: 1, min: false, max: false, ...initialRect('about', 0) }]);
    const zRef = useRef(1);
    const now = useClock();

    const focusedId = useMemo(() => {
        const visible = windows.filter(w => !w.min && !w.closing);
        if (!visible.length) return null;
        return visible.reduce((a, b) => (a.z > b.z ? a : b)).id;
    }, [windows]);

    const focus = useCallback((id) => {
        setWindows(ws => {
            const top = ws.find(w => w.id === id);
            if (!top || top.z === zRef.current) return ws;
            zRef.current += 1;
            return ws.map(w => (w.id === id ? { ...w, z: zRef.current } : w));
        });
    }, []);

    const openApp = useCallback((id) => {
        if (!APPS[id]) return;
        if (APPS[id].game) { onPlay(); return; }
        zRef.current += 1;
        const z = zRef.current;
        setWindows(ws => {
            if (ws.some(w => w.id === id)) {
                return ws.map(w => (w.id === id ? { ...w, min: false, closing: false, z } : w));
            }
            return [...ws, { id, z, min: false, max: false, ...initialRect(id, ws.length) }];
        });
    }, [onPlay]);

    const close = useCallback((id) => {
        setWindows(ws => ws.map(w => (w.id === id ? { ...w, closing: true } : w)));
        setTimeout(() => setWindows(ws => ws.filter(w => !(w.id === id && w.closing))), 160);
    }, []);
    const minimize = useCallback((id) => setWindows(ws => ws.map(w => (w.id === id ? { ...w, min: true } : w))), []);
    const toggleMax = useCallback((id) => setWindows(ws => ws.map(w => (w.id === id ? { ...w, max: !w.max } : w))), []);
    const move = useCallback((id, x, y) => setWindows(ws => ws.map(w => (w.id === id ? { ...w, x, y } : w))), []);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key !== 'Escape' || !focusedId) return;
            if (e.target.closest?.('input, textarea')) return;
            close(focusedId);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [focusedId, close]);

    const openIds = new Set(windows.filter(w => !w.closing).map(w => w.id));
    const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const dateStr = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

    return (
        <div className="cos-root cos-desktop">
            <Wallpaper />

            <nav className="cos-menubar" aria-label="ChetasOS menu bar">
                <div className="cos-menubar-left">
                    <button type="button" className="cos-logo" onClick={() => openApp('about')}>
                        <span className="cos-logo-mark">◆</span> ChetasOS
                    </button>
                    <span className="cos-menubar-app">{focusedId ? APPS[focusedId].title : 'Desktop'}</span>
                </div>
                <div className="cos-menubar-right">
                    <button type="button" className="cos-menubar-play" onClick={onPlay}
                        onPointerEnter={prefetchGame} onFocus={prefetchGame}>
                        <Icon name="play" size={12} /> Play the Journey
                    </button>
                    <span className="cos-menubar-meta"><Icon name="pin" size={13} /> {PROFILE.location}</span>
                    <span className="cos-menubar-meta">{dateStr}&nbsp;&nbsp;{timeStr}</span>
                </div>
            </nav>

            <div className="cos-desk-icons" role="list">
                {DESKTOP_ORDER.map(id => (
                    <button key={id} type="button" role="listitem" className="cos-desk-icon" onClick={() => openApp(id)}
                        onPointerEnter={APPS[id].game ? prefetchGame : undefined}>
                        <AppIcon id={id} size={52} />
                        <span>{APPS[id].game ? 'Journey.exe' : APPS[id].short}</span>
                    </button>
                ))}
            </div>

            <aside className="cos-widgets" aria-label="Widgets">
                <div className="cos-widget cos-widget-profile">
                    <Avatar size={64} className="cos-widget-avatar" />
                    <div>
                        <p className="cos-widget-name">{PROFILE.name}</p>
                        <p className="cos-widget-role">{PROFILE.title}</p>
                        <p className="cos-widget-company">{PROFILE.company} · {yearsOfExperience()} yrs in industry</p>
                    </div>
                </div>

                <button type="button" className="cos-widget cos-widget-play" onClick={onPlay}
                    onPointerEnter={prefetchGame} onFocus={prefetchGame}>
                    <span className="cos-play-scene">
                        <span className="cos-play-ground" />
                        <Walker height={78} />
                    </span>
                    <span className="cos-play-copy">
                        <span className="cos-play-kicker">Interactive</span>
                        <span className="cos-play-title">Play my journey</span>
                        <span className="cos-play-sub">5 levels · Gujarat to Kansas</span>
                    </span>
                    <span className="cos-play-btn"><Icon name="play" size={16} /></span>
                </button>

                <div className="cos-widget cos-widget-route">
                    <p className="cos-widget-label">The route</p>
                    <ol>
                        {JOURNEY_STOPS.map(s => (
                            <li key={s.city}><span>{s.city}, {s.region}</span><span>{s.year}</span></li>
                        ))}
                    </ol>
                </div>
            </aside>

            <div className="cos-windows">
                {windows.map(w => (
                    <Window key={w.id} win={w} focused={w.id === focusedId}
                        onFocus={focus} onClose={close} onMinimize={minimize} onToggleMax={toggleMax} onMove={move}>
                        <AppContent id={w.id} api={{ openApp, launchGame: onPlay, close: () => close(w.id), mobile: false }} />
                    </Window>
                ))}
            </div>

            <nav className="cos-dock" aria-label="Dock">
                {DESKTOP_ORDER.map(id => (
                    <span key={id} className={`cos-dock-item ${id === 'journey' ? 'is-game' : ''}`}>
                        <button type="button" aria-label={APPS[id].title} onClick={() => {
                            const w = windows.find(x => x.id === id);
                            if (w && !w.min && w.id === focusedId) minimize(id); else openApp(id);
                        }} onPointerEnter={APPS[id].game ? prefetchGame : undefined}>
                            <AppIcon id={id} size={46} />
                        </button>
                        <span className="cos-dock-tip">{APPS[id].title}</span>
                        {openIds.has(id) && <span className="cos-dock-dot" />}
                    </span>
                ))}
            </nav>
        </div>
    );
}
