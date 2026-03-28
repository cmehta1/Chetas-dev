import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/constants';
import { createCharacter } from '../utils/CharacterRenderer';
import EventBus from '../EventBus';

/**
 * End Scene — dancing character with social links
 */
export default class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene');
    }

    init(data) {
        this.playerStage = data.playerStage || 6;
    }

    create() {
        this.cameras.main.setBackgroundColor('#0a0a1a');

        // Starry background
        const starsG = this.add.graphics().setDepth(0);
        const rng = new Phaser.Math.RandomDataGenerator(['endstars']);
        for (let i = 0; i < 60; i++) {
            const sx = rng.between(0, GAME_WIDTH);
            const sy = rng.between(0, GAME_HEIGHT);
            const size = rng.realInRange(0.5, 2.5);
            starsG.fillStyle(0xFFFFFF, rng.realInRange(0.3, 0.9));
            starsG.fillCircle(sx, sy, size);
        }

        // Twinkling stars
        for (let i = 0; i < 15; i++) {
            const star = this.add.circle(
                rng.between(50, GAME_WIDTH - 50),
                rng.between(30, GAME_HEIGHT - 100),
                rng.realInRange(1, 3),
                0xFFFFFF, 0.8
            ).setDepth(0);
            this.tweens.add({
                targets: star,
                alpha: 0.2,
                duration: rng.between(800, 2000),
                yoyo: true,
                repeat: -1,
                delay: rng.between(0, 1000),
            });
        }

        // Dancing character
        this.character = createCharacter(this, this.playerStage);
        this.character.setPosition(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30);
        this.character.setScale(1.2);
        this.character.setDepth(5);

        // Dance animation timer
        this.danceTimer = 0;
        this.dancePhase = 0;

        // "Thanks for visiting!" text
        const thanks = this.add.text(GAME_WIDTH / 2, 80, 'Thanks for visiting!', {
            fontFamily: 'Poppins, sans-serif',
            fontSize: '36px',
            color: '#FFD700',
            fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(10).setAlpha(0);

        this.tweens.add({
            targets: thanks,
            alpha: 1, y: 70,
            duration: 800, ease: 'Cubic.easeOut', delay: 300,
        });

        // Subtitle
        const subtitle = this.add.text(GAME_WIDTH / 2, 115, "Let's connect!", {
            fontFamily: 'Poppins, sans-serif',
            fontSize: '18px',
            color: '#cccccc',
        }).setOrigin(0.5).setDepth(10).setAlpha(0);

        this.tweens.add({
            targets: subtitle,
            alpha: 1,
            duration: 800, ease: 'Cubic.easeOut', delay: 600,
        });

        // Social links
        const socials = [
            { icon: '𝕏', label: '@chetas2', url: 'https://x.com/chetas2', color: 0xFFFFFF },
            { icon: '', label: 'cmehta1', url: 'https://github.com/cmehta1', color: 0xFFFFFF },
            { icon: '', label: 'ch3ta5', url: 'https://instagram.com/ch3ta5', color: 0xE1306C },
        ];

        const startY = GAME_HEIGHT - 150;
        const spacing = 80;
        const startX = GAME_WIDTH / 2 - ((socials.length - 1) * spacing) / 2;

        socials.forEach((social, i) => {
            const x = startX + i * spacing;

            // Circle background
            const circle = this.add.graphics().setDepth(10);
            circle.fillStyle(0x222233, 0.9);
            circle.lineStyle(2, social.color, 0.6);
            circle.fillCircle(x, startY, 28);
            circle.strokeCircle(x, startY, 28);

            // Icon text
            const icon = this.add.text(x, startY, social.icon, {
                fontFamily: 'Arial, sans-serif',
                fontSize: '22px',
                color: '#ffffff',
            }).setOrigin(0.5).setDepth(11).setAlpha(0);

            // Label
            const lbl = this.add.text(x, startY + 40, social.label, {
                fontFamily: 'Poppins, sans-serif',
                fontSize: '13px',
                color: '#aaaaaa',
            }).setOrigin(0.5).setDepth(11).setAlpha(0);

            // Animate in
            this.tweens.add({
                targets: [icon, lbl],
                alpha: 1,
                duration: 600,
                delay: 1000 + i * 200,
            });

            // Make clickable
            const hitArea = this.add.rectangle(x, startY, 60, 80, 0x000000, 0)
                .setDepth(12)
                .setInteractive({ useHandCursor: true });

            hitArea.on('pointerover', () => {
                circle.clear();
                circle.fillStyle(0x333355, 0.9);
                circle.lineStyle(2, 0xFFD700, 0.9);
                circle.fillCircle(x, startY, 30);
                circle.strokeCircle(x, startY, 30);
            });

            hitArea.on('pointerout', () => {
                circle.clear();
                circle.fillStyle(0x222233, 0.9);
                circle.lineStyle(2, social.color, 0.6);
                circle.fillCircle(x, startY, 28);
                circle.strokeCircle(x, startY, 28);
            });

            hitArea.on('pointerdown', () => {
                window.open(social.url, '_blank');
            });
        });

        // Confetti particles
        this.confetti = [];
        const confettiColors = [0xFFD700, 0xFF5722, 0x4CAF50, 0x2196F3, 0xE91E63, 0x9C27B0];
        for (let i = 0; i < 30; i++) {
            const cx = rng.between(50, GAME_WIDTH - 50);
            const cy = rng.between(-50, GAME_HEIGHT);
            const color = confettiColors[i % confettiColors.length];
            const piece = this.add.rectangle(cx, cy, rng.between(4, 8), rng.between(8, 14), color, 0.8)
                .setDepth(3);
            this.confetti.push({
                obj: piece,
                speed: rng.realInRange(0.5, 2),
                drift: rng.realInRange(-0.8, 0.8),
                wobble: rng.realInRange(1, 3),
                phase: rng.realInRange(0, Math.PI * 2),
            });
        }

        this.cameras.main.fadeIn(1000);
        EventBus.emit('game-ended', true);
    }

    update(time) {
        // Dance animation
        this.danceTimer += 0.08;
        const c = this.character;

        // Bouncy dance: legs alternate, arms wave, body bounces
        const bounce = Math.abs(Math.sin(this.danceTimer * 2)) * 8;
        const legSwing = Math.sin(this.danceTimer) * 0.5;
        const armSwing = Math.sin(this.danceTimer * 1.5) * 0.6;

        c.leftLeg.rotation = legSwing;
        c.rightLeg.rotation = -legSwing;
        c.leftArm.rotation = -armSwing - 0.3;
        c.rightArm.rotation = armSwing + 0.3;

        if (c.headGfx) {
            c.headGfx.y = -42 - bounce;
            c.headGfx.x = Math.sin(this.danceTimer * 0.7) * 3;
        }
        if (c.torsoGfx) {
            c.torsoGfx.rotation = Math.sin(this.danceTimer * 0.5) * 0.05;
        }

        // Whole character bounce
        c.y = GAME_HEIGHT / 2 - 30 - bounce * 0.5;

        // Confetti
        this.confetti.forEach(p => {
            p.obj.y += p.speed;
            p.obj.x += p.drift + Math.sin(time * 0.001 * p.wobble + p.phase) * 0.8;
            p.obj.rotation += 0.03;
            if (p.obj.y > GAME_HEIGHT + 20) {
                p.obj.y = -20;
                p.obj.x = Phaser.Math.Between(50, GAME_WIDTH - 50);
            }
        });
    }
}
