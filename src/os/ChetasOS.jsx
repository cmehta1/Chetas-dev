import { useCallback, useState } from 'react';
import Boot from './components/Boot';
import Desktop from './Desktop';
import MobileHome from './MobileHome';
import { useIsMobile, session, prefersReducedMotion } from './hooks';
import './os.css';

const BOOT_KEY = 'chetasos-booted';

export default function ChetasOS({ onPlay }) {
    const mobile = useIsMobile();
    const [booted, setBooted] = useState(() => session.get(BOOT_KEY) === '1' || prefersReducedMotion());

    const finishBoot = useCallback(() => {
        session.set(BOOT_KEY, '1');
        setBooted(true);
    }, []);

    if (!booted) return <Boot onDone={finishBoot} />;
    return mobile ? <MobileHome onPlay={onPlay} /> : <Desktop onPlay={onPlay} />;
}
