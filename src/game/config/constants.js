// Game dimensions
export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

// World dimensions
export const WORLD_WIDTH = 16500;
export const GROUND_Y = 580;

// Player settings
export const PLAYER_SPEED = 320;
export const PLAYER_JUMP_VELOCITY = -500;
export const PLAYER_GRAVITY = 900;

// Character growth scales per stage (bigger character — 40% larger base)
export const PLAYER_STAGES = {
    1: { scale: 0.50, label: 'Toddler' },
    2: { scale: 0.62, label: 'School Kid' },
    3: { scale: 0.75, label: 'College Student' },
    4: { scale: 0.85, label: 'Grad Student' },
    5: { scale: 0.95, label: 'Software Engineer' },
    6: { scale: 1.05, label: 'Senior Engineer' },
};

// Terrain profile — array of [x, y] points defining ground height across the world.
// Character walks along this surface. Linear interpolation between points.
export const TERRAIN = [
    // Zone 0: Childhood — gentle platform in middle
    [0, 580], [350, 580],
    [450, 565],
    [700, 565],
    [800, 580],
    [1200, 580],

    // Zone 1: School — elevated school compound
    [1200, 580], [1500, 580],
    [1650, 555],
    [2400, 555],
    [2550, 580],
    [3000, 580],

    // Zone 2: College — two-tier terraces
    [3000, 580], [3300, 580],
    [3450, 560],
    [3800, 560],
    [3950, 540],
    [4300, 540],
    [4450, 560],
    [4650, 560],
    [4800, 580],
    [5000, 580],

    // Zone 3: Flight — flat (cutscene)
    [5000, 580], [6200, 580],

    // Zone 4: US Campus — rolling terraces
    [6200, 580], [6500, 580],
    [6650, 558],
    [7000, 558],
    [7100, 545],
    [7500, 545],
    [7650, 558],
    [7900, 558],
    [8050, 580],
    [8200, 580],

    // Zone 5: Midway — elevated bridge
    [8200, 580], [8500, 580],
    [8650, 548],
    [9100, 548],
    [9250, 580],
    [9600, 580],

    // Zone 6: Cerner — ascending terraces
    [9600, 580], [9900, 580],
    [10050, 562],
    [10400, 562],
    [10550, 545],
    [10900, 545],
    [11050, 560],
    [11400, 560],
    [11550, 575],
    [11900, 575],
    [12050, 580],
    [12200, 580],

    // Zone 7: Oracle — gradual ascent to summit and descent
    [12200, 580], [12500, 580],
    [12650, 560],
    [13000, 555],
    [13200, 540],
    [13500, 540],
    [13700, 555],
    [13850, 580],
    [14000, 580],

    // Zone 8: Hobbies — gentle park terrain
    [14300, 580],
    [14500, 568],
    [14900, 568],
    [15100, 575],
    [15500, 575],
    [15700, 562],
    [16100, 562],
    [16300, 580],
    [16500, 580],
];

/** Get the terrain ground-surface Y at a given world X. */
export function getTerrainY(x) {
    if (x <= TERRAIN[0][0]) return TERRAIN[0][1];
    for (let i = 1; i < TERRAIN.length; i++) {
        if (x <= TERRAIN[i][0]) {
            const [x0, y0] = TERRAIN[i - 1];
            const [x1, y1] = TERRAIN[i];
            const t = (x - x0) / (x1 - x0);
            return y0 + (y1 - y0) * t;
        }
    }
    return TERRAIN[TERRAIN.length - 1][1];
}

// Zone definitions — 8 zones
export const ZONES = [
    {
        id: 0,
        name: 'Childhood',
        subtitle: 'Gujarat, India',
        country: 'IN',
        flag: '\u{1F1EE}\u{1F1F3}',
        startX: 0,
        endX: 1200,
        playerStage: 1,
        skyTop: 0xFF9933,
        skyBottom: 0xFFE0B2,
        groundColor: 0xA67B5B,
        groundAccent: 0x8B6914,
        theme: 'india-village',
    },
    {
        id: 1,
        name: 'School Years',
        subtitle: 'Gujarat, India',
        country: 'IN',
        flag: '\u{1F1EE}\u{1F1F3}',
        startX: 1200,
        endX: 3000,
        playerStage: 2,
        skyTop: 0x4FC3F7,
        skyBottom: 0xB3E5FC,
        groundColor: 0x558B2F,
        groundAccent: 0x33691E,
        theme: 'india-school',
        building: { name: 'School', x: 2850, width: 220 },
    },
    {
        id: 2,
        name: 'Gujarat Tech University',
        subtitle: 'B.E. Computer Science',
        country: 'IN',
        flag: '\u{1F1EE}\u{1F1F3}',
        startX: 3000,
        endX: 5000,
        playerStage: 3,
        skyTop: 0x42A5F5,
        skyBottom: 0x90CAF9,
        groundColor: 0x795548,
        groundAccent: 0x5D4037,
        theme: 'india-college',
        building: { name: 'GTU', x: 4850, width: 250 },
    },
    {
        id: 3,
        name: 'Flight to USA',
        subtitle: 'India \u2708 New York',
        country: 'flight',
        flag: '\u2708\uFE0F',
        startX: 5000,
        endX: 6200,
        playerStage: 3,
        skyTop: 0x0D1B2A,
        skyBottom: 0x1B2838,
        groundColor: 0x37474F,
        groundAccent: 0x263238,
        theme: 'flight',
        isCutscene: true,
    },
    {
        id: 4,
        name: 'SUNY Binghamton',
        subtitle: 'M.S. Computer Science',
        country: 'US',
        flag: '\u{1F1FA}\u{1F1F8}',
        startX: 6200,
        endX: 8200,
        playerStage: 4,
        skyTop: 0x64B5F6,
        skyBottom: 0xBBDEFB,
        groundColor: 0x6D4C41,
        groundAccent: 0x4E342E,
        theme: 'usa-campus',
        building: { name: 'Binghamton University', x: 8050, width: 280 },
    },
    {
        id: 5,
        name: 'Midway Dental Supply',
        subtitle: 'Livonia, Michigan',
        country: 'US',
        flag: '\u{1F1FA}\u{1F1F8}',
        startX: 8200,
        endX: 9600,
        playerStage: 5,
        skyTop: 0x42A5F5,
        skyBottom: 0xE3F2FD,
        groundColor: 0x616161,
        groundAccent: 0x424242,
        theme: 'michigan-office',
        building: { name: 'Midway Dental', x: 9450, width: 240 },
    },
    {
        id: 6,
        name: 'Cerner Corporation',
        subtitle: 'Kansas City, Missouri',
        country: 'US',
        flag: '\u{1F1FA}\u{1F1F8}',
        startX: 9600,
        endX: 12200,
        playerStage: 5,
        skyTop: 0x1E88E5,
        skyBottom: 0x90CAF9,
        groundColor: 0x546E7A,
        groundAccent: 0x37474F,
        theme: 'kansas-corporate',
        building: { name: 'Cerner Corporation', x: 12050, width: 280 },
    },
    {
        id: 7,
        name: 'Oracle Health',
        subtitle: 'Overland Park, Kansas',
        country: 'US',
        flag: '\u{1F1FA}\u{1F1F8}',
        startX: 12200,
        endX: 14000,
        playerStage: 6,
        skyTop: 0x0D47A1,
        skyBottom: 0x1565C0,
        groundColor: 0x455A64,
        groundAccent: 0x37474F,
        theme: 'oracle-tech',
        building: { name: 'Oracle Health', x: 13700, width: 320 },
    },
    {
        id: 8,
        name: 'Hobbies & Interests',
        subtitle: 'Things I Love',
        country: 'US',
        flag: '\u{1F3AF}',
        startX: 14000,
        endX: 16500,
        playerStage: 6,
        skyTop: 0xFF6F00,
        skyBottom: 0xFFCC80,
        groundColor: 0x558B2F,
        groundAccent: 0x33691E,
        theme: 'hobby-park',
    },
];
