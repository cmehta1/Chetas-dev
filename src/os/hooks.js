import { useEffect, useState } from 'react';

const MOBILE_QUERY = '(max-width: 899px), (pointer: coarse) and (max-width: 1023px)';

export function useIsMobile() {
    const [mobile, setMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);
    useEffect(() => {
        const mq = window.matchMedia(MOBILE_QUERY);
        const on = () => setMobile(mq.matches);
        mq.addEventListener('change', on);
        return () => mq.removeEventListener('change', on);
    }, []);
    return mobile;
}

export function useClock(intervalMs = 15000) {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), intervalMs);
        return () => clearInterval(t);
    }, [intervalMs]);
    return now;
}

export function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* sessionStorage can throw (private mode, blocked storage) — never let that break the page. */
export const session = {
    get(key) {
        try { return window.sessionStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
        try { window.sessionStorage.setItem(key, value); } catch { /* ignore */ }
    },
};

/** Warm the game bundle when someone shows intent (hover / touch on a Play button). */
let gamePrefetched = false;
export function prefetchGame() {
    if (gamePrefetched) return;
    gamePrefetched = true;
    import('../App').catch(() => { gamePrefetched = false; });
}
