import Phaser from 'phaser';
import EventBus from '../EventBus';
import {
    GAME_WIDTH, GAME_HEIGHT, GROUND_Y,
    PLAYER_SPEED, PLAYER_JUMP_VELOCITY, PLAYER_GRAVITY,
    PLAYER_STAGES, ZONES, getTerrainY, getCameraMargin, isMobilePortrait, CANVAS_SCALE,
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
        this.targetZoneId = data.targetZoneId;
        this.currentZoneId = (data.targetZoneId !== undefined && [5, 6, 7].includes(data.targetZoneId)) ? data.targetZoneId : 5;
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
        this.cameras.main.setZoom(CANVAS_SCALE);
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
        this.groundPlatform = this.add.rectangle(this.worldStartX + this.worldWidth / 2, GROUND_Y + 200, this.worldWidth, 400, 0x000000, 0);
        this.physics.add.existing(this.groundPlatform, false);
        this.groundPlatform.body.setImmovable(true);
        this.groundPlatform.body.setAllowGravity(false);
        this.groundPlatform.body.moves = false;

        this.createBuildings();
        this.createStars();
        this.createPlayer();
        this.createAutoJumpIndicators();
        this.createCertBanners();

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

        // Building interior overlay callback
        this._onExitBuilding = () => {
            const zoneId = this.pendingBuildingZoneId;
            const nextZone = ZONES.find(z => z.id === zoneId + 1);
            const isNextInLevel = nextZone && this.levelZones.some(z => z.id === nextZone.id);

            this.cameras.main.fadeOut(800, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                if (isNextInLevel) {
                    this.player.x = nextZone.startX + 100;
                    this.player.y = GROUND_Y - 80;
                    this.player.body.setVelocity(0, 0);
                    this.growPlayer(nextZone.playerStage);
                    this.cameras.main.fadeIn(800);
                    this.isTransitioning = false;
                } else {
                    this.scene.start('LevelTransition', {
                        levelId: 5,
                        collectedKeys: this.collectedKeys,
                        skillProficiency: this.skillProficiency,
                        playerStage: this.playerStage,
                    });
                }
            });
        };
        EventBus.on('exit-building', this._onExitBuilding);
        this.events.on('shutdown', () => EventBus.off('exit-building', this._onExitBuilding));
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
                h = 180;
                const mw = w + 40; // wider building

                // Foundation / base stone
                g.fillStyle(0x8D8D8D);
                g.fillRect(bx - mw / 2, groundY - 8, mw, 8);

                // Main body — warm sandstone
                g.fillStyle(0xD4C4A8);
                g.fillRect(bx - mw / 2, groundY - h, mw, h - 8);

                // Stone block texture
                g.lineStyle(0.4, 0xBDB19A, 0.35);
                for (let r = 0; r < Math.floor(h / 16); r++) {
                    const ly = groundY - h + r * 16;
                    g.lineBetween(bx - mw / 2, ly, bx + mw / 2, ly);
                    const off = (r % 2 === 0) ? 0 : 24;
                    for (let vx = bx - mw / 2 + off; vx < bx + mw / 2; vx += 48) {
                        g.lineBetween(vx, ly, vx, ly + 16);
                    }
                }

                // Decorative horizontal band at mid-height
                g.fillStyle(0x5D8AA8, 0.7);
                g.fillRect(bx - mw / 2, groundY - h / 2 - 3, mw, 6);

                // Roof: flat with parapet
                g.fillStyle(0x6D4C41);
                g.fillRect(bx - mw / 2 - 6, groundY - h - 5, mw + 12, 8);
                // Parapet crenellations
                for (let px = bx - mw / 2 - 4; px < bx + mw / 2 + 4; px += 20) {
                    g.fillRect(px, groundY - h - 11, 10, 6);
                }

                // Upper windows — arched, 5 across
                for (let c = 0; c < 5; c++) {
                    const wx = bx - mw / 2 + 22 + c * (mw - 44) / 5;
                    const wy = groundY - h + 22;
                    const ww = 24, wh = 32;
                    // Arch top
                    g.fillStyle(0x5D8AA8);
                    g.fillRect(wx - 2, wy + 8, ww + 4, wh - 4);
                    g.fillCircle(wx + ww / 2, wy + 8, ww / 2 + 2);
                    // Glass
                    g.fillStyle(0xB3E5FC, 0.8);
                    g.fillRect(wx, wy + 10, ww, wh - 6);
                    g.fillCircle(wx + ww / 2, wy + 10, ww / 2);
                    // Mullion
                    g.lineStyle(1, 0xECEFF1);
                    g.lineBetween(wx + ww / 2, wy + 2, wx + ww / 2, wy + wh + 4);
                }

                // Lower windows — rectangular, 5 across
                for (let c = 0; c < 5; c++) {
                    const wx = bx - mw / 2 + 22 + c * (mw - 44) / 5;
                    const wy = groundY - h / 2 + 12;
                    const ww = 24, wh = 30;
                    g.fillStyle(0xECEFF1);
                    g.fillRect(wx - 2, wy - 2, ww + 4, wh + 4);
                    g.fillStyle(0xFFF9C4, 0.85);
                    g.fillRect(wx, wy, ww, wh);
                    g.lineStyle(1, 0xECEFF1);
                    g.lineBetween(wx + ww / 2, wy, wx + ww / 2, wy + wh);
                    g.lineBetween(wx, wy + wh / 2, wx + ww, wy + wh / 2);
                    // Sill
                    g.fillStyle(0xBDB19A);
                    g.fillRect(wx - 3, wy + wh + 2, ww + 6, 3);
                }

                // Grand entrance — recessed with columns
                const doorW = 48, doorH = 58;
                // Recess
                g.fillStyle(0xA1887F);
                g.fillRect(bx - doorW / 2 - 8, groundY - doorH - 8, doorW + 16, doorH + 8);
                // Door frame
                g.fillStyle(0x4E342E);
                g.fillRect(bx - doorW / 2, groundY - doorH, doorW, doorH);
                // Glass doors
                g.fillStyle(0xB3E5FC, 0.6);
                g.fillRect(bx - doorW / 2 + 4, groundY - doorH + 4, doorW / 2 - 6, doorH - 8);
                g.fillRect(bx + 2, groundY - doorH + 4, doorW / 2 - 6, doorH - 8);
                g.lineStyle(1, 0x5D4037);
                g.strokeRect(bx - doorW / 2 + 4, groundY - doorH + 4, doorW / 2 - 6, doorH - 8);
                g.strokeRect(bx + 2, groundY - doorH + 4, doorW / 2 - 6, doorH - 8);
                // Door handles
                g.fillStyle(0xFFD700);
                g.fillCircle(bx - 4, groundY - doorH / 2, 2);
                g.fillCircle(bx + 4, groundY - doorH / 2, 2);
                // Mini columns flanking door
                for (const side of [-1, 1]) {
                    const cx2 = bx + side * (doorW / 2 + 12);
                    g.fillStyle(0xECEFF1);
                    g.fillRect(cx2 - 4, groundY - doorH - 8, 8, doorH + 8);
                    // Column capital
                    g.fillRect(cx2 - 6, groundY - doorH - 12, 12, 5);
                    // Column base
                    g.fillRect(cx2 - 6, groundY - 4, 12, 4);
                }
                // Pediment above door
                g.fillStyle(0x6D4C41);
                g.fillTriangle(bx - doorW / 2 - 18, groundY - doorH - 8, bx + doorW / 2 + 18, groundY - doorH - 8, bx, groundY - doorH - 26);

                // Tooth logo — centered above pediment
                g.fillStyle(0xFFFFFF);
                g.fillRoundedRect(bx - 12, groundY - h + 6, 24, 18, 7);
                g.fillRoundedRect(bx - 10, groundY - h + 20, 8, 12, 2);
                g.fillRoundedRect(bx + 2, groundY - h + 20, 8, 12, 2);
                g.lineStyle(1.5, 0x5D8AA8);
                g.strokeRoundedRect(bx - 12, groundY - h + 6, 24, 18, 7);
                // Sparkle on tooth
                g.fillStyle(0xFFFFFF);
                g.fillCircle(bx - 5, groundY - h + 11, 2);
                g.fillStyle(0xFFFFFF, 0.5);
                g.fillCircle(bx - 5, groundY - h + 11, 3.5);

            } else if (zone.id === 6) {
                // ===== CERNER CORPORATION =====
                h = 300;
                const cw = w + 60;

                // Left wing (shorter)
                const lwW = 100, lwH = 200;
                g.fillStyle(0x455A64);
                g.fillRect(bx - cw / 2, groundY - lwH, lwW, lwH);
                // Left wing windows
                for (let r = 0; r < 6; r++) {
                    for (let c = 0; c < 2; c++) {
                        const wx = bx - cw / 2 + 12 + c * 44;
                        const wy = groundY - lwH + 18 + r * 30;
                        g.fillStyle(0x81D4FA, 0.5);
                        g.fillRect(wx, wy, 32, 20);
                        g.lineStyle(0.5, 0x37474F);
                        g.strokeRect(wx, wy, 32, 20);
                    }
                }

                // Right wing (shorter)
                g.fillStyle(0x455A64);
                g.fillRect(bx + cw / 2 - lwW, groundY - lwH, lwW, lwH);
                for (let r = 0; r < 6; r++) {
                    for (let c = 0; c < 2; c++) {
                        const wx = bx + cw / 2 - lwW + 12 + c * 44;
                        const wy = groundY - lwH + 18 + r * 30;
                        g.fillStyle(0x81D4FA, 0.5);
                        g.fillRect(wx, wy, 32, 20);
                        g.lineStyle(0.5, 0x37474F);
                        g.strokeRect(wx, wy, 32, 20);
                    }
                }

                // Central tower — taller
                const ctW = cw - lwW * 2 + 40;
                g.fillStyle(0x546E7A);
                g.fillRect(bx - ctW / 2, groundY - h, ctW, h);

                // Horizontal accent bands
                g.fillStyle(0x4DB6AC, 0.6);
                g.fillRect(bx - ctW / 2, groundY - h + 30, ctW, 4);
                g.fillRect(bx - ctW / 2, groundY - h / 2, ctW, 4);
                g.fillRect(bx - ctW / 2, groundY - 80, ctW, 4);

                // Central tower windows — curtain wall grid
                const cRows = 9, cCols = 6;
                const cWinW2 = (ctW - 30) / cCols - 3;
                const cWinH2 = (h - 60) / cRows - 3;
                for (let r = 0; r < cRows; r++) {
                    for (let c = 0; c < cCols; c++) {
                        const wx = bx - ctW / 2 + 15 + c * ((ctW - 30) / cCols);
                        const wy = groundY - h + 18 + r * ((h - 60) / cRows);
                        g.fillStyle(0x80DEEA, 0.45);
                        g.fillRect(wx, wy, cWinW2, cWinH2);
                        g.lineStyle(0.5, 0x37474F);
                        g.strokeRect(wx, wy, cWinW2, cWinH2);
                    }
                }

                // Roof: flat top with mechanical penthouse
                g.fillStyle(0x37474F);
                g.fillRect(bx - ctW / 2 - 4, groundY - h - 5, ctW + 8, 8);
                // Penthouse
                g.fillStyle(0x455A64);
                g.fillRect(bx - 30, groundY - h - 22, 60, 18);
                g.fillStyle(0x37474F);
                g.fillRect(bx - 32, groundY - h - 25, 64, 5);
                // Antenna array
                g.lineStyle(1.5, 0x90A4AE);
                g.lineBetween(bx - 10, groundY - h - 25, bx - 10, groundY - h - 42);
                g.lineBetween(bx + 10, groundY - h - 25, bx + 10, groundY - h - 42);
                g.lineBetween(bx, groundY - h - 25, bx, groundY - h - 50);
                g.fillStyle(0x4DB6AC);
                g.fillCircle(bx, groundY - h - 50, 3);

                // Wing roofs
                g.fillStyle(0x37474F);
                g.fillRect(bx - cw / 2 - 3, groundY - lwH - 4, lwW + 6, 6);
                g.fillRect(bx + cw / 2 - lwW - 3, groundY - lwH - 4, lwW + 6, 6);

                // Grand entrance — glass atrium
                const eW = 70, eH = 65;
                g.fillStyle(0x37474F);
                g.fillRect(bx - eW / 2, groundY - eH, eW, eH);
                // Atrium glass panels (3 sections)
                for (let c = 0; c < 3; c++) {
                    const px = bx - eW / 2 + 5 + c * (eW - 10) / 3;
                    g.fillStyle(0x80DEEA, 0.55);
                    g.fillRect(px, groundY - eH + 5, (eW - 20) / 3, eH - 10);
                    g.lineStyle(1, 0x263238);
                    g.strokeRect(px, groundY - eH + 5, (eW - 20) / 3, eH - 10);
                }
                // Canopy above entrance
                g.fillStyle(0x4DB6AC, 0.8);
                g.fillRect(bx - eW / 2 - 10, groundY - eH - 4, eW + 20, 6);

                // Cerner logo: green cross on white circle
                g.fillStyle(0xFFFFFF);
                g.fillCircle(bx, groundY - h + 50, 22);
                g.lineStyle(1.5, 0x4DB6AC);
                g.strokeCircle(bx, groundY - h + 50, 22);
                g.fillStyle(0x4CAF50);
                g.fillRect(bx - 5, groundY - h + 50 - 14, 10, 28);
                g.fillRect(bx - 14, groundY - h + 50 - 5, 28, 10);
                // Heartbeat line through cross
                g.lineStyle(1.5, 0xFFFFFF);
                g.beginPath();
                g.moveTo(bx - 14, groundY - h + 50);
                g.lineTo(bx - 6, groundY - h + 50);
                g.lineTo(bx - 3, groundY - h + 50 - 6);
                g.lineTo(bx, groundY - h + 50 + 4);
                g.lineTo(bx + 3, groundY - h + 50 - 6);
                g.lineTo(bx + 6, groundY - h + 50);
                g.lineTo(bx + 14, groundY - h + 50);
                g.strokePath();

            } else if (zone.id === 7) {
                // ===== ORACLE HEALTH =====
                h = 340;
                const ow = w + 80;

                // Base podium (2-story plinth)
                const podH = 80;
                g.fillStyle(0x37474F);
                g.fillRect(bx - ow / 2, groundY - podH, ow, podH);
                // Podium stone texture
                g.lineStyle(0.4, 0x263238, 0.3);
                for (let r = 0; r < 5; r++) {
                    g.lineBetween(bx - ow / 2, groundY - podH + r * 16, bx + ow / 2, groundY - podH + r * 16);
                }
                // Podium windows
                for (let c = 0; c < 9; c++) {
                    const wx = bx - ow / 2 + 18 + c * (ow - 36) / 9;
                    g.fillStyle(0x455A64, 0.6);
                    g.fillRect(wx, groundY - podH + 10, 28, 24);
                    g.fillStyle(0xFFCC80, 0.3);
                    g.fillRect(wx + 2, groundY - podH + 12, 24, 20);
                }

                // Main tower — dark glass with subtle blue tint
                const twrW = ow - 60;
                const twrH = h - podH;
                g.fillStyle(0x1B2631);
                g.fillRect(bx - twrW / 2, groundY - h, twrW, twrH);

                // Red vertical accent pillars at edges
                g.fillStyle(0xC62828);
                g.fillRect(bx - twrW / 2, groundY - h, 8, twrH);
                g.fillRect(bx + twrW / 2 - 8, groundY - h, 8, twrH);
                // Center red accent stripe
                g.fillStyle(0xC62828, 0.4);
                g.fillRect(bx - 2, groundY - h, 4, twrH);

                // Window grid — two halves separated by center stripe
                const halfCols = 4, oRows = 10;
                const oWinW2 = (twrW / 2 - 24) / halfCols - 3;
                const oWinH2 = (twrH - 50) / oRows - 3;
                for (let r = 0; r < oRows; r++) {
                    for (let c = 0; c < halfCols; c++) {
                        // Left half
                        const lwx = bx - twrW / 2 + 16 + c * ((twrW / 2 - 24) / halfCols);
                        const wy = groundY - h + 20 + r * ((twrH - 50) / oRows);
                        g.fillStyle(0x90CAF9, 0.2);
                        g.fillRect(lwx, wy, oWinW2, oWinH2);
                        g.lineStyle(0.5, 0x263238);
                        g.strokeRect(lwx, wy, oWinW2, oWinH2);
                        // Right half
                        const rwx = bx + 8 + c * ((twrW / 2 - 24) / halfCols);
                        g.fillStyle(0x90CAF9, 0.2);
                        g.fillRect(rwx, wy, oWinW2, oWinH2);
                        g.lineStyle(0.5, 0x263238);
                        g.strokeRect(rwx, wy, oWinW2, oWinH2);
                    }
                }

                // Roof crown — stepped
                g.fillStyle(0x1B2631);
                g.fillRect(bx - twrW / 2 - 4, groundY - h - 5, twrW + 8, 8);
                g.fillStyle(0xC62828);
                g.fillRect(bx - twrW / 2 - 4, groundY - h - 2, twrW + 8, 3);
                // Upper crown step
                g.fillStyle(0x263238);
                g.fillRect(bx - 50, groundY - h - 18, 100, 14);
                g.fillStyle(0xC62828);
                g.fillRect(bx - 50, groundY - h - 19, 100, 2);
                // Spire
                g.fillStyle(0x37474F);
                g.fillRect(bx - 3, groundY - h - 18, 6, -25);
                g.fillStyle(0xFF1744);
                g.fillCircle(bx, groundY - h - 45, 4);
                // Glow around beacon
                g.fillStyle(0xFF1744, 0.2);
                g.fillCircle(bx, groundY - h - 45, 8);

                // Grand entrance — revolving door style
                const oeW = 80, oeH = 70;
                g.fillStyle(0x1B2631);
                g.fillRect(bx - oeW / 2, groundY - podH - oeH, oeW, oeH + podH);
                // Glass revolving door (circle)
                g.fillStyle(0x263238);
                g.fillCircle(bx, groundY - 36, 28);
                g.fillStyle(0x90CAF9, 0.3);
                g.fillCircle(bx, groundY - 36, 26);
                // Door vanes
                g.lineStyle(1.5, 0xC62828);
                g.lineBetween(bx, groundY - 62, bx, groundY - 10);
                g.lineBetween(bx - 26, groundY - 36, bx + 26, groundY - 36);
                // Side panels
                g.fillStyle(0x90CAF9, 0.2);
                g.fillRect(bx - oeW / 2 + 4, groundY - podH - oeH + 8, 16, oeH + podH - 16);
                g.fillRect(bx + oeW / 2 - 20, groundY - podH - oeH + 8, 16, oeH + podH - 16);
                // Red canopy
                g.fillStyle(0xC62828);
                g.fillRect(bx - oeW / 2 - 12, groundY - podH - oeH - 4, oeW + 24, 6);

                // Oracle logo — red "O" with inner cutout
                const logoY = groundY - h + 40;
                g.fillStyle(0xC62828);
                g.fillCircle(bx, logoY, 22);
                g.fillStyle(0x1B2631);
                g.fillCircle(bx, logoY, 15);
                g.fillStyle(0xC62828);
                g.fillCircle(bx, logoY, 13);
                g.fillStyle(0x1B2631);
                g.fillCircle(bx, logoY, 8);
                // ORACLE text
                this.add.text(bx, logoY + 28, 'ORACLE', {
                    fontFamily: 'Poppins, sans-serif', fontSize: '11px',
                    color: '#E53935', fontStyle: 'bold', letterSpacing: 3,
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

            const promptText = isMobilePortrait() ? '[ Tap to Enter ]' : '[ SPACE to Enter ]';
            const prompt = this.add.text(bx, groundY - h - 55, promptText, {
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
        const startX = this.targetZoneId !== undefined ? ZONES[this.targetZoneId].startX + 100 : this.worldStartX + 100;
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
        this.pendingBuildingZoneId = building.zone.id;
        EventBus.emit('enter-building', { zoneId: building.zone.id });
    }

    createCertBanners() {
        // Oracle certifications — ordered by date (oldest first)
        const certs = [
            { title: 'OCI Gen AI 2024', subtitle: 'Certified Professional', year: '2024' },
            { title: 'OCI Foundations', subtitle: 'Certified Associate', year: '2025' },
            { title: 'AI Vector Search', subtitle: 'Certified Professional', year: '2025' },
        ];

        // Place between buildings in Zone 7 (12200–14000)
        // Background buildings: main tower ~13100, supporting ~12500/13400, data center ~12650
        // Level4 Oracle building: 13700
        // Good gaps: 12800, 13250, 13550
        const positions = [12800, 13250, 13550];
        const bannerW = 160, bannerH = 70;
        const restY = 60;     // resting position (high up)
        const dropY = 280;    // dropped position (near character level)
        const triggerDist = 300; // distance at which banner starts dropping

        this.certBanners = certs.map((cert, i) => {
            const cx = positions[i];

            // Container holds everything — we animate its Y
            const container = this.add.container(cx, restY).setDepth(4);

            // Cable graphics (drawn from top of screen down to container)
            const cable = this.add.graphics().setDepth(3);

            // Banner body
            const g = this.add.graphics();
            g.fillStyle(0x1B2631, 0.94);
            g.fillRoundedRect(-bannerW / 2, 0, bannerW, bannerH, 6);
            g.lineStyle(1.5, 0xC62828, 0.85);
            g.strokeRoundedRect(-bannerW / 2, 0, bannerW, bannerH, 6);
            // Red accent bar at top
            g.fillStyle(0xC62828, 0.9);
            g.fillRect(-bannerW / 2 + 6, 3, bannerW - 12, 4);
            // Oracle "O" icon
            g.lineStyle(2, 0xC62828, 0.9);
            g.strokeCircle(-bannerW / 2 + 18, 22, 7);
            // Gold badge at bottom-right
            g.fillStyle(0xFFD700, 0.8);
            g.fillCircle(bannerW / 2 - 16, bannerH - 14, 6);
            g.fillStyle(0xFFA000);
            g.fillCircle(bannerW / 2 - 16, bannerH - 14, 3);
            container.add(g);

            // "ORACLE" label
            const oracleLabel = this.add.text(-bannerW / 2 + 32, 16, 'ORACLE', {
                fontFamily: 'Poppins, sans-serif', fontSize: '8px',
                color: '#C62828', fontStyle: 'bold',
            });
            container.add(oracleLabel);

            // Cert title
            const titleText = this.add.text(0, 30, cert.title, {
                fontFamily: 'Poppins, sans-serif', fontSize: '12px',
                color: '#FFFFFF', fontStyle: 'bold',
            }).setOrigin(0.5);
            container.add(titleText);

            // Subtitle + year
            const subText = this.add.text(0, 47, `${cert.subtitle} · ${cert.year}`, {
                fontFamily: 'Poppins, sans-serif', fontSize: '9px',
                color: '#90CAF9',
            }).setOrigin(0.5);
            container.add(subText);

            return { container, cable, cx, restY, dropY, dropped: false, currentY: restY };
        });
    }

    updateCertBanners() {
        if (!this.certBanners) return;
        const px = this.player.x;

        this.certBanners.forEach(b => {
            const dist = Math.abs(px - b.cx);

            if (dist < 300 && !b.dropped) {
                b.dropped = true;
                this.tweens.add({
                    targets: b.container,
                    y: b.dropY,
                    duration: 800,
                    ease: 'Bounce.easeOut',
                    onUpdate: () => { b.currentY = b.container.y; },
                });
            } else if (dist >= 500 && b.dropped) {
                b.dropped = false;
                this.tweens.add({
                    targets: b.container,
                    y: b.restY,
                    duration: 600,
                    ease: 'Cubic.easeIn',
                    onUpdate: () => { b.currentY = b.container.y; },
                });
            }

            // Redraw cable from top to container
            b.cable.clear();
            b.cable.lineStyle(1.5, 0x78909C, 0.6);
            b.cable.lineBetween(b.cx, 0, b.cx, b.container.y);
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
        this.updateCertBanners();

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
