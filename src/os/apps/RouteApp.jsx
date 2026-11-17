import { ROUTE_RECENT_FIRST } from '../data';

export default function RouteApp() {
    return (
        <div className="cos-app cos-route-app">
            <header className="cos-app-head">
                <p className="cos-kicker">maps</p>
                <h1>The route</h1>
                <p className="cos-app-sub">Where I've lived and what I did in each place, most recent first.</p>
            </header>
            <ol className="cos-stops">
                <li className="is-next" style={{ '--i': 0 }}>
                    <span className="cos-stop-pin" aria-hidden="true" />
                    <div className="cos-stop-card">
                        <div className="cos-stop-head">
                            <span className="cos-stop-city">What's next</span>
                            <span className="cos-stop-years">to be continued</span>
                        </div>
                        <p className="cos-stop-about">The journey continues. New problems to solve, new things to build.</p>
                    </div>
                </li>
                {ROUTE_RECENT_FIRST.map((s, i) => (
                    <li key={s.city} style={{ '--i': i + 1 }} className={s.current ? 'is-now' : ''}>
                        <span className="cos-stop-pin" aria-hidden="true" />
                        <div className="cos-stop-card">
                            <div className="cos-stop-head">
                                <span className="cos-stop-city">{s.city}<span>, {s.region}</span></span>
                                <span className="cos-stop-years">{s.years}</span>
                            </div>
                            <p className="cos-stop-about">{s.about}</p>
                            <ol className="cos-substops">
                                {s.events.map((e, j) => (
                                    <li key={j}>
                                        <span className="cos-substop-when">{e.when}</span>
                                        <span className="cos-substop-text">{e.text}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}
