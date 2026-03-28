import { useState, useEffect, useRef } from 'react';
import EventBus from '../../game/EventBus';
import { PROJECTS_DATA, EXPERIENCE_DATA } from '../../game/config/journeyData';

export default function ProjectsPanel() {
    const [currentZone, setCurrentZone] = useState(0);
    const [visibleCount, setVisibleCount] = useState(0);
    const prevZoneRef = useRef(0);
    const timerRef = useRef(null);

    useEffect(() => {
        const handler = (data) => {
            const zoneId = data?.id ?? 0;
            setCurrentZone(zoneId);
        };
        EventBus.on('zone-changed', handler);
        return () => EventBus.off('zone-changed', handler);
    }, []);

    // When zone changes, reset and stagger items in
    useEffect(() => {
        if (currentZone !== prevZoneRef.current) {
            prevZoneRef.current = currentZone;
            setVisibleCount(0);
            if (timerRef.current) clearInterval(timerRef.current);

            const items = getItems(currentZone);
            if (items.length === 0) return;

            let count = 0;
            timerRef.current = setInterval(() => {
                count++;
                setVisibleCount(count);
                if (count >= items.length) clearInterval(timerRef.current);
            }, 600);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [currentZone]);

    const isWorkZone = currentZone >= 5;
    const items = getItems(currentZone);

    if (items.length === 0) return null;

    const HEADER_MAP = {
        2: 'GTU: Projects',
        4: 'SUNY BU: Projects',
        5: 'Midway Dental: Experience',
        6: 'Cerner Corp: Experience',
        7: 'Oracle Health: Experience',
        8: 'Hobbies & Interests',
    };

    return (
        <div className="projects-panel">
            <div className="projects-header">
                {HEADER_MAP[currentZone] || (isWorkZone ? 'Experience' : 'Projects')}
            </div>
            <div className="projects-list">
                {items.slice(0, visibleCount).map((item, i) => (
                    <div key={i} className="project-item project-new">
                        <div className="project-title">
                            {item.title}
                            {!isWorkZone && <span className="project-year">{item.year}</span>}
                        </div>
                        {isWorkZone && (
                            <div className="project-meta">
                                {item.company} &middot; {item.period}
                            </div>
                        )}
                        <ul className="project-bullets">
                            {item.bullets.map((b, j) => (
                                <li key={j}>{b}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

function getItems(zoneId) {
    if (zoneId === 8) {
        return [
            { title: 'Sports', bullets: ['Cricket', 'Football', 'Boxing', 'Tennis', 'Chess'] },
            { title: 'Interests', bullets: ['Space Science', 'Drawing', 'Coding', 'Gaming'] },
        ];
    }
    if (zoneId >= 5) {
        return EXPERIENCE_DATA.filter(e => e.zone === zoneId);
    }
    return PROJECTS_DATA.filter(p => p.zone === zoneId);
}
