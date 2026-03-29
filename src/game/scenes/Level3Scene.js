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
 * Level 3: Masters at SUNY Binghamton (Zone 4)
 * Themed autumn campus walk with snow/leaf particles
 */
export default class Level3Scene extends Phaser.Scene {
    constructor() {
        super('Level3Scene');
    }

    init(data) {
        this.targetZoneId = data.targetZoneId;
        this.currentZoneId = 4;
        this.playerStage = data.playerStage || 4;
        this.collectedKeys = data.collectedKeys || [];
        this.skillProficiency = data.skillProficiency || {};
        this.isTransitioning = false;
        this.walkTimer = 0;
        this.isMoving = false;
        this.facingRight = true;
        this.scrollVelocity = 0;
        this.levelZone = ZONES[4];
        this.autoJumpTriggers = AUTO_JUMP_TRIGGERS.filter(t => t.level === 3);
        this.triggeredJumps = new Set();
    }

    create() {
        const gfx = this.make.graphics({ x: 0, y: 0, add: false });
        gfx.fillStyle(0xffffff, 0);
        gfx.fillRect(0, 0, 40, 90);
        gfx.generateTexture('playerBody3', 40, 90);
        gfx.destroy();

        const zone = this.levelZone;
        const worldWidth = zone.endX - zone.startX;

        this.physics.world.setBounds(zone.startX, 0, worldWidth, GAME_HEIGHT);
        const margin = getCameraMargin();
        this.cameras.main.setBounds(zone.startX - margin, 0, worldWidth + margin * 2, GAME_HEIGHT);

        renderZoneBackground(this, zone);

        // Ground platform
        this.groundPlatform = this.add.rectangle(zone.startX + worldWidth / 2, GROUND_Y + 10, worldWidth, 20, 0x000000, 0);
        this.physics.add.existing(this.groundPlatform, false);
        this.groundPlatform.body.setImmovable(true);
        this.groundPlatform.body.setAllowGravity(false);
        this.groundPlatform.body.moves = false;

        this.createBuildings();
        this.createStars();
        this.createPlayer();
        this.createAutoJumpIndicators();
        this.createWeatherEffects();

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
        EventBus.emit('level-changed', { id: 3, name: 'Masters' });
        this.cameras.main.fadeIn(800);
        EventBus.emit('current-scene-ready', this);
    }

    createWeatherEffects() {
        // Snow particles
        this.snowParticles = [];
        const rng = new Phaser.Math.RandomDataGenerator(['snow']);
        for (let i = 0; i < 40; i++) {
            const x = this.levelZone.startX + rng.between(0, this.levelZone.endX - this.levelZone.startX);
            const y = rng.between(-50, GAME_HEIGHT);
            const size = rng.between(2, 5);
            const speed = rng.realInRange(0.3, 1.2);
            const drift = rng.realInRange(-0.3, 0.3);
            const snow = this.add.circle(x, y, size, 0xFFFFFF, rng.realInRange(0.4, 0.9)).setDepth(15);
            this.snowParticles.push({ obj: snow, speed, drift, startX: x });
        }

        // Falling leaves
        this.leafParticles = [];
        const leafColors = [0xE65100, 0xBF360C, 0xF57F17, 0xFF6F00, 0xD84315];
        for (let i = 0; i < 20; i++) {
            const x = this.levelZone.startX + rng.between(0, this.levelZone.endX - this.levelZone.startX);
            const y = rng.between(-100, GAME_HEIGHT);
            const color = leafColors[i % leafColors.length];
            const leaf = this.add.graphics().setDepth(15);
            leaf.fillStyle(color, 0.8);
            leaf.fillEllipse(0, 0, 8, 5);
            leaf.setPosition(x, y);
            this.leafParticles.push({
                obj: leaf,
                speed: rng.realInRange(0.5, 1.5),
                drift: rng.realInRange(-1, 1),
                wobble: rng.realInRange(0.5, 2),
                phase: rng.realInRange(0, Math.PI * 2),
            });
        }
    }

    createParallaxClouds() {
        const rng = new Phaser.Math.RandomDataGenerator(['clouds3']);
        for (let i = 0; i < 8; i++) {
            const x = this.levelZone.startX + rng.between(0, this.levelZone.endX - this.levelZone.startX);
            const y = rng.between(30, 180);
            const w = rng.between(80, 180);
            const cloud = this.add.graphics().setDepth(-14);
            cloud.fillStyle(0xBDBDBD, rng.realInRange(0.2, 0.5));
            cloud.fillEllipse(0, 0, w, w * 0.3);
            cloud.fillEllipse(-w * 0.2, 4, w * 0.5, w * 0.22);
            cloud.setPosition(x, y);
            cloud.setScrollFactor(rng.realInRange(0.02, 0.08), 1);
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
        const zone = this.levelZone;
        if (zone.building) {
            const b = zone.building;
            const bx = b.x;
            const groundY = getTerrainY(bx);
            const g = this.add.graphics().setDepth(2);
            const w = 380, h = 260;

            // Main brick body
            g.fillStyle(0x8D6E63);
            g.fillRect(bx - w / 2, groundY - h, w, h);

            // Brick texture: horizontal lines every 12px with vertical offsets
            g.lineStyle(0.6, 0x6D4C41, 0.3);
            for (let r = 0; r < Math.floor(h / 12); r++) {
                const ly = groundY - h + r * 12;
                g.lineBetween(bx - w / 2, ly, bx + w / 2, ly);
                // Vertical brick offsets
                const offset = (r % 2 === 0) ? 0 : 20;
                for (let vx = bx - w / 2 + offset; vx < bx + w / 2; vx += 40) {
                    g.lineBetween(vx, ly, vx, ly + 12);
                }
            }

            // Flat roof with green trim strip
            g.fillStyle(0x5D4037);
            g.fillRect(bx - w / 2 - 8, groundY - h - 8, w + 16, 12);
            g.fillStyle(0x005A43);
            g.fillRect(bx - w / 2 - 8, groundY - h - 2, w + 16, 5);

            // Clock tower on left side
            const towerX = bx - w / 2 + 25;
            const towerW = 50;
            const towerH = 70;
            // Tower body
            g.fillStyle(0x795548);
            g.fillRect(towerX, groundY - h - towerH, towerW, towerH);
            // Tower brick lines
            g.lineStyle(0.5, 0x5D4037, 0.3);
            for (let r = 0; r < Math.floor(towerH / 10); r++) {
                g.lineBetween(towerX, groundY - h - towerH + r * 10, towerX + towerW, groundY - h - towerH + r * 10);
            }
            // Pointed gray cap roof
            g.fillStyle(0x757575);
            g.fillTriangle(
                towerX - 5, groundY - h - towerH,
                towerX + towerW + 5, groundY - h - towerH,
                towerX + towerW / 2, groundY - h - towerH - 30
            );
            // Clock face
            const clockCX = towerX + towerW / 2;
            const clockCY = groundY - h - towerH + 25;
            g.fillStyle(0xFFF9C4);
            g.fillCircle(clockCX, clockCY, 14);
            g.lineStyle(1.5, 0x3E2723);
            g.strokeCircle(clockCX, clockCY, 14);
            // Hour markers
            for (let i = 0; i < 12; i++) {
                const angle = (Math.PI * 2 * i) / 12 - Math.PI / 2;
                const mx = clockCX + Math.cos(angle) * 11;
                const my = clockCY + Math.sin(angle) * 11;
                g.fillStyle(0x3E2723);
                g.fillCircle(mx, my, 1.5);
            }
            // Clock hands
            g.lineStyle(1.5, 0x3E2723);
            g.lineBetween(clockCX, clockCY, clockCX, clockCY - 9); // minute
            g.lineBetween(clockCX, clockCY, clockCX + 6, clockCY + 3); // hour

            // Green accent trim under roof
            g.fillStyle(0x005A43);
            g.fillRect(bx - w / 2, groundY - h, w, 4);

            // Windows: 3 rows of 6
            const winCols = 6;
            const winRows = 3;
            const winW = 28;
            const winH = 34;
            const winSpacingX = (w - 80) / winCols;
            const winSpacingY = 65;
            for (let r = 0; r < winRows; r++) {
                for (let c = 0; c < winCols; c++) {
                    const wx = bx - w / 2 + 40 + c * winSpacingX;
                    const wy = groundY - h + 30 + r * winSpacingY;
                    // Window frame (white)
                    g.fillStyle(0xECEFF1);
                    g.fillRect(wx - 2, wy - 2, winW + 4, winH + 4);
                    // Window glass (warm yellow)
                    g.fillStyle(0xFFF9C4, 0.9);
                    g.fillRect(wx, wy, winW, winH);
                    // Cross-hatch panes
                    g.lineStyle(1.5, 0xECEFF1);
                    g.lineBetween(wx + winW / 2, wy, wx + winW / 2, wy + winH); // vertical
                    g.lineBetween(wx, wy + winH / 2, wx + winW, wy + winH / 2); // horizontal
                }
            }

            // Grand arched entrance
            g.fillStyle(0x3E2723);
            g.fillRoundedRect(bx - 22, groundY - 65, 44, 65, { tl: 22, tr: 22, bl: 0, br: 0 });
            // Door detail
            g.fillStyle(0x5D4037);
            g.fillRect(bx - 1, groundY - 55, 2, 50);
            // Door handle
            g.fillStyle(0xFFC107);
            g.fillCircle(bx + 10, groundY - 30, 3);

            // Steps
            g.fillStyle(0x9E9E9E);
            for (let s = 0; s < 3; s++) {
                g.fillRect(bx - 30 - s * 6, groundY - 3 - s * 4, 60 + s * 12, 5);
            }

            // BU Logo: green circle at top-center
            g.fillStyle(0x005A43);
            g.fillCircle(bx, groundY - h + 12, 18);
            g.lineStyle(1.5, 0x004D40);
            g.strokeCircle(bx, groundY - h + 12, 18);
            // BU text
            this.add.text(bx, groundY - h + 12, 'BU', {
                fontFamily: 'Poppins, sans-serif', fontSize: '16px',
                color: '#ffffff', fontStyle: 'bold',
            }).setOrigin(0.5).setDepth(3);

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
        }
    }

    createStars() {
        this.starObjects = [];
        SKILLS_DATA.forEach(skill => {
            if (skill.zone !== 4) return;
            if (this.collectedKeys.includes(skill.key)) return;
            const zone = ZONES[4];

            const zoneSkills = SKILLS_DATA.filter(s => s.zone === 4);
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
        const startX = this.levelZone.startX + 100;
        const startY = GROUND_Y - 80;

        this.player = this.physics.add.sprite(startX, startY, 'playerBody3');
        this.player.setVisible(false);
        this.player.body.setSize(40, 90).setOffset(0, 0);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setGravityY(PLAYER_GRAVITY);
        this.player.setDepth(10);

        if (this.playerStage < 4) this.playerStage = 4;
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
            this.scene.start('LevelTransition', {
                levelId: 4,
                collectedKeys: this.collectedKeys,
                skillProficiency: this.skillProficiency,
                playerStage: this.playerStage,
            });
        });
    }

    updateWeather(time) {
        // Animate snow
        this.snowParticles.forEach(p => {
            p.obj.y += p.speed;
            p.obj.x += p.drift + Math.sin(time * 0.001 + p.startX) * 0.3;
            if (p.obj.y > GAME_HEIGHT + 10) {
                p.obj.y = -10;
                p.obj.x = this.levelZone.startX + Phaser.Math.Between(0, this.levelZone.endX - this.levelZone.startX);
            }
        });

        // Animate falling leaves
        this.leafParticles.forEach(p => {
            p.obj.y += p.speed;
            p.obj.x += p.drift + Math.sin(time * 0.001 * p.wobble + p.phase) * 1.5;
            p.obj.rotation = Math.sin(time * 0.002 + p.phase) * 0.5;
            if (p.obj.y > GAME_HEIGHT + 20) {
                p.obj.y = -20;
                p.obj.x = this.levelZone.startX + Phaser.Math.Between(0, this.levelZone.endX - this.levelZone.startX);
            }
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
                s.shape.y = s.baseY + Math.sin(time * 0.003 + s.shape.x * 0.01) * 6;
                s.shape.angle += 1.5;
                s.glow.y = s.shape.y;
                s.label.y = s.shape.y - 28;
                s.profLabel.y = s.shape.y - 16;
            }
        });

        this.checkStarCollisions();
        this.updateHUD();
        this.handleBuildingInteraction();
        this.updateWeather(time);

        // End of zone transition
        if (this.player.x >= this.levelZone.endX - 50 && !this.isTransitioning) {
            this.isTransitioning = true;
            this.cameras.main.fadeOut(800, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('LevelTransition', {
                    levelId: 4,
                    collectedKeys: this.collectedKeys,
                    skillProficiency: this.skillProficiency,
                    playerStage: this.playerStage,
                });
            });
        }
    }
}
