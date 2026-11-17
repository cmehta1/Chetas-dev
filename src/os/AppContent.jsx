import AboutApp from './apps/AboutApp';
import TerminalApp from './apps/TerminalApp';
import ContactApp from './apps/ContactApp';
import RouteApp from './apps/RouteApp';
import CardDeck from './components/CardDeck';
import { CARDS, yearsOfExperience } from './data';

const DECKS = {
    experience: {
        kind: 'experience',
        heading: 'Career deck',
        intro: `${yearsOfExperience()} years, from a dental supply company in Michigan to clinical software used by physicians and nurses nationwide, plus the two degrees that started it.`,
    },
    projects: {
        kind: 'project',
        heading: 'Project deck',
        intro: 'Things I built at GTU and SUNY Binghamton, from a home automation system that made the local paper to an out-of-order CPU simulator.',
    },
    certs: {
        kind: 'cert',
        heading: 'Certification deck',
        intro: 'Credentials across Oracle Cloud, generative AI, vector search and Salesforce.',
    },
    skills: {
        kind: 'skill',
        heading: 'Skill deck',
        intro: 'Languages, frameworks, AI tooling and the foundations under them. Each card shows a self-rating and where I used it.',
    },
    hobbies: {
        kind: 'hobby',
        heading: 'Hobby deck',
        intro: 'What I do away from the keyboard, starting with cricket.',
    },
};

export default function AppContent({ id, api }) {
    switch (id) {
        case 'about': return <AboutApp api={api} />;
        case 'terminal': return <TerminalApp api={api} />;
        case 'contact': return <ContactApp api={api} />;
        case 'route': return <RouteApp />;
        default: {
            const d = DECKS[id];
            if (!d) return null;
            return <CardDeck cards={CARDS[d.kind]} heading={d.heading} intro={d.intro} mobile={api.mobile} />;
        }
    }
}
