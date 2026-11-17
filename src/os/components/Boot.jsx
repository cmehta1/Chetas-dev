import { useEffect, useRef, useState } from 'react';
import { yearsOfExperience } from '../data';

const LINES = [
    'CHETASOS BIOS v2.0',
    'Memory check ............ 640K OK',
    `Mounting /career ........ ${yearsOfExperience()} yrs OK`,
    'Loading card decks ...... OK',
    'Starting window manager . OK',
];

/** Short, skippable boot sequence that hands off to the desktop. */
export default function Boot({ onDone }) {
    const [shown, setShown] = useState(0);
    const doneRef = useRef(false);

    useEffect(() => {
        const finish = () => {
            if (doneRef.current) return;
            doneRef.current = true;
            onDone();
        };
        const timers = LINES.map((_, i) => setTimeout(() => setShown(i + 1), 160 + i * 220));
        timers.push(setTimeout(finish, 160 + LINES.length * 220 + 450));
        const skip = () => finish();
        window.addEventListener('keydown', skip);
        window.addEventListener('pointerdown', skip);
        return () => {
            timers.forEach(clearTimeout);
            window.removeEventListener('keydown', skip);
            window.removeEventListener('pointerdown', skip);
        };
    }, [onDone]);

    return (
        <div className="cos-boot" aria-label="ChetasOS is starting">
            <div className="cos-boot-lines">
                {LINES.slice(0, shown).map((l, i) => <p key={i}>{l}</p>)}
                <p className="cos-boot-cursor"><span className="cos-caret" /></p>
            </div>
            <p className="cos-boot-skip">press any key to skip</p>
        </div>
    );
}
