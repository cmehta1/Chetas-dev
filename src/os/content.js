/* Long-form card copy for ChetasOS. Facts come from journeyData, the zone highlights and
   Chetas's public LinkedIn profile; this file adds the wording used on card fronts, backs
   and detail views. Card artwork is specified separately in art.js. */

export const PROJECT_COPY = {
    'Reimagine EHR: Agentic AI Workflows': {
        group: 'Oracle Health', where: 'Oracle Health',
        stack: ['MCP', 'Agent Skills', 'DeepAgents', 'A2UI', 'Java'],
        summary: 'Agentic AI workflows for the next-generation EHR, built with MCP servers and Agent Skills.',
        description: "Part of Oracle Health's effort to reimagine the electronic health record. I build agentic AI workflows in which agents reach tools and data through MCP servers, follow packaged Agent Skills for repeatable tasks, and present results through agent-driven interfaces with A2UI, drawing on years of building Java services for clinical ordering.",
        highlights: [
            'Designs and builds AI agents that work through MCP servers and Agent Skills',
            'Uses DeepAgents for multi-step agent workflows and A2UI for agent-driven UI',
            'Brings years of clinical-ordering experience into AI-first EHR workflows',
        ],
        badge: 'Current',
    },
    'EHR Order App': {
        group: 'Cerner', where: 'Cerner Corporation',
        stack: ['Java', 'JAX-RS', 'Jersey', 'Swagger', 'SQL', 'Jenkins'],
        summary: 'The services behind clinical ordering: create, refill, cancel and discontinue orders.',
        description: "At Cerner I worked on the order app for physicians and nurses. I built the RESTful services that let clinicians create, refill, cancel or discontinue orders for patients, along with Java services that look up formularies and compute the lowest out-of-pocket cost across a patient's health plans.",
        highlights: [
            'RESTful web services with JAX-RS, Jersey Client and Swagger',
            'Formulary lookups and minimum out-of-pocket cost across health plans',
            'Unit and functional tests with a custom Java test framework; CI with Jenkins',
        ],
    },
    'Online Hindu Temple': {
        group: 'Side projects', where: 'onlinehindutemple.com',
        link: 'https://onlinehindutemple.com',
        stack: ['3D in the browser', 'Web', 'Design'],
        summary: 'A living 3D mandir in the browser: darshan, aarti, offerings and japa from anywhere.',
        description: 'A doorway for the days you cannot get to a mandir. Visitors step inside one of seven temples, each built in its own tradition, and ring the bell, offer flowers, light a diya or count japa on a mala. Aarti happens five times a day at the hours of a temple in India, so devotees around the world raise their thalis together, and families in different cities can stand side by side with an invite link. Designed and developed end to end; free, with no app or account needed.',
        highlights: [
            'Seven temples: Siddhivinayak, Himalayan Shiva, Ram, Krishna, Durga, Hanuman and Lakshmi',
            'Live aarti five times a day, offerings, japa and family darshan by invite link',
            'Daily panchang, a teaching and a mantra of the day, in five languages',
        ],
        badge: 'Live',
    },
    Giberish: {
        group: 'Side projects', where: 'giberish.vercel.app',
        link: 'https://giberish.vercel.app',
        stack: ['Web', '3D experiences', 'Design'],
        summary: 'An interactive fragrance house for pure attars, where you feel a scent before you buy it.',
        description: 'A store that turns fragrance into an experience. The Scent Kundli asks ten small questions and reads your scent chart to match fragrances and a bespoke attar. Scent Worlds let you step inside each fragrance, Scent Alchemy lets you compose notes in a glass orb, and a virtual boutique, layering lab and scent journey show how a fragrance unfolds.',
        highlights: [
            'Scent Kundli: ten questions to a scent archetype and a bespoke attar',
            'Immersive Scent Worlds, Scent Alchemy orb and a walk-through virtual boutique',
            'Layering Lab and Scent Journey showing top, heart and base notes',
        ],
        badge: 'Live',
    },
    'Event Management System': {
        group: 'GTU', where: 'Gujarat Technological University',
        stack: ['Visual Basic', 'SQL'],
        summary: 'A platform connecting decorators, caterers and party plots with people planning an event.',
        description: 'One of my first complete systems, designed and built at GTU. It has two sides: decorators, caterers and party plots list their services and facilities, and users browse, book and organise an entire event in one place instead of chasing each vendor separately.',
        highlights: [
            'Provider side for decorators, caterers and party plots to list services',
            'User side to plan, book and organise an event end to end',
        ],
    },
    'Hotel Management System': {
        group: 'GTU', where: 'Gujarat Technological University',
        stack: ['Systems analysis', 'Documentation'],
        summary: 'An in-depth study of hotel management modules, documented and presented to the whole department.',
        description: 'This project started with research rather than code. After a comprehensive study of how hotels operate, I designed the modules a hotel management system needs, wrote the complete system documentation, and presented the design to the entire department.',
        highlights: [
            'Researched hotel operations and broke them into system modules',
            'Wrote full documentation and presented it to the department',
        ],
    },
    'Inventory & Invoice Management': {
        group: 'GTU', where: 'Capstone with L&T Infotech',
        stack: ['.NET', 'Java', 'JSP', 'AJAX', 'MySQL', 'MS Access', 'Visio'],
        summary: 'Capstone at Larsen & Toubro: turning a manual invoice and inventory process into a web app.',
        description: "My capstone with L&T Infotech for employees of Larsen & Toubro's HMD-IT department. Working with two other students, we studied the existing manual process, anticipated where it broke down, and built a web application that maintains all the data and tracks invoices and inventory automatically.",
        highlights: [
            'Replaced manual invoice and inventory tracking with a web application',
            'Built with .NET, JSP, AJAX and JavaScript on MySQL and MS Access',
            "Completed for L&T's HMD-IT department (May 2013)",
        ],
        badge: 'Capstone',
    },
    'Home Automation System': {
        group: 'GTU', where: 'Gujarat, India',
        stack: ['Embedded', 'Mobile control', 'Scheduling'],
        summary: 'Affordable whole-house automation, controlled by remote or phone. It made the local newspaper.',
        description: 'A low-cost, efficient system for automating an entire house, born out of our interest in research. Fans (with a regulator), lights, AC, an RO plant and a security alarm can all be switched by remote or from a mobile phone, scheduled with alarms, and door locks controlled, without the voltage drop that wastes energy. A local newspaper article about the work encouraged us to take it further.',
        highlights: [
            'Fans, lights, AC, RO plant and security alarm on one system',
            'Remote and mobile control, scheduled alarms and door locks',
            'Featured in the local newspaper (2014)',
        ],
        badge: 'In the news',
    },
    'Minion vs Alien 3D Game': {
        group: 'SUNY Binghamton', where: 'Hackathon, Binghamton',
        stack: ['Java', 'jMonkeyEngine', 'Blender', 'XML'],
        summary: 'A 3D shooter built during a hackathon, with jMonkeyEngine and Blender models.',
        description: 'Built during a hackathon at Binghamton. The minion shoots down aliens and their spaceship to earn points and move to the next round. It runs on jMonkeyEngine, which had been released just a year earlier, with characters modelled in Blender and gameplay written in Java with an XML-driven front end.',
        highlights: [
            'Shooting mechanics, scoring and round progression',
            'Characters modelled in Blender; gameplay in Java and XML',
        ],
        badge: 'Hackathon',
    },
    'Secure Electronic Voting System': {
        group: 'SUNY Binghamton', where: 'SUNY Binghamton',
        stack: ['C', 'RSA', 'Concurrency', 'Sockets'],
        summary: 'A voting system in C where every ballot travels RSA-encrypted.',
        description: "Written entirely in C: a Legitimization Agency (LA) server, a concurrent Voting Facility (VF) server and a voter client. Every transaction is protected with RSA encryption and decryption. The system keeps records of each voter's citizenship status, validation number and voting history alongside the vote tallies, and checks what a voter enters against those records before a ballot is accepted.",
        highlights: [
            'Legitimization Agency server, concurrent Voting Facility server and voter client',
            'RSA encryption and decryption on every transaction',
            'Voter validation against stored records before counting',
        ],
    },
    'APEX Simulator': {
        group: 'SUNY Binghamton', where: 'SUNY Binghamton',
        stack: ['C', 'Pipelining', 'Out-of-order execution'],
        summary: 'An out-of-order CPU pipeline simulator in C, at least 3x faster than the in-order version.',
        description: 'A computer architecture simulator for the APEX processor, written in C. It reads a program in assembly, then simulates it cycle by cycle with forwarding and pipelining. The out-of-order version uses multiple functional units, an issue queue, register renaming and a reorder buffer, issuing and completing several instructions at once. It runs at least 3x faster than the in-order version of the processor.',
        highlights: [
            'Forwarding, pipelining and cycle counting from assembly input',
            'Issue queue, register renaming, reorder buffer and multiple functional units',
            'At least 3x faster than the in-order processor',
        ],
    },
    'Retail Business Management System': {
        group: 'SUNY Binghamton', where: 'SUNY Binghamton',
        stack: ['Oracle 11g', 'PL/SQL', 'Java', 'JDBC'],
        summary: 'A retail database application on Oracle 11g, with PL/SQL logic and a Java front end.',
        description: 'I started from the requirements to draw a relational schema diagram, turned it into a relational model with its constraints, and normalised the tables. The business logic lives in Oracle PL/SQL on Oracle 11g Express, and a Java front end talks to it over JDBC.',
        highlights: [
            'Schema design, relational modelling and normalisation',
            'PL/SQL business logic on Oracle 11g',
            'Java front end connected through JDBC',
        ],
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
        description: "Earned at Midway Dental Supply while building out the company's Salesforce CRM for its sales team. Covers users and security, data management, process automation, and reports and dashboards.",
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
    pickleball: {
        summary: 'Quick rallies, soft dinks and a lot of laughs.',
        description: 'Pickleball mixes the reflexes of tennis with the strategy of a short court. Easy to pick up, hard to master, and always more fun with friends.',
    },
    fitness: {
        summary: 'Staying strong so everything else keeps working.',
        description: 'Regular training keeps the body and mind sharp. Strength, cardio and consistency matter more than any single workout.',
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
    reading: {
        summary: 'Books, articles and the occasional deep rabbit hole.',
        description: "Reading is how ideas travel. I read to learn, to unwind, and to borrow other people's ways of thinking, and I write the occasional article on LinkedIn too.",
    },
    traveling: {
        summary: 'New places, new food, new perspectives.',
        description: 'Moving from Gujarat to New York, Michigan and Kansas showed me how much a new place can change your perspective, and I keep exploring.',
    },
};

export const EXPERIENCE_COPY = {
    7: {
        summary: 'Promoted to Senior Member of Technical Staff; clinical ordering services and agentic AI.',
    },
    6: {
        summary: 'Five years of RESTful clinical services for ordering, formulary and patient cost.',
    },
    5: {
        summary: 'First US role: built out Salesforce CRM, Python tools and AngularJS apps.',
    },
};

export const EDUCATION_COPY = {
    'M.S. Computer Science': {
        summary: 'Graduate study at SUNY Binghamton, finishing with a 3.7 GPA.',
        description: 'A new country, a harsh winter and a different academic culture. Coursework in Computer Architecture, Operating Systems, Algorithms and Databases, and projects including an out-of-order CPU simulator and an RSA-secured voting system.',
    },
    'B.E. Computer Science & Engineering': {
        summary: 'From an average first-year student to a top ranker.',
        description: 'Networks, databases, software engineering and programming languages. I delivered lectures on Design & Analysis of Algorithms, was one of three students chosen to maintain the college website, helped organise Aahvan, a national-level tech festival, and finished with a capstone at Larsen & Toubro.',
    },
};

/* Skills: `summary` is the front of the card, `description` the back. */
export const SKILL_COPY = {
    java: {
        summary: 'My main language for over a decade, from GTU coursework to clinical REST services at Cerner and Oracle Health.',
        description: 'Java is the backbone of my career. I build RESTful services with JAX-RS, Jersey and JDBC for clinical ordering, write unit, integration and functional tests with JUnit and custom frameworks, and ship through Jenkins pipelines. Before that it powered my coursework and projects at GTU and Binghamton.',
    },
    javascript: {
        summary: 'Front-end work since college: Bootstrap and AngularJS apps at Midway, then React.',
        description: 'JavaScript is how I build what people see and touch. It started with college web projects, grew into Bootstrap and AngularJS apps at Midway Dental Supply, and today powers React front ends and interactive side projects like a 3D temple and this site.',
    },
    typescript: {
        summary: 'Part of the stack at Oracle Health.',
        description: 'TypeScript adds types to JavaScript so large codebases stay safe to change. It is part of my stack at Oracle Health.',
    },
    python: {
        summary: 'Custom business software at Midway Dental Supply, alongside Salesforce APEX.',
        description: 'Python is my go-to for automation and quick tooling. At Midway Dental Supply I built and maintained custom software in Python next to Salesforce APEX, and I still reach for it for scripts and data work.',
    },
    c: {
        summary: 'My first language, in high school. Later the APEX simulator and the RSA voting system.',
        description: 'C taught me how computers really work: memory, pointers and processes. I first learned it in high school, then used it for systems projects at Binghamton, including an out-of-order CPU simulator and a concurrent, RSA-secured voting system.',
    },
    cplusplus: {
        summary: 'Object-oriented programming from my GTU years.',
        description: 'C++ brought object-oriented design on top of C. I learned it at GTU, where it shaped how I think about classes, abstraction and performance-aware code.',
    },
    sql: {
        summary: 'MySQL at GTU, PL/SQL at Binghamton, SQL and SOQL reports at Midway, Oracle SQL at Oracle Health.',
        description: 'SQL is how I talk to data. I have designed schemas and normalised tables, written PL/SQL business logic on Oracle 11g, built SQL and SOQL reports for the sales team at Midway, and work with Oracle SQL at Oracle Health.',
    },
    react: {
        summary: 'Learned at Binghamton, then used to build UIs at Cerner and Oracle Health.',
        description: 'React is my front-end framework of choice: components, state and a fast feedback loop. I picked it up at Binghamton, used it at Cerner and Oracle Health, and built the interface you are using right now with it.',
    },
    restapis: {
        summary: 'RESTful clinical services with JAX-RS, Jersey and Swagger, used by physicians and nurses.',
        description: "REST APIs are where my work meets everyone else's. I design and build RESTful web services with JAX-RS, Jersey and Swagger for clinical ordering, and test them automatically with Postman collections run through Newman.",
    },
    angularjs: {
        summary: 'Front-end web apps at Midway Dental Supply.',
        description: 'AngularJS was my first single-page-app framework. At Midway Dental Supply I used it with Bootstrap and JavaScript to build web apps for the business.',
    },
    salesforce: {
        summary: 'Certified Administrator and Developer; built APEX solutions and SOQL reports at Midway.',
        description: "At Midway Dental Supply I built out the company's Salesforce CRM to fit the sales team's needs: custom APEX code following object-oriented design patterns, SOQL reports, and administration of the platform.",
    },
    mcp: {
        summary: 'Model Context Protocol: connecting AI agents to tools and data in apps at Oracle Health.',
        description: 'The Model Context Protocol is an open standard for giving AI agents access to tools and data. I use MCP servers at Oracle Health so agents reach tools and data through clear, well-defined interfaces instead of one-off integrations.',
    },
    agents: {
        summary: 'Building AI agents with DeepAgents at Oracle Health.',
        description: 'AI agents plan, call tools and work through multi-step tasks. I build them with DeepAgents at Oracle Health as part of reimagining the EHR, combining them with MCP, Agent Skills and A2UI.',
    },
    agentskills: {
        summary: 'Packaging know-how as reusable skills that AI agents load when they need them.',
        description: 'Agent Skills are folders of instructions, scripts and resources that an AI agent discovers and loads on demand. I use them in agentic workflows to teach agents repeatable tasks, so they stay consistent without stuffing everything into one prompt.',
    },
    a2ui: {
        summary: 'Agent-driven user interfaces with A2UI at Oracle Health.',
        description: 'A2UI lets an agent describe the interface it wants to show and have the app render it natively. I use it at Oracle Health so agents can present results and ask for input through real UI, not just chat.',
    },
    codex: {
        summary: 'AI coding agents as part of the everyday engineering workflow.',
        description: 'AI coding agents like Codex are part of how I build: drafting code, exploring unfamiliar areas and reviewing changes, while I stay responsible for design, correctness and the final call.',
    },
    algorithms: {
        summary: 'Delivered lectures on Design & Analysis of Algorithms at GTU; graduate algorithms at Binghamton.',
        description: 'Algorithms are the craft of solving problems efficiently. I delivered lectures on Design & Analysis of Algorithms as a student at GTU, studied them again at graduate level at Binghamton, and use that thinking whenever performance matters.',
    },
    dsa: {
        summary: 'The foundation under everything else, from GTU onward.',
        description: 'Data structures decide how fast and how cleanly software can work. Lists, trees, hash maps and graphs have been part of my toolkit since GTU, and they show up in every system I design.',
    },
    os: {
        summary: 'Graduate Operating Systems coursework at Binghamton.',
        description: 'Operating systems sit between programs and hardware: processes, scheduling, memory and concurrency. My graduate coursework at Binghamton, and Linux administration training before it, shaped how I reason about concurrent services.',
    },
    comparch: {
        summary: 'Graduate Computer Architecture at Binghamton, including the out-of-order APEX simulator.',
        description: 'Computer architecture is how processors actually execute code. At Binghamton I built an APEX pipeline simulator with forwarding, register renaming and a reorder buffer that ran at least 3x faster out of order.',
    },
    databases: {
        summary: 'Databases at Binghamton and the Oracle PL/SQL retail system.',
        description: 'Databases are where systems keep their truth. I have designed relational schemas and normalised them, written PL/SQL on Oracle, and built applications on Oracle, MySQL and MS Access.',
    },
    compsec: {
        summary: 'Computer security at GTU, and RSA encryption in the Binghamton voting system.',
        description: 'Security means designing for the people trying to break things. I studied it at GTU, trained in networking security, and applied RSA encryption across a concurrent voting system at Binghamton. In healthcare software it is part of every decision.',
    },
    maths: {
        summary: 'Scored 99/100 in Mathematics in secondary school exams.',
        description: 'Mathematics has always come naturally. I scored 99/100 in my secondary exams, and later taught Vedic and speed mathematics tricks to school students in Ankleshwar and Vadodara.',
    },
    science: {
        summary: 'Scored a perfect 100/100 in Science in secondary school exams.',
        description: 'Science was where curiosity started. I scored a perfect 100/100 in my secondary exams, came first in a district-level science quiz, and took part in science projects and competitions throughout school.',
    },
    physics: {
        summary: 'Part of the science stream at school.',
        description: 'Physics, as part of the science stream, taught me to model the world with equations and test ideas against reality, a habit that carries straight into engineering.',
    },
    chemistry: {
        summary: 'Part of the science stream at school.',
        description: 'Chemistry, as part of the science stream, was about careful experiments, precise measurement and understanding how small changes produce big effects.',
    },
    socialscience: {
        summary: 'A core subject through school in Gujarat.',
        description: 'Social science covered history, geography and civics: the context for how people and societies work.',
    },
};
