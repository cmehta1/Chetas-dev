import { useRef, useState, useEffect, lazy, Suspense } from 'react';
import PhaserGame from './game/PhaserGame';
import HUD from './components/HUD/HUD';
import Joystick from './components/HUD/Joystick';
import EventBus from './game/EventBus';
import './styles/hud.css';

const BuildingInterior = lazy(() => import('./components/BuildingInterior/BuildingInterior'));

function App() {
    const phaserRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [buildingZone, setBuildingZone] = useState(null);

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

    useEffect(() => {
        const onEnterBuilding = ({ zoneId }) => setBuildingZone(zoneId);
        EventBus.on('enter-building', onEnterBuilding);
        return () => EventBus.off('enter-building', onEnterBuilding);
    }, []);

    const handleBuildingClose = () => {
        setBuildingZone(null);
        EventBus.emit('exit-building');
    };

    return (
        <div id="app-container">
            <PhaserGame ref={phaserRef} />
            <HUD />
            {isMobile && !gameEnded && <Joystick />}
            {buildingZone !== null && (
                <Suspense fallback={null}>
                    <BuildingInterior zoneId={buildingZone} onClose={handleBuildingClose} />
                </Suspense>
            )}
        </div>
    );
}

export default App;
