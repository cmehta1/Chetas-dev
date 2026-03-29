import Phaser from 'phaser';
import EventBus from '../EventBus';
import {
    GAME_WIDTH, GAME_HEIGHT, WORLD_WIDTH, GROUND_Y,
    PLAYER_SPEED, PLAYER_JUMP_VELOCITY, PLAYER_GRAVITY,
    PLAYER_STAGES, ZONES, getTerrainY, isMobilePortrait,
} from '../config/constants';
import { JOURNEY, SKILLS_DATA } from '../config/journeyData';
import { createCharacter, animateWalk } from '../utils/CharacterRenderer';
import { renderZoneBackground } from '../utils/BackgroundRenderer';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init() {
        this.currentZoneId = 0;
        this.playerStage = 1;
        this.collectedKeys = [];
        this.skillProficiency = {};
        this.isTransitioning = false;
        this.inFlightCutscene = false;
        this.flightCompleted = false;
        this.walkTimer = 0;
        this.isMoving = false;
        this.facingRight = true;
        this.scrollVelocity = 0;
    }

    create() {
        const gfx = this.make.graphics({ x: 0, y: 0, add: false });
        gfx.fillStyle(0xffffff, 0);
        gfx.fillRect(0, 0, 30, 70);
        gfx.generateTexture('playerBody', 30, 70);
        gfx.destroy();

        this.physics.world.setBounds(0, 0, WORLD_WIDTH, GAME_HEIGHT);
        this.cameras.main.setBounds(0, 0, WORLD_WIDTH, GAME_HEIGHT);

        ZONES.forEach((zone) => renderZoneBackground(this, zone));

        // Ground platform — dynamic immovable body that follows terrain height
        this.groundPlatform = this.add.rectangle(WORLD_WIDTH / 2, GROUND_Y + 10, WORLD_WIDTH, 20, 0x000000, 0);
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

        // Scroll-wheel navigation (Leonardi-style)
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            if (this.isTransitioning || this.inFlightCutscene) return;
            this.scrollVelocity += deltaY * 0.8;
            this.scrollVelocity = Phaser.Math.Clamp(this.scrollVelocity, -400, 400);
        });

        this.createParallaxClouds();

        this.updateHUD();
        this.cameras.main.fadeIn(800);
        EventBus.emit('current-scene-ready', this);
    }

    // ─── PARALLAX CLOUDS ────────────────────────────────────
    createParallaxClouds() {
        this.parallaxClouds = [];
        const rng = new Phaser.Math.RandomDataGenerator(['clouds']);
        for (let i = 0; i < 20; i++) {
            const x = rng.between(0, WORLD_WIDTH);
            const y = rng.between(30, 200);
            const w = rng.between(80, 200);
            const speed = rng.realInRange(0.02, 0.08);

            const cloud = this.add.graphics().setDepth(-14);
            cloud.fillStyle(0xFFFFFF, rng.realInRange(0.15, 0.4));
            cloud.fillEllipse(0, 0, w, w * 0.3);
            cloud.fillEllipse(-w * 0.2, 4, w * 0.5, w * 0.22);
            cloud.fillEllipse(w * 0.22, 3, w * 0.45, w * 0.2);
            cloud.setPosition(x, y);
            cloud.setScrollFactor(speed, 1);

            this.parallaxClouds.push({ obj: cloud, baseX: x, speed });
        }
    }

    // ─── BUILDINGS ──────────────────────────────────────────
    createBuildings() {
        this.buildings = [];
        ZONES.forEach((zone) => {
            if (!zone.building) return;
            const b = zone.building;
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

            const promptText = isMobilePortrait() ? '[ Tap to Enter ]' : '[ SPACE to Enter ]';
            const prompt = this.add.text(bx, groundY - h - 55, promptText, {
                fontFamily: 'Poppins, sans-serif', fontSize: '15px',
                color: '#FFD700', stroke: '#000000', strokeThickness: 4, fontStyle: 'bold',
            }).setOrigin(0.5).setDepth(10).setAlpha(0);

            this.tweens.add({ targets: prompt, y: groundY - h - 62, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
            this.buildings.push({ zone, x: bx, prompt, entered: false });
        });
    }

    // ─── STARS (placed on terrain surface) ──────────────────
    createStars() {
        this.starObjects = [];
        SKILLS_DATA.forEach((skill) => {
            const zone = ZONES.find((z) => z.id === skill.zone);
            if (!zone || zone.isCutscene) return;

            const zoneSkills = SKILLS_DATA.filter((s) => s.zone === skill.zone && !ZONES.find(z => z.id === s.zone)?.isCutscene);
            const skillIdx = zoneSkills.indexOf(skill);
            const spacing = (zone.endX - zone.startX - 300) / (zoneSkills.length + 1);
            const x = zone.startX + 150 + (skillIdx + 1) * spacing;
            // Place star on terrain surface
            const y = getTerrainY(x) - 40;

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

            this.starObjects.push({
                shape: star, glow, label, profLabel, skill, baseY: y, collected: false,
            });
        });
    }

    // ─── FLIGHT ELEMENTS ────────────────────────────────────
    createFlightElements() {
        const fz = ZONES.find(z => z.isCutscene);
        if (!fz) return;

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

    // ─── PLAYER ─────────────────────────────────────────────
    createPlayer() {
        const startX = 100, startY = GROUND_Y - 60;

        this.player = this.physics.add.sprite(startX, startY, 'playerBody');
        this.player.setVisible(false);
        this.player.body.setSize(28, 65).setOffset(1, 2);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setGravityY(PLAYER_GRAVITY);
        this.player.setDepth(10);

        this.playerVisual = createCharacter(this, this.playerStage);
        this.playerVisual.setScale(PLAYER_STAGES[this.playerStage].scale);
        this.playerVisual.setDepth(10);

        this.physics.add.collider(this.player, this.groundPlatform);
    }

    rebuildCharacter(newStage) {
        if (this.playerVisual) this.playerVisual.destroy();
        this.playerVisual = createCharacter(this, newStage);
        this.playerVisual.setDepth(10);
        this.playerVisual.x = this.player.x;
        this.playerVisual.y = this.player.y;
    }

    // ─── STAR COLLECTION ────────────────────────────────────
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
        this.starObjects.forEach((s) => {
            if (s.collected) return;
            const dx = px - s.shape.x, dy = py - s.shape.y;
            if (dx * dx + dy * dy < 2500) this.collectStar(s);
        });
    }

    // ─── FLIGHT CUTSCENE ────────────────────────────────────
    startFlightCutscene() {
        if (this.inFlightCutscene) return;
        this.inFlightCutscene = true;

        const fz = ZONES.find(z => z.isCutscene);
        if (!fz) return;

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
                const nextZone = ZONES.find(z => z.id === fz.id + 1);
                if (nextZone) {
                    this.player.x = nextZone.startX + 80;
                    this.player.y = GROUND_Y - 60;
                    this.player.body.setAllowGravity(true);
                    this.player.body.setVelocity(0, 0);
                    this.playerVisual.setVisible(true);
                    this.cameras.main.setScroll(this.player.x - GAME_WIDTH / 2 - 200, this.player.y - GAME_HEIGHT / 2 + 50);
                    this.currentZoneId = nextZone.id;
                    this.growPlayer(nextZone.playerStage);
                }
                this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
                this.cameras.main.setFollowOffset(-200, 50);
                this.flightCompleted = true;
                this.inFlightCutscene = false;
            },
        });
    }

    // ─── HUD UPDATE ─────────────────────────────────────────
    updateHUD() {
        const zone = ZONES[this.currentZoneId];
        const zoneData = JOURNEY.zones[this.currentZoneId];
        if (!zoneData) return;

        const zoneProgress = (this.player.x - zone.startX) / (zone.endX - zone.startX);
        const clamped = Phaser.Math.Clamp(zoneProgress, 0, 1);
        const year = Math.floor(zoneData.yearStart + (zoneData.yearEnd - zoneData.yearStart) * clamped);

        EventBus.emit('year-updated', year);
        EventBus.emit('zone-changed', {
            id: this.currentZoneId,
            name: zone.name,
            city: zoneData.city,
            flag: zone.flag,
            subtitle: zone.subtitle,
            progress: this.player.x / WORLD_WIDTH,
        });
    }

    // ─── GROWTH ─────────────────────────────────────────────
    growPlayer(newStage) {
        if (newStage <= this.playerStage) return;
        this.playerStage = newStage;
        this.rebuildCharacter(newStage);

        const targetScale = PLAYER_STAGES[newStage].scale;
        this.playerVisual.setScale(PLAYER_STAGES[newStage - 1]?.scale || 0.5);

        this.tweens.add({
            targets: this.playerVisual, scaleX: targetScale, scaleY: targetScale,
            duration: 1000, ease: 'Back.easeOut',
        });

        const flash = this.add.text(this.player.x, this.player.y - 90, 'LEVEL UP!', {
            fontFamily: 'Poppins, sans-serif', fontSize: '26px',
            color: '#FFD700', stroke: '#000000', strokeThickness: 5, fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(20);

        const sub = this.add.text(this.player.x, this.player.y - 60, PLAYER_STAGES[newStage].label, {
            fontFamily: 'Poppins, sans-serif', fontSize: '15px',
            color: '#ffffff', stroke: '#000000', strokeThickness: 3,
        }).setOrigin(0.5).setDepth(20);

        this.tweens.add({
            targets: [flash, sub], y: '-=80', alpha: 0, duration: 2000,
            ease: 'Cubic.easeOut', onComplete: () => { flash.destroy(); sub.destroy(); },
        });

        EventBus.emit('player-grew', { stage: newStage, label: PLAYER_STAGES[newStage].label });
    }

    // ─── BUILDING INTERACTION ───────────────────────────────
    handleBuildingInteraction() {
        if (this.isTransitioning) return;
        this.buildings.forEach((b) => {
            if (b.entered) return;
            if (Math.abs(this.player.x - b.x) < 100) {
                b.prompt.setAlpha(1);
                if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) this.enterBuilding(b);
                else if (isMobilePortrait() && this.input.activePointer.isDown && !this._pointerWasDown) this.enterBuilding(b);
            } else {
                b.prompt.setAlpha(0);
            }
        });
        this._pointerWasDown = this.input.activePointer.isDown;
    }

    enterBuilding(building) {
        this.isTransitioning = true;
        building.entered = true;
        building.prompt.setAlpha(0);

        this.cameras.main.fadeOut(800, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            const zoneData = JOURNEY.zones.find(z => z.id === building.zone.id);
            const nextZone = ZONES.find(z => z.id === building.zone.id + 1);

            const overlay = this.add.rectangle(
                this.cameras.main.scrollX + GAME_WIDTH / 2, GAME_HEIGHT / 2,
                GAME_WIDTH, GAME_HEIGHT, 0x000000
            ).setScrollFactor(0).setDepth(99);

            const city = this.add.text(
                this.cameras.main.scrollX + GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30,
                zoneData ? zoneData.city : '', {
                    fontFamily: 'Poppins, sans-serif', fontSize: '32px', color: '#ffffff', fontStyle: 'bold',
                }
            ).setOrigin(0.5).setDepth(100).setScrollFactor(0);

            const yr = this.add.text(
                this.cameras.main.scrollX + GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20,
                zoneData ? `${zoneData.yearEnd}` : '', {
                    fontFamily: 'Poppins, sans-serif', fontSize: '44px', color: '#FFD700', fontStyle: 'bold',
                }
            ).setOrigin(0.5).setDepth(100).setScrollFactor(0);

            const desc = this.add.text(
                this.cameras.main.scrollX + GAME_WIDTH / 2, GAME_HEIGHT / 2 + 75,
                zoneData ? zoneData.description : '', {
                    fontFamily: 'Poppins, sans-serif', fontSize: '16px', color: '#aaaaaa', fontStyle: 'italic',
                }
            ).setOrigin(0.5).setDepth(100).setScrollFactor(0);

            this.time.delayedCall(2000, () => {
                overlay.destroy(); city.destroy(); yr.destroy(); desc.destroy();
                if (nextZone) {
                    this.player.x = nextZone.startX + 100;
                    this.player.y = GROUND_Y - 60;
                    this.player.body.setVelocity(0, 0);
                    this.growPlayer(nextZone.playerStage);
                }
                this.cameras.main.fadeIn(800);
                this.isTransitioning = false;
            });
        });
    }

    // ─── UPDATE LOOP ────────────────────────────────────────
    update(time) {
        if (this.isTransitioning || this.inFlightCutscene) return;

        // Check if entering flight zone
        const currentZone = ZONES[this.currentZoneId];
        if (currentZone?.isCutscene && !this.inFlightCutscene && !this.flightCompleted) {
            this.startFlightCutscene();
            return;
        }

        // ── Move ground platform to terrain height at player position ──
        const terrainY = getTerrainY(this.player.x);
        this.groundPlatform.y = terrainY + 10;
        this.groundPlatform.body.updateFromGameObject();

        // ── INPUT: keyboard + scroll wheel ──
        let moveX = 0;

        if (this.cursors.left.isDown) {
            moveX = -PLAYER_SPEED;
            this.facingRight = false;
        } else if (this.cursors.right.isDown) {
            moveX = PLAYER_SPEED;
            this.facingRight = true;
        }

        // Scroll-wheel momentum
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
            this.player.body.setVelocityY(PLAYER_JUMP_VELOCITY);

        // Sync visual to physics
        this.playerVisual.x = this.player.x;
        this.playerVisual.y = this.player.y;

        // Character facing: face movement direction when walking, face viewer when idle
        const sx = Math.abs(this.playerVisual.scaleX);
        if (this.isMoving) {
            this.playerVisual.setScale(this.facingRight ? sx : -sx, Math.abs(this.playerVisual.scaleY));
        } else {
            // Face forward (default orientation) when standing still
            this.playerVisual.setScale(sx, Math.abs(this.playerVisual.scaleY));
        }

        // Walk + idle animation
        if (this.isMoving) this.walkTimer += 0.2;
        else this.walkTimer = 0;
        animateWalk(this.playerVisual, this.walkTimer, this.isMoving, this.player.body.blocked.down, time);

        // Star bob & spin
        this.starObjects.forEach((s) => {
            if (!s.collected && s.shape.active) {
                s.shape.y = s.baseY + Math.sin(time * 0.003 + s.skill.zone * 10 + s.shape.x * 0.01) * 6;
                s.shape.angle += 1.5;
                s.glow.y = s.shape.y;
                s.label.y = s.shape.y - 28;
                s.profLabel.y = s.shape.y - 16;
            }
        });

        this.checkStarCollisions();

        // Zone detection
        const newZone = ZONES.findIndex(z => this.player.x >= z.startX && this.player.x < z.endX);
        if (newZone !== -1 && newZone !== this.currentZoneId) this.currentZoneId = newZone;
        this.updateHUD();

        this.handleBuildingInteraction();
    }
}
