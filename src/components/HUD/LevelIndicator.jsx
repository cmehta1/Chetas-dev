import { useGameEvent } from '../../hooks/useGameEvent';

export default function LevelIndicator() {
    const levelData = useGameEvent('level-changed', { id: 1, name: 'Early Days' });
    const zoneData = useGameEvent('zone-changed', { name: '' });

    const zoneName = zoneData?.name || '';

    return (
        <div className="level-indicator">
            <span className="level-number">L{levelData?.id || 1}</span>
            <span className="level-name">
                {levelData?.name || ''}{zoneName ? `: ${zoneName}` : ''}
            </span>
        </div>
    );
}
