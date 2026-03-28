import { useRef, useState, useEffect } from 'react';
import PhaserGame from './game/PhaserGame';
import HUD from './components/HUD/HUD';
import Joystick from './components/HUD/Joystick';
import './styles/hud.css';

function App() {
    const phaserRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile('ontouchstart' in window && window.innerWidth < 900);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    return (
        <div id="app-container">
            <PhaserGame ref={phaserRef} />
            <HUD />
            {isMobile && <Joystick />}
        </div>
    );
}

export default App;
