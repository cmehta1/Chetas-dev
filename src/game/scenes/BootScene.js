import Phaser from 'phaser';
import { CANVAS_SCALE } from '../config/constants';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    create() {
        // Patch text factory so every text object renders at CANVAS_SCALE resolution.
        // This makes text textures map 1:1 to the HD canvas pixels.
        const origText = Phaser.GameObjects.GameObjectFactory.prototype.text;
        Phaser.GameObjects.GameObjectFactory.prototype.text = function (x, y, text, style) {
            style = style || {};
            if (!style.resolution) style.resolution = CANVAS_SCALE;
            return origText.call(this, x, y, text, style);
        };

        this.scene.start('PreloaderScene');
    }
}
