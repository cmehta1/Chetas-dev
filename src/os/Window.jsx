import { useRef } from 'react';
import Icon from './components/Icons';
import AppIcon from './components/AppIcon';
import { APPS } from './apps';

const MENUBAR_H = 34;

export default function Window({ win, focused, onFocus, onClose, onMinimize, onToggleMax, onMove, children }) {
    const app = APPS[win.id];
    const drag = useRef(null);

    const onPointerDown = (e) => {
        if (e.button !== 0 || win.max || e.target.closest('button')) return;
        drag.current = { px: e.clientX, py: e.clientY, x: win.x, y: win.y };
        e.currentTarget.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e) => {
        const d = drag.current;
        if (!d) return;
        const vw = window.innerWidth, vh = window.innerHeight;
        const x = Math.min(Math.max(d.x + e.clientX - d.px, 120 - win.w), vw - 120);
        const y = Math.min(Math.max(d.y + e.clientY - d.py, MENUBAR_H), vh - 60);
        onMove(win.id, x, y);
    };
    const endDrag = () => { drag.current = null; };

    const style = win.max
        ? { zIndex: win.z }
        : { zIndex: win.z, left: win.x, top: win.y, width: win.w, height: win.h };

    return (
        <section
            className={[
                'cos-window',
                focused && 'is-focused',
                win.max && 'is-max',
                win.min && 'is-min',
                win.closing && 'is-closing',
            ].filter(Boolean).join(' ')}
            style={style}
            role="dialog"
            aria-label={app.title}
            onPointerDown={() => onFocus(win.id)}
        >
            <header
                className="cos-window-bar"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onDoubleClick={(e) => { if (!e.target.closest('button')) onToggleMax(win.id); }}
            >
                <span className="cos-window-title">
                    <AppIcon id={win.id} size={18} />
                    {app.title}
                </span>
                <span className="cos-window-ctrls">
                    <button type="button" aria-label="Minimize" onClick={() => onMinimize(win.id)}><Icon name="minus" size={14} /></button>
                    <button type="button" aria-label={win.max ? 'Restore' : 'Maximize'} onClick={() => onToggleMax(win.id)}>
                        <Icon name={win.max ? 'restore' : 'maximize'} size={13} />
                    </button>
                    <button type="button" className="cos-ctrl-close" aria-label="Close" onClick={() => onClose(win.id)}><Icon name="close" size={14} /></button>
                </span>
            </header>
            <div className="cos-window-body">{children}</div>
        </section>
    );
}
