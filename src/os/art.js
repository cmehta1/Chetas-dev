/* Illustration spec for every card: a style (`theme`), a colour `palette`, the central
   subject (`main`, an icon name or `logo`) and six supporting icons (`nodes`).
   Rendered by components/CardIllustration.jsx; styles live in illustration/themes.jsx.
   Icon names are Lucide icons, or custom glyphs prefixed with `x:` (see components/Glyphs.jsx). */

const LANG_NODES = ['Code', 'Braces', 'Terminal', 'Bug', 'GitBranch', 'Laptop'];
const WEB_NODES = ['AppWindow', 'Server', 'Globe', 'Plug', 'Layers', 'Smartphone'];

export const PROJECT_ART = {
    'Reimagine EHR: Agentic AI Workflows': { theme: 'neon', palette: 'violet', main: 'Bot', nodes: ['HeartPulse', 'PlugZap', 'Puzzle', 'Workflow', 'Sparkles', 'LayoutDashboard'] },
    'EHR Order App': { theme: 'glass', palette: 'ocean', main: 'ClipboardList', nodes: ['Stethoscope', 'Pill', 'Server', 'Calculator', 'ShieldCheck', 'Users'] },
    'Online Hindu Temple': { theme: 'poster', palette: 'sunset', main: 'x:temple', nodes: ['Flame', 'BellRing', 'Flower2', 'Users', 'CalendarCheck', 'Globe'] },
    Giberish: { theme: 'paper', palette: 'peach', main: 'Flower2', nodes: ['Sparkles', 'Gem', 'Wind', 'Moon', 'Star', 'Sun'] },
    'Event Management System': { theme: 'poster', palette: 'sunset', main: 'PartyPopper', nodes: ['Flower2', 'Utensils', 'Music', 'CalendarCheck', 'Users', 'Cake'] },
    'Hotel Management System': { theme: 'iso', palette: 'peach', main: 'ConciergeBell', nodes: ['Bed', 'Key', 'Luggage', 'ClipboardList', 'CreditCard', 'Coffee'] },
    'Inventory & Invoice Management': { theme: 'glass', palette: 'sand', main: 'Warehouse', nodes: ['Package', 'Receipt', 'Barcode', 'Truck', 'Database', 'ChartBar'] },
    'Home Automation System': { theme: 'hub', palette: 'violet', main: 'House', nodes: ['Lightbulb', 'Lock', 'Tv', 'Wifi', 'Clock', 'Smartphone'] },
    'Minion vs Alien 3D Game': { theme: 'neon', palette: 'magenta', main: 'Gamepad2', nodes: ['Ghost', 'Rocket', 'Crosshair', 'Trophy', 'Box', 'Code'] },
    'Secure Electronic Voting System': { theme: 'paper', palette: 'sky', main: 'Vote', nodes: ['ShieldCheck', 'KeyRound', 'Server', 'Lock', 'Users', 'Fingerprint'] },
    'APEX Simulator': { theme: 'circuit', palette: 'forest', main: 'Cpu', nodes: ['MemoryStick', 'Binary', 'Workflow', 'Gauge', 'Layers', 'Timer'] },
    'Retail Business Management System': { theme: 'iso', palette: 'mint', main: 'ShoppingCart', nodes: ['Store', 'Tag', 'Database', 'Receipt', 'CreditCard', 'ChartLine'] },
};

export const CERT_ART = {
    'OCI Generative AI Professional': { theme: 'glass', palette: 'lavender', main: 'Sparkles', nodes: ['Brain', 'Bot', 'Cloud', 'MessageSquare', 'Search', 'Layers'] },
    'OCI Foundations Associate': { theme: 'bubbles', palette: 'sky', main: 'Cloud', nodes: ['Server', 'Network', 'Shield', 'HardDrive', 'Globe', 'Settings'] },
    'Oracle AI Vector Search Professional': { theme: 'orbit', palette: 'ocean', main: 'ScatterChart', nodes: ['Search', 'Database', 'Brain', 'Layers', 'Sparkles', 'Network'] },
    'Salesforce Administrator': { theme: 'iso', palette: 'sky', main: 'logo', logo: 'salesforce', nodes: ['Users', 'Settings', 'Workflow', 'ChartBar', 'Shield', 'Database'] },
    'Salesforce Developer': { theme: 'neon', palette: 'ocean', main: 'logo', logo: 'salesforce', nodes: ['Code2', 'Braces', 'Database', 'Zap', 'Bug', 'GitBranch'] },
};

export const HOBBY_ART = {
    cricket: { theme: 'paper', palette: 'forest', main: 'x:cricket', nodes: ['Trophy', 'Medal', 'Users', 'Timer', 'Target', 'Award'] },
    football: { theme: 'iso', palette: 'lime', main: 'x:football', nodes: ['Trophy', 'Users', 'Timer', 'Target', 'Flag', 'Footprints'] },
    boxing: { theme: 'poster', palette: 'crimson', main: 'x:glove', nodes: ['Dumbbell', 'Timer', 'Flame', 'Target', 'Medal', 'Activity'] },
    pickleball: { theme: 'hub', palette: 'teal', main: 'x:paddle', nodes: ['Trophy', 'Users', 'Timer', 'Sun', 'Target', 'Activity'] },
    fitness: { theme: 'neon', palette: 'crimson', main: 'Dumbbell', nodes: ['HeartPulse', 'Timer', 'Flame', 'Activity', 'Footprints', 'Trophy'] },
    tennis: { theme: 'poster', palette: 'sand', main: 'x:racket', nodes: ['x:tennisball', 'Trophy', 'Timer', 'Target', 'Sun', 'Medal'] },
    chess: { theme: 'iso', palette: 'slate', main: 'x:knight', nodes: ['Crown', 'Brain', 'Timer', 'Swords', 'Target', 'Trophy'] },
    space: { theme: 'orbit', palette: 'violet', main: 'Telescope', nodes: ['Rocket', 'Orbit', 'Satellite', 'Moon', 'Star', 'Globe'] },
    drawing: { theme: 'paper', palette: 'lavender', main: 'Pencil', nodes: ['Palette', 'Brush', 'Award', 'Feather', 'Star', 'Sparkles'] },
    coding: { theme: 'neon', palette: 'teal', main: 'Code2', nodes: ['Terminal', 'Braces', 'Bug', 'GitBranch', 'Laptop', 'Brain'] },
    reading: { theme: 'paper', palette: 'sand', main: 'BookOpen', nodes: ['Library', 'Bookmark', 'Lightbulb', 'Coffee', 'Brain', 'Feather'] },
    traveling: { theme: 'orbit', palette: 'teal', main: 'Plane', nodes: ['Luggage', 'Map', 'Camera', 'Mountain', 'Compass', 'Globe'] },
    gaming: { theme: 'glass', palette: 'magenta', main: 'Gamepad2', nodes: ['Joystick', 'Trophy', 'Ghost', 'Rocket', 'Star', 'Monitor'] },
};

export const EXPERIENCE_ART = {
    7: { theme: 'hub', palette: 'crimson', main: 'HeartPulse', nodes: ['Stethoscope', 'Pill', 'Bot', 'Server', 'ShieldCheck', 'BellRing'] },
    6: { theme: 'glass', palette: 'ocean', main: 'Stethoscope', nodes: ['Pill', 'ClipboardList', 'Server', 'Calculator', 'Users', 'ChartLine'] },
    5: { theme: 'bubbles', palette: 'mint', main: 'x:tooth', nodes: ['Cloud', 'Code', 'Database', 'ChartBar', 'Package', 'Laptop'] },
};

export const EDUCATION_ART = {
    'M.S. Computer Science': { theme: 'paper', palette: 'ocean', main: 'GraduationCap', nodes: ['Cpu', 'Brain', 'Database', 'Shield', 'BookOpen', 'Snowflake'] },
    'B.E. Computer Science & Engineering': { theme: 'poster', palette: 'peach', main: 'School', nodes: ['BookOpen', 'Network', 'Database', 'Code', 'Trophy', 'Globe'] },
};

export const SKILL_ART = {
    java: { theme: 'hub', palette: 'sunset', main: 'logo', logo: 'java', nodes: LANG_NODES },
    javascript: { theme: 'poster', palette: 'sand', main: 'logo', logo: 'javascript', nodes: LANG_NODES },
    typescript: { theme: 'glass', palette: 'ocean', main: 'logo', logo: 'typescript', nodes: LANG_NODES },
    python: { theme: 'iso', palette: 'mint', main: 'logo', logo: 'python', nodes: LANG_NODES },
    c: { theme: 'blueprint', palette: 'slate', main: 'logo', logo: 'c', nodes: ['Cpu', 'MemoryStick', 'Terminal', 'Binary', 'Bug', 'Code'] },
    cplusplus: { theme: 'blueprint', palette: 'ocean', main: 'logo', logo: 'cplusplus', nodes: ['Boxes', 'Layers', 'Terminal', 'Cpu', 'Bug', 'Code'] },
    sql: { theme: 'iso', palette: 'sky', main: 'Database', nodes: ['Table', 'Search', 'Server', 'Filter', 'Key', 'ChartBar'] },
    react: { theme: 'orbit', palette: 'teal', main: 'logo', logo: 'react', nodes: WEB_NODES },
    restapis: { theme: 'circuit', palette: 'ocean', main: 'logo', logo: 'swagger', nodes: ['Server', 'Globe', 'Plug', 'Stethoscope', 'ShieldCheck', 'Network'] },
    angularjs: { theme: 'paper', palette: 'crimson', main: 'logo', logo: 'angularjs', nodes: WEB_NODES },
    salesforce: { theme: 'bubbles', palette: 'sky', main: 'logo', logo: 'salesforce', nodes: ['Users', 'Workflow', 'Database', 'ChartBar', 'Code2', 'Cloud'] },
    mcp: { theme: 'circuit', palette: 'teal', main: 'PlugZap', nodes: ['Bot', 'Database', 'Wrench', 'Cable', 'Server', 'FileCode'] },
    agents: { theme: 'hub', palette: 'violet', main: 'Bot', nodes: ['Brain', 'Workflow', 'Wrench', 'MessageSquare', 'Search', 'Sparkles'] },
    agentskills: { theme: 'iso', palette: 'lavender', main: 'Puzzle', nodes: ['Bot', 'FileCode', 'Wrench', 'BookOpen', 'Sparkles', 'Workflow'] },
    a2ui: { theme: 'glass', palette: 'lavender', main: 'LayoutDashboard', nodes: ['Bot', 'AppWindow', 'MousePointer2', 'Smartphone', 'Sparkles', 'Palette'] },
    codex: { theme: 'neon', palette: 'slate', main: 'SquareTerminal', nodes: ['Bot', 'Code2', 'GitBranch', 'Bug', 'Sparkles', 'FileCode'] },
    algorithms: { theme: 'blueprint', palette: 'ocean', main: 'ArrowDownUp', nodes: ['GitFork', 'Timer', 'Binary', 'Infinity', 'Search', 'Layers'] },
    dsa: { theme: 'blueprint', palette: 'forest', main: 'ListTree', nodes: ['Boxes', 'Hash', 'GitFork', 'Layers', 'Binary', 'Network'] },
    os: { theme: 'neon', palette: 'ocean', main: 'Laptop', nodes: ['Cpu', 'MemoryStick', 'HardDrive', 'Terminal', 'Settings', 'Layers'] },
    comparch: { theme: 'circuit', palette: 'magenta', main: 'Microchip', nodes: ['Cpu', 'MemoryStick', 'Binary', 'Zap', 'Gauge', 'Cable'] },
    databases: { theme: 'iso', palette: 'slate', main: 'Server', nodes: ['Database', 'HardDrive', 'Key', 'Search', 'Shield', 'Layers'] },
    compsec: { theme: 'hub', palette: 'forest', main: 'ShieldCheck', nodes: ['Lock', 'KeyRound', 'Fingerprint', 'Bug', 'Eye', 'Server'] },
    maths: { theme: 'blueprint', palette: 'forest', main: 'Sigma', nodes: ['Pi', 'Calculator', 'Infinity', 'ChartLine', 'Binary', 'Hash'] },
    science: { theme: 'orbit', palette: 'lime', main: 'Atom', nodes: ['FlaskConical', 'Microscope', 'Magnet', 'Orbit', 'Sun', 'Zap'] },
    physics: { theme: 'orbit', palette: 'sunset', main: 'Magnet', nodes: ['Atom', 'Zap', 'Orbit', 'Gauge', 'Sun', 'Timer'] },
    chemistry: { theme: 'bubbles', palette: 'magenta', main: 'FlaskConical', nodes: ['TestTube', 'Atom', 'Flame', 'FlaskRound', 'Microscope', 'Droplet'] },
    socialscience: { theme: 'paper', palette: 'sky', main: 'Globe', nodes: ['Map', 'Landmark', 'BookOpen', 'Users', 'Languages', 'Compass'] },
};
