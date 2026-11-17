import { Avatar } from '../components/Avatar';
import Icon from '../components/Icons';
import { PROFILE, EDUCATION, JOURNEY_STOPS, EXPERIENCE, CARDS, yearsOfExperience } from '../data';
import { prefetchGame } from '../hooks';

export default function AboutApp({ api }) {
    const stats = [
        { value: `${yearsOfExperience()}`, label: 'years in industry' },
        { value: `${EXPERIENCE.length}`, label: 'companies' },
        { value: `${CARDS.cert.length}`, label: 'certifications' },
        { value: `${PROFILE.languages.length}`, label: 'languages spoken' },
    ];

    return (
        <div className="cos-app cos-about">
            <header className="cos-about-hero">
                <Avatar size={92} className="cos-about-avatar" />
                <div>
                    <p className="cos-kicker">README.md</p>
                    <h1>{PROFILE.name}</h1>
                    <p className="cos-about-role">{PROFILE.title} at <strong>{PROFILE.company}</strong></p>
                    <p className="cos-about-loc"><Icon name="pin" size={13} /> {PROFILE.location}</p>
                </div>
            </header>

            <p className="cos-lede">
                I build clinical ordering software used by physicians and nurses. That's RESTful services in Java
                for EJS clinical ordering, Discern alerts, and lately AI-enabled apps and agents
                with MCP, DeepAgents and A2UI. I've been in healthcare tech since 2017, at Cerner and then Oracle Health.
            </p>

            <ul className="cos-stats">
                {stats.map(s => (
                    <li key={s.label}><strong>{s.value}</strong><span>{s.label}</span></li>
                ))}
            </ul>

            <div className="cos-about-actions">
                <button type="button" className="cos-btn cos-btn-primary" onClick={api.launchGame}
                    onPointerEnter={prefetchGame} onTouchStart={prefetchGame}>
                    <Icon name="play" size={14} /> Play my journey
                </button>
                <button type="button" className="cos-btn" onClick={() => api.openApp('experience')}>Experience</button>
                <button type="button" className="cos-btn" onClick={() => api.openApp('projects')}>Projects</button>
                <button type="button" className="cos-btn" onClick={() => api.openApp('contact')}>Contact</button>
            </div>

            <section className="cos-section">
                <h2>The route</h2>
                <ol className="cos-route">
                    {JOURNEY_STOPS.map((s, i) => (
                        <li key={s.city} style={{ '--i': i }}>
                            <span className="cos-route-dot" />
                            <span className="cos-route-city">{s.city}</span>
                            <span className="cos-route-meta">{s.region} · {s.year}</span>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="cos-section">
                <h2>Education</h2>
                <ul className="cos-edu">
                    {EDUCATION.map(e => (
                        <li key={e.degree}>
                            <p className="cos-edu-degree">{e.degree}</p>
                            <p className="cos-edu-school">{e.school} · {e.place}</p>
                            <p className="cos-edu-meta">{e.years} · {e.note}</p>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="cos-section">
                <h2>Languages</h2>
                <ul className="cos-langs">
                    {PROFILE.languages.map(l => (
                        <li key={l.id}>
                            <span>{l.label}</span>
                            <span className="cos-stars" aria-label={`${l.proficiency} out of 5`}>
                                {'★'.repeat(l.proficiency)}<span>{'★'.repeat(5 - l.proficiency)}</span>
                            </span>
                        </li>
                    ))}
                </ul>
            </section>

        </div>
    );
}
