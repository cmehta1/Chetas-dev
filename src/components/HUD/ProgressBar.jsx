import { useGameEvent } from '../../hooks/useGameEvent';

export default function ProgressBar() {
    const zoneData = useGameEvent('zone-changed', { progress: 0, name: '' });
    const percent = Math.round((zoneData?.progress || 0) * 100);

    return (
        <div className="progress-bar-container">
            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${percent}%` }}
                />
            </div>
            <span className="progress-text">{percent}%</span>
        </div>
    );
}
