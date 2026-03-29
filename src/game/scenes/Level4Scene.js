import Phaser from 'phaser';
import EventBus from '../EventBus';
import {
    GAME_WIDTH, GAME_HEIGHT, GROUND_Y,
    PLAYER_SPEED, PLAYER_JUMP_VELOCITY, PLAYER_GRAVITY,
    PLAYER_STAGES, ZONES, getTerrainY, getCameraMargin, isMobilePortrait,
} from '../config/constants';
import { JOURNEY, SKILLS_DATA } from '../config/journeyData';
import { AUTO_JUMP_TRIGGERS } from '../config/levelConfig';
import { createCharacter, animateWalk } from '../utils/CharacterRenderer';
import { renderZoneBackground } from '../utils/BackgroundRenderer';

/**
 * Level 4: Career (Zones 5-7: Midway, Cerner, Oracle)
 * Horizontal walk with distinct visual themes per company
 */
export default class Level4Scene extends Phaser.Scene {
    constructor() {
        super('Level4Scene');
    }

    init(data) {
        this.currentZoneId = 5;
        this.playerStage = data.playerStage || 5;
        this.collectedKeys = data.collectedKeys || [];
        this.skillProficiency = data.skillProficiency || {};
        this.isTransitioning = false;
        this.walkTimer = 0;
        this.isMoving = false;
        this.facingRight = true;
        this.scrollVelocity = 0;
        this.levelZones = [ZONES[5], ZONES[6], ZONES[7]];
        this.worldStartX = ZONES[5].startX;
        this.worldEndX = ZONES[7].endX;
        this.worldWidth = this.worldEndX - this.worldStartX;
        this.autoJumpTriggers = AUTO_JUMP_TRIGGERS.filter(t => t.level === 4);
        this.triggeredJumps = new Set();
    }

    create() {
        const gfx = this.make.graphics({ x: 0, y: 0, add: false });
        gfx.fillStyle(0xffffff, 0);
        gfx.fillRect(0, 0, 40, 90);
        gfx.generateTexture('playerBody4', 40, 90);
        gfx.destroy();

        this.physics.world.setBounds(this.worldStartX, 0, this.worldWidth, GAME_HEIGHT);
        const margin = getCameraMargin();
        this.cameras.main.setBounds(this.worldStartX - margin, 0, this.worldWidth + margin * 2, GAME_HEIGHT);

        // Render backgrounds for all career zones
        this.levelZones.forEach(zone => renderZoneBackground(this, zone));

        // Ground platform
        this.groundPlatform = this.add.rectangle(this.worldStartX + this.worldWidth / 2, GROUND_Y + 10, this.worldWidth, 20, 0x000000, 0);
        this.physics.add.existing(this.groundPlatform, false);
        this.groundPlatform.body.setImmovable(true);
        this.groundPlatform.body.setAllowGravity(false);
        this.groundPlatform.body.moves = false;

        this.createBuildings();
        this.createStars();
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
        EventBus.emit('level-changed', { id: 4, name: 'Career' });
        this.cameras.main.fadeIn(800);
        EventBus.emit('current-scene-ready', this);
    }

    createParallaxClouds() {
        const rng = new Phaser.Math.RandomDataGenerator(['clouds4']);
        for (let i = 0; i < 18; i++) {
            const x = this.worldStartX + rng.between(0, this.worldWidth);
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

    createBuildings() {
        this.buildings = [];
        this.levelZones.forEach(zone => {
            if (!zone.building) return;
            const b = zone.building;
            const bx = b.x;
            const groundY = getTerrainY(bx);
            const g = this.add.graphics().setDepth(2);
            const w = b.width;
            let h;

            if (zone.id === 5) {
                // ===== MIDWAY DENTAL SUPPLY =====
                h = 150;

                // Warm brick body
                g.fillStyle(0x8D4E3C);
                g.fillRect(bx - w / 2, groundY - h, w, h);

                // Brick texture
                g.lineStyle(0.5, 0x6D3A2E, 0.3);
                for (let r = 0; r < Math.floor(h / 12); r++) {
                    const ly = groundY - h + r * 12;
                    g.lineBetween(bx - w / 2, ly, bx + w / 2, ly);
                    const offset = (r % 2 === 0) ? 0 : 18;
                    for (let vx = bx - w / 2 + offset; vx < bx + w / 2; vx += 36) {
                        g.lineBetween(vx, ly, vx, ly + 12);
                    }
                }

                // Roof
                g.fillStyle(0x5D4037);
                g.fillRect(bx - w / 2 - 6, groundY - h - 6, w + 12, 10);

                // Windows: 2 rows of 4
                const mWinCols = 4;
                const mWinRows = 2;
                const mWinW = 26;
                const mWinH = 30;
                const mSpacingX = (w - 60) / mWinCols;
                const mSpacingY = 50;
                for (let r = 0; r < mWinRows; r++) {
                    for (let c = 0; c < mWinCols; c++) {
                        const wx = bx - w / 2 + 30 + c * mSpacingX;
                        const wy = groundY - h + 20 + r * mSpacingY;
                        g.fillStyle(0xECEFF1);
                        g.fillRect(wx - 2, wy - 2, mWinW + 4, mWinH + 4);
                        g.fillStyle(0xFFF9C4, 0.85);
                        g.fillRect(wx, wy, mWinW, mWinH);
                        g.lineStyle(1, 0xECEFF1);
                        g.lineBetween(wx + mWinW / 2, wy, wx + mWinW / 2, wy + mWinH);
                        g.lineBetween(wx, wy + mWinH / 2, wx + mWinW, wy + mWinH / 2);
                    }
                }

                // Clean entrance with awning
                g.fillStyle(0x3E2723);
                g.fillRect(bx - 16, groundY - 45, 32, 45);
                g.fillStyle(0xFFC107);
                g.fillCircle(bx + 8, groundY - 22, 2.5);
                // Awning
                g.fillStyle(0xB71C1C, 0.8);
                g.fillTriangle(bx - 28, groundY - 45, bx + 28, groundY - 45, bx - 28, groundY - 35);
                g.fillTriangle(bx - 28, groundY - 45, bx + 28, groundY - 45, bx + 28, groundY - 35);
                g.fillRect(bx - 28, groundY - 48, 56, 5);

                // Tooth logo at top-center
                g.fillStyle(0xFFFFFF);
                // Tooth crown (rounded rect)
                g.fillRoundedRect(bx - 10, groundY - h + 6, 20, 16, 6);
                // Tooth roots
                g.fillRoundedRect(bx - 8, groundY - h + 18, 7, 10, 2);
                g.fillRoundedRect(bx + 1, groundY - h + 18, 7, 10, 2);
                // Tooth outline
                g.lineStyle(1, 0xBDBDBD);
                g.strokeRoundedRect(bx - 10, groundY - h + 6, 20, 16, 6);

            } else if (zone.id === 6) {
                // ===== CERNER CORPORATION =====
                h = 280;

                // Blue-gray glass body
                g.fillStyle(0x546E7A);
                g.fillRect(bx - w / 2, groundY - h, w, h);

                // Glass panel grid windows
                const cWinCols = 7;
                const cWinRows = 8;
                const cWinW = (w - 40) / cWinCols - 4;
                const cWinH = (h - 50) / cWinRows - 4;
                for (let r = 0; r < cWinRows; r++) {
                    for (let c = 0; c < cWinCols; c++) {
                        const wx = bx - w / 2 + 20 + c * ((w - 40) / cWinCols);
                        const wy = groundY - h + 25 + r * ((h - 50) / cWinRows);
                        g.fillStyle(0x90CAF9, 0.45);
                        g.fillRect(wx, wy, cWinW, cWinH);
                        g.lineStyle(0.5, 0x37474F);
                        g.strokeRect(wx, wy, cWinW, cWinH);
                    }
                }

                // Modern roof
                g.fillStyle(0x37474F);
                g.fillRect(bx - w / 2 - 4, groundY - h - 6, w + 8, 10);

                // Roof antenna
                g.lineStyle(2, 0x90A4AE);
                g.lineBetween(bx + w / 4, groundY - h - 6, bx + w / 4, groundY - h - 30);
                g.fillStyle(0xE0E0E0);
                g.fillCircle(bx + w / 4, groundY - h - 30, 3);

                // Entrance: wide glass doors
                g.fillStyle(0x37474F);
                g.fillRect(bx - 28, groundY - 55, 56, 55);
                g.fillStyle(0x90CAF9, 0.6);
                g.fillRect(bx - 24, groundY - 50, 22, 46);
                g.fillRect(bx + 2, groundY - 50, 22, 46);
                g.lineStyle(1, 0x263238);
                g.strokeRect(bx - 24, groundY - 50, 22, 46);
                g.strokeRect(bx + 2, groundY - 50, 22, 46);

                // Cerner logo: healthcare cross at top-center
                // Circle behind
                g.fillStyle(0x37474F);
                g.fillCircle(bx, groundY - h + 14, 18);
                g.lineStyle(1, 0x263238);
                g.strokeCircle(bx, groundY - h + 14, 18);
                // Green cross
                g.fillStyle(0x4CAF50);
                g.fillRect(bx - 4, groundY - h + 14 - 12, 8, 24); // vertical bar
                g.fillRect(bx - 12, groundY - h + 14 - 4, 24, 8); // horizontal bar

            } else if (zone.id === 7) {
                // ===== ORACLE HEALTH =====
                h = 320;

                // Dark glass body
                g.fillStyle(0x263238);
                g.fillRect(bx - w / 2, groundY - h, w, h);

                // Red accent strips on sides
                g.fillStyle(0xC62828);
                g.fillRect(bx - w / 2, groundY - h, 6, h);
                g.fillRect(bx + w / 2 - 6, groundY - h, 6, h);

                // Red-tinted window grid
                const oWinCols = 7;
                const oWinRows = 10;
                const oWinW = (w - 60) / oWinCols - 4;
                const oWinH = (h - 60) / oWinRows - 4;
                for (let r = 0; r < oWinRows; r++) {
                    for (let c = 0; c < oWinCols; c++) {
                        const wx = bx - w / 2 + 30 + c * ((w - 60) / oWinCols);
                        const wy = groundY - h + 30 + r * ((h - 60) / oWinRows);
                        g.fillStyle(0xE74C3C, 0.35);
                        g.fillRect(wx, wy, oWinW, oWinH);
                        g.lineStyle(0.5, 0x1B2631);
                        g.strokeRect(wx, wy, oWinW, oWinH);
                    }
                }

                // Dark roof with red trim
                g.fillStyle(0x1B2631);
                g.fillRect(bx - w / 2 - 4, groundY - h - 6, w + 8, 10);
                g.fillStyle(0xC62828);
                g.fillRect(bx - w / 2 - 4, groundY - h - 2, w + 8, 4);

                // Antenna on top with red light
                g.lineStyle(2, 0x546E7A);
                g.lineBetween(bx, groundY - h - 6, bx, groundY - h - 35);
                g.lineStyle(1, 0x546E7A);
                g.lineBetween(bx - 8, groundY - h - 20, bx + 8, groundY - h - 20);
                g.fillStyle(0xFF1744);
                g.fillCircle(bx, groundY - h - 35, 3);

                // Entrance: wide glass doors
                g.fillStyle(0x1B2631);
                g.fillRect(bx - 30, groundY - 60, 60, 60);
                g.fillStyle(0xE74C3C, 0.25);
                g.fillRect(bx - 26, groundY - 55, 24, 50);
                g.fillRect(bx + 2, groundY - 55, 24, 50);
                g.lineStyle(1, 0xC62828);
                g.strokeRect(bx - 26, groundY - 55, 24, 50);
                g.strokeRect(bx + 2, groundY - 55, 24, 50);

                // Oracle logo: red "O" circle outline at top-center
                g.lineStyle(4, 0xC62828);
                g.strokeCircle(bx, groundY - h + 16, 18);
                // "ORACLE" text below circle
                this.add.text(bx, groundY - h + 38, 'ORACLE', {
                    fontFamily: 'Poppins, sans-serif', fontSize: '10px',
                    color: '#ffffff', fontStyle: 'bold',
                }).setOrigin(0.5).setDepth(3);

            } else {
                // ===== FALLBACK GENERIC =====
                h = 180;

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
            }

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
            this.buildings.push({ zone, x: bx, prompt, entered: false });
        });
    }

    createStars() {
        this.starObjects = [];
        const levelZoneIds = this.levelZones.map(z => z.id);
        SKILLS_DATA.forEach(skill => {
            if (!levelZoneIds.includes(skill.zone)) return;
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

    createPlayer() {
        const startX = this.worldStartX + 100;
        const startY = GROUND_Y - 80;

        this.player = this.physics.add.sprite(startX, startY, 'playerBody4');
        this.player.setVisible(false);
        this.player.body.setSize(40, 90).setOffset(0, 0);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setGravityY(PLAYER_GRAVITY);
        this.player.setDepth(10);

        if (this.playerStage < 5) this.playerStage = 5;
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

        const flash = this.add.text(this.player.x, this.player.y - 70, msg, {
            fontFamily: 'Poppins, sans-serif', fontSize: '16px',
            color, stroke: '#000000', strokeThickness: 4, fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(20);
        this.tweens.add({
            targets: flash, y: flash.y - 40, alpha: 0, duration: 1200,
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
            progress: this.player.x / 16500,
        });
    }

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

        const charTop = this.player.y - 60 * targetScale;
        const flash = this.add.text(this.player.x, charTop - 15, 'LEVEL UP!', {
            fontFamily: 'Poppins, sans-serif', fontSize: '26px',
            color: '#FFD700', stroke: '#000000', strokeThickness: 5, fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(20);
        const sub = this.add.text(this.player.x, charTop + 15, PLAYER_STAGES[newStage].label, {
            fontFamily: 'Poppins, sans-serif', fontSize: '15px',
            color: '#ffffff', stroke: '#000000', strokeThickness: 3,
        }).setOrigin(0.5).setDepth(20);

        this.tweens.add({
            targets: [flash, sub], y: '-=80', alpha: 0, duration: 2000,
            ease: 'Cubic.easeOut', onComplete: () => { flash.destroy(); sub.destroy(); },
        });
        EventBus.emit('player-grew', { stage: newStage, label: PLAYER_STAGES[newStage].label });
    }

    handleBuildingInteraction() {
        if (this.isTransitioning) return;
        this.buildings.forEach(b => {
            if (b.entered) return;
            if (Math.abs(this.player.x - b.x) < 100) {
                b.prompt.setAlpha(1);
                if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) this.enterBuilding(b);
            } else {
                b.prompt.setAlpha(0);
            }
        });
    }

    enterBuilding(building) {
        this.isTransitioning = true;
        building.entered = true;
        building.prompt.setAlpha(0);

        this.cameras.main.fadeOut(800, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            const zoneData = JOURNEY.zones.find(z => z.id === building.zone.id);
            const nextZone = ZONES.find(z => z.id === building.zone.id + 1);
            const isNextInLevel = nextZone && this.levelZones.some(z => z.id === nextZone.id);

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
                if (isNextInLevel) {
                    this.player.x = nextZone.startX + 100;
                    this.player.y = GROUND_Y - 80;
                    this.player.body.setVelocity(0, 0);
                    this.growPlayer(nextZone.playerStage);
                    this.cameras.main.fadeIn(800);
                    this.isTransitioning = false;
                } else {
                    // Last building in level — transition to next level
                    this.scene.start('LevelTransition', {
                        levelId: 5,
                        collectedKeys: this.collectedKeys,
                        skillProficiency: this.skillProficiency,
                        playerStage: this.playerStage,
                    });
                }
            });
        });
    }

    update(time) {
        if (this.isTransitioning) return;

        const terrainY = getTerrainY(this.player.x);
        this.groundPlatform.y = terrainY + 10;
        this.groundPlatform.body.updateFromGameObject();

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

        // Zone detection
        const newZone = this.levelZones.find(z => this.player.x >= z.startX && this.player.x < z.endX);
        if (newZone && newZone.id !== this.currentZoneId) {
            this.currentZoneId = newZone.id;
            if (newZone.playerStage > this.playerStage) this.growPlayer(newZone.playerStage);
        }
        this.updateHUD();
        this.handleBuildingInteraction();

        // End of Level 4 — transition to Level 5 (Hobbies)
        if (this.player.x >= this.worldEndX - 80 && !this.isTransitioning) {
            this.isTransitioning = true;
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('LevelTransition', {
                    levelId: 5,
                    collectedKeys: this.collectedKeys,
                    skillProficiency: this.skillProficiency,
                    playerStage: this.playerStage,
                });
            });
        }
    }
}
