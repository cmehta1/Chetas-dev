import { useGameEvent } from '../../hooks/useGameEvent';

const ZONE_NODES = [
    { label: 'Home', icon: '🏠', level: 1 },
    { label: 'School', icon: '🏫', level: 1 },
    { label: 'GTU', icon: '🎓', level: 2 },
    { label: 'Flight', icon: '✈️', level: 2 },
    { label: 'SUNY', icon: '🎓', level: 3 },
    { label: 'Midway', icon: '💼', level: 4 },
    { label: 'Cerner', icon: '💼', level: 4 },
    { label: 'Oracle', icon: '🔴', level: 4 },
    { label: 'Hobbies', icon: '🎯', level: 5 },
];

// Level bracket boundaries (zone indices where each level starts)
const LEVEL_STARTS = [0, 2, 4, 5, 8];

export default function MiniMap() {
    const zoneData = useGameEvent('zone-changed', { id: 0, progress: 0 });
    const currentZone = zoneData?.id || 0;

    return (
        <div className="minimap">
            <div className="minimap-track">
                {ZONE_NODES.map((node, i) => (
                    <div key={i} className="minimap-node">
                        {LEVEL_STARTS.includes(i) && (
                            <span className="minimap-level-tag">L{node.level}</span>
                        )}
                        <div
                            className={`minimap-dot ${
                                i < currentZone ? 'dot-completed'
                                    : i === currentZone ? 'dot-current'
                                    : 'dot-future'
                            }`}
                        >
                            <span className="minimap-icon">{node.icon}</span>
                        </div>
                        <span className={`minimap-label ${i === currentZone ? 'label-current' : ''}`}>
                            {node.label}
                        </span>
                        {i < ZONE_NODES.length - 1 && (
                            <div className={`minimap-line ${i < currentZone ? 'line-completed' : ''}`} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
