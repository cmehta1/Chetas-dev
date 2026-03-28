import { useGameEvent } from '../../hooks/useGameEvent';

export default function YearCounter() {
    const year = useGameEvent('year-updated', '----');
    const zoneData = useGameEvent('zone-changed', { city: '', flag: '', name: '' });

    return (
        <div className="year-counter">
            <div className="year-location">
                <span className="location-flag">{zoneData?.flag || ''}</span>
                <div className="location-info">
                    <span className="location-city">{zoneData?.city || ''}</span>
                    {zoneData?.subtitle && (
                        <span className="location-theme">{zoneData.subtitle}</span>
                    )}
                </div>
            </div>
            <div className="year-display">
                <span className="year-value">{year}</span>
            </div>
        </div>
    );
}
