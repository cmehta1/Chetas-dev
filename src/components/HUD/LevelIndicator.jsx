import { useGameEvent } from '../../hooks/useGameEvent';

export default function LevelIndicator() {
    const levelData = useGameEvent('level-changed', null);
    const zoneData = useGameEvent('zone-changed', { name: '' });

    if (!levelData) return null;

    const zoneName = zoneData?.name || '';

    return (
        <div className="level-indicator">
            <span className="level-number">L{levelData.id}</span>
            <span className="level-name">
                {levelData.name || ''}{zoneName ? `: ${zoneName}` : ''}
            </span>
        </div>
    );
}
