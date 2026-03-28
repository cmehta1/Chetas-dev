import { useEffect, useRef } from 'react';
import EventBus from '../../game/EventBus';

export default function Joystick() {
    const leftRef = useRef(null);
    const rightRef = useRef(null);
    const activeRef = useRef({ left: false, right: false });

    useEffect(() => {
        const emitState = () => {
            EventBus.emit('joystick-input', {
                left: activeRef.current.left,
                right: activeRef.current.right,
            });
        };

        const onDown = (dir) => (e) => {
            e.preventDefault();
            activeRef.current[dir] = true;
            emitState();
        };

        const onUp = (dir) => (e) => {
            e.preventDefault();
            activeRef.current[dir] = false;
            emitState();
        };

        const leftEl = leftRef.current;
        const rightEl = rightRef.current;

        leftEl.addEventListener('touchstart', onDown('left'), { passive: false });
        leftEl.addEventListener('touchend', onUp('left'), { passive: false });
        leftEl.addEventListener('touchcancel', onUp('left'), { passive: false });

        rightEl.addEventListener('touchstart', onDown('right'), { passive: false });
        rightEl.addEventListener('touchend', onUp('right'), { passive: false });
        rightEl.addEventListener('touchcancel', onUp('right'), { passive: false });

        return () => {
            leftEl.removeEventListener('touchstart', onDown('left'));
            leftEl.removeEventListener('touchend', onUp('left'));
            leftEl.removeEventListener('touchcancel', onUp('left'));
            rightEl.removeEventListener('touchstart', onDown('right'));
            rightEl.removeEventListener('touchend', onUp('right'));
            rightEl.removeEventListener('touchcancel', onUp('right'));
        };
    }, []);

    return (
        <div className="joystick-container">
            <button ref={leftRef} className="joystick-btn joystick-left" aria-label="Move left">
                <svg viewBox="0 0 24 24" width="28" height="28">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
            <button ref={rightRef} className="joystick-btn joystick-right" aria-label="Move right">
                <svg viewBox="0 0 24 24" width="28" height="28">
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
        </div>
    );
}
