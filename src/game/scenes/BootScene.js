import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    create() {
        // Patch text factory for HD/Retina text rendering
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        if (dpr > 1) {
            const origText = Phaser.GameObjects.GameObjectFactory.prototype.text;
            Phaser.GameObjects.GameObjectFactory.prototype.text = function (x, y, text, style) {
                style = style || {};
                if (!style.resolution) style.resolution = dpr;
                return origText.call(this, x, y, text, style);
            };
        }

        this.scene.start('PreloaderScene');
    }
}
