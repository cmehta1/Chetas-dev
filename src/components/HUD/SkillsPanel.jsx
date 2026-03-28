import { useState, useEffect } from 'react';
import EventBus from '../../game/EventBus';
import { LANGUAGES } from '../../game/config/journeyData';

export default function SkillsPanel() {
    const [skills, setSkills] = useState({});
    const [latestSkill, setLatestSkill] = useState(null);

    useEffect(() => {
        const handler = (data) => {
            setSkills(data.allSkills || {});
            setLatestSkill({ id: data.id, label: data.label, proficiency: data.proficiency, isUpgrade: data.isUpgrade });
            setTimeout(() => setLatestSkill(null), 2500);
        };
        EventBus.on('skill-collected', handler);
        return () => EventBus.off('skill-collected', handler);
    }, []);

    const skillEntries = Object.entries(skills);

    return (
        <div className="skills-panel">
            {/* Languages — always visible */}
            <div className="skills-header">Languages</div>
            <div className="skills-list">
                {LANGUAGES.map((lang) => (
                    <div key={lang.id} className="skill-item">
                        <span className="skill-name">{lang.label}</span>
                        <span className="skill-stars">
                            {'★'.repeat(lang.proficiency)}
                            {'☆'.repeat(5 - lang.proficiency)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Skills — collected during gameplay */}
            <div className="skills-header skills-header-gap">
                Skills ({skillEntries.length})
            </div>
            <div className="skills-list">
                {skillEntries.map(([id, data]) => (
                    <div
                        key={id}
                        className={`skill-item ${latestSkill?.id === id ? 'skill-new' : ''}`}
                    >
                        <span className="skill-name">{data.label}</span>
                        <span className="skill-stars">
                            {'★'.repeat(data.proficiency)}
                            {'☆'.repeat(5 - data.proficiency)}
                        </span>
                    </div>
                ))}
            </div>
            {latestSkill && (
                <div className={`skill-toast ${latestSkill.isUpgrade ? 'toast-upgrade' : ''}`}>
                    {latestSkill.isUpgrade ? '↑ ' : '+ '}
                    {latestSkill.label} {'★'.repeat(latestSkill.proficiency)}
                    {latestSkill.isUpgrade ? ' Upgraded!' : ' Acquired!'}
                </div>
            )}
        </div>
    );
}
