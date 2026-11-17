import { useState } from 'react';
import { EXPERIENCE, EDUCATION, yearsOfExperience } from '../data';
import { ZONE_HIGHLIGHTS } from '../../game/config/journeyData';

export default function ExperienceApp() {
    const [open, setOpen] = useState(() => new Set([EXPERIENCE[0].zone]));
    const toggle = (zone) => setOpen(s => {
        const n = new Set(s);
        if (n.has(zone)) n.delete(zone); else n.add(zone);
        return n;
    });

    return (
        <div className="cos-app cos-exp">
            <header className="cos-app-head">
                <p className="cos-kicker">career.log</p>
                <h1>Experience</h1>
                <p className="cos-app-sub">{yearsOfExperience()} years, from a dental supply company in Michigan to clinical software used by physicians and nurses nationwide.</p>
            </header>

            <ol className="cos-timeline">
                {EXPERIENCE.map(e => {
                    const isOpen = open.has(e.zone);
                    return (
                        <li key={e.zone} className={`cos-tl-item ${isOpen ? 'is-open' : ''}`} style={{ '--accent': e.accent }}>
                            <span className="cos-tl-node" aria-hidden="true">{e.company[0]}</span>
                            <div className="cos-tl-card">
                                <button type="button" className="cos-tl-head" aria-expanded={isOpen} onClick={() => toggle(e.zone)}>
                                    <span>
                                        <span className="cos-tl-title">{e.title}</span>
                                        <span className="cos-tl-company">{e.company} · {e.location}</span>
                                    </span>
                                    <span className="cos-tl-period">{e.period}</span>
                                </button>
                                <div className="cos-chips">
                                    {e.stack.map(s => <span key={s} className="cos-chip">{s}</span>)}
                                </div>
                                {isOpen && (
                                    <div className="cos-tl-body">
                                        <ul className="cos-bullets">
                                            {e.bullets.map((b, i) => <li key={i}>{b}</li>)}
                                        </ul>
                                        {(ZONE_HIGHLIGHTS[e.zone] || []).map(h => (
                                            <details key={h.title} className="cos-story">
                                                <summary>{h.title}</summary>
                                                <p>{h.text}</p>
                                            </details>
                                        ))}
                                    </div>
                                )}
                                {!isOpen && (
                                    <button type="button" className="cos-tl-more" onClick={() => toggle(e.zone)}>
                                        Show {e.bullets.length} highlights
                                    </button>
                                )}
                            </div>
                        </li>
                    );
                })}
                {EDUCATION.map(ed => (
                    <li key={ed.degree} className="cos-tl-item is-edu" style={{ '--accent': '#9AA0B4' }}>
                        <span className="cos-tl-node" aria-hidden="true">🎓</span>
                        <div className="cos-tl-card">
                            <div className="cos-tl-head is-static">
                                <span>
                                    <span className="cos-tl-title">{ed.degree}</span>
                                    <span className="cos-tl-company">{ed.school} · {ed.place}</span>
                                </span>
                                <span className="cos-tl-period">{ed.years}</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}
