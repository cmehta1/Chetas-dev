/* App registry: everything ChetasOS can open. `game: true` launches the journey instead of a window. */
export const APPS = {
    about: { title: 'About Me', short: 'About', icon: 'user', tint: ['#FF9933', '#E8483B'], size: [660, 600] },
    experience: { title: 'Experience', short: 'Experience', icon: 'briefcase', tint: ['#3D8BFF', '#2A4FD6'], size: [760, 640] },
    projects: { title: 'Projects', short: 'Projects', icon: 'cards', tint: ['#8B5CF6', '#5B33D6'], size: [900, 660] },
    certs: { title: 'Certifications', short: 'Certs', icon: 'award', tint: ['#FFC94A', '#E39B12'], size: [900, 660] },
    hobbies: { title: 'Hobbies', short: 'Hobbies', icon: 'target', tint: ['#34D399', '#0E9F6E'], size: [900, 660] },
    skills: { title: 'Skill Monitor', short: 'Skills', icon: 'activity', tint: ['#22D3EE', '#0E7490'], size: [640, 600] },
    terminal: { title: 'Terminal', short: 'Terminal', icon: 'terminal', tint: ['#4B5563', '#1F2937'], size: [700, 460] },
    contact: { title: 'Contact', short: 'Contact', icon: 'mail', tint: ['#60A5FA', '#2563EB'], size: [500, 470] },
    journey: { title: 'Journey', short: 'Journey', icon: 'gamepad', tint: ['#FFD54F', '#FF6F00'], game: true },
};

export const DESKTOP_ORDER = ['about', 'experience', 'projects', 'certs', 'hobbies', 'skills', 'terminal', 'contact', 'journey'];
export const MOBILE_GRID = ['experience', 'certs', 'hobbies', 'skills', 'journey'];
export const MOBILE_DOCK = ['about', 'projects', 'terminal', 'contact'];

export function findApp(query) {
    const q = String(query || '').toLowerCase().replace(/[^a-z]/g, '');
    if (!q) return null;
    if (APPS[q]) return q;
    return Object.keys(APPS).find(id =>
        APPS[id].title.toLowerCase().replace(/[^a-z]/g, '').startsWith(q)
        || APPS[id].short.toLowerCase().startsWith(q)) || null;
}
