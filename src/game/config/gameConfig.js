import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './constants';
import BootScene from '../scenes/BootScene';
import PreloaderScene from '../scenes/PreloaderScene';
import LevelTransitionScene from '../scenes/LevelTransitionScene';
import Level1Scene from '../scenes/Level1Scene';
import Level2Scene from '../scenes/Level2Scene';
import Level3Scene from '../scenes/Level3Scene';
import Level4Scene from '../scenes/Level4Scene';

export const gameConfig = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, PreloaderScene, LevelTransitionScene, Level1Scene, Level2Scene, Level3Scene, Level4Scene],
    backgroundColor: '#87CEEB',
    pixelArt: false,
    antialias: true,
};
