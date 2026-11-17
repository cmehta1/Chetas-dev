/* Long-form card copy for ChetasOS. Facts come from journeyData (projects, experience,
   zone highlights); this file adds the wording used on card fronts, backs and detail views.
   Card artwork is specified separately in art.js. */

export const PROJECT_COPY = {
    'Event Management System': {
        group: 'GTU', where: 'Gujarat Technological University',
        stack: ['Visual Basic', 'SQL'],
        summary: 'A platform connecting decorators, caterers and party plots with people planning an event.',
        description: 'One of my first complete systems, built at GTU with Visual Basic and SQL. Service providers such as decorators, caterers and party plots list what they offer, and users organise an event by choosing and booking those services in one place.',
    },
    'Hotel Management System': {
        group: 'GTU', where: 'Gujarat Technological University',
        stack: ['Systems analysis', 'Documentation'],
        summary: 'An in-depth study of hotel management modules, documented and presented to the whole department.',
        description: 'This project started with research rather than code. I studied the modules a hotel management system needs, wrote the complete system documentation, and presented the design to the entire department.',
    },
    'Inventory & Invoice Management': {
        group: 'GTU', where: 'Capstone with L&T Infotech',
        stack: ['.NET', 'Java', 'JSP', 'MySQL'],
        summary: 'Capstone at Larsen & Toubro: turning a manual invoice and inventory process into software.',
        description: "My capstone project with L&T Infotech at Larsen & Toubro, India's largest engineering company. Invoices and inventory were being tracked by hand, so I built a system with .NET, Java, JSP and MySQL that tracks both automatically.",
        badge: 'Capstone',
    },
    'Home Automation System': {
        group: 'GTU', where: 'Gujarat, India',
        stack: ['Embedded', 'Mobile control', 'Scheduling'],
        summary: 'Affordable whole-house automation, controlled by remote or phone. It made the local newspaper.',
        description: 'An affordable system for automating an entire house. Appliances can be switched by remote or from a mobile phone and put on a schedule, and door locks can be controlled too. The project was featured in the local newspaper.',
        badge: 'In the news',
    },
    'Minion vs Alien 3D Game': {
        group: 'SUNY Binghamton', where: 'Hackathon, Binghamton',
        stack: ['Java', 'jMonkeyEngine', 'Blender', 'XML'],
        summary: 'A 3D shooter built during a hackathon, with jMonkeyEngine and Blender models.',
        description: 'Built during a hackathon at Binghamton: a 3D game with shooting mechanics and level progression. Gameplay is written in Java and XML on jMonkeyEngine, with characters and scenes modelled in Blender.',
        badge: 'Hackathon',
    },
    'Secure Electronic Voting System': {
        group: 'SUNY Binghamton', where: 'SUNY Binghamton',
        stack: ['C', 'RSA', 'Concurrency', 'Sockets'],
        summary: 'A voting system in C where every ballot travels RSA-encrypted.',
        description: 'Written in C: concurrent LA and VF servers plus a voter client. RSA encryption and decryption protect every ballot transaction between them.',
    },
    'APEX Simulator': {
        group: 'SUNY Binghamton', where: 'SUNY Binghamton',
        stack: ['C', 'Pipelining', 'Out-of-order execution'],
        summary: 'A simulator of an out-of-order CPU pipeline, written in C.',
        description: 'A computer architecture simulator for the APEX processor pipeline, written in C. It models out-of-order execution with an issue queue, register renaming and a reorder buffer.',
    },
    'Retail Business Management System': {
        group: 'SUNY Binghamton', where: 'SUNY Binghamton',
        stack: ['Oracle 11g', 'PL/SQL', 'Java', 'JDBC'],
        summary: 'A retail database application on Oracle 11g, with PL/SQL logic and a Java front end.',
        description: 'I designed a normalised relational schema for a retail business on Oracle 11g, wrote the business logic in PL/SQL, and built a Java front end that connects through JDBC.',
    },
};

export const CERT_COPY = {
    'OCI Generative AI Professional': {
        group: 'Oracle',
        summary: "Oracle's professional certification for building with large language models on OCI.",
        description: 'Covers how large language models work, prompt engineering and fine-tuning, retrieval-augmented generation, and building LLM applications on the OCI Generative AI service.',
    },
    'OCI Foundations Associate': {
        group: 'Oracle',
        summary: 'The foundation certification for Oracle Cloud Infrastructure.',
        description: 'Core Oracle Cloud Infrastructure concepts: regions and availability domains, compute, storage, networking, identity and security, and governance and pricing.',
    },
    'Oracle AI Vector Search Professional': {
        group: 'Oracle',
        summary: 'Semantic search and RAG with vectors inside Oracle Database.',
        description: 'Covers vector embeddings, the VECTOR data type, similarity search and vector indexes in Oracle Database, and using them to build retrieval-augmented generation (RAG) applications.',
    },
    'Salesforce Administrator': {
        group: 'Salesforce',
        summary: 'Configuring and managing Salesforce for a business.',
        description: "Earned at Midway Dental Supply while working on the company's Salesforce platform. Covers users and security, data management, process automation, and reports and dashboards.",
    },
    'Salesforce Developer': {
        group: 'Salesforce',
        summary: 'Building custom business logic on Salesforce with APEX and SOQL.',
        description: 'Earned at Midway Dental Supply alongside building custom APEX software and SOQL reports. Covers APEX, SOQL, triggers and the Salesforce data model.',
    },
};

export const HOBBY_COPY = {
    cricket: {
        badge: 'U-19 champion',
        summary: 'Youngest player on a winning Under-19 team, at 15.',
        description: 'I developed a deep love for cricket at school. I played for the school team at regional level three years in a row, and in 2005, at just 15, I was the youngest player on the Under-19 team that won the tournament.',
    },
    football: {
        summary: 'Fast, physical, and all about the team.',
        description: 'Football is pure teamwork: quick decisions, constant movement, and trusting the people around you.',
    },
    boxing: {
        summary: 'Footwork, focus and staying calm under pressure.',
        description: 'Boxing is as much about discipline, footwork and focus as it is about strength.',
    },
    tennis: {
        summary: 'One-on-one, and every point is a fresh start.',
        description: 'Tennis rewards patience and recovery. Whatever happened on the last point, the next one starts at zero.',
    },
    chess: {
        summary: 'Thinking several moves ahead, on and off the board.',
        description: 'Chess is strategy in its purest form: read the position, plan ahead, and adapt when your opponent does something unexpected.',
    },
    space: {
        summary: 'Rockets, planets and the big questions.',
        description: 'Space science is the curiosity that never switched off: how rockets reach orbit, what is out there, and how we find out.',
    },
    drawing: {
        badge: 'Award winner',
        summary: 'Won awards for drawing at school.',
        description: 'Drawing was one of my strongest interests at school, where I won awards for it, and for dance too.',
    },
    coding: {
        summary: 'Started with C in high school and never stopped.',
        description: 'Learning C in high school was my first window into programming. I was fascinated by how computers could simulate intelligence and bring virtual worlds to life, and that spark shaped my whole career.',
    },
    gaming: {
        summary: 'The reason this portfolio is a game.',
        description: 'Games are where design, engineering and storytelling meet. That is why the other half of this site is a playable journey.',
    },
};

export const EXPERIENCE_COPY = {
    7: {
        summary: 'Building clinical ordering services and AI-enabled apps used by physicians and nurses.',
    },
    6: {
        summary: 'Five years of RESTful clinical services for ordering, formulary and patient cost.',
    },
    5: {
        summary: 'First US role: Salesforce, Python and AngularJS across the whole stack.',
    },
};

export const EDUCATION_COPY = {
    'M.S. Computer Science': {
        summary: 'Graduate study at SUNY Binghamton, finishing with a 3.7 GPA.',
        description: 'A new country, a harsh winter and a different academic culture. Coursework in Computer Architecture, Operating Systems, Algorithms and Databases, and projects including an out-of-order CPU simulator and an RSA-secured voting system.',
    },
    'B.E. Computer Science & Engineering': {
        summary: 'From an average first-year student to a top ranker.',
        description: 'Networks, databases, software engineering and programming languages. I delivered lectures on Design & Analysis of Algorithms, was one of three students chosen to maintain the college website, and finished with a capstone at Larsen & Toubro.',
    },
};

/* Skills */
export const SKILL_COPY = {
    java: { summary: 'My main language for over a decade, from GTU coursework to clinical REST services at Cerner and Oracle Health.' },
    javascript: { summary: 'Front-end work since college: Bootstrap and AngularJS apps at Midway, then React.' },
    typescript: { summary: 'Part of the stack at Oracle Health.' },
    python: { summary: 'Custom business software at Midway Dental Supply, alongside Salesforce APEX.' },
    c: { summary: 'My first language, in high school. Later the APEX simulator and the RSA voting system.' },
    cplusplus: { summary: 'Object-oriented programming from my GTU years.' },
    sql: { summary: 'MySQL at GTU, PL/SQL at Binghamton, SQL and SOQL reports at Midway, Oracle SQL at Oracle Health.' },
    react: { summary: 'Learned at Binghamton, then used to build UIs at Cerner and Oracle Health.' },
    restapis: { summary: 'RESTful clinical services with JAX-RS, Jersey and Swagger, used by physicians and nurses.' },
    angularjs: { summary: 'Front-end web apps at Midway Dental Supply.' },
    salesforce: { summary: 'Certified Administrator and Developer; built APEX solutions and SOQL reports at Midway.' },
    mcp: { summary: 'Model Context Protocol: connecting AI agents to tools and data in apps at Oracle Health.' },
    agents: { summary: 'Building AI agents with DeepAgents at Oracle Health.' },
    a2ui: { summary: 'Agent-driven user interfaces with A2UI at Oracle Health.' },
    codex: { summary: 'AI coding agents as part of the everyday engineering workflow.' },
    algorithms: { summary: 'Delivered lectures on Design & Analysis of Algorithms at GTU; graduate algorithms at Binghamton.' },
    dsa: { summary: 'The foundation under everything else, from GTU onward.' },
    os: { summary: 'Graduate Operating Systems coursework at Binghamton.' },
    comparch: { summary: 'Graduate Computer Architecture at Binghamton, including the out-of-order APEX simulator.' },
    databases: { summary: 'Databases at Binghamton and the Oracle PL/SQL retail system.' },
    compsec: { summary: 'Computer security at GTU, and RSA encryption in the Binghamton voting system.' },
    maths: { summary: 'Scored 99/100 in Mathematics in secondary school exams.' },
    science: { summary: 'Scored a perfect 100/100 in Science in secondary school exams.' },
    physics: { summary: 'Part of the science stream at school.' },
    chemistry: { summary: 'Part of the science stream at school.' },
    socialscience: { summary: 'A core subject through school in Gujarat.' },
};
