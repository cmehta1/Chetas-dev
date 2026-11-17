import Icon from '../components/Icons';
import { SOCIALS } from '../data';
import { prefetchGame } from '../hooks';

export default function ContactApp({ api }) {
    return (
        <div className="cos-app cos-contact">
            <header className="cos-app-head">
                <p className="cos-kicker">compose</p>
                <h1>Let's connect</h1>
                <p className="cos-app-sub">Happy to talk about healthcare software, AI agents, or cricket.</p>
            </header>

            <ul className="cos-socials">
                {SOCIALS.map(s => (
                    <li key={s.id}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className={`cos-social cos-social-${s.id}`}>
                            <span className="cos-social-icon"><Icon name={s.id} size={20} /></span>
                            <span className="cos-social-text">
                                <span className="cos-social-label">{s.label}</span>
                                <span className="cos-social-handle">{s.handle}</span>
                            </span>
                            <Icon name="external" size={16} className="cos-social-go" />
                        </a>
                    </li>
                ))}
            </ul>

            <button type="button" className="cos-contact-play" onClick={api.launchGame}
                onPointerEnter={prefetchGame} onTouchStart={prefetchGame}>
                <span>Rather see it than read it?</span>
                <strong><Icon name="play" size={12} /> Play my journey</strong>
            </button>
        </div>
    );
}
