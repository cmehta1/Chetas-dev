import { useEffect, useState, useRef, useCallback } from 'react';
import Character3D from './Character3D';
import { JOURNEY, SKILLS_DATA, PROJECTS_DATA, EXPERIENCE_DATA, ZONE_INTROS, ZONE_HIGHLIGHTS } from '../../game/config/journeyData';
import '../../styles/building-interior.css';

function getZoneData(zoneId) {
    const journey = JOURNEY.zones.find(z => z.id === zoneId);
    const skills = SKILLS_DATA.filter(s => s.zone === zoneId);
    const projects = PROJECTS_DATA.filter(p => p.zone === zoneId);
    const experience = EXPERIENCE_DATA.find(e => e.zone === zoneId);
    const intros = ZONE_INTROS[zoneId] || null;
    const highlights = ZONE_HIGHLIGHTS[zoneId] || [];
    return { journey, skills, projects, experience, intros, highlights };
}

export default function BuildingInterior({ zoneId, onClose }) {
    const [visible, setVisible] = useState(false);
    const scrollRef = useRef(0);        // 0-1 scroll progress for Character3D
    const scrollElRef = useRef(null);    // the scrollable overlay element

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
        const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => onClose(), 400);
    };

    const handleScroll = useCallback(() => {
        const el = scrollElRef.current;
        if (!el) return;
        const maxScroll = el.scrollHeight - el.clientHeight;
        scrollRef.current = maxScroll > 0 ? el.scrollTop / maxScroll : 0;
    }, []);

    const { journey, skills, projects, experience, intros, highlights } = getZoneData(zoneId);
    const hasExperience = !!experience;
    const hasProjects = projects.length > 0;
    const hasHighlights = highlights.length > 0;
    const leftHasContent = hasExperience || hasProjects;

    return (
        <div className={`building-interior-overlay ${visible ? 'bi-visible' : ''}`}>
            {/* 3D Canvas — fixed behind everything */}
            <div className="bi-canvas-fixed">
                <Character3D zoneId={zoneId} scrollRef={scrollRef} />
                <div className="bi-rim"></div>
            </div>

            {/* Scrollable content layer */}
            <div
                className="bi-scroll"
                ref={scrollElRef}
                onScroll={handleScroll}
            >
                {/* Section 1: Head close-up + title + intro blurbs */}
                <div className="bi-section bi-section-head">
                    <h2 className="bi-building-name">{journey?.name || 'Building'}</h2>
                    <p className="bi-subtitle">
                        {journey?.city}
                        {journey && ` | ${journey.yearStart}–${journey.yearEnd}`}
                    </p>
                    {journey?.description && (
                        <p className="bi-description">{journey.description}</p>
                    )}

                    {/* Intro blurbs — left & right of character */}
                    {intros && (
                        <div className="bi-intro-row">
                            <div className="bi-intro-blurb bi-intro-left">
                                <h3 className="bi-intro-heading">{intros.left.heading}</h3>
                                <p className="bi-intro-text">{intros.left.text}</p>
                            </div>
                            <div className="bi-intro-spacer" />
                            <div className="bi-intro-blurb bi-intro-right">
                                <h3 className="bi-intro-heading">{intros.right.heading}</h3>
                                <p className="bi-intro-text">{intros.right.text}</p>
                            </div>
                        </div>
                    )}

                    <div className="bi-scroll-hint">scroll down</div>
                </div>

                {/* Section 2: Info cards appear as camera pulls back */}
                <div className="bi-section bi-section-info">
                    <div className="bi-info-grid">
                        {/* Left panel */}
                        <div className="bi-panel bi-panel-left">
                            {hasExperience && (
                                <div className="bi-card bi-experience-card">
                                    <h3 className="bi-card-title">{experience.title}</h3>
                                    <p className="bi-card-company">{experience.company}</p>
                                    <p className="bi-card-period">{experience.period}</p>
                                    <ul className="bi-card-bullets">
                                        {experience.bullets.map((b, i) => <li key={i}>{b}</li>)}
                                    </ul>
                                </div>
                            )}
                            {hasProjects && (
                                <>
                                    <h3 className="bi-section-label">Projects</h3>
                                    {projects.map((proj, idx) => (
                                        <div key={idx} className="bi-card bi-project-card">
                                            <h3 className="bi-card-title">{proj.title}</h3>
                                            <span className="bi-card-year">{proj.year}</span>
                                            <ul className="bi-card-bullets">
                                                {proj.bullets.map((b, i) => <li key={i}>{b}</li>)}
                                            </ul>
                                        </div>
                                    ))}
                                </>
                            )}
                            {/* Highlights on left when there's no other left content */}
                            {hasHighlights && !leftHasContent && highlights.map((item, idx) => (
                                <div key={idx} className="bi-card bi-highlight-card">
                                    <h3 className="bi-card-title">{item.title}</h3>
                                    <p className="bi-card-text">{item.text}</p>
                                </div>
                            ))}
                        </div>

                        {/* Right panel */}
                        <div className="bi-panel bi-panel-right">
                            <div className="bi-card bi-skills-card">
                                <h3 className="bi-card-title">Skills</h3>
                                <div className="bi-skills-list">
                                    {skills.map(s => (
                                        <div key={s.key} className="bi-skill-item">
                                            <span className="bi-skill-label">{s.label}</span>
                                            <span className="bi-skill-stars">
                                                {'★'.repeat(s.proficiency)}{'☆'.repeat(5 - s.proficiency)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Highlights on right when left already has content */}
                            {hasHighlights && leftHasContent && highlights.map((item, idx) => (
                                <div key={idx} className="bi-card bi-highlight-card">
                                    <h3 className="bi-card-title">{item.title}</h3>
                                    <p className="bi-card-text">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Section 3: Continue */}
                <div className="bi-section bi-section-bottom">
                    <button className="bi-continue-btn" onClick={handleClose}>
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
