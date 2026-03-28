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
