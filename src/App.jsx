import { useRef } from 'react';
import PhaserGame from './game/PhaserGame';
import HUD from './components/HUD/HUD';
import './styles/hud.css';

function App() {
    const phaserRef = useRef(null);

    return (
        <div id="app-container">
            <PhaserGame ref={phaserRef} />
            <HUD />
        </div>
    );
}

export default App;
