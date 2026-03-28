import { useGameEvent } from '../../hooks/useGameEvent';
import YearCounter from './YearCounter';
import SkillsPanel from './SkillsPanel';
import ProgressBar from './ProgressBar';
import MiniMap from './MiniMap';
import LevelIndicator from './LevelIndicator';

export default function HUD() {
    const gameEnded = useGameEvent('game-ended', false);

    if (gameEnded) return null;

    return (
        <div className="hud-overlay">
            <div className="hud-top">
                <YearCounter />
                <LevelIndicator />
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
