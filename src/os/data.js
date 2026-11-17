import {
    JOURNEY, SKILLS_DATA, PROJECTS_DATA, EXPERIENCE_DATA, HOBBIES_DATA,
    LANGUAGES, CERTIFICATIONS, ZONE_HIGHLIGHTS,
} from '../game/config/journeyData';

export const PROFILE = {
    name: JOURNEY.name,
    firstName: 'Chetas',
    title: 'Member of Technical Staff',
    company: 'Oracle Health',
    location: 'Overland Park, KS',
    tagline: 'Healthcare software engineer building clinical ordering services and AI agents.',
    languages: LANGUAGES,
};

export const SOCIALS = [
    { id: 'linkedin', label: 'LinkedIn', handle: 'in/chetasmehta', url: 'https://www.linkedin.com/in/chetasmehta' },
    { id: 'github', label: 'GitHub', handle: 'cmehta1', url: 'https://github.com/cmehta1' },
    { id: 'x', label: 'X', handle: '@chetas2', url: 'https://x.com/chetas2' },
];

const CAREER_START = new Date(2016, 8, 1);
export function yearsOfExperience(now = new Date()) {
    return Math.floor((now - CAREER_START) / (365.25 * 24 * 3600 * 1000));
}

export const EDUCATION = [
    { degree: 'M.S. Computer Science', school: 'SUNY Binghamton', place: 'Binghamton, NY', years: '2014 – 2016', note: 'GPA 3.7 / 4.0' },
    { degree: 'B.E. Computer Science & Engineering', school: 'Gujarat Technological University', place: 'Gujarat, India', years: '2009 – 2013', note: 'Top ranker' },
];

export const JOURNEY_STOPS = [
    { city: 'Gujarat', region: 'India', year: '1991' },
    { city: 'Binghamton', region: 'NY', year: '2014' },
    { city: 'Livonia', region: 'MI', year: '2016' },
    { city: 'Kansas City', region: 'MO', year: '2017' },
    { city: 'Overland Park', region: 'KS', year: '2022' },
];

/* ── Experience (newest first) ── */
const EXPERIENCE_META = {
    5: { location: 'Livonia, Michigan', accent: '#2BB3A3', stack: ['Python', 'Salesforce APEX', 'AngularJS', 'JavaScript', 'SQL / SOQL'] },
    6: { location: 'Kansas City, Missouri', accent: '#3D8BFF', stack: ['Java', 'JAX-RS', 'Jersey', 'Swagger', 'Jenkins', 'SQL'] },
    7: { location: 'Overland Park, Kansas', accent: '#E8483B', stack: ['Java', 'JAX-RS', 'JDBC', 'Oracle SQL', 'Jenkins', 'MCP', 'A2UI'] },
};

export const EXPERIENCE = [...EXPERIENCE_DATA]
    .sort((a, b) => b.zone - a.zone)
    .map(e => ({
        ...e,
        ...EXPERIENCE_META[e.zone],
        story: (ZONE_HIGHLIGHTS[e.zone] || []).map(h => h.title),
    }));

/* ── Skills, merged across zones (highest rating wins, earliest year kept) ── */
const SKILL_GROUPS = {
    'AI & Agents': ['mcp', 'agents', 'a2ui', 'codex'],
    Languages: ['java', 'javascript', 'typescript', 'python', 'c', 'cplusplus', 'sql'],
    'Web & Services': ['react', 'restapis', 'angularjs', 'salesforce'],
    Foundations: ['algorithms', 'dsa', 'os', 'comparch', 'databases', 'compsec'],
    School: ['maths', 'science', 'physics', 'chemistry', 'socialscience'],
};

export const SKILL_GROUPS_LIST = (() => {
    const merged = {};
    SKILLS_DATA.forEach(s => {
        const since = JOURNEY.zones[s.zone].yearStart;
        const m = merged[s.id];
        if (!m) merged[s.id] = { id: s.id, label: s.label, proficiency: s.proficiency, since, zones: 1 };
        else {
            m.proficiency = Math.max(m.proficiency, s.proficiency);
            m.since = Math.min(m.since, since);
            m.zones += 1;
        }
    });
    // The game files AI skills under the Oracle zone (2022+), but these tools are newer than that,
    // so they're labelled "new" rather than given a misleading year.
    return Object.entries(SKILL_GROUPS).map(([group, ids]) => ({
        group,
        skills: ids.map(id => merged[id]).filter(Boolean)
            .map(sk => (group === 'AI & Agents' ? { ...sk, since: 'new' } : sk)),
    }));
})();

/* ── Cards ── */
const PROJECT_EXTRA = {
    'Event Management System': { icon: '🎪', stack: ['Visual Basic', 'SQL'], where: 'GTU' },
    'Hotel Management System': { icon: '🏨', stack: ['Documentation', 'Systems analysis'], where: 'GTU' },
    'Inventory & Invoice Management': { icon: '🧾', stack: ['.NET', 'Java', 'JSP', 'MySQL'], where: 'GTU × L&T Infotech' },
    'Home Automation System': { icon: '🏠', stack: ['Embedded', 'Mobile control'], where: 'GTU', badge: 'In the news' },
    'Minion vs Alien 3D Game': { icon: '👾', stack: ['Java', 'jMonkeyEngine', 'Blender'], where: 'Binghamton hackathon' },
    'Secure Electronic Voting System': { icon: '🗳️', stack: ['C', 'RSA', 'Sockets'], where: 'SUNY Binghamton' },
    'APEX Simulator': { icon: '🧠', stack: ['C', 'Pipelining', 'Out-of-order'], where: 'SUNY Binghamton' },
    'Retail Business Management System': { icon: '🛒', stack: ['Oracle PL/SQL', 'Java', 'JDBC'], where: 'SUNY Binghamton' },
};

const HOBBY_EXTRA = {
    cricket: { icon: '🏏', flavor: 'Played for the school team at regional level three years running. In 2005, the youngest player on a winning Under-19 side, at 15.', badge: 'U-19 champion' },
    football: { icon: '⚽', flavor: 'Team sport, quick decisions, and a lot of running.' },
    boxing: { icon: '🥊', flavor: 'Footwork, focus and staying calm under pressure.' },
    tennis: { icon: '🎾', flavor: 'One-on-one, every point a fresh start.' },
    chess: { icon: '♟️', flavor: 'Thinking several moves ahead, on and off the board.' },
    space: { icon: '🔭', flavor: 'Rockets, planets and the questions that keep you looking up.' },
    drawing: { icon: '🎨', flavor: 'Won prizes for drawing in school, and still sketches for fun.', badge: 'Award winner' },
    coding: { icon: '💻', flavor: 'Started with C in high school, curious how computers could simulate intelligence. Never stopped.' },
    gaming: { icon: '🎮', flavor: 'Games are why this portfolio is a game.' },
};

const CERT_EXTRA = {
    'OCI Generative AI Professional': { icon: '✨', flavor: 'LLM fundamentals, retrieval-augmented generation and building on the OCI Generative AI service.' },
    'OCI Foundations Associate': { icon: '☁️', flavor: 'Core Oracle Cloud Infrastructure: compute, storage, networking, security and governance.' },
    'Oracle AI Vector Search Professional': { icon: '🧭', flavor: 'Embeddings, similarity search and RAG pipelines inside Oracle Database.' },
    'Salesforce Administrator': { icon: '⚙️', flavor: 'Earned while building Salesforce solutions at Midway Dental Supply.' },
    'Salesforce Developer': { icon: '⚡', flavor: 'APEX and SOQL development, earned during the Midway Dental Supply years.' },
};

const projectCards = PROJECTS_DATA.map(p => ({
    kind: 'project',
    title: p.title,
    subtitle: PROJECT_EXTRA[p.title]?.where,
    year: p.year,
    icon: PROJECT_EXTRA[p.title]?.icon || '🛠️',
    badge: PROJECT_EXTRA[p.title]?.badge,
    stack: PROJECT_EXTRA[p.title]?.stack || [],
    bullets: p.bullets,
}));

const certCards = CERTIFICATIONS.map(c => ({
    kind: 'cert',
    title: c.name,
    subtitle: c.issuer,
    year: c.year,
    icon: CERT_EXTRA[c.name]?.icon || '🏅',
    flavor: CERT_EXTRA[c.name]?.flavor,
    badge: c.level,
    stack: c.tags || [],
    bullets: c.bullets || [],
}));

const hobbyCards = HOBBIES_DATA.map(h => ({
    kind: 'hobby',
    title: h.label,
    subtitle: h.category,
    icon: HOBBY_EXTRA[h.id]?.icon || '⭐',
    badge: HOBBY_EXTRA[h.id]?.badge,
    flavor: HOBBY_EXTRA[h.id]?.flavor,
    stack: [],
    bullets: [],
}));

const ALL = [...certCards, ...projectCards, ...hobbyCards].map((c, i, arr) => ({
    ...c,
    id: `${c.kind}-${i}`,
    number: `${String(i + 1).padStart(3, '0')}/${String(arr.length).padStart(3, '0')}`,
}));

export const CARDS = {
    project: ALL.filter(c => c.kind === 'project'),
    cert: ALL.filter(c => c.kind === 'cert'),
    hobby: ALL.filter(c => c.kind === 'hobby'),
};

export const CARD_KIND_LABEL = { project: 'Project', cert: 'Certification', hobby: 'Hobby' };
