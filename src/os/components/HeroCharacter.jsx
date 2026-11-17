import { useEffect, useRef, useState } from 'react';

function canRun3D() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    if (navigator.connection?.saveData) return false;
    try {
        const c = document.createElement('canvas');
        return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch {
        return false;
    }
}

/** Live 3D wallpaper. Loads Three.js and the model only once the page is idle, then fades in. */
export default function HeroCharacter({ mobile, paused = false, className = '' }) {
    const ref = useRef(null);
    const ctl = useRef(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!canRun3D()) return undefined;
        let cancelled = false;
        const load = () => {
            import('./hero3d')
                .then(({ mountHero }) => {
                    if (cancelled || !ref.current) return;
                    ctl.current = mountHero(ref.current, { mobile, onReady: () => { if (!cancelled) setReady(true); } });
                })
                .catch(() => { /* keep the 2D wallpaper */ });
        };
        const idle = window.requestIdleCallback
            ? window.requestIdleCallback(load, { timeout: 1500 })
            : window.setTimeout(load, 700);
        return () => {
            cancelled = true;
            if (window.cancelIdleCallback) window.cancelIdleCallback(idle); else window.clearTimeout(idle);
            ctl.current?.destroy();
            ctl.current = null;
        };
    }, [mobile]);

    useEffect(() => { ctl.current?.setPaused(paused); }, [paused, ready]);

    return <div ref={ref} className={`cos-hero3d ${ready ? 'is-ready' : ''} ${className}`} aria-hidden="true" />;
}
