import { useEffect, useState } from 'react';
import { SKILL_GROUPS_LIST, yearsOfExperience } from '../data';

export default function SkillsApp() {
    const [ready, setReady] = useState(false);
    useEffect(() => {
        const t = requestAnimationFrame(() => setReady(true));
        return () => cancelAnimationFrame(t);
    }, []);

    const total = SKILL_GROUPS_LIST.reduce((n, g) => n + g.skills.length, 0);

    return (
        <div className="cos-app cos-skills">
            <header className="cos-app-head">
                <p className="cos-kicker">skillmon</p>
                <h1>Skill Monitor</h1>
                <p className="cos-app-sub">Each skill shows its self-rated proficiency and the year it first showed up.</p>
            </header>

            <div className="cos-sm-summary">
                <span><strong>{total}</strong> processes</span>
                <span><strong>{yearsOfExperience()} yrs</strong> uptime</span>
                <span className="cos-sm-live"><span className="cos-sm-pulse" /> running</span>
            </div>

            <div className="cos-sm-table" role="table" aria-label="Skills">
                <div className="cos-sm-row cos-sm-header" role="row">
                    <span role="columnheader">Skill</span>
                    <span role="columnheader">Since</span>
                    <span role="columnheader">Load</span>
                </div>
                {SKILL_GROUPS_LIST.map(g => (
                    <div key={g.group} role="rowgroup">
                        <div className="cos-sm-group" role="row"><span role="cell">{g.group}</span></div>
                        {g.skills.map((s, i) => (
                            <div key={s.id} className="cos-sm-row" role="row">
                                <span role="cell" className="cos-sm-name">{s.label}</span>
                                <span role="cell" className={`cos-sm-since ${s.since === 'new' ? 'is-new' : ''}`}>{s.since}</span>
                                <span role="cell" className="cos-sm-load" aria-label={`${s.proficiency} out of 5`}>
                                    <span className="cos-sm-bar">
                                        <span style={{
                                            width: ready ? `${s.proficiency * 20}%` : 0,
                                            transitionDelay: `${i * 40}ms`,
                                        }} />
                                    </span>
                                    <span className="cos-sm-val">{s.proficiency}/5</span>
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
