import {
    JOURNEY, SKILLS_DATA, PROJECTS_DATA, EXPERIENCE_DATA, HOBBIES_DATA,
    LANGUAGES, CERTIFICATIONS, ZONE_HIGHLIGHTS, ZONE_INTROS,
} from '../game/config/journeyData';
import {
    PROJECT_COPY, CERT_COPY, HOBBY_COPY, EXPERIENCE_COPY, EDUCATION_COPY, SKILL_COPY,
} from './content';
import { PROJECT_ART, CERT_ART, HOBBY_ART, EXPERIENCE_ART, EDUCATION_ART, SKILL_ART } from './art';

export const PROFILE = {
    name: JOURNEY.name,
    firstName: 'Chetas',
    title: 'Senior Member of Technical Staff',
    company: 'Oracle Health',
    location: 'Overland Park, KS',
    tagline: 'Full-stack healthcare engineer: clinical ordering, e-prescribing, prior authorization and agentic AI.',
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
    { degree: 'M.S. Computer Science', school: 'SUNY Binghamton', place: 'Binghamton, NY', years: '2014 – 2016', note: 'GPA 3.7 / 4.0', zone: 4 },
    { degree: 'B.E. Computer Science & Engineering', school: 'Gujarat Technological University', place: 'Gujarat, India', years: '2009 – 2013', note: 'Top ranker', zone: 2 },
];

/* Where Chetas has lived (not office locations), with what happened in each place. */
export const JOURNEY_STOPS = [
    {
        city: 'Gujarat', region: 'India', year: '1991', years: '1991 – 2014',
        note: 'Childhood, school, and a B.E. in Computer Science at Gujarat Technological University.',
        about: "A state on India's west coast, home to Ahmedabad, Vadodara and the Narmada river.",
        events: [
            { when: '1991', text: 'Born and raised in Gujarat' },
            { when: '1994–2009', text: 'Three schools; 100/100 in Science and 99/100 in Maths' },
            { when: '2002', text: 'First place in a district-level science quiz' },
            { when: '2005', text: 'Youngest player, at 15, on the winning Under-19 cricket team' },
            { when: '2009–13', text: 'B.E. in Computer Science & Engineering at GTU' },
            { when: '2011–12', text: 'Helped organise Aahvan, a national-level college tech festival' },
            { when: '2012–13', text: "Capstone with L&T Infotech for Larsen & Toubro's HMD-IT department" },
            { when: '2012–14', text: 'Taught Vedic and speed maths to school students' },
            { when: '2014', text: 'Home automation system featured in the local newspaper' },
            { when: '2014', text: 'Flew to the USA' },
        ],
    },
    {
        city: 'Binghamton', region: 'NY', year: '2014', years: '2014 – 2016',
        note: 'M.S. in Computer Science at SUNY Binghamton.',
        about: "A college city in New York's Southern Tier, where the Susquehanna and Chenango rivers meet, known for long snowy winters.",
        events: [
            { when: '2014', text: 'Started an M.S. in Computer Science at SUNY Binghamton' },
            { when: 'Mar 2015', text: 'Built a 3D shooter game at a hackathon' },
            { when: 'May 2015', text: 'Secure electronic voting system with RSA, in C' },
            { when: 'Oct 2015', text: 'APEX out-of-order CPU simulator, 3x faster than in-order' },
            { when: 'Nov 2015', text: 'Retail business management system on Oracle 11g' },
            { when: '2016', text: 'Graduated with a 3.7 GPA' },
        ],
    },
    {
        city: 'Livonia', region: 'MI', year: '2016', years: '2016 – 2017',
        note: 'First job in the US: Software Developer at Midway Dental Supply.',
        about: 'A suburb of Detroit in southeast Michigan.',
        events: [
            { when: 'Sep 2016', text: 'Software Developer at Midway Dental Supply' },
            { when: '2016–17', text: "Built out the company's Salesforce CRM for the sales team" },
            { when: '2016–17', text: 'Python and APEX software, AngularJS web apps, SQL and SOQL reports' },
        ],
    },
    {
        city: 'Overland Park', region: 'KS', year: '2017', years: '2017 – now',
        note: 'Home since 2017: five years at Cerner, then Oracle Health.',
        about: 'One of the largest cities in the Kansas City metro area, in Johnson County, Kansas.',
        current: true,
        events: [
            { when: 'Sep 2017', text: 'Software Engineer II at Cerner: clinical ordering services' },
            { when: '2019', text: 'Started volunteering with TLC for Kids USA' },
            { when: 'Oct 2022', text: 'Cerner becomes Oracle Health; Member of Technical Staff' },
            { when: '2022–now', text: 'E-prescribing and prior authorization features at Oracle Health' },
            { when: 'Jul 2024', text: 'OCI Generative AI Professional certification' },
            { when: 'May 2025', text: 'OCI Foundations and AI Vector Search certifications' },
            { when: 'Aug 2025', text: 'Mentoring engineers on ADPList; named a Top 50 Fullstack Mentor' },
            { when: 'Now', text: 'Senior Member of Technical Staff, building agentic AI for the EHR' },
        ],
    },
];

/* The route as shown on screen: most recent place first, newest events first. */
export const ROUTE_RECENT_FIRST = [...JOURNEY_STOPS].reverse()
    .map(s => ({ ...s, events: [...s.events].reverse() }));

/* ── Experience (newest first) ── */
const EXPERIENCE_META = {
    5: { location: 'Livonia, Michigan', stack: ['Python', 'Salesforce APEX', 'AngularJS', 'JavaScript', 'SQL / SOQL'] },
    6: { location: 'Kansas City, Missouri', stack: ['Java', 'JAX-RS', 'Jersey', 'Swagger', 'Jenkins', 'SQL'] },
    7: { location: 'Overland Park, Kansas', stack: ['Java', 'JAX-RS', 'JDBC', 'Oracle SQL', 'Jenkins', 'MCP', 'A2UI'] },
};

export const EXPERIENCE = [...EXPERIENCE_DATA]
    .sort((a, b) => b.zone - a.zone)
    .map(e => ({ ...e, ...EXPERIENCE_META[e.zone] }));

/* ── Skills, merged across zones (highest rating wins, earliest year kept) ── */
const SKILL_GROUPS = {
    'AI & Agents': ['mcp', 'agents', 'agentskills', 'a2ui', 'codex'],
    Languages: ['java', 'javascript', 'typescript', 'python', 'c', 'cplusplus', 'sql'],
    'Web & Services': ['react', 'restapis', 'angularjs', 'salesforce'],
    Foundations: ['algorithms', 'dsa', 'os', 'comparch', 'databases', 'compsec'],
    School: ['maths', 'science', 'physics', 'chemistry', 'socialscience'],
};

const ZONE_PLACE = { 1: 'School', 2: 'GTU', 4: 'SUNY Binghamton', 5: 'Midway', 6: 'Cerner', 7: 'Oracle Health' };

export const SKILL_GROUPS_LIST = (() => {
    const merged = {};
    SKILLS_DATA.forEach(s => {
        const since = JOURNEY.zones[s.zone].yearStart;
        const m = merged[s.id];
        if (!m) merged[s.id] = { id: s.id, label: s.label, proficiency: s.proficiency, since, places: [ZONE_PLACE[s.zone]] };
        else {
            m.proficiency = Math.max(m.proficiency, s.proficiency);
            m.since = Math.min(m.since, since);
            if (!m.places.includes(ZONE_PLACE[s.zone])) m.places.push(ZONE_PLACE[s.zone]);
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

/* ── Cards (each has an `art` spec drawn by CardIllustration) ── */

const experienceCards = [
    ...EXPERIENCE.map(e => {
        const copy = EXPERIENCE_COPY[e.zone] || {};
        const intro = ZONE_INTROS[e.zone];
        const [start, end] = e.period.split('–').map(s => s.trim());
        return {
            kind: 'experience',
            group: 'Work',
            title: e.title,
            subtitle: e.company,
            year: `${start.slice(-4)}–${end === 'Present' ? 'now' : end.slice(-4)}`,
            art: EXPERIENCE_ART[e.zone],
            summary: copy.summary,
            description: intro ? `${intro.left.text} ${intro.right.text}` : '',
            bullets: e.bullets,
            stack: e.stack,
            facts: [
                { label: 'Company', value: e.company },
                { label: 'Office', value: e.location },
                { label: 'Period', value: e.period },
            ],
            story: ZONE_HIGHLIGHTS[e.zone] || [],
        };
    }),
    ...EDUCATION.map(ed => {
        const copy = EDUCATION_COPY[ed.degree] || {};
        return {
            kind: 'education',
            group: 'Education',
            title: ed.degree,
            subtitle: ed.school,
            year: ed.years.replace(/\s/g, ''),
            art: EDUCATION_ART[ed.degree],
            summary: copy.summary,
            description: copy.description,
            bullets: [],
            stack: [],
            facts: [
                { label: 'School', value: ed.school },
                { label: 'Location', value: ed.place },
                { label: 'Years', value: ed.years },
                { label: 'Result', value: ed.note },
            ],
            story: ZONE_HIGHLIGHTS[ed.zone] || [],
        };
    }),
];

const PROJECT_GROUP_ORDER = ['Oracle Health', 'Cerner', 'Side projects', 'SUNY Binghamton', 'GTU'];
const projectCards = PROJECTS_DATA.map(p => {
    const copy = PROJECT_COPY[p.title] || {};
    return {
        kind: 'project',
        group: copy.group,
        title: p.title,
        subtitle: copy.where,
        year: p.year,
        badge: copy.badge,
        link: copy.link,
        art: PROJECT_ART[p.title],
        summary: copy.summary || p.bullets[0],
        description: copy.description,
        bullets: copy.highlights || p.bullets,
        stack: copy.stack || [],
        facts: [
            { label: 'Year', value: p.year },
            { label: 'Where', value: copy.where },
            { label: 'Built with', value: (copy.stack || []).join(', ') },
        ].filter(f => f.value),
    };
}).sort((a, b) => PROJECT_GROUP_ORDER.indexOf(a.group) - PROJECT_GROUP_ORDER.indexOf(b.group));

const certCards = CERTIFICATIONS.map(c => {
    const copy = CERT_COPY[c.name] || {};
    return {
        kind: 'cert',
        group: copy.group || c.issuer,
        title: c.name,
        subtitle: c.issuer,
        year: c.year,
        badge: c.level,
        art: CERT_ART[c.name],
        summary: copy.summary,
        description: copy.description,
        bullets: [],
        stack: c.tags || [],
        facts: [
            { label: 'Issuer', value: c.issuer },
            { label: 'Level', value: c.level },
            { label: 'Earned', value: c.issued || c.year },
        ],
    };
});

const hobbyCards = HOBBIES_DATA.map(h => {
    const copy = HOBBY_COPY[h.id] || {};
    return {
        kind: 'hobby',
        group: h.category,
        title: h.label,
        subtitle: h.category,
        badge: copy.badge,
        art: HOBBY_ART[h.id],
        summary: copy.summary,
        description: copy.description,
        bullets: [],
        stack: [],
        facts: [{ label: 'Category', value: h.category }],
    };
});

const skillCards = SKILL_GROUPS_LIST.flatMap(g => g.skills.map(s => {
    const copy = SKILL_COPY[s.id] || {};
    return {
        kind: 'skill',
        group: g.group,
        title: s.label,
        subtitle: g.group,
        year: `★ ${s.proficiency}/5`,
        rating: s.proficiency,
        art: SKILL_ART[s.id],
        summary: copy.summary,
        description: copy.description || '',
        bullets: [],
        stack: [],
        facts: [
            { label: 'Rating', value: `${'★'.repeat(s.proficiency)}${'☆'.repeat(5 - s.proficiency)}` },
            { label: 'Since', value: s.since === 'new' ? 'Recent' : String(s.since) },
            { label: 'Used at', value: s.places.join(', ') },
        ],
    };
}));

const ALL = [...experienceCards, ...projectCards, ...certCards, ...skillCards, ...hobbyCards]
    .map((c, i, arr) => ({
        ...c,
        id: `${c.kind}-${i}`,
        number: `${String(i + 1).padStart(3, '0')}/${String(arr.length).padStart(3, '0')}`,
    }));

export const CARDS = {
    experience: ALL.filter(c => c.kind === 'experience' || c.kind === 'education'),
    project: ALL.filter(c => c.kind === 'project'),
    cert: ALL.filter(c => c.kind === 'cert'),
    skill: ALL.filter(c => c.kind === 'skill'),
    hobby: ALL.filter(c => c.kind === 'hobby'),
};

export const ALL_CARDS = ALL;

export const CARD_KIND_LABEL = {
    project: 'Project', cert: 'Certification', hobby: 'Hobby',
    skill: 'Skill', experience: 'Experience', education: 'Education',
};
