import { useState, useEffect } from 'react';
import { useGameEvent } from '../../hooks/useGameEvent';
import YearCounter from './YearCounter';
import SkillsPanel from './SkillsPanel';
import ProgressBar from './ProgressBar';
import MiniMap from './MiniMap';
import LevelIndicator from './LevelIndicator';
import ProjectsPanel from './ProjectsPanel';

export default function HUD() {
    const gameEnded = useGameEvent('game-ended', false);
    const [isMobile, setIsMobile] = useState(false);
    const [showSkills, setShowSkills] = useState(false);
    const [showProjects, setShowProjects] = useState(false);

    useEffect(() => {
        const check = () => {
            const mobile = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) {
                setShowSkills(false);
                setShowProjects(false);
            }
        };
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // On mobile, close one panel when the other opens
    const toggleSkills = () => {
        setShowSkills(v => !v);
        setShowProjects(false);
    };
    const toggleProjects = () => {
        setShowProjects(v => !v);
        setShowSkills(false);
    };

    return (
        <>
            <div className="chetas-watermark">Chetas</div>
            {!gameEnded && (
                <div className="hud-overlay">
                    <div className="hud-top">
                        <YearCounter />
                        <LevelIndicator />
                        <ProgressBar />
                    </div>
                    <div className={`hud-left ${isMobile && !showSkills ? 'mobile-hidden' : ''}`}>
                        <SkillsPanel />
                    </div>
                    <div className={`hud-right ${isMobile && !showProjects ? 'mobile-hidden' : ''}`}>
                        <ProjectsPanel />
                    </div>
                    {isMobile && (
                        <div className="mobile-panel-toggles">
                            <button className={`panel-toggle panel-toggle-left ${showSkills ? 'toggle-active' : ''}`} onClick={toggleSkills}>
                                Skills
                            </button>
                            <button className={`panel-toggle panel-toggle-right ${showProjects ? 'toggle-active' : ''}`} onClick={toggleProjects}>
                                Projects
                            </button>
                        </div>
                    )}
                    <div className="hud-bottom">
                        <MiniMap />
                    </div>
                </div>
            )}
        </>
    );
}
