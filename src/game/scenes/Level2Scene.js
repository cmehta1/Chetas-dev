import Phaser from 'phaser';
import EventBus from '../EventBus';
import {
    GAME_WIDTH, GAME_HEIGHT, GROUND_Y,
    PLAYER_SPEED, PLAYER_GRAVITY,
    PLAYER_STAGES, ZONES, getTerrainY,
} from '../config/constants';
import { JOURNEY, SKILLS_DATA } from '../config/journeyData';
import { createCharacter, createParachuteCharacter, animateWalk } from '../utils/CharacterRenderer';
import { renderZoneBackground } from '../utils/BackgroundRenderer';

/**
 * Level 2: Engineering + Flight (Zones 2-3)
 * Zone 2: Parachute vertical ascent collecting stars
 * Zone 3: Flight cutscene (airplane)
 */
export default class Level2Scene extends Phaser.Scene {
    constructor() {
        super('Level2Scene');
    }

    init(data) {
        this.currentZoneId = 2;
        this.playerStage = data.playerStage || 3;
        this.collectedKeys = data.collectedKeys || [];
        this.skillProficiency = data.skillProficiency || {};
        this.isTransitioning = false;
        this.walkTimer = 0;
        this.isMoving = false;
        this.facingRight = true;
        this.scrollVelocity = 0;
        this.inParachuteMode = true;
        this.inFlightCutscene = false;
        this.flightCompleted = false;
        this.parachuteComplete = false;
    }

    create() {
        const gfx = this.make.graphics({ x: 0, y: 0, add: false });
        gfx.fillStyle(0xffffff, 0);
        gfx.fillRect(0, 0, 40, 90);
        gfx.generateTexture('playerBody2', 40, 90);
        gfx.destroy();

        // Zone 2 (college) as horizontal walk first, then parachute at mid-point
        // Zone 3 (flight) as cutscene
        const zone2 = ZONES[2];
        const zone3 = ZONES[3];
        const worldWidth = zone3.endX - zone2.startX;

        this.worldStartX = zone2.startX;
        this.worldWidth = worldWidth;

        this.physics.world.setBounds(zone2.startX, 0, worldWidth, GAME_HEIGHT);
        this.cameras.main.setBounds(zone2.startX, 0, worldWidth, GAME_HEIGHT);

        // Render backgrounds
        renderZoneBackground(this, zone2);
        renderZoneBackground(this, zone3);

        // Ground platform
        this.groundPlatform = this.add.rectangle(zone2.startX + worldWidth / 2, GROUND_Y + 10, worldWidth, 20, 0x000000, 0);
        this.physics.add.existing(this.groundPlatform, false);
        this.groundPlatform.body.setImmovable(true);
        this.groundPlatform.body.setAllowGravity(false);
        this.groundPlatform.body.moves = false;

        this.createBuildings();
        this.createStars();
        this.createPlayer();
        this.createFlightElements();

        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setFollowOffset(-200, 50);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            if (this.isTransitioning || this.inFlightCutscene) return;
            this.scrollVelocity += deltaY * 0.8;
            this.scrollVelocity = Phaser.Math.Clamp(this.scrollVelocity, -400, 400);
        });

        this.joystickState = { left: false, right: false };
        EventBus.on('joystick-input', (state) => { this.joystickState = state; });

        this.createParallaxClouds();
        this.updateHUD();
        EventBus.emit('level-changed', { id: 2, name: 'Engineering' });
        this.cameras.main.fadeIn(800);
        EventBus.emit('current-scene-ready', this);
    }

    createParallaxClouds() {
        const rng = new Phaser.Math.RandomDataGenerator(['clouds2']);
        for (let i = 0; i < 15; i++) {
            const x = this.worldStartX + rng.between(0, this.worldWidth);
            const y = rng.between(30, 250);
            const w = rng.between(60, 180);
            const speed = rng.realInRange(0.02, 0.08);
            const cloud = this.add.graphics().setDepth(-14);
            cloud.fillStyle(0xFFFFFF, rng.realInRange(0.15, 0.5));
            cloud.fillEllipse(0, 0, w, w * 0.3);
            cloud.fillEllipse(-w * 0.2, 4, w * 0.5, w * 0.22);
            cloud.fillEllipse(w * 0.22, 3, w * 0.45, w * 0.2);
            cloud.setPosition(x, y);
            cloud.setScrollFactor(speed, 1);
        }
    }

    createBuildings() {
        this.buildings = [];
        const zone2 = ZONES[2];
        if (zone2.building) {
            const b = zone2.building;
            const bx = b.x;
            const groundY = getTerrainY(bx);
            const g = this.add.graphics().setDepth(2);
            const w = b.width, h = 180;

            g.fillStyle(0xBCAAA4);
            g.fillRect(bx - w / 2, groundY - h, w, h);
            g.lineStyle(0.5, 0x8D6E63, 0.2);
            for (let r = 0; r < h / 10; r++)
                g.lineBetween(bx - w / 2, groundY - h + r * 10, bx + w / 2, groundY - h + r * 10);
            g.fillStyle(0x5D4037);
            g.fillRect(bx - w / 2 - 8, groundY - h - 8, w + 16, 12);

            g.fillStyle(0xFFF9C4, 0.9);
            const cols = Math.floor(w / 50);
            for (let r = 0; r < 3; r++)
                for (let c = 0; c < cols; c++) {
                    const wx = bx - w / 2 + 20 + c * (w / cols), wy = groundY - h + 20 + r * 50;
                    g.fillRect(wx, wy, 24, 30);
                    g.lineStyle(1.5, 0x795548);
                    g.strokeRect(wx, wy, 24, 30);
                }

            g.fillStyle(0x3E2723);
            g.fillRoundedRect(bx - 18, groundY - 55, 36, 55, { tl: 18, tr: 18, bl: 0, br: 0 });
            g.fillStyle(0xFFC107);
            g.fillCircle(bx + 8, groundY - 25, 3);
            g.fillStyle(0x9E9E9E);
            for (let s = 0; s < 3; s++)
                g.fillRect(bx - 25 - s * 5, groundY - 3 - s * 5, 50 + s * 10, 5);

            const signBg = this.add.graphics().setDepth(3);
            signBg.fillStyle(0x1A237E, 0.9);
            signBg.fillRoundedRect(bx - w / 2 + 10, groundY - h - 35, w - 20, 24, 6);
            this.add.text(bx, groundY - h - 23, b.name, {
                fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: '#ffffff', fontStyle: 'bold',
            }).setOrigin(0.5).setDepth(4);

            const prompt = this.add.text(bx, groundY - h - 55, '[ SPACE to Enter ]', {
                fontFamily: 'Poppins, sans-serif', fontSize: '15px',
                color: '#FFD700', stroke: '#000000', strokeThickness: 4, fontStyle: 'bold',
            }).setOrigin(0.5).setDepth(10).setAlpha(0);

            this.tweens.add({ targets: prompt, y: groundY - h - 62, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
            this.buildings.push({ zone: zone2, x: bx, prompt, entered: false });
        }
    }

    createStars() {
        this.starObjects = [];
        const zoneIds = [2]; // Only zone 2 has stars (zone 3 is cutscene)
        SKILLS_DATA.forEach(skill => {
            if (!zoneIds.includes(skill.zone)) return;
            if (this.collectedKeys.includes(skill.key)) return;
            const zone = ZONES[skill.zone];

            const zoneSkills = SKILLS_DATA.filter(s => s.zone === skill.zone);
            const skillIdx = zoneSkills.indexOf(skill);
            const spacing = (zone.endX - zone.startX - 300) / (zoneSkills.length + 1);
            const x = zone.startX + 150 + (skillIdx + 1) * spacing;
            const y = getTerrainY(x) - 50;

            const star = this.add.star(x, y, 5, 10, 22, 0xFFD700);
            star.setStrokeStyle(2, 0xFFA000).setDepth(12);
            const glow = this.add.circle(x, y, 18, 0xFFD700, 0.12).setDepth(11);
            const label = this.add.text(x, y - 28, skill.label, {
                fontFamily: 'Poppins, sans-serif', fontSize: '11px',
                color: '#FFD700', stroke: '#000000', strokeThickness: 3, fontStyle: 'bold',
            }).setOrigin(0.5).setDepth(13);
            const starsText = '\u2605'.repeat(skill.proficiency) + '\u2606'.repeat(5 - skill.proficiency);
            const profLabel = this.add.text(x, y - 16, starsText, {
                fontFamily: 'Poppins, sans-serif', fontSize: '8px',
                color: '#FFA000', stroke: '#000000', strokeThickness: 2,
            }).setOrigin(0.5).setDepth(13);

            this.starObjects.push({ shape: star, glow, label, profLabel, skill, baseY: y, collected: false });
        });
    }

    createFlightElements() {
        const fz = ZONES[3];
        this.airplane = this.add.container(fz.startX + 50, 350);
        this.airplane.setDepth(8);
        this.airplane.setVisible(false);

        const ag = this.add.graphics();
        ag.fillStyle(0xECEFF1);
        ag.fillRoundedRect(-60, -15, 120, 30, 12);
        ag.fillStyle(0x64B5F6);
        for (let w = 0; w < 7; w++) ag.fillCircle(-40 + w * 12, -5, 3.5);
        ag.fillStyle(0xB0BEC5);
        ag.fillTriangle(-15, 15, 15, 15, 0, 50);
        ag.fillStyle(0xB0BEC5);
        ag.fillTriangle(48, -15, 60, -15, 56, -38);
        ag.fillStyle(0xFF5722);
        ag.fillTriangle(50, -18, 58, -18, 55, -34);
        ag.fillStyle(0x78909C);
        ag.fillEllipse(-25, 22, 16, 8);
        ag.fillEllipse(25, 22, 16, 8);
        this.airplane.add(ag);

        const miniChar = this.add.graphics();
        miniChar.fillStyle(0xD4A574);
        miniChar.fillCircle(-28, -6, 4);
        miniChar.fillStyle(0x1A1A1A);
        miniChar.fillEllipse(-28, -9, 10, 5);
        this.airplane.add(miniChar);
    }

    createPlayer() {
        const startX = ZONES[2].startX + 100;
        const startY = GROUND_Y - 80;

        this.player = this.physics.add.sprite(startX, startY, 'playerBody2');
        this.player.setVisible(false);
        this.player.body.setSize(40, 90).setOffset(0, 0);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setGravityY(PLAYER_GRAVITY);
        this.player.setDepth(10);

        if (this.playerStage < 3) this.playerStage = 3;
        this.playerVisual = createCharacter(this, this.playerStage);
        this.playerVisual.setScale(PLAYER_STAGES[this.playerStage].scale);
        this.playerVisual.setDepth(10);

        this.physics.add.collider(this.player, this.groundPlatform);
    }

    collectStar(starObj) {
        if (starObj.collected) return;
        starObj.collected = true;
        const skill = starObj.skill;
        this.collectedKeys.push(skill.key);

        const isUpgrade = this.skillProficiency[skill.id] !== undefined;
        this.skillProficiency[skill.id] = { label: skill.label, proficiency: skill.proficiency };

        this.tweens.add({
            targets: [starObj.shape, starObj.glow],
            scaleX: 2.5, scaleY: 2.5, alpha: 0, duration: 350, ease: 'Back.easeIn',
            onComplete: () => { starObj.shape.destroy(); starObj.glow.destroy(); },
        });
        this.tweens.add({ targets: [starObj.label, starObj.profLabel], alpha: 0, duration: 250, onComplete: () => { starObj.label.destroy(); starObj.profLabel.destroy(); } });

        const msg = isUpgrade
            ? `${skill.label} ${'★'.repeat(skill.proficiency)} UPGRADED!`
            : `+ ${skill.label} ${'★'.repeat(skill.proficiency)}`;
        const color = isUpgrade ? '#FF9800' : '#FFD700';

        const flash = this.add.text(starObj.shape.x, starObj.shape.y - 40, msg, {
            fontFamily: 'Poppins, sans-serif', fontSize: '16px',
            color, stroke: '#000000', strokeThickness: 4, fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(20);
        this.tweens.add({
            targets: flash, y: flash.y - 60, alpha: 0, duration: 1500,
            ease: 'Cubic.easeOut', onComplete: () => flash.destroy(),
        });

        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const p = this.add.circle(starObj.shape.x, starObj.shape.y, 3, isUpgrade ? 0xFF9800 : 0xFFD700).setDepth(20);
            this.tweens.add({
                targets: p, x: p.x + Math.cos(angle) * 35, y: p.y + Math.sin(angle) * 35,
                alpha: 0, scale: 0, duration: 400, onComplete: () => p.destroy(),
            });
        }

        EventBus.emit('skill-collected', {
            id: skill.id, label: skill.label, proficiency: skill.proficiency,
            isUpgrade, total: Object.keys(this.skillProficiency).length,
            allSkills: { ...this.skillProficiency },
        });
    }

    checkStarCollisions() {
        const px = this.player.x, py = this.player.y;
        this.starObjects.forEach(s => {
            if (s.collected) return;
            const dx = px - s.shape.x, dy = py - s.shape.y;
            if (dx * dx + dy * dy < 3600) this.collectStar(s);
        });
    }

    startFlightCutscene() {
        if (this.inFlightCutscene) return;
        this.inFlightCutscene = true;

        const fz = ZONES[3];
        this.playerVisual.setVisible(false);
        this.player.body.setVelocity(0, 0);
        this.player.body.setAllowGravity(false);

        this.airplane.setVisible(true);
        this.airplane.x = fz.startX + 50;
        this.airplane.y = 320;
        this.cameras.main.stopFollow();

        const endX = fz.endX - 50;

        this.tweens.add({
            targets: this.airplane,
            x: endX,
            y: { value: 280, duration: 600, yoyo: true, repeat: 1, ease: 'Sine.easeInOut' },
            duration: 3000,
            ease: 'Sine.easeInOut',
            onUpdate: () => {
                this.cameras.main.scrollX = this.airplane.x - GAME_WIDTH / 2;
            },
            onComplete: () => {
                this.airplane.setVisible(false);
                this.flightCompleted = true;
                this.inFlightCutscene = false;

                // Transition to next level
                this.cameras.main.fadeOut(800, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('LevelTransition', {
                        levelId: 3,
                        collectedKeys: this.collectedKeys,
                        skillProficiency: this.skillProficiency,
                        playerStage: this.playerStage,
                    });
                });
            },
        });
    }

    updateHUD() {
        const zone = ZONES[this.currentZoneId];
        const zoneData = JOURNEY.zones[this.currentZoneId];
        if (!zoneData) return;

        const zoneProgress = (this.player.x - zone.startX) / (zone.endX - zone.startX);
        const clamped = Phaser.Math.Clamp(zoneProgress, 0, 1);
        const year = Math.floor(zoneData.yearStart + (zoneData.yearEnd - zoneData.yearStart) * clamped);

        EventBus.emit('year-updated', year);
        EventBus.emit('zone-changed', {
            id: this.currentZoneId, name: zone.name, city: zoneData.city,
            flag: zone.flag, subtitle: zone.subtitle,
            progress: this.player.x / 14000,
        });
    }

    handleBuildingInteraction() {
        if (this.isTransitioning || this.inFlightCutscene) return;
        this.buildings.forEach(b => {
            if (b.entered) return;
            if (Math.abs(this.player.x - b.x) < 100) {
                b.prompt.setAlpha(1);
                if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
                    b.entered = true;
                    b.prompt.setAlpha(0);
                    // Enter building triggers transition to flight zone
                    this.isTransitioning = true;
                    this.cameras.main.fadeOut(800, 0, 0, 0);
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        // Show building interstitial
                        const zoneData = JOURNEY.zones[2];
                        const overlay = this.add.rectangle(
                            this.cameras.main.scrollX + GAME_WIDTH / 2, GAME_HEIGHT / 2,
                            GAME_WIDTH, GAME_HEIGHT, 0x000000
                        ).setScrollFactor(0).setDepth(99);

                        const city = this.add.text(
                            this.cameras.main.scrollX + GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30,
                            zoneData.city, {
                                fontFamily: 'Poppins, sans-serif', fontSize: '32px', color: '#ffffff', fontStyle: 'bold',
                            }
                        ).setOrigin(0.5).setDepth(100).setScrollFactor(0);

                        const yr = this.add.text(
                            this.cameras.main.scrollX + GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20,
                            `${zoneData.yearEnd}`, {
                                fontFamily: 'Poppins, sans-serif', fontSize: '44px', color: '#FFD700', fontStyle: 'bold',
                            }
                        ).setOrigin(0.5).setDepth(100).setScrollFactor(0);

                        this.time.delayedCall(2000, () => {
                            overlay.destroy(); city.destroy(); yr.destroy();
                            // Move player to flight zone
                            this.currentZoneId = 3;
                            this.player.x = ZONES[3].startX + 50;
                            this.player.y = GROUND_Y - 80;
                            this.player.body.setVelocity(0, 0);
                            this.cameras.main.fadeIn(800);
                            this.isTransitioning = false;
                        });
                    });
                }
            } else {
                b.prompt.setAlpha(0);
            }
        });
    }

    update(time) {
        if (this.isTransitioning) return;

        // Check if entering flight zone
        const currentZone = ZONES[this.currentZoneId];
        if (currentZone?.isCutscene && !this.inFlightCutscene && !this.flightCompleted) {
            this.startFlightCutscene();
            return;
        }
        if (this.inFlightCutscene) return;

        // Terrain following
        const terrainY = getTerrainY(this.player.x);
        this.groundPlatform.y = terrainY + 10;
        this.groundPlatform.body.updateFromGameObject();

        // Input (keyboard + joystick)
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

        // Jump
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && this.player.body.blocked.down)
            this.player.body.setVelocityY(-500);

        // Sync visual
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

        // Star animation
        this.starObjects.forEach(s => {
            if (!s.collected && s.shape.active) {
                s.shape.y = s.baseY + Math.sin(time * 0.003 + s.skill.zone * 10 + s.shape.x * 0.01) * 6;
                s.shape.angle += 1.5;
                s.glow.y = s.shape.y;
                s.label.y = s.shape.y - 28;
                s.profLabel.y = s.shape.y - 16;
            }
        });

        this.checkStarCollisions();

        // Zone detection within level
        if (this.player.x >= ZONES[3].startX && this.currentZoneId < 3) {
            this.currentZoneId = 3;
        } else if (this.player.x < ZONES[3].startX && this.player.x >= ZONES[2].startX) {
            this.currentZoneId = 2;
        }

        this.updateHUD();
        this.handleBuildingInteraction();
    }
}
