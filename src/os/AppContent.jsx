import AboutApp from './apps/AboutApp';
import ExperienceApp from './apps/ExperienceApp';
import SkillsApp from './apps/SkillsApp';
import TerminalApp from './apps/TerminalApp';
import ContactApp from './apps/ContactApp';
import CardDeck from './components/CardDeck';
import { CARDS } from './data';

const DECKS = {
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
    hobbies: {
        kind: 'hobby',
        heading: 'Hobby deck',
        intro: 'What I do away from the keyboard, starting with cricket.',
    },
};

export default function AppContent({ id, api }) {
    switch (id) {
        case 'about': return <AboutApp api={api} />;
        case 'experience': return <ExperienceApp api={api} />;
        case 'skills': return <SkillsApp />;
        case 'terminal': return <TerminalApp api={api} />;
        case 'contact': return <ContactApp api={api} />;
        case 'projects':
        case 'certs':
        case 'hobbies': {
            const d = DECKS[id];
            return <CardDeck cards={CARDS[d.kind]} heading={d.heading} intro={d.intro} mobile={api.mobile} />;
        }
        default: return null;
    }
}
