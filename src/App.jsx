import { useRef, useState, useEffect } from 'react';
import PhaserGame from './game/PhaserGame';
import HUD from './components/HUD/HUD';
import Joystick from './components/HUD/Joystick';
import EventBus from './game/EventBus';
import './styles/hud.css';

function App() {
    const phaserRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);

    useEffect(() => {
        const check = () => {
            const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const smallScreen = window.innerWidth < 1024;
            setIsMobile(touchDevice && smallScreen);
        };
        check();
        window.addEventListener('resize', check);
        window.addEventListener('orientationchange', check);
        return () => {
            window.removeEventListener('resize', check);
            window.removeEventListener('orientationchange', check);
        };
    }, []);

    useEffect(() => {
        const onGameEnded = () => setGameEnded(true);
        EventBus.on('game-ended', onGameEnded);
        return () => EventBus.off('game-ended', onGameEnded);
    }, []);

    return (
        <div id="app-container">
            <PhaserGame ref={phaserRef} />
            <HUD />
            {isMobile && !gameEnded && <Joystick />}
        </div>
    );
}

export default App;
