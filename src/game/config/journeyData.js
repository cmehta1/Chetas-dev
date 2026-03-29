export const JOURNEY = {
    name: 'Chetas Mehta',
    title: 'Oracle Health & AI | Software Engineer',
    email: 'chetas8090@gmail.com',
    linkedin: 'linkedin.com/in/chetasmehta',
    zones: [
        { id: 0, name: 'Childhood', city: 'Gujarat', yearStart: 1991, yearEnd: 1994, description: 'Where it all began...' },
        { id: 1, name: 'School', city: 'Gujarat', yearStart: 1994, yearEnd: 2009, description: 'First encounter with knowledge' },
        { id: 2, name: 'Engineering College', city: 'Gujarat', yearStart: 2009, yearEnd: 2013, description: 'B.E. in Computer Science & Engineering' },
        { id: 3, name: 'Flight to USA', city: 'India \u2708 USA', yearStart: 2014, yearEnd: 2014, description: 'New horizons await...' },
        { id: 4, name: 'Binghamton University', city: 'Binghamton, NY', yearStart: 2014, yearEnd: 2016, description: 'M.S. in Computer Science' },
        { id: 5, name: 'Midway Dental Supply', city: 'Livonia, MI', yearStart: 2016, yearEnd: 2017, description: 'Software Developer' },
        { id: 6, name: 'Cerner Corporation', city: 'Kansas City, MO', yearStart: 2017, yearEnd: 2022, description: 'Software Engineer II' },
        { id: 7, name: 'Oracle Health', city: 'Overland Park, KS', yearStart: 2022, yearEnd: 2026, description: 'Member of Technical Staff' },
        { id: 8, name: 'Hobbies', city: 'Life', yearStart: 2026, yearEnd: 2026, description: 'Beyond the code...' },
    ],
};

// Languages — shown separately from skills
export const LANGUAGES = [
    { id: 'english', label: 'English', proficiency: 5 },
    { id: 'gujarati', label: 'Gujarati', proficiency: 5 },
    { id: 'hindi', label: 'Hindi', proficiency: 4 },
];

// Skills with proficiency (1-5 stars). Same `id` in multiple zones = upgrade.
// key must be unique per star pickup.
export const SKILLS_DATA = [
    // Zone 1: School
    { key: 'maths_1', id: 'maths', label: 'Maths', zone: 1, proficiency: 5 },
    { key: 'science_1', id: 'science', label: 'Science', zone: 1, proficiency: 4 },
    { key: 'socialscience_1', id: 'socialscience', label: 'Social Science', zone: 1, proficiency: 4 },
    { key: 'chemistry_1', id: 'chemistry', label: 'Chemistry', zone: 1, proficiency: 4 },
    { key: 'physics_1', id: 'physics', label: 'Physics', zone: 1, proficiency: 3 },

    // Zone 2: College (GTU) — B.E. Computer Science
    { key: 'algorithms_2', id: 'algorithms', label: 'Algorithms', zone: 2, proficiency: 4 },
    { key: 'dsa_2', id: 'dsa', label: 'Data Structures', zone: 2, proficiency: 4 },
    { key: 'compsec_2', id: 'compsec', label: 'Computer Security', zone: 2, proficiency: 4 },
    { key: 'java_2', id: 'java', label: 'Java', zone: 2, proficiency: 4 },
    { key: 'javascript_2', id: 'javascript', label: 'JavaScript', zone: 2, proficiency: 4 },
    { key: 'c_2', id: 'c', label: 'C', zone: 2, proficiency: 4 },
    { key: 'cplusplus_2', id: 'cplusplus', label: 'C++', zone: 2, proficiency: 3 },
    { key: 'sql_2', id: 'sql', label: 'SQL', zone: 2, proficiency: 4 },

    // Zone 4: Masters (SUNY Binghamton) — M.S. Computer Science
    { key: 'java_4', id: 'java', label: 'Java', zone: 4, proficiency: 4 },
    { key: 'comparch_4', id: 'comparch', label: 'Computer Architecture', zone: 4, proficiency: 4 },
    { key: 'os_4', id: 'os', label: 'Operating Systems', zone: 4, proficiency: 4 },
    { key: 'algorithms_4', id: 'algorithms', label: 'Algorithms', zone: 4, proficiency: 4 },
    { key: 'databases_4', id: 'databases', label: 'Databases', zone: 4, proficiency: 4 },
    { key: 'javascript_4', id: 'javascript', label: 'JavaScript', zone: 4, proficiency: 4 },
    { key: 'react_4', id: 'react', label: 'React', zone: 4, proficiency: 4 },
    { key: 'c_4', id: 'c', label: 'C', zone: 4, proficiency: 4 },

    // Zone 5: Midway Dental Supply
    { key: 'python_5', id: 'python', label: 'Python', zone: 5, proficiency: 4 },
    { key: 'angularjs_5', id: 'angularjs', label: 'AngularJS', zone: 5, proficiency: 3 },
    { key: 'java_5', id: 'java', label: 'Java', zone: 5, proficiency: 4 },
    { key: 'salesforce_5', id: 'salesforce', label: 'Salesforce', zone: 5, proficiency: 3 },

    // Zone 6: Cerner Corporation
    { key: 'restapis_6', id: 'restapis', label: 'REST APIs', zone: 6, proficiency: 4 },
    { key: 'java_6', id: 'java', label: 'Java', zone: 6, proficiency: 4 },
    { key: 'react_6', id: 'react', label: 'React', zone: 6, proficiency: 4 },
    { key: 'sql_6', id: 'sql', label: 'SQL', zone: 6, proficiency: 4 },

    // Zone 7: Oracle Health
    { key: 'java_7', id: 'java', label: 'Java', zone: 7, proficiency: 4 },
    { key: 'react_7', id: 'react', label: 'React', zone: 7, proficiency: 4 },
    { key: 'typescript_7', id: 'typescript', label: 'TypeScript', zone: 7, proficiency: 4 },
    { key: 'mcp_7', id: 'mcp', label: 'MCP', zone: 7, proficiency: 4 },
    { key: 'agents_7', id: 'agents', label: 'Agents', zone: 7, proficiency: 4 },
    { key: 'codex_7', id: 'codex', label: 'Codex', zone: 7, proficiency: 4 },
    { key: 'a2ui_7', id: 'a2ui', label: 'A2UI', zone: 7, proficiency: 4 },
];

// Hobbies — displayed in Level 5
export const HOBBIES_DATA = [
    { id: 'cricket', label: 'Cricket', category: 'Sports' },
    { id: 'football', label: 'Football', category: 'Sports' },
    { id: 'boxing', label: 'Boxing', category: 'Sports' },
    { id: 'tennis', label: 'Tennis', category: 'Sports' },
    { id: 'chess', label: 'Chess', category: 'Sports' },
    { id: 'space', label: 'Space Science', category: 'Interests' },
    { id: 'drawing', label: 'Drawing', category: 'Interests' },
    { id: 'coding', label: 'Coding', category: 'Interests' },
    { id: 'gaming', label: 'Gaming', category: 'Interests' },
];

// Projects — shown on right side panel, grouped by zone
export const PROJECTS_DATA = [
    // Zone 2: Bachelors (GTU)
    {
        zone: 2,
        title: 'Event Management System',
        year: '2011',
        bullets: [
            'Built system for decorators, caterers & party-plots to provide services',
            'Users can organize events efficiently using the platform',
        ],
    },
    {
        zone: 2,
        title: 'Hotel Management System',
        year: '2012',
        bullets: [
            'Created documentation after in-depth study of hotel management modules',
            'Presented project slides to the entire department',
        ],
    },
    {
        zone: 2,
        title: 'Inventory & Invoice Management',
        year: '2012–13',
        bullets: [
            'Converted manual work to automated system with L&T Infotech',
            'Built with DotNet, Java, MySQL & JSP for tracking invoices & inventories',
        ],
    },
    {
        zone: 2,
        title: 'Home Automation System',
        year: '2014',
        bullets: [
            'Developed affordable full-house automation with remote & mobile control',
            'Featured in local newspaper; includes appliance scheduling & door locks',
        ],
    },

    // Zone 4: Masters (SUNY Binghamton)
    {
        zone: 4,
        title: 'Minion vs Alien 3D Game',
        year: '2015',
        bullets: [
            'Built 3D game at hackathon using JMonkey Engine & Blender',
            'Java + XML gameplay with shooting mechanics & level progression',
        ],
    },
    {
        zone: 4,
        title: 'Secure Electronic Voting System',
        year: '2015',
        bullets: [
            'Concurrent LA server & VF server with voter-client in C',
            'RSA encryption/decryption for secure ballot transactions',
        ],
    },
    {
        zone: 4,
        title: 'APEX Simulator',
        year: '2015',
        bullets: [
            'Computer Architecture pipelining simulator in C',
            'Out-of-order execution with issue queue, register renaming & reorder buffer',
        ],
    },
    {
        zone: 4,
        title: 'Retail Business Management System',
        year: '2015',
        bullets: [
            'Built with Oracle PL/SQL, Java & JDBC on Oracle 11g',
            'Designed relational schema, normalized tables & Java frontend',
        ],
    },
];

// Work experience — shown instead of projects for career zones (5-7)
export const EXPERIENCE_DATA = [
    {
        zone: 5,
        title: 'Software Developer',
        company: 'Midway Dental Supply',
        period: 'Sep 2016 – Sep 2017',
        bullets: [
            'Expanded knowledge into Salesforce Administrator & Salesforce Developer certifications',
            'Developed web apps with JavaScript, Bootstrap & AngularJS on the front end',
            'Built & maintained custom software in Python & Salesforce (APEX)',
            'Applied OOP design patterns in APEX for scalable solutions',
            'Created & maintained SQL & SOQL database reports',
        ],
    },
    {
        zone: 6,
        title: 'Software Engineer II',
        company: 'Cerner Corporation',
        period: 'Sep 2017 – Sep 2022',
        bullets: [
            'Built RESTful Web Services using JAX-RS, Jersey Client & Swagger for physicians and nurses to create, refill or cancel/discontinue orders',
            'Implemented Java Services for formulary services & minimum out-of-pocket cost computation across patient health plans',
            'Followed Agile methodologies — daily scrums, bi-weekly iteration planning & retrospectives',
            'Designed, developed & implemented unit tests and functional tests with custom test framework using Java',
            'Used GitHub for version control, Jenkins for integration testing & Crucible for code reviews',
            'Mentored associates on existing processes, features & services supported by the team',
        ],
    },
    {
        zone: 7,
        title: 'Member of Technical Staff',
        company: 'Oracle Health',
        period: 'Oct 2022 – Present',
        bullets: [
            'Developed RESTful services in Java (JAX-RS, Jersey, JDBC) for EJS clinical ordering used by physicians & nurses',
            'Added Discern alerts feature enabling physicians to create custom alerts for efficient patient care',
            'Performed & followed Agile methodologies — daily scrums, bi-weekly planning, retrospectives & design discussions with Solution Designers & Software Architects',
            'Established & documented the release server process for the team',
            'Created Jenkins pipeline scripts & managed CI/CD boxes for continuous deployment',
            'Built Postman collections with Newman for automated REST API testing & reporting',
            'Wrote integration tests with JUnit; used Oracle SQL for data management',
            'Built AI-enabled apps & agents using MCP, DeepAgents & A2UI',
            'Mentored associates on tools, technologies, processes & functionalities',
        ],
    },
];

// Intro blurbs — shown on left/right of character head when building opens
export const ZONE_INTROS = {
    1: {
        left: {
            heading: 'Science Stream',
            text: 'Attended 3 different schools across Gujarat, building a strong foundation in Mathematics, Science & Computer fundamentals.',
        },
        right: {
            heading: 'Early Spark',
            text: 'Scored 100/100 in Science & 99/100 in Mathematics. Developed a deep curiosity for problem-solving and technology.',
        },
    },
    2: {
        left: {
            heading: 'B.E. Computer Science',
            text: 'Pursued Bachelor of Engineering in Computer Science & Engineering from Gujarat Technological University (GTU).',
        },
        right: {
            heading: 'Deepening Passion',
            text: 'Dove deep into Networks, Databases, Software Engineering & Programming Languages. Grew from an average student to a top ranker through hard work.',
        },
    },
    4: {
        left: {
            heading: 'M.S. Computer Science',
            text: 'Pursued Master of Science in Computer Science at SUNY Binghamton, graduating with a 3.7/4.0 GPA.',
        },
        right: {
            heading: 'New Horizons',
            text: 'Acclimatized to a new country, new weather & a new culture while gaining deep practical knowledge through intensive coursework & projects.',
        },
    },
    5: {
        left: {
            heading: 'Software Developer',
            text: 'First professional role in the USA, working as a Software Developer at Midway Dental Supply in Livonia, Michigan.',
        },
        right: {
            heading: 'Expanding Skills',
            text: 'Expanded into Salesforce Administration & Development while building front-end applications with AngularJS & JavaScript.',
        },
    },
    6: {
        left: {
            heading: 'Software Engineer II',
            text: 'Joined Cerner Corporation in Kansas City, MO — building clinical software used by physicians and nurses nationwide.',
        },
        right: {
            heading: 'Healthcare Tech',
            text: 'Developed RESTful services for clinical ordering, formulary computations & patient health plan cost optimization.',
        },
    },
    7: {
        left: {
            heading: 'Member of Technical Staff',
            text: 'Continued the healthcare mission at Oracle Health in Overland Park, KS — building the next generation of clinical software.',
        },
        right: {
            heading: 'Innovation & AI',
            text: 'Leading development of AI-enabled applications using MCP, DeepAgents & A2UI while mentoring the next wave of engineers.',
        },
    },
};

// Zone highlights — detailed paragraphs shown when scrolling down
export const ZONE_HIGHLIGHTS = {
    1: [
        {
            title: 'Academic Foundation',
            text: 'Growing up in Gujarat, education was the cornerstone of every aspiration. Across three different schools, I built a rock-solid foundation in Mathematics and Science — scoring a perfect 100 in Science and 99 in Mathematics in my secondary school exams, finishing with an overall 92.77%. These years taught me that no goal is too hard to achieve if you believe in it and give your hundred percent.',
        },
        {
            title: 'Sports, Competitions & Early Interests',
            text: 'School was not just about textbooks. I developed a deep love for cricket — playing for the school team at the regional level for three consecutive years and, in 2005, representing the Under-19 cricket team as the youngest player at just 15 years old, winning the tournament. Beyond sports, I actively participated in competitive exams, science projects, quizzes and technical events, earning numerous prizes. I also won awards for Drawing and Dance. Learning C Language in high school was my first window into programming — I was fascinated by how computers could simulate intelligence and enliven virtual worlds, a spark that would shape my entire career.',
        },
    ],
    2: [
        {
            title: 'From Curiosity to Mastery',
            text: 'Joining B.E. in Computer Science & Engineering was a pivotal milestone. The highly diverse nature of computer science — Networks, Databases, Software Engineering, Programming Languages — captivated me completely. I went from an average first-year student to a top ranker through sheer dedication. I attended workshops on PHP/MySQL, delivered lectures on Design & Analysis of Algorithms, and was one of three students selected by faculty to maintain the college website.',
        },
        {
            title: 'Building Real-World Systems',
            text: 'Hands-on projects defined my college years. I built an Event Management System using Visual Basic & SQL, connecting decorators, caterers and party-plots with users. My fascination with databases grew as I explored how small chips could store gigabytes of data. This led to my capstone project at Larsen & Toubro — India\'s largest engineering company — where I developed an Inventory & Invoice Management System, converting manual workflows into automated systems. I also completed a year-long training in Linux & Java, and developed a Home Automation System that was featured in the local newspaper.',
        },
    ],
    4: [
        {
            title: 'A New Chapter in Binghamton',
            text: 'Moving to Binghamton, New York was a transformative leap — a new country, a harsh winter climate, and an entirely different academic culture. At SUNY Binghamton, I pursued my M.S. in Computer Science, graduating with a 3.7/4.0 GPA. The rigorous coursework in Computer Architecture, Operating Systems, Algorithms & Databases deepened my understanding far beyond what textbooks could offer.',
        },
        {
            title: 'Intensive Projects & Growth',
            text: 'The project-driven curriculum pushed me to my limits. I built a 3D game using JMonkey Engine at a hackathon, implemented a Secure Electronic Voting System with RSA encryption in C, developed an APEX pipelining simulator with out-of-order execution, and created a Retail Business Management System using Oracle PL/SQL & Java. Each project sharpened my practical skills and taught me how to tackle complex engineering challenges under real deadlines.',
        },
    ],
    5: [
        {
            title: 'First Professional Chapter',
            text: 'Joining Midway Dental Supply in Livonia, Michigan as my first professional role in the USA was an exciting transition from academia to industry. I expanded my knowledge beyond traditional computer science into Salesforce Administration and Salesforce Development, earning certifications in both. On the front end, I built responsive web applications using JavaScript, Bootstrap & AngularJS.',
        },
        {
            title: 'Broadening the Toolkit',
            text: 'Working in a smaller company meant wearing many hats — from building custom Python & APEX software solutions to creating SQL & SOQL database reports. I applied object-oriented design patterns to write scalable, maintainable code. This experience taught me adaptability and the importance of understanding the full stack from database to user interface.',
        },
    ],
    6: [
        {
            title: 'Healthcare at Scale',
            text: 'At Cerner Corporation in Kansas City, I spent five years building clinical software that directly impacted patient care. I developed RESTful Web Services using JAX-RS, Jersey Client & Swagger — enabling physicians and nurses to create, refill, or cancel orders for patients. I implemented Java services for formulary lookups and computed the minimum out-of-pocket cost across multiple patient health plans.',
        },
        {
            title: 'Engineering Excellence',
            text: 'Working within Agile methodologies — daily scrums, bi-weekly sprints, and retrospectives — I honed my craft in writing clean, testable code. I designed custom test frameworks, used GitHub, Jenkins & Crucible for CI/CD, and consistently mentored new associates to bring them up to speed on the team\'s processes and services. This role solidified my identity as a healthcare software engineer.',
        },
    ],
    7: [
        {
            title: 'Continuing the Mission',
            text: 'When Cerner became Oracle Health, I continued building upon the clinical ordering platform — now as a Member of Technical Staff. I work closely with Solution Designers and Software Architects to break down complex implementation tasks, develop RESTful services in Java, and have established the team\'s release server process. I also added the Discern alerts feature, enabling physicians to create custom alerts for more efficient patient care.',
        },
        {
            title: 'AI & the Future',
            text: 'Beyond core engineering, I\'ve embraced the AI revolution — building intelligent applications and agents using MCP, DeepAgents & A2UI. I manage Jenkins pipelines for continuous deployment, create automated API testing suites with Postman & Newman, and continue mentoring the next generation of engineers. At Oracle Health, I\'m at the intersection of healthcare and cutting-edge technology, shaping the future of clinical software.',
        },
    ],
};
