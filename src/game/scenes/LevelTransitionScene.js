import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, CANVAS_SCALE } from '../config/constants';
import { getLevelConfig } from '../config/levelConfig';

export default class LevelTransitionScene extends Phaser.Scene {
    constructor() {
        super('LevelTransition');
    }

    init(data) {
        this.levelId = data.levelId || 1;
        this.collectedKeys = data.collectedKeys || [];
        this.skillProficiency = data.skillProficiency || {};
        this.playerStage = data.playerStage || 1;
        this.targetZoneId = data.targetZoneId;
    }

    create() {
        this.cameras.main.setZoom(CANVAS_SCALE);
        this.cameras.main.centerOn(GAME_WIDTH / 2, GAME_HEIGHT / 2);
        const level = getLevelConfig(this.levelId);
        if (!level) {
            this.scene.start('Level1Scene', this.getState());
            return;
        }

        this.cameras.main.setBackgroundColor('#000000');

        // Level number
        const levelText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, `LEVEL ${level.id}`, {
            fontFamily: 'Poppins, sans-serif',
            fontSize: '18px',
            color: '#FFD700',
            fontStyle: 'bold',
            letterSpacing: 4,
        }).setOrigin(0.5).setAlpha(0);

        // Level name
        const nameText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, level.name, {
            fontFamily: 'Poppins, sans-serif',
            fontSize: '42px',
            color: '#ffffff',
            fontStyle: 'bold',
        }).setOrigin(0.5).setAlpha(0);

        // Subtitle
        const subText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50, level.subtitle, {
            fontFamily: 'Poppins, sans-serif',
            fontSize: '16px',
            color: '#aaaaaa',
        }).setOrigin(0.5).setAlpha(0);

        // Animate in
        this.tweens.add({
            targets: levelText,
            alpha: 1, y: GAME_HEIGHT / 2 - 50,
            duration: 600, ease: 'Cubic.easeOut', delay: 200,
        });
        this.tweens.add({
            targets: nameText,
            alpha: 1,
            duration: 800, ease: 'Cubic.easeOut', delay: 400,
        });
        this.tweens.add({
            targets: subText,
            alpha: 1, y: GAME_HEIGHT / 2 + 45,
            duration: 600, ease: 'Cubic.easeOut', delay: 600,
        });

        // Transition to level scene after delay
        this.time.delayedCall(2500, () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                const sceneName = this.getSceneName();
                this.scene.start(sceneName, this.getState());
            });
        });
    }

    getSceneName() {
        switch (this.levelId) {
            case 1: return 'Level1Scene';
            case 2: return 'Level2Scene';
            case 3: return 'Level3Scene';
            case 4: return 'Level4Scene';
            case 5: return 'Level5Scene';
            default: return 'Level1Scene';
        }
    }

    getState() {
        return {
            levelId: this.levelId,
            collectedKeys: this.collectedKeys,
            skillProficiency: this.skillProficiency,
            playerStage: this.playerStage,
            targetZoneId: this.targetZoneId,
        };
    }
}
