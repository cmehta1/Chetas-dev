import YearCounter from './YearCounter';
import SkillsPanel from './SkillsPanel';
import ProgressBar from './ProgressBar';
import MiniMap from './MiniMap';

export default function HUD() {
    return (
        <div className="hud-overlay">
            <div className="hud-top">
                <YearCounter />
                <ProgressBar />
            </div>
            <div className="hud-left">
                <SkillsPanel />
            </div>
            <div className="hud-bottom">
                <MiniMap />
            </div>
        </div>
    );
}
