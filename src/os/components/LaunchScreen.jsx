import '../os.css';

/** Shown while the game bundle downloads. */
export default function LaunchScreen() {
    return (
        <div className="cos-launch" role="status" aria-live="polite">
            <div className="cos-launch-inner">
                <p>&gt; launching journey-game.exe<span className="cos-caret" /></p>
                <div className="cos-launch-bar"><span /></div>
            </div>
        </div>
    );
}
