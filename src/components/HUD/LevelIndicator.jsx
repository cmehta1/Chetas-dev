import { useGameEvent } from '../../hooks/useGameEvent';

export default function LevelIndicator() {
    const levelData = useGameEvent('level-changed', { id: 1, name: 'Early Days' });

    return (
        <div className="level-indicator">
            <span className="level-number">L{levelData?.id || 1}</span>
            <span className="level-name">{levelData?.name || ''}</span>
        </div>
    );
}
