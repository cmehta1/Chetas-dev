import { useEffect, useRef } from 'react';
import EventBus from '../../game/EventBus';

export default function Joystick() {
    const leftRef = useRef(null);
    const rightRef = useRef(null);
    const jumpRef = useRef(null);
    const activeRef = useRef({ left: false, right: false });

    useEffect(() => {
        const emitState = () => {
            EventBus.emit('joystick-input', {
                left: activeRef.current.left,
                right: activeRef.current.right,
            });
        };

        const handleLeftDown = (e) => { e.preventDefault(); activeRef.current.left = true; emitState(); };
        const handleLeftUp = (e) => { e.preventDefault(); activeRef.current.left = false; emitState(); };
        const handleRightDown = (e) => { e.preventDefault(); activeRef.current.right = true; emitState(); };
        const handleRightUp = (e) => { e.preventDefault(); activeRef.current.right = false; emitState(); };
        const handleJumpDown = (e) => { e.preventDefault(); EventBus.emit('joystick-jump'); };

        const leftEl = leftRef.current;
        const rightEl = rightRef.current;
        const jumpEl = jumpRef.current;

        leftEl.addEventListener('touchstart', handleLeftDown, { passive: false });
        leftEl.addEventListener('touchend', handleLeftUp, { passive: false });
        leftEl.addEventListener('touchcancel', handleLeftUp, { passive: false });

        rightEl.addEventListener('touchstart', handleRightDown, { passive: false });
        rightEl.addEventListener('touchend', handleRightUp, { passive: false });
        rightEl.addEventListener('touchcancel', handleRightUp, { passive: false });

        jumpEl.addEventListener('touchstart', handleJumpDown, { passive: false });

        return () => {
            leftEl.removeEventListener('touchstart', handleLeftDown);
            leftEl.removeEventListener('touchend', handleLeftUp);
            leftEl.removeEventListener('touchcancel', handleLeftUp);
            rightEl.removeEventListener('touchstart', handleRightDown);
            rightEl.removeEventListener('touchend', handleRightUp);
            rightEl.removeEventListener('touchcancel', handleRightUp);
            jumpEl.removeEventListener('touchstart', handleJumpDown);
        };
    }, []);

    return (
        <div className="joystick-container">
            <button ref={leftRef} className="joystick-btn joystick-left" aria-label="Move left">
                <svg viewBox="0 0 24 24" width="28" height="28">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
            <div className="joystick-right-group">
                <button ref={jumpRef} className="joystick-btn joystick-jump" aria-label="Jump">
                    <svg viewBox="0 0 24 24" width="28" height="28">
                        <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <button ref={rightRef} className="joystick-btn joystick-right" aria-label="Move right">
                    <svg viewBox="0 0 24 24" width="28" height="28">
                        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}
