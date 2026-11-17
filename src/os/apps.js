import { SOCIALS } from './data';

const social = Object.fromEntries(SOCIALS.map(s => [s.id, s.url]));

/* App registry: everything ChetasOS can open.
   `game: true` launches the journey; `url` opens an external profile (like a phone web clip). */
export const APPS = {
    about: { title: 'About Me', short: 'About', icon: 'user', tint: ['#FF9933', '#E8483B'], size: [660, 600] },
    experience: { title: 'Experience', short: 'Experience', icon: 'briefcase', tint: ['#3D8BFF', '#2A4FD6'], size: [900, 680] },
    projects: { title: 'Projects', short: 'Projects', icon: 'cards', tint: ['#8B5CF6', '#5B33D6'], size: [900, 680] },
    certs: { title: 'Certifications', short: 'Certs', icon: 'award', tint: ['#FFC94A', '#E39B12'], size: [900, 680] },
    hobbies: { title: 'Hobbies', short: 'Hobbies', icon: 'target', tint: ['#34D399', '#0E9F6E'], size: [900, 680] },
    skills: { title: 'Skills', short: 'Skills', icon: 'activity', tint: ['#22D3EE', '#0E7490'], size: [900, 680] },
    route: { title: 'Route', short: 'Route', icon: 'route', tint: ['#F472B6', '#BE185D'], size: [560, 640] },
    terminal: { title: 'Terminal', short: 'Terminal', icon: 'terminal', tint: ['#4B5563', '#1F2937'], size: [700, 460] },
    contact: { title: 'Contact', short: 'Contact', icon: 'mail', tint: ['#60A5FA', '#2563EB'], size: [500, 470] },
    linkedin: { title: 'LinkedIn', short: 'LinkedIn', icon: 'linkedin', tint: ['#2D8CE0', '#0A66C2'], url: social.linkedin },
    github: { title: 'GitHub', short: 'GitHub', icon: 'github', tint: ['#3B4048', '#16191D'], url: social.github },
    x: { title: 'X', short: 'X', icon: 'x', tint: ['#2A2A2A', '#000000'], url: social.x },
    journey: { title: 'Journey', short: 'Journey', icon: 'gamepad', tint: ['#FFD54F', '#FF6F00'], game: true },
};

export const DESKTOP_ORDER = ['about', 'experience', 'projects', 'certs', 'skills', 'hobbies', 'route', 'terminal', 'contact', 'journey'];
export const MOBILE_PAGES = [
    ['experience', 'certs', 'skills', 'hobbies', 'journey', 'route'],
    ['linkedin', 'github', 'x'],
];
export const MOBILE_DOCK = ['about', 'projects', 'terminal', 'contact'];

/** Open an external profile in a new tab. Returns true if the app was a link. */
export function openExternal(id) {
    const url = APPS[id]?.url;
    if (!url) return false;
    window.open(url, '_blank', 'noopener,noreferrer');
    return true;
}

export function findApp(query) {
    const q = String(query || '').toLowerCase().replace(/[^a-z]/g, '');
    if (!q) return null;
    if (APPS[q]) return q;
    return Object.keys(APPS).find(id =>
        APPS[id].title.toLowerCase().replace(/[^a-z]/g, '').startsWith(q)
        || APPS[id].short.toLowerCase().startsWith(q)) || null;
}
