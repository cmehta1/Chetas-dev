import { ZONES } from './constants';

// Level definitions — each level groups zones and defines gameplay
export const LEVELS = [
    {
        id: 1,
        name: 'Early Days',
        subtitle: 'Gujarat, India',
        zoneIds: [0, 1],
        startX: 0,
        endX: 3000,
        playerStageStart: 1,
        playerStageEnd: 2,
        nextScene: 'LevelTransition',
    },
    {
        id: 2,
        name: 'Engineering',
        subtitle: 'B.E. Computer Science',
        zoneIds: [2, 3],
        startX: 3000,
        endX: 6200,
        playerStageStart: 3,
        playerStageEnd: 3,
        nextScene: 'LevelTransition',
    },
    {
        id: 3,
        name: 'Masters',
        subtitle: 'SUNY Binghamton',
        zoneIds: [4],
        startX: 6200,
        endX: 8200,
        playerStageStart: 4,
        playerStageEnd: 4,
        nextScene: 'LevelTransition',
    },
    {
        id: 4,
        name: 'Career',
        subtitle: 'Software Engineer',
        zoneIds: [5, 6, 7],
        startX: 8200,
        endX: 14000,
        playerStageStart: 5,
        playerStageEnd: 6,
        nextScene: null,
    },
];

// Auto-jump triggers — player auto-jumps at terrain transitions
export const AUTO_JUMP_TRIGGERS = [
    // Level 1: Childhood + School
    { x: 450, velocity: -380, level: 1 },
    { x: 800, velocity: -350, level: 1 },
    { x: 1650, velocity: -420, level: 1 },
    { x: 2550, velocity: -350, level: 1 },

    // Level 2: College
    { x: 3450, velocity: -380, level: 2 },
    { x: 3950, velocity: -360, level: 2 },
    { x: 4450, velocity: -350, level: 2 },
    { x: 4800, velocity: -350, level: 2 },

    // Level 3: Masters
    { x: 6650, velocity: -400, level: 3 },
    { x: 7100, velocity: -380, level: 3 },
    { x: 7650, velocity: -350, level: 3 },
    { x: 8050, velocity: -350, level: 3 },

    // Level 4: Career
    { x: 8650, velocity: -420, level: 4 },
    { x: 9250, velocity: -350, level: 4 },
    { x: 10050, velocity: -380, level: 4 },
    { x: 10550, velocity: -360, level: 4 },
    { x: 11050, velocity: -350, level: 4 },
    { x: 11550, velocity: -340, level: 4 },
    { x: 12050, velocity: -350, level: 4 },
    { x: 12650, velocity: -400, level: 4 },
    { x: 13200, velocity: -380, level: 4 },
    { x: 13700, velocity: -350, level: 4 },
];

/** Get level config for a given level id */
export function getLevelConfig(levelId) {
    return LEVELS.find(l => l.id === levelId);
}

/** Get zones for a given level */
export function getLevelZones(levelId) {
    const level = getLevelConfig(levelId);
    if (!level) return [];
    return level.zoneIds.map(id => ZONES[id]);
}
