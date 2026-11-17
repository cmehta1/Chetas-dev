import { useEffect, useRef, useState } from 'react';
import ChetasLogo from './ChetasLogo';

const SHOW_MS = 2000;  // logo + progress bar
const FADE_MS = 450;   // fade into the home screen

/** Branded start-up splash: logo, wordmark and a thin progress bar, then a fade.
    The home screen renders underneath, so it's ready the moment the splash fades. */
export default function Boot({ onDone }) {
    const [leaving, setLeaving] = useState(false);
    const leavingRef = useRef(false);

    useEffect(() => {
        const timers = [];
        const finish = () => {
            if (leavingRef.current) return;
            leavingRef.current = true;
            setLeaving(true);
            timers.push(setTimeout(onDone, FADE_MS));
        };
        timers.push(setTimeout(finish, SHOW_MS));
        window.addEventListener('keydown', finish);
        window.addEventListener('pointerdown', finish);
        return () => {
            timers.forEach(clearTimeout);
            window.removeEventListener('keydown', finish);
            window.removeEventListener('pointerdown', finish);
        };
    }, [onDone]);

    return (
        <div className={`cos-splash ${leaving ? 'is-leaving' : ''}`} role="status" aria-label="ChetasOS is starting">
            <div className="cos-splash-inner">
                <ChetasLogo size={96} className="cos-splash-logo" />
                <p className="cos-splash-word">Chetas<span>OS</span></p>
                <div className="cos-splash-bar" aria-hidden="true"><span style={{ animationDuration: `${SHOW_MS - 250}ms` }} /></div>
            </div>
        </div>
    );
}
