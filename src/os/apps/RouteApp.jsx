import { JOURNEY_STOPS } from '../data';

export default function RouteApp() {
    return (
        <div className="cos-app cos-route-app">
            <header className="cos-app-head">
                <p className="cos-kicker">maps</p>
                <h1>The route</h1>
                <p className="cos-app-sub">Where I've lived, from Gujarat to Kansas.</p>
            </header>
            <ol className="cos-stops">
                {JOURNEY_STOPS.map((s, i) => (
                    <li key={s.city} style={{ '--i': i }} className={i === JOURNEY_STOPS.length - 1 ? 'is-now' : ''}>
                        <span className="cos-stop-pin" aria-hidden="true" />
                        <div className="cos-stop-card">
                            <div className="cos-stop-head">
                                <span className="cos-stop-city">{s.city}<span>, {s.region}</span></span>
                                <span className="cos-stop-years">{s.years}</span>
                            </div>
                            <p>{s.note}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}
