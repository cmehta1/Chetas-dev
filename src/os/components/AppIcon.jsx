import Icon from './Icons';
import { APPS } from '../apps';

/** Squircle app tile with gradient tint. */
export default function AppIcon({ id, size = 56 }) {
    const app = APPS[id];
    const [a, b] = app.tint;
    return (
        <span
            className="cos-appicon"
            style={{
                width: size,
                height: size,
                borderRadius: size * 0.26,
                background: `linear-gradient(145deg, ${a}, ${b})`,
            }}
        >
            <Icon name={app.icon} size={size * 0.5} strokeWidth={1.9} />
        </span>
    );
}
