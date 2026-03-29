import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, CANVAS_SCALE } from './constants';
import BootScene from '../scenes/BootScene';
import PreloaderScene from '../scenes/PreloaderScene';
import LevelTransitionScene from '../scenes/LevelTransitionScene';
import Level1Scene from '../scenes/Level1Scene';
import Level2Scene from '../scenes/Level2Scene';
import Level3Scene from '../scenes/Level3Scene';
import Level4Scene from '../scenes/Level4Scene';
import Level5Scene from '../scenes/Level5Scene';
import EndScene from '../scenes/EndScene';

const isMobileDevice = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 1024;

export const gameConfig = {
    type: Phaser.AUTO,
    width: GAME_WIDTH * CANVAS_SCALE,
    height: GAME_HEIGHT * CANVAS_SCALE,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    scale: {
        mode: isMobileDevice ? Phaser.Scale.ENVELOP : Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
        antialias: true,
        roundPixels: true,
    },
    scene: [BootScene, PreloaderScene, LevelTransitionScene, Level1Scene, Level2Scene, Level3Scene, Level4Scene, Level5Scene, EndScene],
    backgroundColor: '#87CEEB',
    pixelArt: false,
    antialias: true,
};
