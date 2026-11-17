import { useEffect, useRef, useState } from 'react';
import { APPS, findApp } from '../apps';
import {
    PROFILE, SOCIALS, EXPERIENCE, CARDS, SKILL_GROUPS_LIST, EDUCATION, yearsOfExperience,
} from '../data';

const PROMPT = 'chetas@chetasos:~$';

const HELP = [
    ['whoami', 'who is this'],
    ['experience', 'where I have worked'],
    ['projects', 'things I have built'],
    ['certs', 'certifications'],
    ['hobbies', 'life outside work'],
    ['skills', 'top skills'],
    ['contact', 'ways to reach me'],
    ['open <app>', 'open an app (e.g. open projects)'],
    ['play', 'launch the journey game'],
    ['neofetch', 'system info'],
    ['ls · clear · history · date', 'the usual'],
];

const FILES = ['about.md', 'experience/', 'projects/', 'certs/', 'hobbies/', 'skills.json', 'journey.exe*'];

function neofetch() {
    const info = [
        ['', `${PROFILE.firstName.toLowerCase()}@chetasos`],
        ['', '─────────────────'],
        ['OS', 'ChetasOS 2.0'],
        ['Host', PROFILE.company],
        ['Role', PROFILE.title],
        ['Uptime', `${yearsOfExperience()} years in industry`],
        ['Kernel', 'Java · React · TypeScript'],
        ['Modules', 'MCP · Agents · A2UI'],
        ['Locale', PROFILE.languages.map(l => l.label).join(', ')],
        ['Location', PROFILE.location],
    ];
    const logo = [
        '     ▲     ',
        '    ▲ ▲    ',
        '   ▲ ◆ ▲   ',
        '    ▼ ▼    ',
        '     ▼     ',
        '           ',
        '           ',
        '           ',
        '           ',
        '           ',
    ];
    return info.map(([k, v], i) => ({ t: 'pre', text: `${logo[i]}  ${k ? `${k.padEnd(9)}` : ''}${v}` }));
}

function run(raw, api, history) {
    const input = raw.trim();
    const [cmd, ...rest] = input.split(/\s+/);
    const arg = rest.join(' ');
    const c = (cmd || '').toLowerCase();

    switch (c) {
        case '': return [];
        case 'help': return [
            { t: 'muted', text: 'Available commands:' },
            ...HELP.map(([k, v]) => ({ t: 'pre', text: `  ${k.padEnd(28)}${v}` })),
        ];
        case 'whoami': return [
            { t: 'text', text: `${PROFILE.name}: ${PROFILE.title} @ ${PROFILE.company}` },
            { t: 'muted', text: PROFILE.tagline },
        ];
        case 'about':
        case 'cat':
            if (c === 'cat' && arg && !/about/.test(arg)) {
                const app = findApp(arg.replace(/[/.].*$/, ''));
                if (app) return run(app === 'certs' ? 'certs' : app, api, history);
                return [{ t: 'err', text: `cat: ${arg}: No such file` }];
            }
            return [
                { t: 'text', text: `# ${PROFILE.name}` },
                { t: 'text', text: PROFILE.tagline },
                ...EDUCATION.map(e => ({ t: 'muted', text: `- ${e.degree}, ${e.school} (${e.years})` })),
            ];
        case 'experience':
        case 'exp':
            return EXPERIENCE.flatMap(e => [
                { t: 'accent', text: `${e.period.padEnd(22)}${e.title} · ${e.company}` },
            ]).concat({ t: 'muted', text: "Tip: 'open experience' for the details." });
        case 'projects':
            return CARDS.project.map(p => ({ t: 'pre', text: `  ${p.year.padEnd(9)}${p.title}` }))
                .concat({ t: 'muted', text: "Tip: 'open projects' to flip through the card deck." });
        case 'certs':
        case 'certifications':
            return CARDS.cert.map(p => ({ t: 'pre', text: `  ★ ${p.title} (${p.subtitle}, ${p.year})` }));
        case 'hobbies':
            return [{ t: 'text', text: CARDS.hobby.map(h => `${h.icon} ${h.title}`).join('   ') }];
        case 'skills': {
            const top = SKILL_GROUPS_LIST.filter(g => g.group !== 'School')
                .map(g => ({ t: 'pre', text: `  ${g.group.padEnd(16)}${g.skills.map(s => s.label).join(', ')}` }));
            return [...top, { t: 'muted', text: "Tip: 'open skills' for the monitor." }];
        }
        case 'contact':
        case 'socials':
            return SOCIALS.map(s => ({ t: 'link', text: `  ${s.label.padEnd(10)}${s.handle}`, href: s.url }));
        case 'open': {
            const id = findApp(arg);
            if (!id) return [{ t: 'err', text: `open: unknown app '${arg}'. Try: ${Object.keys(APPS).join(', ')}` }];
            setTimeout(() => api.openApp(id), 150);
            return [{ t: 'muted', text: `Opening ${APPS[id].title}…` }];
        }
        case 'play':
        case './journey.exe':
        case 'journey':
            setTimeout(() => api.launchGame(), 400);
            return [{ t: 'accent', text: 'Launching journey.exe…' }];
        case 'ls':
            return [{ t: 'pre', text: FILES.join('   ') }];
        case 'neofetch':
            return neofetch();
        case 'date':
            return [{ t: 'text', text: new Date().toString() }];
        case 'echo':
            return [{ t: 'text', text: arg }];
        case 'history':
            return history.map((h, i) => ({ t: 'pre', text: `  ${String(i + 1).padStart(3)}  ${h}` }));
        case 'sudo':
            if (/hire/i.test(arg)) {
                setTimeout(() => api.openApp('contact'), 600);
                return [{ t: 'accent', text: '[sudo] permission granted. Opening contact…' }];
            }
            return [{ t: 'err', text: 'Nice try. This incident will be reported.' }];
        case 'exit':
            setTimeout(() => api.close(), 100);
            return [{ t: 'muted', text: 'logout' }];
        default:
            return [{ t: 'err', text: `command not found: ${cmd}. Type 'help'.` }];
    }
}

const QUICK = ['help', 'whoami', 'projects', 'certs', 'neofetch', 'play'];

export default function TerminalApp({ api }) {
    const [lines, setLines] = useState(() => [
        { t: 'accent', text: 'ChetasOS 2.0 · tty1' },
        { t: 'muted', text: "Type 'help' to see what you can ask. Try 'sudo hire chetas'." },
    ]);
    const [value, setValue] = useState('');
    const [history, setHistory] = useState([]);
    const [cursor, setCursor] = useState(-1);
    const inputRef = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (!api.mobile) inputRef.current?.focus({ preventScroll: true });
    }, [api.mobile]);
    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [lines]);

    const submit = (raw) => {
        const cmd = raw.trim();
        if (cmd.toLowerCase() === 'clear') {
            setLines([]);
        } else {
            const out = run(cmd, api, history);
            setLines(ls => [...ls, { t: 'cmd', text: cmd }, ...out]);
        }
        if (cmd) setHistory(h => [...h, cmd]);
        setCursor(-1);
        setValue('');
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter') { e.preventDefault(); submit(value); }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!history.length) return;
            const next = cursor === -1 ? history.length - 1 : Math.max(0, cursor - 1);
            setCursor(next); setValue(history[next]);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (cursor === -1) return;
            const next = cursor + 1;
            if (next >= history.length) { setCursor(-1); setValue(''); } else { setCursor(next); setValue(history[next]); }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const words = ['help', 'whoami', 'experience', 'projects', 'certs', 'hobbies', 'skills', 'contact', 'open', 'play', 'neofetch', 'ls', 'clear', 'history', 'date', 'sudo'];
            const match = words.find(w => w.startsWith(value.toLowerCase()) && value);
            if (match) setValue(match + (match === 'open' ? ' ' : ''));
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault(); setLines([]);
        }
    };

    return (
        <div className="cos-term" onClick={() => { if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true }); }}>
            <div className="cos-term-scroll" ref={scrollRef}>
                {lines.map((l, i) => {
                    if (l.t === 'cmd') return <p key={i} className="cos-term-line"><span className="cos-term-prompt">{PROMPT}</span> {l.text}</p>;
                    if (l.t === 'link') return <p key={i} className="cos-term-line is-pre"><a href={l.href} target="_blank" rel="noopener noreferrer">{l.text}</a></p>;
                    return <p key={i} className={`cos-term-line is-${l.t}`}>{l.text}</p>;
                })}
                <form className="cos-term-input" onSubmit={(e) => { e.preventDefault(); submit(value); }}>
                    <label htmlFor="cos-term-field" className="cos-term-prompt">{PROMPT}</label>
                    <input
                        id="cos-term-field"
                        ref={inputRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={onKeyDown}
                        autoComplete="off"
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck="false"
                        enterKeyHint="go"
                        aria-label="Terminal command"
                    />
                </form>
            </div>
            <div className="cos-term-quick" aria-label="Quick commands">
                {QUICK.map(q => (
                    <button key={q} type="button" onClick={(e) => { e.stopPropagation(); submit(q); }}>{q}</button>
                ))}
            </div>
        </div>
    );
}
