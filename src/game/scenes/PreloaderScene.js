import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, CANVAS_SCALE, isMobilePortrait } from '../config/constants';

export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super('PreloaderScene');
    }

    create() {
        this.cameras.main.setZoom(CANVAS_SCALE);
        this.cameras.main.centerOn(GAME_WIDTH / 2, GAME_HEIGHT / 2);
        const mobile = isMobilePortrait();
        const visibleWidth = mobile
            ? window.innerWidth / (window.innerHeight / GAME_HEIGHT)
            : GAME_WIDTH;

        // Retro boot-up text
        const lines = mobile ? [
            'CHETAS MEHTA BIOS v1.0',
            'Checking memory... OK',
            'Loading personality... OK',
            'Loading 40+ skills... OK',
            'Mapping journey... OK',
            'Career engine... OK',
            '',
            'SWIPE to move | TAP to enter buildings',
            '',
            'TAP to begin',
        ] : [
            'CHETAS MEHTA BIOS v1.0',
            'Checking memory... 640K OK',
            'Loading personality... OK',
            'Loading 40+ skills... OK',
            'Mapping journey: Gujarat → New York → Michigan → Kansas... OK',
            'Initializing career engine... OK',
            '',
            'SCROLL WHEEL or ARROW KEYS to move | SPACE to enter buildings',
            '',
            'TAP or Press ENTER to begin',
        ];

        const textStyle = {
            fontFamily: 'Courier New, monospace',
            fontSize: mobile ? '12px' : '18px',
            color: '#00ff00',
            lineSpacing: 8,
            wordWrap: mobile ? { width: visibleWidth - 40 } : undefined,
        };

        // Black background
        this.cameras.main.setBackgroundColor('#000000');

        // Animate lines appearing one by one
        let y = GAME_HEIGHT / 2 - (lines.length * 28) / 2;
        const textObjects = [];

        lines.forEach((line, index) => {
            const text = this.add.text(GAME_WIDTH / 2, y + index * 28, '', {
                ...textStyle,
                fontSize: index === 0 ? '22px' : '18px',
            });
            text.setOrigin(0.5);
            text.setAlpha(0);
            textObjects.push(text);

            this.time.delayedCall(index * 400, () => {
                text.setText(line);
                text.setAlpha(1);

                // Make the last line blink
                if (index === lines.length - 1) {
                    this.tweens.add({
                        targets: text,
                        alpha: 0.3,
                        duration: 500,
                        yoyo: true,
                        repeat: -1,
                    });
                    this.enableStart();
                }
            });
        });
    }

    enableStart() {
        // Keyboard
        this.input.keyboard.once('keydown-ENTER', () => {
            this.startGame();
        });
        this.input.keyboard.once('keydown-SPACE', () => {
            this.startGame();
        });
        // Click/touch
        this.input.once('pointerdown', () => {
            this.startGame();
        });
    }

    startGame() {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('LevelTransition', { levelId: 1 });
        });
    }
}
