import Phaser from 'phaser';
import EventBus from '../EventBus';
import {
    GAME_WIDTH, GAME_HEIGHT, GROUND_Y,
    PLAYER_SPEED, PLAYER_JUMP_VELOCITY, PLAYER_GRAVITY,
    PLAYER_STAGES, ZONES, getTerrainY, getCameraMargin, isMobilePortrait, CANVAS_SCALE,
} from '../config/constants';
import { JOURNEY, HOBBIES_DATA } from '../config/journeyData';
import { AUTO_JUMP_TRIGGERS } from '../config/levelConfig';
import { createCharacter, animateWalk } from '../utils/CharacterRenderer';
import { renderZoneBackground } from '../utils/BackgroundRenderer';

/**
 * Level 5: Hobbies & Interests (Zone 8)
 * Colorful park walk with hobby stations to discover
 */
export default class Level5Scene extends Phaser.Scene {
    constructor() {
        super('Level5Scene');
    }

    init(data) {
        this.targetZoneId = data.targetZoneId;
        this.currentZoneId = 8;
        this.playerStage = data.playerStage || 6;
        this.collectedKeys = data.collectedKeys || [];
        this.skillProficiency = data.skillProficiency || {};
        this.isTransitioning = false;
        this.walkTimer = 0;
        this.isMoving = false;
        this.facingRight = true;
        this.scrollVelocity = 0;
        this.levelZone = ZONES[8];
        this.worldStartX = ZONES[8].startX;
        this.worldEndX = ZONES[8].endX;
        this.worldWidth = this.worldEndX - this.worldStartX;
        this.autoJumpTriggers = AUTO_JUMP_TRIGGERS.filter(t => t.level === 5);
        this.triggeredJumps = new Set();
        this.discoveredHobbies = new Set();
    }

    create() {
        this.cameras.main.setZoom(CANVAS_SCALE);
        const gfx = this.make.graphics({ x: 0, y: 0, add: false });
        gfx.fillStyle(0xffffff, 0);
        gfx.fillRect(0, 0, 40, 90);
        gfx.generateTexture('playerBody5', 40, 90);
        gfx.destroy();

        this.physics.world.setBounds(this.worldStartX, 0, this.worldWidth, GAME_HEIGHT);
        const margin = getCameraMargin();
        this.cameras.main.setBounds(this.worldStartX - margin, 0, this.worldWidth + margin * 2, GAME_HEIGHT);

        renderZoneBackground(this, this.levelZone);

        // Ground platform
        this.groundPlatform = this.add.rectangle(this.worldStartX + this.worldWidth / 2, GROUND_Y + 200, this.worldWidth, 400, 0x000000, 0);
        this.physics.add.existing(this.groundPlatform, false);
        this.groundPlatform.body.setImmovable(true);
        this.groundPlatform.body.setAllowGravity(false);
        this.groundPlatform.body.moves = false;

        this.createHobbyStations();
        this.createPlayer();
        this.createAutoJumpIndicators();

        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        const mobile = isMobilePortrait();
        this.cameras.main.setFollowOffset(mobile ? 0 : -200, mobile ? 30 : 50);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            if (this.isTransitioning) return;
            this.scrollVelocity += deltaY * 0.8;
            this.scrollVelocity = Phaser.Math.Clamp(this.scrollVelocity, -400, 400);
        });

        this.joystickState = { left: false, right: false };
        EventBus.on('joystick-input', (state) => { this.joystickState = state; });
        this.mobileJumpRequested = false;
        EventBus.on('joystick-jump', () => { this.mobileJumpRequested = true; });

        this.createParallaxClouds();
        this.updateHUD();
        EventBus.emit('level-changed', { id: 5, name: 'Hobbies' });
        this.cameras.main.fadeIn(800);
        EventBus.emit('current-scene-ready', this);
    }

    createParallaxClouds() {
        const rng = new Phaser.Math.RandomDataGenerator(['clouds5']);
        for (let i = 0; i < 12; i++) {
            const x = this.worldStartX + rng.between(0, this.worldWidth);
            const y = rng.between(30, 180);
            const w = rng.between(80, 180);
            const speed = rng.realInRange(0.02, 0.08);
            const cloud = this.add.graphics().setDepth(-14);
            cloud.fillStyle(0xFFFFFF, rng.realInRange(0.2, 0.5));
            cloud.fillEllipse(0, 0, w, w * 0.3);
            cloud.fillEllipse(-w * 0.2, 4, w * 0.5, w * 0.22);
            cloud.fillEllipse(w * 0.22, 3, w * 0.45, w * 0.2);
            cloud.setPosition(x, y);
            cloud.setScrollFactor(speed, 1);
        }
    }

    createAutoJumpIndicators() {
        this.autoJumpTriggers.forEach(t => {
            const y = getTerrainY(t.x);
            const g = this.add.graphics().setDepth(1);
            g.fillStyle(0xFFD700, 0.4);
            g.fillRoundedRect(t.x - 12, y - 6, 24, 6, 3);
            g.fillStyle(0xFFD700, 0.2);
            g.fillTriangle(t.x - 8, y - 6, t.x + 8, y - 6, t.x, y - 16);
        });
    }

    createHobbyStations() {
        this.hobbyStations = [];
        const spacing = (this.worldWidth - 400) / (HOBBIES_DATA.length + 1);

        HOBBIES_DATA.forEach((hobby, i) => {
            const x = this.worldStartX + 200 + (i + 1) * spacing;
            const groundY = getTerrainY(x);
            const y = groundY - 55;

            // Pedestal
            const pedestal = this.add.graphics().setDepth(2);
            pedestal.fillStyle(0x37474F, 0.8);
            pedestal.fillRoundedRect(x - 35, groundY - 8, 70, 10, 4);
            pedestal.fillStyle(0x455A64, 0.6);
            pedestal.fillRect(x - 25, groundY - 3, 50, 5);

            // Hobby visual
            const hobbyGfx = this.add.graphics().setDepth(3);
            this.drawHobbyVisual(hobbyGfx, hobby.id, x, y);

            // Glow aura (hidden initially)
            const glow = this.add.circle(x, y, 40, 0xFFD700, 0).setDepth(1);

            // Label
            const label = this.add.text(x, groundY + 14, hobby.label, {
                fontFamily: 'Poppins, sans-serif', fontSize: '12px',
                color: '#cccccc', fontStyle: 'bold',
                stroke: '#000000', strokeThickness: 2,
            }).setOrigin(0.5).setDepth(4);

            // Category tag
            const catLabel = this.add.text(x, y - 40, hobby.category, {
                fontFamily: 'Poppins, sans-serif', fontSize: '9px',
                color: '#FFD700', stroke: '#000000', strokeThickness: 2,
            }).setOrigin(0.5).setDepth(4).setAlpha(0);

            this.hobbyStations.push({
                hobby, x, y, groundY,
                gfx: hobbyGfx, glow, label, catLabel, pedestal,
                discovered: false, glowing: false,
            });
        });
    }

    drawHobbyVisual(g, hobbyId, x, y) {
        switch (hobbyId) {
            case 'cricket':
                // Stumps
                g.fillStyle(0xD2B48C);
                g.fillRect(x - 8, y - 20, 3, 40);
                g.fillRect(x, y - 20, 3, 40);
                g.fillRect(x + 8, y - 20, 3, 40);
                // Bails
                g.fillRect(x - 8, y - 22, 8, 3);
                g.fillRect(x + 3, y - 22, 8, 3);
                // Bat
                g.fillStyle(0xC4A882);
                g.fillRoundedRect(x + 18, y - 10, 8, 32, 2);
                g.fillStyle(0x8B7355);
                g.fillRect(x + 19, y - 16, 6, 8);
                // Ball
                g.fillStyle(0xCC0000);
                g.fillCircle(x - 16, y + 12, 6);
                g.lineStyle(0.8, 0xFFFFFF, 0.4);
                g.beginPath();
                g.arc(x - 16, y + 12, 4, 0, Math.PI, false);
                g.strokePath();
                break;

            case 'football':
                // Goal post
                g.lineStyle(3, 0xFFFFFF);
                g.lineBetween(x - 18, y + 20, x - 18, y - 15);
                g.lineBetween(x + 18, y + 20, x + 18, y - 15);
                g.lineBetween(x - 18, y - 15, x + 18, y - 15);
                // Net lines
                g.lineStyle(0.5, 0xFFFFFF, 0.3);
                for (let i = 0; i < 4; i++) g.lineBetween(x - 14 + i * 9, y - 15, x - 14 + i * 9, y + 20);
                for (let i = 0; i < 3; i++) g.lineBetween(x - 18, y - 5 + i * 10, x + 18, y - 5 + i * 10);
                // Ball
                g.fillStyle(0xFFFFFF);
                g.fillCircle(x, y + 14, 7);
                g.fillStyle(0x212121);
                // Pentagon pattern
                for (let a = 0; a < 5; a++) {
                    const angle = (a * Math.PI * 2) / 5 - Math.PI / 2;
                    g.fillCircle(x + Math.cos(angle) * 4, y + 14 + Math.sin(angle) * 4, 1.5);
                }
                break;

            case 'boxing':
                // Ring corner posts
                g.fillStyle(0xC62828);
                g.fillRect(x - 22, y - 10, 5, 30);
                g.fillRect(x + 17, y - 10, 5, 30);
                // Ropes
                g.lineStyle(2, 0xE53935, 0.8);
                g.lineBetween(x - 20, y - 5, x + 20, y - 5);
                g.lineBetween(x - 20, y + 5, x + 20, y + 5);
                g.lineBetween(x - 20, y + 15, x + 20, y + 15);
                // Boxing glove (left)
                g.fillStyle(0xD32F2F);
                g.fillCircle(x - 6, y + 2, 9);
                g.fillStyle(0xB71C1C);
                g.fillRect(x - 9, y + 6, 6, 8);
                // Boxing glove (right)
                g.fillStyle(0x1565C0);
                g.fillCircle(x + 8, y - 2, 9);
                g.fillStyle(0x0D47A1);
                g.fillRect(x + 5, y + 2, 6, 8);
                break;

            case 'tennis':
                // Net
                g.lineStyle(2, 0x37474F);
                g.lineBetween(x - 20, y + 20, x - 20, y - 5);
                g.lineBetween(x + 20, y + 20, x + 20, y - 5);
                g.lineStyle(1, 0x9E9E9E, 0.4);
                g.lineBetween(x - 20, y - 5, x + 20, y - 5);
                for (let i = 0; i < 4; i++) g.lineBetween(x - 14 + i * 9, y - 5, x - 14 + i * 9, y + 20);
                for (let i = 0; i < 2; i++) g.lineBetween(x - 20, y + 5 + i * 8, x + 20, y + 5 + i * 8);
                // Racket
                g.lineStyle(2, 0x4CAF50);
                g.strokeCircle(x - 8, y - 15, 10);
                g.fillStyle(0x795548);
                g.fillRect(x - 9, y - 5, 3, 14);
                // Ball
                g.fillStyle(0xCDDC39);
                g.fillCircle(x + 12, y + 14, 5);
                g.lineStyle(0.8, 0xFFFFFF, 0.3);
                g.beginPath();
                g.arc(x + 12, y + 14, 4, 0.5, 2.5, false);
                g.strokePath();
                break;

            case 'chess':
                // Board
                g.fillStyle(0x5D4037);
                g.fillRect(x - 20, y - 5, 40, 30);
                // Checkerboard pattern
                for (let r = 0; r < 4; r++)
                    for (let c = 0; c < 5; c++) {
                        g.fillStyle((r + c) % 2 === 0 ? 0xFFECB3 : 0x5D4037);
                        g.fillRect(x - 20 + c * 8, y - 5 + r * 8, 8, 8);
                    }
                // King piece
                g.fillStyle(0x212121);
                g.fillRect(x - 4, y - 20, 8, 15);
                g.fillRect(x - 2, y - 24, 4, 6);
                g.fillRect(x - 4, y - 22, 8, 2);
                // Pawn
                g.fillStyle(0xFFFFFF);
                g.fillCircle(x + 12, y - 12, 5);
                g.fillRect(x + 9, y - 7, 6, 6);
                break;

            case 'space':
                // Telescope tripod
                g.lineStyle(2, 0x795548);
                g.lineBetween(x, y, x - 14, y + 20);
                g.lineBetween(x, y, x + 14, y + 20);
                g.lineBetween(x, y, x, y + 22);
                // Telescope tube
                g.fillStyle(0x546E7A);
                g.beginPath();
                g.moveTo(x - 18, y - 12);
                g.lineTo(x + 8, y + 2);
                g.lineTo(x + 10, y - 2);
                g.lineTo(x - 16, y - 16);
                g.closePath();
                g.fillPath();
                // Lens
                g.fillStyle(0x90CAF9, 0.8);
                g.fillCircle(x - 18, y - 14, 4);
                // Saturn
                g.fillStyle(0xFFB74D);
                g.fillCircle(x + 16, y - 18, 6);
                g.lineStyle(1.5, 0xFFCC80, 0.7);
                g.beginPath();
                g.arc(x + 16, y - 18, 10, -0.3, Math.PI + 0.3, false);
                g.strokePath();
                // Stars
                g.fillStyle(0xFFFFFF, 0.8);
                g.fillCircle(x - 10, y - 25, 1.5);
                g.fillCircle(x + 5, y - 28, 1);
                g.fillCircle(x + 22, y - 8, 1.2);
                break;

            case 'drawing':
                // Easel legs
                g.lineStyle(2.5, 0x795548);
                g.lineBetween(x - 12, y - 20, x - 18, y + 20);
                g.lineBetween(x + 12, y - 20, x + 18, y + 20);
                g.lineBetween(x, y - 10, x - 5, y + 20);
                // Canvas
                g.fillStyle(0xFFF8E1);
                g.fillRect(x - 14, y - 22, 28, 24);
                g.lineStyle(1, 0x8D6E63);
                g.strokeRect(x - 14, y - 22, 28, 24);
                // Art on canvas (colorful strokes)
                g.fillStyle(0x2196F3, 0.6);
                g.fillCircle(x - 4, y - 12, 5);
                g.fillStyle(0xF44336, 0.6);
                g.fillCircle(x + 4, y - 8, 4);
                g.fillStyle(0xFFC107, 0.6);
                g.fillCircle(x, y - 4, 3);
                // Palette
                g.fillStyle(0xD7CCC8);
                g.fillEllipse(x + 20, y + 8, 16, 12);
                // Color dots on palette
                const palColors = [0xF44336, 0x2196F3, 0xFFC107, 0x4CAF50, 0x9C27B0];
                palColors.forEach((c, i) => {
                    g.fillStyle(c);
                    g.fillCircle(x + 15 + (i % 3) * 5, y + 5 + Math.floor(i / 3) * 5, 2);
                });
                break;

            case 'coding':
                // Laptop base
                g.fillStyle(0x37474F);
                g.fillRoundedRect(x - 22, y + 6, 44, 4, 2);
                // Laptop body/keyboard
                g.fillStyle(0x455A64);
                g.fillRoundedRect(x - 20, y + 2, 40, 8, 2);
                // Keyboard dots
                g.fillStyle(0x616161);
                for (let r = 0; r < 2; r++)
                    for (let c = 0; c < 8; c++)
                        g.fillRect(x - 16 + c * 4.5, y + 4 + r * 3, 3, 1.5);
                // Screen
                g.fillStyle(0x1A237E);
                g.fillRoundedRect(x - 18, y - 22, 36, 24, 3);
                // Screen inner (dark editor)
                g.fillStyle(0x0D1117);
                g.fillRect(x - 16, y - 20, 32, 20);
                // Code lines (colored syntax)
                g.fillStyle(0x79B8FF); // blue keyword
                g.fillRect(x - 14, y - 18, 12, 2);
                g.fillStyle(0xE1E4E8); // white text
                g.fillRect(x + 0, y - 18, 8, 2);
                g.fillStyle(0xB392F0); // purple
                g.fillRect(x - 12, y - 14, 8, 2);
                g.fillStyle(0x85E89D); // green string
                g.fillRect(x - 2, y - 14, 14, 2);
                g.fillStyle(0xE1E4E8);
                g.fillRect(x - 10, y - 10, 18, 2);
                g.fillStyle(0xFFAB70); // orange
                g.fillRect(x - 14, y - 6, 6, 2);
                g.fillStyle(0x79B8FF);
                g.fillRect(x - 6, y - 6, 10, 2);
                g.fillStyle(0xB392F0);
                g.fillRect(x + 6, y - 6, 8, 2);
                // Cursor blink indicator
                g.fillStyle(0xE1E4E8, 0.8);
                g.fillRect(x - 10, y - 2, 1, 3);
                break;

            case 'gaming':
                // Controller body
                g.fillStyle(0x37474F);
                g.fillRoundedRect(x - 22, y - 8, 44, 24, 8);
                // D-pad
                g.fillStyle(0x212121);
                g.fillRect(x - 16, y - 2, 4, 12);
                g.fillRect(x - 20, y + 2, 12, 4);
                // Buttons (ABXY style)
                g.fillStyle(0x4CAF50);
                g.fillCircle(x + 12, y + 2, 3);
                g.fillStyle(0xF44336);
                g.fillCircle(x + 18, y - 2, 3);
                g.fillStyle(0x2196F3);
                g.fillCircle(x + 6, y - 2, 3);
                g.fillStyle(0xFFC107);
                g.fillCircle(x + 12, y - 6, 3);
                // Joysticks
                g.fillStyle(0x616161);
                g.fillCircle(x - 8, y + 10, 4);
                g.fillCircle(x + 4, y + 10, 4);
                // Bumpers
                g.fillStyle(0x455A64);
                g.fillRoundedRect(x - 20, y - 12, 14, 5, 2);
                g.fillRoundedRect(x + 6, y - 12, 14, 5, 2);
                break;
        }
    }

    createPlayer() {
        const startX = this.worldStartX + 100;
        const startY = GROUND_Y - 80;

        this.player = this.physics.add.sprite(startX, startY, 'playerBody5');
        this.player.setVisible(false);
        this.player.body.setSize(40, 90).setOffset(0, 0);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setGravityY(PLAYER_GRAVITY);
        this.player.setDepth(10);

        this.playerVisual = createCharacter(this, this.playerStage);
        this.playerVisual.setScale(PLAYER_STAGES[this.playerStage].scale);
        this.playerVisual.setDepth(10);

        this.physics.add.collider(this.player, this.groundPlatform);
    }

    discoverHobby(station) {
        if (station.discovered) return;
        station.discovered = true;
        this.discoveredHobbies.add(station.hobby.id);

        // Glow burst
        this.tweens.add({
            targets: station.glow,
            alpha: 0.25, scale: 1.5,
            duration: 400, yoyo: true, ease: 'Cubic.easeOut',
        });

        // Show category
        this.tweens.add({
            targets: station.catLabel,
            alpha: 1, y: station.y - 45,
            duration: 500, ease: 'Back.easeOut',
        });

        // Highlight label
        station.label.setColor('#FFD700');
        station.label.setFontSize('14px');

        // Flash text
        const flash = this.add.text(station.x, station.y - 55, `${station.hobby.label}!`, {
            fontFamily: 'Poppins, sans-serif', fontSize: '18px',
            color: '#FFD700', stroke: '#000000', strokeThickness: 4, fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(20);
        this.tweens.add({
            targets: flash, y: flash.y - 50, alpha: 0, duration: 1500,
            ease: 'Cubic.easeOut', onComplete: () => flash.destroy(),
        });

        // Sparkle particles
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const p = this.add.circle(station.x, station.y, 3, 0xFFD700).setDepth(20);
            this.tweens.add({
                targets: p, x: p.x + Math.cos(angle) * 40, y: p.y + Math.sin(angle) * 40,
                alpha: 0, scale: 0, duration: 500, onComplete: () => p.destroy(),
            });
        }

        // Emit event for HUD
        EventBus.emit('hobby-discovered', {
            id: station.hobby.id,
            label: station.hobby.label,
            category: station.hobby.category,
            total: this.discoveredHobbies.size,
        });
    }

    checkHobbyProximity() {
        const px = this.player.x;
        this.hobbyStations.forEach(s => {
            const dist = Math.abs(px - s.x);
            if (dist < 70 && !s.discovered) {
                if (!s.glowing) {
                    s.glowing = true;
                    this.tweens.add({ targets: s.glow, alpha: 0.15, duration: 300 });
                }
                if (dist < 50) this.discoverHobby(s);
            } else if (dist >= 70 && s.glowing && !s.discovered) {
                s.glowing = false;
                this.tweens.add({ targets: s.glow, alpha: 0, duration: 300 });
            }
        });
    }

    updateHUD() {
        const zone = ZONES[this.currentZoneId];
        const zoneData = JOURNEY.zones[this.currentZoneId];
        if (!zoneData) return;

        EventBus.emit('year-updated', 2026);
        EventBus.emit('zone-changed', {
            id: this.currentZoneId, name: zone.name, city: zoneData.city,
            flag: zone.flag, subtitle: zone.subtitle,
            progress: this.player.x / 16500,
        });
    }

    update(time) {
        if (this.isTransitioning) return;

        const terrainY = getTerrainY(this.player.x);
        this.groundPlatform.y = terrainY + 200;
        this.groundPlatform.body.updateFromGameObject();

        // Safety clamp: prevent falling through terrain on steep slopes
        if (this.player.y > terrainY - 10) {
            this.player.body.reset(this.player.x, terrainY - 45);
        }

        let moveX = 0;
        if (this.cursors.left.isDown || this.joystickState.left) {
            moveX = -PLAYER_SPEED;
            this.facingRight = false;
        } else if (this.cursors.right.isDown || this.joystickState.right) {
            moveX = PLAYER_SPEED;
            this.facingRight = true;
        }

        if (Math.abs(this.scrollVelocity) > 5) {
            moveX = this.scrollVelocity;
            this.facingRight = this.scrollVelocity > 0;
            this.scrollVelocity *= 0.92;
        } else {
            this.scrollVelocity = 0;
        }

        this.player.body.setVelocityX(moveX);
        this.isMoving = Math.abs(moveX) > 10;

        const wantJump = Phaser.Input.Keyboard.JustDown(this.cursors.up) || this.mobileJumpRequested;
        this.mobileJumpRequested = false;
        if (wantJump && this.player.body.blocked.down)
            this.player.body.setVelocityY(PLAYER_JUMP_VELOCITY);

        // Auto-jump
        if (this.isMoving && this.player.body.blocked.down) {
            this.autoJumpTriggers.forEach(t => {
                if (Math.abs(this.player.x - t.x) < 25 && !this.triggeredJumps.has(t.x)) {
                    this.player.body.setVelocityY(t.velocity);
                    this.triggeredJumps.add(t.x);
                    this.time.delayedCall(1000, () => this.triggeredJumps.delete(t.x));
                }
            });
        }

        this.playerVisual.x = this.player.x;
        this.playerVisual.y = this.player.y;

        const sx = Math.abs(this.playerVisual.scaleX);
        if (this.isMoving) {
            this.playerVisual.setScale(this.facingRight ? sx : -sx, Math.abs(this.playerVisual.scaleY));
        } else {
            this.playerVisual.setScale(sx, Math.abs(this.playerVisual.scaleY));
        }

        if (this.isMoving) this.walkTimer += 0.2;
        else this.walkTimer = 0;
        animateWalk(this.playerVisual, this.walkTimer, this.isMoving, this.player.body.blocked.down, time);

        // Hobby station bob animation
        this.hobbyStations.forEach(s => {
            if (!s.discovered) {
                const bob = Math.sin(time * 0.003 + s.x * 0.01) * 4;
                s.gfx.y = bob;
            }
        });

        this.checkHobbyProximity();
        this.updateHUD();

        // End of hobbies — transition to EndScene
        if (this.player.x >= this.worldEndX - 80 && !this.isTransitioning) {
            this.isTransitioning = true;
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('EndScene', { playerStage: this.playerStage });
            });
        }
    }
}
