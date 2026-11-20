import { Avatar } from '../components/Avatar';
import Icon from '../components/Icons';
import { PROFILE, EDUCATION, JOURNEY_STOPS, EXPERIENCE, CARDS, yearsOfExperience } from '../data';
import { prefetchGame } from '../hooks';

const STRENGTHS = [
    'Healthcare IT, 10+ years',
    'Java & RESTful services',
    'React & TypeScript',
    'Agentic AI: MCP, Agent Skills, A2UI',
    'Oracle Cloud certified',
    'Product design & 3D on the web',
    'Mentoring',
];

export default function AboutApp({ api }) {
    const stats = [
        { value: `${yearsOfExperience()}+`, label: 'years building software' },
        { value: `${EXPERIENCE.length}`, label: 'companies' },
        { value: `${CARDS.project.length}`, label: 'projects' },
        { value: `${CARDS.cert.length}`, label: 'certifications' },
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

            <div className="cos-lede">
                <p className="cos-intro">
                    A detail-oriented full-stack engineer with {yearsOfExperience()}+ years of experience working in the
                    fields of{' '}
                    <span className="cos-intro-hl">Healthcare IT, Agentic AI</span> and{' '}
                    <span className="cos-intro-hl">Interactive UI/UX</span>, focused on crafting reliable, intelligent and
                    delightful software that people love to use.
                </p>
                <p>
                    I'm a software engineer with 10+ years in healthcare IT, and I like turning ideas into things people
                    actually use. At Oracle Health I build across the stack for clinical ordering, e-prescribing and prior
                    authorization used by physicians and nurses: Java REST services, React interfaces, and agent-driven UI
                    with A2UI. I'm also helping
                    reimagine the EHR with agentic AI, building agents that work through MCP servers and Agent Skills.
                </p>
                <p>
                    I design and build end to end, from APIs and data models to interfaces people enjoy. Outside work I keep
                    creating: a 3D temple anyone can visit in the browser, an interactive fragrance house, and this
                    portfolio you can explore as an OS or play as a game. I also mentor engineers on ADPList, where I was
                    named a Top 50 Fullstack Mentor.
                </p>
            </div>

            <ul className="cos-tags" aria-label="Strengths">
                {STRENGTHS.map(s => <li key={s}>{s}</li>)}
            </ul>

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
                <button type="button" className="cos-btn" onClick={() => api.openApp('projects')}>Projects</button>
                <button type="button" className="cos-btn" onClick={() => api.openApp('skills')}>Skills</button>
                <button type="button" className="cos-btn" onClick={() => api.openApp('contact')}>Contact</button>
            </div>

            <section className="cos-section">
                <h2>The route</h2>
                {/* Unlike the Route app, this summary reads in time order, from Gujarat to what's next. */}
                <ol className="cos-route">
                    {JOURNEY_STOPS.map((s, i) => (
                        <li key={s.city} style={{ '--i': i }} className={s.current ? 'is-current' : ''}>
                            <span className="cos-route-dot" />
                            <span className="cos-route-city">{s.city}</span>
                            <span className="cos-route-meta">{s.region} · {s.current ? `${s.year}–now` : s.year}</span>
                        </li>
                    ))}
                    <li className="is-next" style={{ '--i': JOURNEY_STOPS.length }}>
                        <span className="cos-route-dot" />
                        <span className="cos-route-city">What's next</span>
                        <span className="cos-route-meta">the journey continues</span>
                    </li>
                </ol>
                <button type="button" className="cos-link-btn" onClick={() => api.openApp('route')}>
                    See the full route <Icon name="chevronRight" size={13} />
                </button>
            </section>

            <section className="cos-section">
                <h2>Work</h2>
                <ul className="cos-edu cos-work">
                    {EXPERIENCE.map(e => (
                        <li key={e.zone}>
                            <button type="button" onClick={() => api.openApp('experience')}>
                                <p className="cos-edu-degree">{e.title}</p>
                                <p className="cos-edu-school">{e.company} · {e.location}</p>
                                <p className="cos-edu-meta">{e.period}</p>
                            </button>
                        </li>
                    ))}
                </ul>
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
