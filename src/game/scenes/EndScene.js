import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, getMobileMargin } from '../config/constants';
import { createCharacter } from '../utils/CharacterRenderer';
import EventBus from '../EventBus';

/**
 * End Scene — dancing character with social links (drawn icons)
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

        // Gradient background overlay
        const bgGfx = this.add.graphics().setDepth(-1);
        const bgSteps = 30;
        for (let i = 0; i < bgSteps; i++) {
            const t = i / bgSteps;
            const r = Math.floor(10 + t * 15);
            const g = Math.floor(10 + t * 10);
            const b = Math.floor(26 + t * 30);
            bgGfx.fillStyle(Phaser.Display.Color.GetColor(r, g, b));
            bgGfx.fillRect(0, i * (GAME_HEIGHT / bgSteps), GAME_WIDTH, GAME_HEIGHT / bgSteps + 1);
        }

        // Starry background
        const starsG = this.add.graphics().setDepth(0);
        const rng = new Phaser.Math.RandomDataGenerator(['endstars']);
        for (let i = 0; i < 80; i++) {
            const sx = rng.between(0, GAME_WIDTH);
            const sy = rng.between(0, GAME_HEIGHT);
            const size = rng.realInRange(0.5, 2.5);
            starsG.fillStyle(0xFFFFFF, rng.realInRange(0.3, 0.9));
            starsG.fillCircle(sx, sy, size);
        }

        // Twinkling stars
        for (let i = 0; i < 20; i++) {
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

        // Spotlight glow behind character
        const spotlight = this.add.graphics().setDepth(1);
        spotlight.fillStyle(0xFFD700, 0.06);
        spotlight.fillCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, 150);
        spotlight.fillStyle(0xFFD700, 0.03);
        spotlight.fillCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, 250);

        // Dancing character
        this.character = createCharacter(this, this.playerStage);
        this.character.setPosition(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20);
        this.character.setScale(1.3);
        this.character.setDepth(5);

        this.danceTimer = 0;

        const mobilePortrait = getMobileMargin() > 0;

        // "Thanks for visiting!" text
        const thanks = this.add.text(GAME_WIDTH / 2, 80, 'Thanks for visiting!', {
            fontFamily: 'Poppins, sans-serif',
            fontSize: mobilePortrait ? '26px' : '40px',
            color: '#FFD700',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2,
        }).setOrigin(0.5).setDepth(10).setAlpha(0);

        this.tweens.add({
            targets: thanks,
            alpha: 1, y: 70,
            duration: 800, ease: 'Cubic.easeOut', delay: 300,
        });

        // Subtitle
        const subtitle = this.add.text(GAME_WIDTH / 2, 120, "Let's connect!", {
            fontFamily: 'Poppins, sans-serif',
            fontSize: mobilePortrait ? '14px' : '20px',
            color: '#cccccc',
        }).setOrigin(0.5).setDepth(10).setAlpha(0);

        this.tweens.add({
            targets: subtitle,
            alpha: 1,
            duration: 800, ease: 'Cubic.easeOut', delay: 600,
        });

        // Social links with drawn icons
        this.createSocialLinks();

        // Confetti particles
        this.confetti = [];
        const confettiColors = [0xFFD700, 0xFF5722, 0x4CAF50, 0x2196F3, 0xE91E63, 0x9C27B0];
        for (let i = 0; i < 40; i++) {
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

    createSocialLinks() {
        const socials = [
            { label: 'chetasmehta', url: 'https://www.linkedin.com/in/chetasmehta', drawIcon: this.drawLinkedInIcon },
            { label: 'X  @chetas2', url: 'https://x.com/chetas2', drawIcon: this.drawXIcon },
            { label: 'cmehta1', url: 'https://github.com/cmehta1', drawIcon: this.drawGitHubIcon },
            { label: 'ch3ta5', url: 'https://instagram.com/ch3ta5', drawIcon: this.drawInstagramIcon },
        ];

        const startY = GAME_HEIGHT - 140;
        const isMobilePortrait = getMobileMargin() > 0;
        const spacing = isMobilePortrait ? 70 : 130;
        const startX = GAME_WIDTH / 2 - ((socials.length - 1) * spacing) / 2;

        socials.forEach((social, i) => {
            const x = startX + i * spacing;

            // Circle background
            const circleR = isMobilePortrait ? 24 : 32;
            const circle = this.add.graphics().setDepth(10);
            circle.fillStyle(0x1a1a2e, 0.95);
            circle.lineStyle(2.5, 0x444466, 0.8);
            circle.fillCircle(x, startY, circleR);
            circle.strokeCircle(x, startY, circleR);

            // Draw icon using graphics
            const iconGfx = this.add.graphics().setDepth(11).setAlpha(0);
            social.drawIcon(iconGfx, x, startY);

            // Label
            const lbl = this.add.text(x, startY + 48, social.label, {
                fontFamily: 'Poppins, sans-serif',
                fontSize: isMobilePortrait ? '10px' : '14px',
                color: '#bbbbbb',
                fontStyle: 'bold',
            }).setOrigin(0.5).setDepth(11).setAlpha(0);

            // Animate in
            this.tweens.add({
                targets: [iconGfx, lbl],
                alpha: 1,
                duration: 600,
                delay: 1000 + i * 250,
            });

            // Hit area
            const hitArea = this.add.rectangle(x, startY + 10, 100, 90, 0x000000, 0)
                .setDepth(12)
                .setInteractive({ useHandCursor: true });

            hitArea.on('pointerover', () => {
                circle.clear();
                circle.fillStyle(0x252550, 0.95);
                circle.lineStyle(2.5, 0xFFD700, 0.9);
                circle.fillCircle(x, startY, circleR + 2);
                circle.strokeCircle(x, startY, circleR + 2);
                lbl.setColor('#FFD700');
            });

            hitArea.on('pointerout', () => {
                circle.clear();
                circle.fillStyle(0x1a1a2e, 0.95);
                circle.lineStyle(2.5, 0x444466, 0.8);
                circle.fillCircle(x, startY, circleR);
                circle.strokeCircle(x, startY, circleR);
                lbl.setColor('#bbbbbb');
            });

            hitArea.on('pointerdown', () => {
                window.open(social.url, '_blank');
            });
        });
    }

    // Draw X (Twitter) logo
    drawXIcon(g, cx, cy) {
        g.lineStyle(3, 0xFFFFFF, 1);
        g.lineBetween(cx - 10, cy - 10, cx + 10, cy + 10);
        g.lineBetween(cx + 10, cy - 10, cx - 10, cy + 10);
    }

    // Draw GitHub octocat-inspired icon
    drawGitHubIcon(g, cx, cy) {
        // Circle head
        g.fillStyle(0xFFFFFF);
        g.fillCircle(cx, cy - 2, 14);
        // Body
        g.fillStyle(0xFFFFFF);
        g.fillRoundedRect(cx - 10, cy + 8, 20, 8, 4);
        // Eyes (cut out)
        g.fillStyle(0x1a1a2e);
        g.fillCircle(cx - 5, cy - 4, 3);
        g.fillCircle(cx + 5, cy - 4, 3);
        // Tentacles
        g.lineStyle(2.5, 0xFFFFFF, 0.9);
        g.beginPath();
        g.arc(cx - 12, cy + 6, 6, -Math.PI * 0.3, Math.PI * 0.5, false);
        g.strokePath();
        g.beginPath();
        g.arc(cx + 12, cy + 6, 6, Math.PI * 0.5, Math.PI * 1.3, false);
        g.strokePath();
    }

    // Draw LinkedIn icon
    drawLinkedInIcon(g, cx, cy) {
        // Rounded square background
        g.fillStyle(0x0A66C2);
        g.fillRoundedRect(cx - 13, cy - 13, 26, 26, 4);
        // "in" text approximation
        // Letter "i" - dot + bar
        g.fillStyle(0xFFFFFF);
        g.fillRect(cx - 8, cy - 3, 4, 12);
        g.fillCircle(cx - 6, cy - 7, 2.5);
        // Letter "n"
        g.fillRect(cx - 1, cy - 3, 4, 12);
        g.fillRect(cx - 1, cy - 3, 10, 3);
        g.fillRect(cx + 6, cy - 1, 4, 10);
    }

    // Draw Instagram camera icon
    drawInstagramIcon(g, cx, cy) {
        // Rounded square
        g.lineStyle(2.5, 0xFFFFFF, 1);
        g.strokeRoundedRect(cx - 12, cy - 12, 24, 24, 6);
        // Lens circle
        g.strokeCircle(cx, cy, 7);
        // Flash dot
        g.fillStyle(0xFFFFFF);
        g.fillCircle(cx + 8, cy - 8, 2.5);
    }

    update(time) {
        this.danceTimer += 0.08;
        const c = this.character;

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

        c.y = GAME_HEIGHT / 2 - 20 - bounce * 0.5;

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
