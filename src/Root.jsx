import { lazy, Suspense, useEffect, useState } from 'react';
import ChetasOS from './os/ChetasOS';
import LaunchScreen from './os/components/LaunchScreen';
import { GAME_PATH, currentPath, navigate } from './router';

// The game pulls in Phaser (and Three.js for interiors), so it is only
// downloaded when someone actually launches it.
const GameApp = lazy(() => import('./App'));

export default function Root() {
    const [path, setPath] = useState(currentPath);

    useEffect(() => {
        const onPop = () => setPath(currentPath());
        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
    }, []);

    useEffect(() => {
        document.title = path === GAME_PATH
            ? 'Journey · Chetas Mehta'
            : 'Chetas Mehta · Software Engineer';
    }, [path]);

    if (path === GAME_PATH) {
        return (
            <Suspense fallback={<LaunchScreen />}>
                <GameApp />
            </Suspense>
        );
    }
    return <ChetasOS onPlay={() => navigate(GAME_PATH)} />;
}
