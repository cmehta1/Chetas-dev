import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, GROUND_Y, TERRAIN, getTerrainY } from '../config/constants';

/**
 * Creates rich, detailed backgrounds for each zone.
 */
export function renderZoneBackground(scene, zone) {
    const width = zone.endX - zone.startX;
    const cx = zone.startX + width / 2;

    // === SKY GRADIENT (extra wide for parallax scrolling) ===
    const skyGfx = scene.add.graphics();
    skyGfx.setDepth(-20);
    const steps = 40;
    const topColor = Phaser.Display.Color.IntegerToColor(zone.skyTop);
    const bottomColor = Phaser.Display.Color.IntegerToColor(zone.skyBottom);
    const skyPad = width * 0.5; // extra width so sky covers parallax shift
    for (let i = 0; i < steps; i++) {
        const t = i / steps;
        const color = Phaser.Display.Color.Interpolate.ColorWithColor(topColor, bottomColor, 100, Math.floor(t * 100));
        const hexColor = Phaser.Display.Color.GetColor(color.r, color.g, color.b);
        const bandHeight = GROUND_Y / steps + 1;
        skyGfx.fillStyle(hexColor);
        skyGfx.fillRect(zone.startX - skyPad, i * bandHeight, width + skyPad * 2, bandHeight + 1);
    }

    // === CELESTIAL BODY (sun/moon) — only one per scene ===
    if (!scene._celestialRendered) {
        scene._celestialRendered = true;
        if (zone.theme === 'flight' || zone.theme === 'oracle-tech') {
            drawMoon(scene, zone.startX + width * 0.8, 80, zone);
            drawStarryNight(scene, zone);
        } else {
            drawSun(scene, zone.startX + width * 0.75, 70, zone);
        }
    }

    // === CLOUDS ===
    const rng = new Phaser.Math.RandomDataGenerator([`bg${zone.id}`]);
    const numClouds = zone.isCutscene ? 12 : 5;
    for (let i = 0; i < numClouds; i++) {
        const cx2 = zone.startX + rng.between(50, width - 50);
        const cy = rng.between(40, 200);
        drawCloud(scene, cx2, cy, rng.between(60, 140), zone);
    }

    // === GROUND (terrain-following) — skip for flight cutscene (over ocean) ===
    if (zone.theme !== 'flight') {
        drawGround(scene, zone);
    }

    // === PARALLAX BACKGROUND LAYERS ===
    drawParallaxLayers(scene, zone, rng);

    // === THEME-SPECIFIC ELEMENTS ===
    switch (zone.theme) {
        case 'india-village':
            drawIndianVillage(scene, zone, rng);
            break;
        case 'india-school':
            drawIndianSchoolArea(scene, zone, rng);
            break;
        case 'india-college':
            drawIndianCollege(scene, zone, rng);
            break;
        case 'flight':
            drawFlightScene(scene, zone, rng);
            break;
        case 'usa-campus':
            drawUSCampus(scene, zone, rng);
            break;
        case 'michigan-office':
            drawMichiganOffice(scene, zone, rng);
            break;
        case 'kansas-corporate':
            drawKansasCityCorporate(scene, zone, rng);
            break;
        case 'oracle-tech':
            drawOracleTechHub(scene, zone, rng);
            break;
        case 'hobby-park':
            drawHobbyPark(scene, zone, rng);
            break;
    }

    // === ZONE LABEL (positioned closer to ground, not at very top) ===
    const labelY = 380;
    const labelBg = scene.add.graphics();
    labelBg.fillStyle(0x000000, 0.5);
    labelBg.fillRoundedRect(-120, -22, 240, 44, 10);
    labelBg.setPosition(cx, labelY);
    labelBg.setDepth(5);

    const label = scene.add.text(cx, labelY - 8, zone.name, {
        fontFamily: "'Segoe UI', Arial, sans-serif",
        fontSize: '20px',
        color: '#ffffff',
        fontStyle: 'bold',
    });
    label.setOrigin(0.5).setDepth(6);

    const sublabel = scene.add.text(cx, labelY + 12, zone.subtitle || '', {
        fontFamily: "'Segoe UI', Arial, sans-serif",
        fontSize: '13px',
        color: '#cccccc',
    });
    sublabel.setOrigin(0.5).setDepth(6);
}

function drawSun(scene, x, y, zone) {
    const sf = 0.05;
    const g = scene.add.graphics();
    g.setDepth(-18);
    g.setPosition((1 - sf) * (GAME_WIDTH / 2 - x), 0);
    g.fillStyle(0xFFFF00, 0.15);
    g.fillCircle(x, y, 50);
    g.fillStyle(0xFFFF00, 0.25);
    g.fillCircle(x, y, 35);
    g.fillStyle(0xFDD835);
    g.fillCircle(x, y, 22);
    g.lineStyle(2, 0xFDD835, 0.4);
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
        g.lineBetween(
            x + Math.cos(a) * 26, y + Math.sin(a) * 26,
            x + Math.cos(a) * 38, y + Math.sin(a) * 38
        );
    }
    g.setScrollFactor(sf, 1);
}

function drawMoon(scene, x, y, zone) {
    const sf = 0.05;
    const g = scene.add.graphics();
    g.setDepth(-18);
    g.setPosition((1 - sf) * (GAME_WIDTH / 2 - x), 0);
    g.fillStyle(0xECEFF1, 0.2);
    g.fillCircle(x, y, 40);
    g.fillStyle(0xECEFF1);
    g.fillCircle(x, y, 18);
    g.fillStyle(zone.skyTop);
    g.fillCircle(x + 6, y - 3, 14);
    g.setScrollFactor(sf, 1);
}

function drawStarryNight(scene, zone) {
    const sf = 0.05;
    const zoneCX = zone.startX + (zone.endX - zone.startX) / 2;
    const g = scene.add.graphics();
    g.setDepth(-19);
    g.setPosition((1 - sf) * (GAME_WIDTH / 2 - zoneCX), 0);
    const rng = new Phaser.Math.RandomDataGenerator([`stars${zone.id}`]);
    for (let i = 0; i < 30; i++) {
        const sx = zone.startX + rng.between(20, zone.endX - zone.startX - 20);
        const sy = rng.between(10, 250);
        const size = rng.between(1, 3);
        g.fillStyle(0xFFFFFF, rng.realInRange(0.3, 0.9));
        g.fillCircle(sx, sy, size);
    }
    g.setScrollFactor(sf, 1);
}

function drawCloud(scene, x, y, width, zone) {
    const sf = 0.15;
    const g = scene.add.graphics();
    g.setDepth(-15);
    if (!zone.isCutscene) {
        g.setPosition((1 - sf) * (GAME_WIDTH / 2 - x), 0);
    }
    const alpha = zone.isCutscene ? 0.9 : 0.6;
    g.fillStyle(0xFFFFFF, alpha);
    g.fillEllipse(x, y, width, width * 0.35);
    g.fillEllipse(x - width * 0.2, y + 5, width * 0.5, width * 0.25);
    g.fillEllipse(x + width * 0.25, y + 3, width * 0.4, width * 0.22);
    if (!zone.isCutscene) {
        g.setScrollFactor(sf, 1);
    }
}

// ─── PARALLAX BACKGROUND LAYERS ───────────────────────────────
function drawParallaxLayers(scene, zone, rng) {
    if (zone.isCutscene) return;

    const width = zone.endX - zone.startX;
    const cx = zone.startX + width / 2;

    // Position offset so parallax layers stay on-screen at any world X.
    // Without this, scrollFactor < 1 causes layers to drift off-screen in later zones.
    const pxOff = (sf) => (1 - sf) * (GAME_WIDTH / 2 - cx);

    const hillColor = Phaser.Display.Color.IntegerToColor(zone.skyBottom);
    const hillHex = Phaser.Display.Color.GetColor(
        Math.max(0, hillColor.red - 40),
        Math.max(0, hillColor.green - 30),
        Math.max(0, hillColor.blue - 20),
    );
    const hillHex2 = Phaser.Display.Color.GetColor(
        Math.max(0, hillColor.red - 60),
        Math.max(0, hillColor.green - 50),
        Math.max(0, hillColor.blue - 30),
    );

    // ── Layer 1: Far mountains (scrollFactor 0.1) ──
    const farG = scene.add.graphics().setDepth(-17);
    farG.setPosition(pxOff(0.1), 0);
    farG.fillStyle(hillHex2, 0.35);
    farG.beginPath();
    farG.moveTo(cx - width, GROUND_Y - 80);
    const numPeaks = 6 + Math.floor(width / 500);
    for (let i = 0; i <= numPeaks; i++) {
        const px = cx - width + i * (width * 2 / numPeaks);
        const peakH = rng.between(120, 220);
        const midX = px + (width * 2 / numPeaks) / 2;
        farG.lineTo(midX, GROUND_Y - 80 - peakH);
    }
    farG.lineTo(cx + width, GROUND_Y - 80);
    farG.lineTo(cx + width, GROUND_Y);
    farG.lineTo(cx - width, GROUND_Y);
    farG.closePath();
    farG.fillPath();
    farG.setScrollFactor(0.1, 1);

    // ── Layer 2: Mid hills (scrollFactor 0.2) ──
    const midFarG = scene.add.graphics().setDepth(-16);
    midFarG.setPosition(pxOff(0.2), 0);
    midFarG.fillStyle(hillHex, 0.3);
    midFarG.beginPath();
    midFarG.moveTo(cx - width, GROUND_Y - 40);
    const numHills = 8 + Math.floor(width / 400);
    for (let i = 0; i <= numHills; i++) {
        const hx = cx - width + i * (width * 2 / numHills);
        const hillH = rng.between(60, 130);
        const midX = hx + (width * 2 / numHills) / 2;
        midFarG.lineTo(midX, GROUND_Y - 40 - hillH);
    }
    midFarG.lineTo(cx + width, GROUND_Y - 40);
    midFarG.lineTo(cx + width, GROUND_Y);
    midFarG.lineTo(cx - width, GROUND_Y);
    midFarG.closePath();
    midFarG.fillPath();
    midFarG.setScrollFactor(0.2, 1);

    // ── Layer 3: Zone-specific distant silhouettes (scrollFactor 0.25) ──
    drawDistantSilhouettes(scene, zone, rng, cx, width, hillHex2);

    // ── Layer 4: Background trees (scrollFactor 0.4) ──
    const treeColor1 = zone.theme?.startsWith('india') ? 0x2E7D32 :
                       zone.theme === 'oracle-tech' ? 0x1B5E20 :
                       zone.theme === 'hobby-park' ? 0x388E3C : 0x33691E;
    const treeColor2 = zone.theme?.startsWith('india') ? 0x388E3C :
                       zone.theme === 'oracle-tech' ? 0x2E7D32 :
                       zone.theme === 'hobby-park' ? 0x43A047 : 0x4CAF50;

    const midG = scene.add.graphics().setDepth(-10);
    midG.setPosition(pxOff(0.4), 0);
    const numBgTrees = Math.floor(width / 100);
    for (let i = 0; i < numBgTrees; i++) {
        const tx = cx - width * 0.3 + rng.between(0, width * 1.6);
        const ty = GROUND_Y - rng.between(20, 50);
        const treeW = rng.between(25, 45);
        const treeH = rng.between(40, 70);
        const color = i % 2 === 0 ? treeColor1 : treeColor2;

        midG.fillStyle(0x5D4037, 0.4);
        midG.fillRect(tx - 2, ty - treeH * 0.4, 4, treeH * 0.5);
        midG.fillStyle(color, 0.35);
        midG.fillCircle(tx, ty - treeH * 0.6, treeW * 0.5);
        midG.fillCircle(tx - treeW * 0.25, ty - treeH * 0.45, treeW * 0.35);
        midG.fillCircle(tx + treeW * 0.25, ty - treeH * 0.45, treeW * 0.35);
    }
    midG.setScrollFactor(0.4, 1);

    // ── Layer 5: Near bushes & ground cover (scrollFactor 0.6) ──
    const nearG = scene.add.graphics().setDepth(-8);
    nearG.setPosition(pxOff(0.6), 0);
    const numBushes = Math.floor(width / 150);
    for (let i = 0; i < numBushes; i++) {
        const bx = cx - width * 0.2 + rng.between(0, width * 1.4);
        const by = GROUND_Y - rng.between(5, 25);
        const bw = rng.between(22, 45);
        nearG.fillStyle(treeColor2, 0.25);
        nearG.fillEllipse(bx, by, bw, bw * 0.5);
        nearG.fillStyle(treeColor1, 0.2);
        nearG.fillEllipse(bx + bw * 0.3, by + 3, bw * 0.6, bw * 0.35);
    }
    nearG.setScrollFactor(0.6, 1);
}

// ─── Zone-specific distant silhouettes for parallax layer 3 ──
function drawDistantSilhouettes(scene, zone, rng, cx, width, baseColor) {
    const sf = 0.25;
    const g = scene.add.graphics().setDepth(-13);
    g.setPosition((1 - sf) * (GAME_WIDTH / 2 - cx), 0);

    if (zone.theme === 'india-village') {
        // Distant temples, huts, palm trees
        for (let i = 0; i < 5; i++) {
            const sx = cx - width * 0.4 + rng.between(0, width * 1.8);
            const sy = GROUND_Y - 60;
            g.fillStyle(0x8D6E63, 0.2);
            // Hut shape
            g.fillRect(sx - 12, sy - 20, 24, 20);
            g.fillTriangle(sx - 16, sy - 20, sx + 16, sy - 20, sx, sy - 38);
        }
        // Distant palm trees
        for (let i = 0; i < 6; i++) {
            const px = cx - width * 0.3 + rng.between(0, width * 1.6);
            const py = GROUND_Y - 55;
            g.fillStyle(0x5D4037, 0.2);
            g.fillRect(px - 1.5, py - 35, 3, 35);
            g.fillStyle(0x2E7D32, 0.2);
            g.fillEllipse(px - 10, py - 38, 18, 8);
            g.fillEllipse(px + 10, py - 38, 18, 8);
            g.fillEllipse(px, py - 42, 10, 12);
        }
    } else if (zone.theme === 'india-school') {
        // Distant school buildings & flag poles
        for (let i = 0; i < 4; i++) {
            const sx = cx - width * 0.3 + rng.between(0, width * 1.6);
            const sy = GROUND_Y - 50;
            const bh = rng.between(35, 55);
            g.fillStyle(0xBF8040, 0.18);
            g.fillRect(sx - 20, sy - bh, 40, bh);
            g.fillStyle(0x8B4513, 0.15);
            g.fillRect(sx - 23, sy - bh - 3, 46, 4);
        }
        // Distant flag poles
        for (let i = 0; i < 3; i++) {
            const fx = cx - width * 0.2 + rng.between(0, width * 1.4);
            g.fillStyle(0x9E9E9E, 0.2);
            g.fillRect(fx, GROUND_Y - 95, 2, 45);
            g.fillStyle(0xFF9933, 0.2);
            g.fillRect(fx + 2, GROUND_Y - 95, 8, 3);
            g.fillStyle(0xFFFFFF, 0.15);
            g.fillRect(fx + 2, GROUND_Y - 92, 8, 3);
            g.fillStyle(0x138808, 0.2);
            g.fillRect(fx + 2, GROUND_Y - 89, 8, 3);
        }
    } else if (zone.theme === 'india-college') {
        // Distant college blocks & pillared halls
        for (let i = 0; i < 5; i++) {
            const sx = cx - width * 0.4 + rng.between(0, width * 1.8);
            const sy = GROUND_Y - 50;
            const bw = rng.between(40, 70);
            const bh = rng.between(40, 65);
            g.fillStyle(0x9E9E9E, 0.15);
            g.fillRect(sx - bw / 2, sy - bh, bw, bh);
            g.fillStyle(0x757575, 0.12);
            // Pillars
            for (let p = 0; p < 4; p++)
                g.fillRect(sx - bw / 2 + 5 + p * (bw / 4), sy - bh, 3, bh);
            g.fillRect(sx - bw / 2 - 2, sy - bh - 3, bw + 4, 4);
        }
    } else if (zone.theme === 'usa-campus') {
        // Distant Binghamton campus, clock towers, dorms
        for (let i = 0; i < 4; i++) {
            const sx = cx - width * 0.3 + rng.between(0, width * 1.6);
            const sy = GROUND_Y - 50;
            const bw = rng.between(30, 55);
            const bh = rng.between(45, 70);
            g.fillStyle(0x6D4C41, 0.18);
            g.fillRect(sx - bw / 2, sy - bh, bw, bh);
            g.fillStyle(0x546E7A, 0.15);
            g.fillRect(sx - bw / 2, sy - bh - 3, bw, 4);
        }
        // Distant clock tower
        const tx = cx + rng.between(-200, 200);
        g.fillStyle(0x795548, 0.2);
        g.fillRect(tx - 8, GROUND_Y - 120, 16, 70);
        g.fillStyle(0x546E7A, 0.18);
        g.fillTriangle(tx - 10, GROUND_Y - 120, tx + 10, GROUND_Y - 120, tx, GROUND_Y - 135);
    } else if (zone.theme === 'michigan-office') {
        // Distant suburban skyline, water tower, church steeple
        for (let i = 0; i < 5; i++) {
            const sx = cx - width * 0.3 + rng.between(0, width * 1.6);
            const sy = GROUND_Y - 50;
            const bw = rng.between(25, 45);
            const bh = rng.between(30, 50);
            g.fillStyle(0x8D6E63, 0.15);
            g.fillRect(sx - bw / 2, sy - bh, bw, bh);
            g.fillStyle(0x5D4037, 0.12);
            g.fillTriangle(sx - bw / 2 - 3, sy - bh, sx + bw / 2 + 3, sy - bh, sx, sy - bh - 15);
        }
        // Water tower
        const wt = cx + rng.between(-100, 100);
        g.fillStyle(0x78909C, 0.2);
        g.fillRect(wt - 2, GROUND_Y - 110, 4, 60);
        g.fillRect(wt - 8, GROUND_Y - 110, 4, 60);
        g.fillRect(wt + 4, GROUND_Y - 110, 4, 60);
        g.fillStyle(0x90A4AE, 0.2);
        g.fillEllipse(wt, GROUND_Y - 118, 22, 16);
    } else if (zone.theme === 'kansas-corporate') {
        // Distant Kansas City skyline — tall glass towers
        const skylineX = cx - width * 0.4;
        for (let i = 0; i < 8; i++) {
            const sx = skylineX + rng.between(0, width * 1.8);
            const sy = GROUND_Y - 50;
            const bw = rng.between(18, 35);
            const bh = rng.between(60, 140);
            g.fillStyle(0x455A64, 0.18);
            g.fillRect(sx - bw / 2, sy - bh, bw, bh);
            // Window dots
            g.fillStyle(0x90CAF9, 0.1);
            const rows = Math.floor(bh / 12);
            const cols = Math.floor(bw / 8);
            for (let r = 0; r < rows; r++)
                for (let c = 0; c < cols; c++)
                    g.fillRect(sx - bw / 2 + 3 + c * 8, sy - bh + 3 + r * 12, 4, 7);
        }
    } else if (zone.theme === 'oracle-tech') {
        // Distant dark tech towers with red accents
        for (let i = 0; i < 7; i++) {
            const sx = cx - width * 0.4 + rng.between(0, width * 1.8);
            const sy = GROUND_Y - 50;
            const bw = rng.between(16, 30);
            const bh = rng.between(70, 160);
            g.fillStyle(0x1A237E, 0.2);
            g.fillRect(sx - bw / 2, sy - bh, bw, bh);
            g.fillStyle(0xC62828, 0.1);
            g.fillRect(sx - bw / 2, sy - bh, 2, bh);
            g.fillRect(sx + bw / 2 - 2, sy - bh, 2, bh);
            // Antenna lights
            if (bh > 100) {
                g.fillStyle(0xF44336, 0.25);
                g.fillCircle(sx, sy - bh - 8, 2);
            }
        }
    } else if (zone.theme === 'hobby-park') {
        // Distant rolling hills with colorful patches, ferris wheel silhouette
        const parkG = scene.add.graphics().setDepth(-13);
        parkG.setPosition((1 - sf) * (GAME_WIDTH / 2 - cx), 0);
        // Gentle rolling hills
        parkG.fillStyle(0x4CAF50, 0.15);
        parkG.beginPath();
        parkG.moveTo(cx - width, GROUND_Y - 30);
        for (let i = 0; i <= 10; i++) {
            const hx = cx - width + i * (width * 2 / 10);
            const hillH = rng.between(30, 60);
            const midX = hx + (width * 2 / 10) / 2;
            parkG.lineTo(midX, GROUND_Y - 30 - hillH);
        }
        parkG.lineTo(cx + width, GROUND_Y - 30);
        parkG.lineTo(cx + width, GROUND_Y);
        parkG.lineTo(cx - width, GROUND_Y);
        parkG.closePath();
        parkG.fillPath();
        parkG.setScrollFactor(0.25, 1);

        // Ferris wheel silhouette
        const fw = cx + rng.between(-200, 200);
        g.lineStyle(1.5, 0x795548, 0.15);
        g.strokeCircle(fw, GROUND_Y - 110, 35);
        g.fillStyle(0x795548, 0.12);
        g.fillRect(fw - 2, GROUND_Y - 75, 4, 30);
        g.fillRect(fw - 18, GROUND_Y - 47, 36, 3);
        // Spokes
        for (let s = 0; s < 8; s++) {
            const angle = (s * Math.PI * 2) / 8;
            g.lineBetween(fw, GROUND_Y - 110, fw + Math.cos(angle) * 35, GROUND_Y - 110 + Math.sin(angle) * 35);
        }
    }

    g.setScrollFactor(0.25, 1);
}

// ─── TERRAIN-FOLLOWING GROUND ──────────────────────────────────
function drawGround(scene, zone) {
    const width = zone.endX - zone.startX;

    // Get terrain points for this zone
    const zonePoints = TERRAIN.filter(([x]) => x >= zone.startX && x <= zone.endX);
    if (zonePoints.length < 2) {
        // Flat fallback
        const g = scene.add.graphics().setDepth(-1);
        g.fillStyle(zone.groundColor);
        g.fillRect(zone.startX, GROUND_Y, width, GAME_HEIGHT - GROUND_Y);
        return;
    }

    // ── Filled terrain polygon ──
    const g = scene.add.graphics().setDepth(-1);
    g.fillStyle(zone.groundColor);
    g.beginPath();
    g.moveTo(zone.startX, GAME_HEIGHT);
    for (const [px, py] of zonePoints) {
        g.lineTo(px, py);
    }
    g.lineTo(zone.endX, GAME_HEIGHT);
    g.closePath();
    g.fillPath();

    // ── Surface edge line ──
    g.lineStyle(4, zone.groundAccent);
    g.beginPath();
    g.moveTo(zonePoints[0][0], zonePoints[0][1]);
    for (let i = 1; i < zonePoints.length; i++) {
        g.lineTo(zonePoints[i][0], zonePoints[i][1]);
    }
    g.strokePath();

    // ── Stair lines on slope sections ──
    const stairsG = scene.add.graphics().setDepth(0);
    for (let i = 0; i < zonePoints.length - 1; i++) {
        const [x0, y0] = zonePoints[i];
        const [x1, y1] = zonePoints[i + 1];
        const rise = Math.abs(y1 - y0);
        const run = x1 - x0;
        if (rise > 5 && run > 0) {
            // Draw stair-step lines
            const numSteps = Math.ceil(rise / 5);
            const stepW = run / numSteps;
            const stepH = (y1 - y0) / numSteps;
            stairsG.lineStyle(1.5, zone.groundAccent, 0.6);
            for (let s = 0; s < numSteps; s++) {
                const sx = x0 + s * stepW;
                const sy = y0 + s * stepH;
                stairsG.lineBetween(sx, sy, sx + stepW, sy);
                stairsG.lineBetween(sx + stepW, sy, sx + stepW, sy + stepH);
            }
        }
    }

    // ── Support pillars under elevated sections ──
    const supportG = scene.add.graphics().setDepth(-2);
    for (let i = 0; i < zonePoints.length - 1; i++) {
        const [x0, y0] = zonePoints[i];
        const [x1, y1] = zonePoints[i + 1];
        const midY = (y0 + y1) / 2;
        if (midY < GROUND_Y - 8 && Math.abs(y1 - y0) < 5) {
            // Flat elevated section — draw supports
            const span = x1 - x0;
            const numSupports = Math.max(1, Math.floor(span / 100));
            supportG.fillStyle(zone.groundAccent, 0.35);
            for (let s = 0; s <= numSupports; s++) {
                const sx = x0 + s * (span / numSupports);
                const sy = getTerrainY(sx);
                supportG.fillRect(sx - 4, sy, 8, GROUND_Y - sy + 20);
            }
        }
    }

    // ── Railing on elevated sections ──
    const railG = scene.add.graphics().setDepth(0);
    for (let i = 0; i < zonePoints.length - 1; i++) {
        const [x0, y0] = zonePoints[i];
        const [x1, y1] = zonePoints[i + 1];
        const midY = (y0 + y1) / 2;
        if (midY < GROUND_Y - 15 && Math.abs(y1 - y0) < 5) {
            railG.lineStyle(2, zone.groundAccent, 0.45);
            railG.lineBetween(x0, y0 - 28, x1, y1 - 28);
            const numPosts = Math.max(1, Math.floor((x1 - x0) / 50));
            for (let p = 0; p <= numPosts; p++) {
                const px = x0 + p * ((x1 - x0) / numPosts);
                const py = getTerrainY(px);
                railG.lineBetween(px, py, px, py - 28);
            }
        }
    }

    // ── Path/road texture on flat sections ──
    if (!zone.isCutscene) {
        const pathG = scene.add.graphics().setDepth(0);
        for (let i = 0; i < zonePoints.length - 1; i++) {
            const [x0, y0] = zonePoints[i];
            const [x1, y1] = zonePoints[i + 1];
            if (Math.abs(y1 - y0) < 3) {
                // Flat section — draw road
                pathG.fillStyle(0x555555, 0.3);
                pathG.fillRect(x0, y0 + 5, x1 - x0, 14);
                pathG.fillStyle(0xFFFF00, 0.25);
                for (let dx = x0; dx < x1; dx += 80) {
                    pathG.fillRect(dx, y0 + 10, 30, 4);
                }
            }
        }
    }

    // ── Grass tufts on terrain ──
    if (zone.theme?.startsWith('india') || zone.theme === 'usa-campus') {
        const rng = new Phaser.Math.RandomDataGenerator([`grass${zone.id}`]);
        const grassG = scene.add.graphics().setDepth(0);
        grassG.fillStyle(0x4CAF50, 0.6);
        for (let i = 0; i < 30; i++) {
            const gx = zone.startX + rng.between(10, width - 10);
            const gy = getTerrainY(gx);
            grassG.fillTriangle(gx - 4, gy, gx + 4, gy, gx, gy - rng.between(5, 15));
        }
    }
}

// === INDIAN VILLAGE ===
function drawIndianVillage(scene, zone, rng) {
    const width = zone.endX - zone.startX;
    const g = scene.add.graphics();
    g.setDepth(-5);

    // Indian town buildings — multi-story, colorful, with balconies
    const townColors = [0xE74C3C, 0xF39C12, 0x3498DB, 0xE91E63, 0x2196F3, 0xFF9800];
    for (let i = 0; i < 6; i++) {
        const hx = zone.startX + 120 + i * (width / 7);
        const gy = getTerrainY(hx);
        const hw = rng.between(80, 120);
        const hh = rng.between(110, 180);
        const color = townColors[i % townColors.length];
        drawTownHouse(g, hx, gy, hw, hh, color);
    }

    // Two temples
    drawTemple(g, zone.startX + width * 0.35, getTerrainY(zone.startX + width * 0.35));
    drawTemple(g, zone.endX - 250, getTerrainY(zone.endX - 250));

    // Small shop fronts
    drawShopFront(g, zone.startX + 500, getTerrainY(zone.startX + 500), 0x4CAF50);
    drawShopFront(g, zone.startX + width * 0.6, getTerrainY(zone.startX + width * 0.6), 0xFF5722);

    for (let i = 0; i < 4; i++) {
        const tx = zone.startX + rng.between(80, width - 80);
        drawBanyanTree(scene, tx, getTerrainY(tx));
    }

    drawAutoRickshaw(scene, zone.startX + 600, getTerrainY(zone.startX + 600) + 5);
}

function drawTownHouse(g, x, groundY, w, h, color) {
    // Multi-story Indian town building
    const floors = Math.floor(h / 50);
    g.fillStyle(color);
    g.fillRect(x - w / 2, groundY - h, w, h);
    // Darker trim lines between floors
    g.lineStyle(1.5, 0x000000, 0.15);
    for (let f = 1; f < floors; f++) {
        const fy = groundY - f * 50;
        g.lineBetween(x - w / 2, fy, x + w / 2, fy);
        // Decorative ledge
        g.fillStyle(0xFFFFFF, 0.15);
        g.fillRect(x - w / 2, fy - 2, w, 3);
    }
    // Windows — arched style
    g.fillStyle(0xFFF9C4);
    for (let f = 0; f < floors; f++) {
        const fy = groundY - h + f * 50 + 12;
        const cols = Math.floor(w / 35);
        for (let c = 0; c < cols; c++) {
            const wx = x - w / 2 + 12 + c * (w / cols);
            g.fillRoundedRect(wx, fy, 14, 22, { tl: 7, tr: 7, bl: 0, br: 0 });
            g.lineStyle(0.8, 0x5D4037, 0.3);
            g.strokeRoundedRect(wx, fy, 14, 22, { tl: 7, tr: 7, bl: 0, br: 0 });
        }
    }
    // Balcony on second floor (if tall enough)
    if (h > 120) {
        const balY = groundY - 50;
        g.fillStyle(0x8D6E63);
        g.fillRect(x - w / 2 - 3, balY, w + 6, 3);
        // Railing
        g.lineStyle(1.5, 0x5D4037);
        g.lineBetween(x - w / 2 - 3, balY - 15, x + w / 2 + 3, balY - 15);
        g.lineBetween(x - w / 2 - 3, balY, x - w / 2 - 3, balY - 15);
        g.lineBetween(x + w / 2 + 3, balY, x + w / 2 + 3, balY - 15);
        for (let r = 0; r < 4; r++)
            g.lineBetween(x - w / 2 + 5 + r * (w / 4), balY, x - w / 2 + 5 + r * (w / 4), balY - 15);
    }
    // Flat roof with parapet
    g.fillStyle(0x000000, 0.1);
    g.fillRect(x - w / 2, groundY - h, w, 4);
    // Door
    g.fillStyle(0x5D4037);
    g.fillRoundedRect(x - 10, groundY - 35, 20, 35, { tl: 10, tr: 10, bl: 0, br: 0 });
    g.fillStyle(0xFFC107);
    g.fillCircle(x + 5, groundY - 18, 1.5);
}

function drawShopFront(g, x, groundY, awningColor) {
    const w = 70, h = 55;
    g.fillStyle(0xFFF8E1);
    g.fillRect(x - w / 2, groundY - h, w, h);
    // Awning
    g.fillStyle(awningColor, 0.85);
    g.fillRect(x - w / 2 - 5, groundY - h, w + 10, 8);
    // Scalloped awning edge
    for (let s = 0; s < 6; s++) {
        g.fillTriangle(
            x - w / 2 - 5 + s * ((w + 10) / 6), groundY - h + 8,
            x - w / 2 - 5 + (s + 0.5) * ((w + 10) / 6), groundY - h + 14,
            x - w / 2 - 5 + (s + 1) * ((w + 10) / 6), groundY - h + 8
        );
    }
    // Open front
    g.fillStyle(0x3E2723);
    g.fillRect(x - w / 2 + 5, groundY - h + 12, w - 10, h - 12);
    // Wares (colored rectangles)
    g.fillStyle(0xFFEB3B, 0.6);
    g.fillRect(x - w / 2 + 8, groundY - h + 15, 12, 8);
    g.fillStyle(0xFF5722, 0.6);
    g.fillRect(x - w / 2 + 24, groundY - h + 15, 12, 8);
    g.fillStyle(0x4CAF50, 0.6);
    g.fillRect(x + w / 2 - 22, groundY - h + 15, 12, 8);
}

function drawTemple(g, x, groundY) {
    // Main mandapa
    g.fillStyle(0xFFCC80);
    g.fillRect(x - 45, groundY - 110, 90, 110);
    // Stepped base
    g.fillStyle(0xFFB74D);
    for (let s = 0; s < 3; s++)
        g.fillRect(x - 50 - s * 5, groundY - 5 - s * 8, 100 + s * 10, 8);
    // Pillar detail
    g.fillStyle(0xDEB887);
    g.fillRect(x - 40, groundY - 100, 6, 90);
    g.fillRect(x + 34, groundY - 100, 6, 90);
    // Shikhara (tower top)
    g.fillStyle(0xFFCC80);
    g.fillTriangle(x - 30, groundY - 110, x + 30, groundY - 110, x, groundY - 185);
    // Horizontal bands on shikhara
    g.lineStyle(1, 0xDEB887, 0.5);
    for (let b = 0; b < 4; b++) {
        const by = groundY - 120 - b * 16;
        const bw = 26 - b * 5;
        g.lineBetween(x - bw, by, x + bw, by);
    }
    // Kalash on top
    g.fillStyle(0xFFA726);
    g.fillCircle(x, groundY - 185, 8);
    g.fillStyle(0xFF5722);
    g.fillTriangle(x, groundY - 193, x, groundY - 210, x + 16, groundY - 200);
    g.lineStyle(1.5, 0x795548);
    g.lineBetween(x, groundY - 193, x, groundY - 215);
    // Entrance archway
    g.fillStyle(0x4E342E);
    g.fillRoundedRect(x - 12, groundY - 75, 24, 40, { tl: 12, tr: 12, bl: 0, br: 0 });
    // Decorative arch rings
    g.lineStyle(1.5, 0xFFB74D);
    g.beginPath();
    g.arc(x, groundY - 75, 14, Math.PI, 0, false);
    g.strokePath();
    // Window circles on sides
    g.fillStyle(0xFFF9C4, 0.8);
    g.fillCircle(x - 25, groundY - 70, 6);
    g.fillCircle(x + 25, groundY - 70, 6);
}

function drawBanyanTree(scene, x, groundY) {
    const g = scene.add.graphics();
    g.setDepth(-3);
    g.fillStyle(0x5D4037);
    g.fillRect(x - 6, groundY - 60, 12, 60);
    g.lineStyle(2, 0x5D4037, 0.5);
    g.lineBetween(x - 20, groundY - 40, x - 25, groundY);
    g.lineBetween(x + 20, groundY - 35, x + 22, groundY);
    g.fillStyle(0x2E7D32);
    g.fillCircle(x, groundY - 70, 30);
    g.fillStyle(0x388E3C);
    g.fillCircle(x - 18, groundY - 55, 22);
    g.fillCircle(x + 18, groundY - 55, 22);
    g.fillStyle(0x43A047);
    g.fillCircle(x, groundY - 85, 20);
}

function drawAutoRickshaw(scene, x, groundY) {
    const g = scene.add.graphics();
    g.setDepth(-2);
    g.fillStyle(0x4CAF50);
    g.fillRoundedRect(x - 20, groundY - 30, 40, 25, 4);
    g.fillStyle(0x388E3C);
    g.fillRoundedRect(x - 18, groundY - 38, 36, 10, { tl: 6, tr: 6, bl: 0, br: 0 });
    g.fillStyle(0xB3E5FC, 0.8);
    g.fillRect(x + 14, groundY - 28, 6, 12);
    g.fillStyle(0x212121);
    g.fillCircle(x - 12, groundY - 3, 5);
    g.fillCircle(x + 12, groundY - 3, 5);
    g.fillStyle(0x9E9E9E);
    g.fillCircle(x - 12, groundY - 3, 2);
    g.fillCircle(x + 12, groundY - 3, 2);
}

// === INDIAN SCHOOL ===
function drawIndianSchoolArea(scene, zone, rng) {
    const width = zone.endX - zone.startX;
    const g = scene.add.graphics().setDepth(-5);

    // Town houses along the school zone (decorative, no names)
    const colors = [0xE8D5B7, 0xF5E6CC, 0xFFCC80, 0xE0C8A8, 0xDEB887];
    for (let i = 0; i < 4; i++) {
        const hx = zone.startX + 200 + i * (width / 5);
        const gy = getTerrainY(hx);
        const hw = rng.between(70, 100);
        const hh = rng.between(90, 140);
        drawTownHouse(g, hx, gy, hw, hh, colors[i % colors.length]);
    }

    // Small temple
    drawTemple(g, zone.startX + width * 0.7, getTerrainY(zone.startX + width * 0.7));

    // Playground
    drawPlayground(scene, zone.startX + width * 0.85, getTerrainY(zone.startX + width * 0.85));

    // Shop front
    drawShopFront(g, zone.startX + width * 0.45, getTerrainY(zone.startX + width * 0.45), 0x1565C0);

    for (let i = 0; i < 6; i++) {
        const tx = zone.startX + rng.between(80, width - 200);
        drawNormalTree(scene, tx, getTerrainY(tx), rng);
    }
}

function drawPlayground(scene, x, groundY) {
    const g = scene.add.graphics().setDepth(-4);
    // Swing set
    g.lineStyle(3, 0x616161);
    g.lineBetween(x - 20, groundY, x - 10, groundY - 50);
    g.lineBetween(x + 20, groundY, x + 10, groundY - 50);
    g.lineBetween(x - 10, groundY - 50, x + 10, groundY - 50);
    g.lineStyle(1.5, 0x795548);
    g.lineBetween(x - 3, groundY - 50, x - 5, groundY - 15);
    g.lineBetween(x + 3, groundY - 50, x + 5, groundY - 15);
    g.fillStyle(0x795548);
    g.fillRect(x - 8, groundY - 15, 16, 4);
    // Slide nearby
    g.lineStyle(2.5, 0x616161);
    g.lineBetween(x + 30, groundY, x + 30, groundY - 40);
    g.lineBetween(x + 28, groundY - 40, x + 50, groundY);
    g.lineStyle(3, 0xFFC107);
    g.lineBetween(x + 29, groundY - 38, x + 49, groundY);
}

// === INDIAN COLLEGE (GTU) ===
function drawIndianCollege(scene, zone, rng) {
    const width = zone.endX - zone.startX;

    // Campus hostel — 3-story with balconies
    drawHostelBlock(scene, zone.startX + 400, getTerrainY(zone.startX + 400), 160, 130, 0xE8EAF6);
    // Library wing — with small dome
    drawLibraryWing(scene, zone.startX + width * 0.35, getTerrainY(zone.startX + width * 0.35), 120, 100, 0xF5F5F5);
    // Canteen — open front with pillars
    drawCanteen(scene, zone.startX + width * 0.7, getTerrainY(zone.startX + width * 0.7), 110, 70, 0xFFF8E1);
    // Department building — L-shaped
    drawDeptBlock(scene, zone.startX + width * 0.85, getTerrainY(zone.startX + width * 0.85), 140, 110, 0xE0E0E0);

    // Grand campus entrance gate — brick pillars with arch
    const gateX = zone.startX + 150;
    const gateY = getTerrainY(gateX);
    const gg = scene.add.graphics().setDepth(-4);
    // Left pillar
    gg.fillStyle(0x8D6E63);
    gg.fillRect(gateX - 12, gateY - 75, 24, 75);
    gg.fillStyle(0x6D4C41);
    gg.fillRect(gateX - 14, gateY - 78, 28, 6);
    gg.fillRect(gateX - 14, gateY - 3, 28, 6);
    // Left pillar lamp
    gg.fillStyle(0xFFD54F);
    gg.fillCircle(gateX, gateY - 82, 5);
    gg.fillStyle(0xFFD54F, 0.3);
    gg.fillCircle(gateX, gateY - 82, 9);
    // Right pillar
    gg.fillStyle(0x8D6E63);
    gg.fillRect(gateX + 68, gateY - 75, 24, 75);
    gg.fillStyle(0x6D4C41);
    gg.fillRect(gateX + 66, gateY - 78, 28, 6);
    gg.fillRect(gateX + 66, gateY - 3, 28, 6);
    gg.fillStyle(0xFFD54F);
    gg.fillCircle(gateX + 80, gateY - 82, 5);
    gg.fillStyle(0xFFD54F, 0.3);
    gg.fillCircle(gateX + 80, gateY - 82, 9);
    // Arch connecting pillars
    gg.fillStyle(0x1A237E);
    gg.fillRect(gateX + 12, gateY - 70, 56, 8);
    // Semicircular arch
    gg.lineStyle(4, 0x1A237E);
    gg.beginPath();
    gg.arc(gateX + 40, gateY - 70, 28, Math.PI, 0, false);
    gg.strokePath();
    gg.fillStyle(0x1A237E, 0.4);
    gg.fillCircle(gateX + 40, gateY - 70, 26);
    // Iron gate bars
    gg.lineStyle(1.5, 0x5D4037, 0.5);
    for (let i = 0; i < 5; i++) {
        const barX = gateX + 18 + i * 11;
        gg.lineBetween(barX, gateY - 62, barX, gateY);
    }

    // Notice board near gate
    const nbX = zone.startX + 260;
    const nbY = getTerrainY(nbX);
    const nb = scene.add.graphics().setDepth(-4);
    nb.fillStyle(0x5D4037);
    nb.fillRect(nbX - 2, nbY - 50, 4, 50);
    nb.fillRect(nbX + 30, nbY - 50, 4, 50);
    nb.fillStyle(0xFFF9C4);
    nb.fillRect(nbX - 4, nbY - 55, 40, 30);
    nb.fillStyle(0x5D4037);
    nb.fillRect(nbX - 6, nbY - 57, 44, 4);
    // Paper notices
    nb.fillStyle(0xFFFFFF);
    nb.fillRect(nbX + 2, nbY - 50, 12, 16);
    nb.fillRect(nbX + 18, nbY - 48, 10, 12);
    nb.fillStyle(0xE3F2FD);
    nb.fillRect(nbX + 4, nbY - 38, 14, 10);

    // Cycle stand
    const csX = zone.startX + width * 0.5;
    const csY = getTerrainY(csX);
    const cs = scene.add.graphics().setDepth(-4);
    cs.lineStyle(1.5, 0x757575);
    cs.fillStyle(0x9E9E9E);
    cs.fillRect(csX - 30, csY - 4, 60, 4);
    // Cycle outlines (3 bikes)
    for (let i = 0; i < 3; i++) {
        const cx2 = csX - 18 + i * 18;
        // Wheels
        cs.lineStyle(1, 0x424242);
        cs.strokeCircle(cx2 - 4, csY - 10, 5);
        cs.strokeCircle(cx2 + 4, csY - 10, 5);
        // Frame
        cs.lineBetween(cx2 - 4, csY - 10, cx2, csY - 18);
        cs.lineBetween(cx2 + 4, csY - 10, cx2, csY - 18);
        cs.lineBetween(cx2 - 4, csY - 10, cx2 + 4, csY - 10);
        // Handlebar
        cs.lineBetween(cx2 - 2, csY - 20, cx2 + 2, csY - 20);
    }

    // Flagpole
    const fpX = zone.startX + width * 0.15;
    const fpY = getTerrainY(fpX);
    const fp = scene.add.graphics().setDepth(-4);
    fp.lineStyle(2, 0xBDBDBD);
    fp.lineBetween(fpX, fpY, fpX, fpY - 90);
    fp.fillStyle(0xBDBDBD);
    fp.fillCircle(fpX, fpY - 90, 3);
    // Indian tricolor flag
    fp.fillStyle(0xFF9933);
    fp.fillRect(fpX + 2, fpY - 88, 22, 5);
    fp.fillStyle(0xFFFFFF);
    fp.fillRect(fpX + 2, fpY - 83, 22, 5);
    fp.fillStyle(0x138808);
    fp.fillRect(fpX + 2, fpY - 78, 22, 5);
    // Ashoka chakra (tiny dot)
    fp.fillStyle(0x000080);
    fp.fillCircle(fpX + 13, fpY - 80.5, 2);

    for (let i = 0; i < 8; i++) {
        const tx = zone.startX + rng.between(100, width - 200);
        drawNormalTree(scene, tx, getTerrainY(tx), rng);
    }
    drawBench(scene, zone.startX + 800, getTerrainY(zone.startX + 800));
    drawBench(scene, zone.startX + 1500, getTerrainY(zone.startX + 1500));
    drawBench(scene, zone.startX + 2200, getTerrainY(zone.startX + 2200));
}

function drawHostelBlock(scene, x, groundY, w, h, color) {
    const g = scene.add.graphics().setDepth(-6);
    g.fillStyle(color);
    g.fillRect(x - w / 2, groundY - h, w, h);
    // Floor dividers
    const floors = 3;
    for (let f = 1; f < floors; f++) {
        g.fillStyle(0xBDBDBD);
        g.fillRect(x - w / 2, groundY - h + f * (h / floors) - 2, w, 4);
    }
    // Roof cornice
    g.fillStyle(0x7986CB);
    g.fillRect(x - w / 2 - 4, groundY - h - 5, w + 8, 7);
    // Windows with balcony railings
    const cols = Math.floor(w / 38);
    for (let f = 0; f < floors; f++) {
        for (let c = 0; c < cols; c++) {
            const wx = x - w / 2 + 12 + c * (w / cols);
            const wy = groundY - h + 10 + f * (h / floors);
            g.fillStyle(0x90CAF9, 0.6);
            g.fillRect(wx, wy, 20, 26);
            g.lineStyle(0.8, 0x546E7A, 0.4);
            g.strokeRect(wx, wy, 20, 26);
            // Balcony ledge
            if (f > 0) {
                g.fillStyle(0xBDBDBD);
                g.fillRect(wx - 3, wy + 26, 26, 3);
                // Railing bars
                g.lineStyle(0.5, 0x9E9E9E);
                g.lineBetween(wx - 2, wy + 29, wx - 2, wy + 36);
                g.lineBetween(wx + 10, wy + 29, wx + 10, wy + 36);
                g.lineBetween(wx + 22, wy + 29, wx + 22, wy + 36);
                g.lineBetween(wx - 2, wy + 36, wx + 22, wy + 36);
            }
        }
    }
    // Stairwell at side
    g.fillStyle(0xD1C4E9);
    g.fillRect(x + w / 2 - 18, groundY - h, 18, h);
    g.lineStyle(0.5, 0x9575CD, 0.4);
    for (let s = 0; s < floors; s++) {
        const sy = groundY - h + s * (h / floors) + 10;
        g.lineBetween(x + w / 2 - 16, sy, x + w / 2 - 2, sy + 15);
        g.lineBetween(x + w / 2 - 2, sy + 15, x + w / 2 - 16, sy + 30);
    }
    // Door
    g.fillStyle(0x5D4037);
    g.fillRoundedRect(x - 14, groundY - 42, 28, 42, { tl: 14, tr: 14, bl: 0, br: 0 });
}

function drawLibraryWing(scene, x, groundY, w, h, color) {
    const g = scene.add.graphics().setDepth(-6);
    g.fillStyle(color);
    g.fillRect(x - w / 2, groundY - h, w, h);
    // Roof cornice
    g.fillStyle(0xBDBDBD);
    g.fillRect(x - w / 2 - 4, groundY - h - 4, w + 8, 6);
    // Small dome on top
    g.fillStyle(0x7986CB, 0.7);
    g.fillCircle(x, groundY - h - 4, 18);
    g.fillStyle(color);
    g.fillRect(x - 20, groundY - h, 40, 6);
    // Tall arched windows (library style)
    const cols = Math.floor(w / 30);
    for (let c = 0; c < cols; c++) {
        const wx = x - w / 2 + 10 + c * (w / cols);
        const wy = groundY - h + 15;
        const ww = 16, wh = h - 50;
        g.fillStyle(0x90CAF9, 0.5);
        g.fillRect(wx, wy + 8, ww, wh);
        g.fillCircle(wx + ww / 2, wy + 8, ww / 2);
        g.lineStyle(0.8, 0x546E7A, 0.4);
        g.strokeRect(wx, wy + 8, ww, wh);
        // Horizontal divider
        g.lineBetween(wx, wy + 8 + wh / 2, wx + ww, wy + 8 + wh / 2);
    }
    // Pillared entrance
    for (const s of [-1, 1]) {
        g.fillStyle(0xBDBDBD);
        g.fillRect(x + s * 16 - 3, groundY - 50, 6, 50);
    }
    g.fillStyle(0x5D4037);
    g.fillRoundedRect(x - 12, groundY - 40, 24, 40, { tl: 12, tr: 12, bl: 0, br: 0 });
}

function drawCanteen(scene, x, groundY, w, h, color) {
    const g = scene.add.graphics().setDepth(-6);
    g.fillStyle(color);
    g.fillRect(x - w / 2, groundY - h, w, h);
    // Sloped roof
    g.fillStyle(0xA1887F);
    g.fillTriangle(x - w / 2 - 8, groundY - h, x + w / 2 + 8, groundY - h, x, groundY - h - 20);
    g.fillRect(x - w / 2 - 8, groundY - h - 2, w + 16, 4);
    // Open front pillars
    const pillars = 4;
    for (let p = 0; p < pillars; p++) {
        const px = x - w / 2 + 10 + p * ((w - 20) / (pillars - 1));
        g.fillStyle(0xBDBDBD);
        g.fillRect(px - 3, groundY - h + 4, 6, h - 4);
    }
    // Counter at back
    g.fillStyle(0x8D6E63);
    g.fillRect(x - w / 2 + 8, groundY - h / 2 - 4, w - 16, 8);
    // Menu board
    g.fillStyle(0x1B5E20);
    g.fillRect(x - 18, groundY - h + 8, 36, 20);
    g.fillStyle(0xFFFFFF, 0.5);
    g.fillRect(x - 14, groundY - h + 12, 28, 2);
    g.fillRect(x - 14, groundY - h + 17, 20, 2);
    g.fillRect(x - 14, groundY - h + 22, 24, 2);
    // Chairs/stools in front
    for (let s = 0; s < 3; s++) {
        const sx = x - 20 + s * 20;
        g.fillStyle(0x795548);
        g.fillRect(sx - 4, groundY - 14, 8, 14);
        g.fillRect(sx - 6, groundY - 16, 12, 3);
    }
}

function drawDeptBlock(scene, x, groundY, w, h, color) {
    const g = scene.add.graphics().setDepth(-6);
    // Main block
    g.fillStyle(color);
    g.fillRect(x - w / 2, groundY - h, w, h);
    // L-shape wing extending right
    const wingW = w * 0.4, wingH = h * 0.6;
    g.fillStyle(Phaser.Display.Color.IntegerToColor(color).brighten(5).color);
    g.fillRect(x + w / 2, groundY - wingH, wingW, wingH);
    // Roof cornice — both blocks
    g.fillStyle(0x7986CB);
    g.fillRect(x - w / 2 - 3, groundY - h - 4, w + 6, 6);
    g.fillRect(x + w / 2 - 3, groundY - wingH - 4, wingW + 6, 6);
    // Main block windows
    const cols = Math.floor(w / 36);
    const rows = Math.floor(h / 40);
    g.fillStyle(0x90CAF9, 0.6);
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
            const wx = x - w / 2 + 12 + c * (w / cols);
            const wy = groundY - h + 12 + r * 38;
            g.fillRect(wx, wy, 20, 26);
            g.lineStyle(0.8, 0x546E7A, 0.4);
            g.strokeRect(wx, wy, 20, 26);
        }
    // Wing windows
    const wCols = Math.floor(wingW / 36);
    const wRows = Math.floor(wingH / 40);
    for (let r = 0; r < wRows; r++)
        for (let c = 0; c < wCols; c++) {
            const wx = x + w / 2 + 10 + c * (wingW / wCols);
            const wy = groundY - wingH + 12 + r * 38;
            g.fillStyle(0x90CAF9, 0.6);
            g.fillRect(wx, wy, 18, 24);
            g.lineStyle(0.8, 0x546E7A, 0.4);
            g.strokeRect(wx, wy, 18, 24);
        }
    // Covered walkway connecting blocks
    g.fillStyle(0xBDBDBD, 0.6);
    g.fillRect(x + w / 2 - 10, groundY - wingH - 2, 20, 4);
    // Door
    g.fillStyle(0x5D4037);
    g.fillRoundedRect(x - 12, groundY - 38, 24, 38, { tl: 12, tr: 12, bl: 0, br: 0 });
}

// === FLIGHT SCENE ===
function drawFlightScene(scene, zone, rng) {
    const cx = zone.startX + (zone.endX - zone.startX) / 2;
    const width = zone.endX - zone.startX;

    // Ocean below the flight path
    const ocean = scene.add.graphics();
    ocean.setDepth(-1);
    // Deep ocean gradient
    ocean.fillStyle(0x0D47A1, 0.6);
    ocean.fillRect(zone.startX, GROUND_Y - 40, width, GAME_HEIGHT - GROUND_Y + 40);
    // Wave highlights
    ocean.lineStyle(1, 0x42A5F5, 0.15);
    for (let w = 0; w < 12; w++) {
        const wy = GROUND_Y - 20 + w * 15;
        ocean.beginPath();
        ocean.moveTo(zone.startX, wy);
        for (let wx = zone.startX; wx <= zone.endX; wx += 40) {
            ocean.lineTo(wx, wy + Math.sin((wx + w * 50) * 0.02) * 4);
        }
        ocean.strokePath();
    }

    // Static plane (decorative, the animated one is in Level2Scene)
    const plane = scene.add.graphics();
    plane.setDepth(-2);
    plane.fillStyle(0xECEFF1);
    plane.fillRoundedRect(cx - 70, 260, 140, 35, 15);
    plane.fillStyle(0x64B5F6);
    for (let w = 0; w < 8; w++) {
        plane.fillCircle(cx - 50 + w * 14, 272, 4);
    }
    plane.fillStyle(0xB0BEC5);
    plane.fillTriangle(cx - 20, 278, cx + 20, 278, cx, 330);
    plane.fillStyle(0xB0BEC5);
    plane.fillTriangle(cx + 55, 260, cx + 70, 260, cx + 65, 230);
    plane.fillStyle(0xFF5722);
    plane.fillTriangle(cx + 58, 255, cx + 68, 255, cx + 64, 235);
    plane.fillStyle(0x78909C);
    plane.fillEllipse(cx - 30, 295, 20, 10);
    plane.fillEllipse(cx + 30, 295, 20, 10);

    // Labels
    const indiaLabel = scene.add.text(zone.startX + 100, 420, 'INDIA', {
        fontFamily: 'Arial', fontSize: '24px', color: '#ffffff', stroke: '#000000', strokeThickness: 2,
    });
    indiaLabel.setAlpha(0.5).setDepth(-1);

    const usaLabel = scene.add.text(zone.endX - 200, 420, 'USA', {
        fontFamily: 'Arial', fontSize: '24px', color: '#ffffff', stroke: '#000000', strokeThickness: 2,
    });
    usaLabel.setAlpha(0.5).setDepth(-1);

    // Dashed flight path arc
    const path = scene.add.graphics();
    path.setDepth(-3);
    path.lineStyle(2, 0xFFFFFF, 0.3);
    for (let d = 0; d < 20; d++) {
        const dx = zone.startX + 100 + d * ((width - 200) / 20);
        const dy = 380 - Math.sin(d / 20 * Math.PI) * 100;
        if (d > 0) {
            const pdx = zone.startX + 100 + (d - 1) * ((width - 200) / 20);
            const pdy = 380 - Math.sin((d - 1) / 20 * Math.PI) * 100;
            path.lineBetween(pdx, pdy, dx, dy);
        }
    }
}

// === US CAMPUS (SUNY Binghamton) ===
function drawUSCampus(scene, zone, rng) {
    const width = zone.endX - zone.startX;

    // Tall NY-style apartment buildings in background
    drawTallBuilding(scene, zone.startX + 250, getTerrainY(zone.startX + 250), 80, 240, 0x8D6E63);
    drawTallBuilding(scene, zone.startX + width * 0.3, getTerrainY(zone.startX + width * 0.3), 90, 200, 0x795548);
    drawTallBuilding(scene, zone.startX + width * 0.75, getTerrainY(zone.startX + width * 0.75), 70, 220, 0x6D4C41);

    // Dorm buildings
    drawDormBuilding(scene, zone.startX + 500, getTerrainY(zone.startX + 500));
    drawDormBuilding(scene, zone.startX + width * 0.6, getTerrainY(zone.startX + width * 0.6));

    const fallColors = [0xE65100, 0xBF360C, 0xF57F17, 0xFF6F00, 0xD84315];
    for (let i = 0; i < 8; i++) {
        const tx = zone.startX + rng.between(80, width - 200);
        drawFallTree(scene, tx, getTerrainY(tx), fallColors[i % fallColors.length]);
    }
    for (let i = 0; i < 5; i++) {
        const lx = zone.startX + 200 + i * 500;
        drawLampPost(scene, lx, getTerrainY(lx));
    }
    drawBench(scene, zone.startX + 800, getTerrainY(zone.startX + 800));
    drawBench(scene, zone.startX + 1800, getTerrainY(zone.startX + 1800));
}

function drawTallBuilding(scene, x, groundY, w, h, color) {
    const g = scene.add.graphics().setDepth(-7);
    // Body
    g.fillStyle(color);
    g.fillRect(x - w / 2, groundY - h, w, h);
    // Brick texture
    g.lineStyle(0.4, 0x000000, 0.1);
    for (let r = 0; r < h / 12; r++) {
        g.lineBetween(x - w / 2, groundY - h + r * 12, x + w / 2, groundY - h + r * 12);
        const offset = (r % 2 === 0) ? 0 : 16;
        for (let c = 0; c < w / 32; c++)
            g.lineBetween(x - w / 2 + c * 32 + offset, groundY - h + r * 12, x - w / 2 + c * 32 + offset, groundY - h + (r + 1) * 12);
    }
    // Windows
    const cols = Math.floor(w / 22);
    const rows = Math.floor(h / 28);
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
            const lit = ((r + c) % 3 !== 0);
            g.fillStyle(lit ? 0xFFF9C4 : 0x546E7A, lit ? 0.9 : 0.5);
            g.fillRect(x - w / 2 + 6 + c * (w / cols), groundY - h + 8 + r * 26, 12, 18);
        }
    // Roof cap
    g.fillStyle(0x37474F);
    g.fillRect(x - w / 2 - 2, groundY - h - 4, w + 4, 6);
    // Water tank on roof
    g.fillStyle(0x546E7A);
    g.fillRect(x - 8, groundY - h - 20, 16, 16);
    g.fillRect(x - 10, groundY - h - 22, 20, 4);
}

function drawDormBuilding(scene, x, groundY) {
    const g = scene.add.graphics().setDepth(-6);
    const w = 120, h = 100;
    g.fillStyle(0x8D6E63);
    g.fillRect(x - w / 2, groundY - h, w, h);
    // Brick lines
    g.lineStyle(0.3, 0x6D4C41, 0.2);
    for (let r = 0; r < h / 10; r++)
        g.lineBetween(x - w / 2, groundY - h + r * 10, x + w / 2, groundY - h + r * 10);
    // Roof
    g.fillStyle(0xECEFF1);
    g.fillRect(x - w / 2 - 2, groundY - h - 4, w + 4, 6);
    // Windows
    g.fillStyle(0xFFF9C4);
    for (let r = 0; r < 2; r++)
        for (let c = 0; c < 3; c++) {
            g.fillRect(x - 38 + c * 30, groundY - h + 15 + r * 40, 18, 25);
            g.lineStyle(0.8, 0xECEFF1);
            g.strokeRect(x - 38 + c * 30, groundY - h + 15 + r * 40, 18, 25);
        }
    // Door
    g.fillStyle(0x3E2723);
    g.fillRoundedRect(x - 10, groundY - 35, 20, 35, { tl: 10, tr: 10, bl: 0, br: 0 });
}

// === MICHIGAN OFFICE (Midway Dental Supply) ===
function drawMichiganOffice(scene, zone, rng) {
    const width = zone.endX - zone.startX;

    // Suburban strip mall (decorative, no names)
    const stripX = zone.startX + width * 0.35;
    const stripY = getTerrainY(stripX);
    const sg = scene.add.graphics().setDepth(-5);
    sg.fillStyle(0xE8D5B7);
    sg.fillRect(stripX - 100, stripY - 80, 200, 80);
    sg.fillStyle(0x5D4037);
    sg.fillRect(stripX - 104, stripY - 84, 208, 6);
    // Storefronts
    for (let i = 0; i < 3; i++) {
        const sx = stripX - 70 + i * 65;
        sg.fillStyle(0x90CAF9, 0.5);
        sg.fillRect(sx, stripY - 65, 45, 40);
        sg.lineStyle(1, 0x546E7A);
        sg.strokeRect(sx, stripY - 65, 45, 40);
        sg.fillStyle(0x3E2723);
        sg.fillRect(sx + 16, stripY - 22, 14, 22);
    }
    // Awning
    sg.fillStyle(0xBF360C, 0.7);
    sg.fillRect(stripX - 100, stripY - 68, 200, 5);

    // Residential houses in background
    const houseColors = [0xE8D5B7, 0xD7CCC8, 0xF5F5DC, 0xECE0D0];
    for (let i = 0; i < 4; i++) {
        const hx = zone.startX + 120 + i * (width / 4.5);
        const gy = getTerrainY(hx);
        const g = scene.add.graphics().setDepth(-7);
        const hw = rng.between(55, 75), hh = rng.between(50, 65);
        g.fillStyle(houseColors[i % 4]);
        g.fillRect(hx - hw / 2, gy - hh, hw, hh);
        g.fillStyle(0x5D4037);
        g.fillTriangle(hx - hw / 2 - 6, gy - hh, hx + hw / 2 + 6, gy - hh, hx, gy - hh - 22);
        g.fillStyle(0x3E2723);
        g.fillRoundedRect(hx - 6, gy - 24, 12, 24, { tl: 6, tr: 6, bl: 0, br: 0 });
        g.fillStyle(0xFFF9C4);
        g.fillRect(hx - 18, gy - hh + 10, 12, 14);
        g.fillRect(hx + 6, gy - hh + 10, 12, 14);
        // Chimney
        g.fillStyle(0x8D6E63);
        g.fillRect(hx + hw / 4, gy - hh - 22 - 12, 8, 14);
    }

    // Trees + street lights
    for (let i = 0; i < 5; i++) {
        const tx = zone.startX + rng.between(50, width - 50);
        drawNormalTree(scene, tx, getTerrainY(tx), rng);
    }
    for (let i = 0; i < 3; i++) {
        const lx = zone.startX + 200 + i * (width / 3);
        drawStreetLight(scene, lx, getTerrainY(lx));
    }

    // Lake
    const lakeG = scene.add.graphics().setDepth(-8);
    lakeG.fillStyle(0x64B5F6, 0.3);
    lakeG.fillEllipse(zone.startX + width * 0.7, 280, 180, 35);
}

// === KANSAS CITY CORPORATE (Cerner) ===
function drawKansasCityCorporate(scene, zone, rng) {
    const width = zone.endX - zone.startX;

    // Decorative glass office towers (no branding)
    for (let i = 0; i < 3; i++) {
        const bx = zone.startX + 300 + i * (width / 3.5);
        const gy = getTerrainY(bx);
        const bw = rng.between(90, 130);
        const bh = rng.between(160, 230);
        drawGlassTower(scene, bx, gy, bw, bh, 0x546E7A, 0x90CAF9);
    }

    // Parking garage
    const pgX = zone.startX + width * 0.2;
    const pgY = getTerrainY(pgX);
    const pg = scene.add.graphics().setDepth(-6);
    pg.fillStyle(0x9E9E9E);
    pg.fillRect(pgX - 50, pgY - 60, 100, 60);
    for (let f = 0; f < 3; f++) {
        pg.fillStyle(0x757575);
        pg.fillRect(pgX - 50, pgY - 60 + f * 20, 100, 2);
    }
    pg.fillStyle(0x616161);
    pg.fillRect(pgX - 50, pgY - 62, 100, 4);

    // Fountain
    const ftnX = zone.startX + width * 0.5;
    const ftnY = getTerrainY(ftnX);
    const ftnG = scene.add.graphics().setDepth(-3);
    ftnG.fillStyle(0x78909C);
    ftnG.fillEllipse(ftnX, ftnY - 5, 50, 12);
    ftnG.fillRect(ftnX - 3, ftnY - 25, 6, 20);
    ftnG.fillStyle(0x64B5F6, 0.5);
    ftnG.fillEllipse(ftnX, ftnY - 25, 18, 6);
    ftnG.lineStyle(1, 0x90CAF9, 0.4);
    ftnG.lineBetween(ftnX, ftnY - 25, ftnX - 8, ftnY - 12);
    ftnG.lineBetween(ftnX, ftnY - 25, ftnX + 8, ftnY - 12);
    ftnG.lineBetween(ftnX, ftnY - 25, ftnX, ftnY - 12);

    // Corporate park benches
    for (let i = 0; i < 3; i++) {
        drawBench(scene, zone.startX + 500 + i * 800, getTerrainY(zone.startX + 500 + i * 800));
    }

    // Trimmed hedges
    for (let i = 0; i < 8; i++) {
        const hx = zone.startX + 200 + i * (width / 8);
        const hy = getTerrainY(hx);
        const hg = scene.add.graphics().setDepth(-3);
        hg.fillStyle(0x2E7D32, 0.8);
        hg.fillRoundedRect(hx - 15, hy - 18, 30, 18, 6);
    }

    // Street lights
    for (let i = 0; i < 8; i++) {
        const lx = zone.startX + 150 + i * (width / 8);
        drawStreetLight(scene, lx, getTerrainY(lx));
    }
}

function drawGlassTower(scene, x, groundY, w, h, bodyColor, windowColor) {
    const g = scene.add.graphics().setDepth(-6);
    g.fillStyle(bodyColor);
    g.fillRect(x - w / 2, groundY - h, w, h);
    // Glass panel grid
    const cols = Math.floor(w / 18);
    const rows = Math.floor(h / 20);
    g.fillStyle(windowColor, 0.3);
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            g.fillRect(x - w / 2 + 4 + c * 18, groundY - h + 4 + r * 20, 14, 16);
    // Glass reflections (diagonal highlights)
    g.fillStyle(0xFFFFFF, 0.06);
    g.fillRect(x - w / 2, groundY - h, w / 3, h);
    // Roof cap
    g.fillStyle(0x37474F);
    g.fillRect(x - w / 2, groundY - h - 4, w, 6);
    // Antenna for tall ones
    if (h > 180) {
        g.lineStyle(2, 0x78909C);
        g.lineBetween(x, groundY - h - 4, x, groundY - h - 28);
        g.fillStyle(0xE0E0E0);
        g.fillCircle(x, groundY - h - 28, 3);
    }
}

// === ORACLE TECH HUB ===
function drawOracleTechHub(scene, zone, rng) {
    const width = zone.endX - zone.startX;

    // Decorative dark glass towers (no branding)
    for (let i = 0; i < 3; i++) {
        const bx = zone.startX + 250 + i * (width / 3.5);
        const gy = getTerrainY(bx);
        const bw = rng.between(80, 120);
        const bh = rng.between(190, 260);
        drawGlassTower(scene, bx, gy, bw, bh, 0x263238, 0xE74C3C);
    }

    // Data center motif
    const dcX = zone.startX + width * 0.25;
    const dcY = getTerrainY(dcX);
    const dcG = scene.add.graphics().setDepth(-4);
    dcG.fillStyle(0x37474F);
    dcG.fillRect(dcX - 30, dcY - 60, 60, 60);
    for (let r = 0; r < 5; r++) {
        dcG.fillStyle(0x4FC3F7, 0.3);
        dcG.fillRect(dcX - 25, dcY - 55 + r * 11, 50, 8);
        dcG.fillStyle(0x4CAF50, 0.8);
        dcG.fillCircle(dcX + 20, dcY - 51 + r * 11, 2);
    }

    // Corporate plaza (flat area in front)
    const plazaX = zone.startX + width * 0.6;
    const plazaY = getTerrainY(plazaX);
    const plG = scene.add.graphics().setDepth(-3);
    plG.fillStyle(0x78909C, 0.2);
    plG.fillEllipse(plazaX, plazaY - 3, 120, 12);
    // Sculpture
    plG.fillStyle(0xBDBDBD);
    plG.fillRect(plazaX - 3, plazaY - 35, 6, 32);
    plG.fillStyle(0x90A4AE);
    plG.fillCircle(plazaX, plazaY - 40, 10);

    // Street lights
    for (let i = 0; i < 6; i++) {
        const lx = zone.startX + 150 + i * (width / 6);
        drawStreetLight(scene, lx, getTerrainY(lx));
    }

    // Sparse modern trees
    for (let i = 0; i < 4; i++) {
        const tx = zone.startX + rng.between(100, width - 100);
        drawNormalTree(scene, tx, getTerrainY(tx), rng);
    }
}

// === HOBBY PARK ===
function drawHobbyPark(scene, zone, rng) {
    const width = zone.endX - zone.startX;

    // Colorful flower beds
    const flowerColors = [0xE91E63, 0xFFEB3B, 0x9C27B0, 0xFF5722, 0x4CAF50, 0x03A9F4];
    for (let i = 0; i < 20; i++) {
        const fx = zone.startX + rng.between(50, width - 50);
        const fy = getTerrainY(fx);
        const fg = scene.add.graphics().setDepth(-2);
        const c = flowerColors[i % flowerColors.length];
        fg.fillStyle(c, 0.8);
        fg.fillCircle(fx, fy - 6, 4);
        fg.fillCircle(fx - 4, fy - 3, 3);
        fg.fillCircle(fx + 4, fy - 3, 3);
        fg.fillStyle(0x4CAF50);
        fg.fillRect(fx - 1, fy - 3, 2, 6);
    }

    // Park trees (varied)
    for (let i = 0; i < 10; i++) {
        const tx = zone.startX + rng.between(60, width - 60);
        drawNormalTree(scene, tx, getTerrainY(tx), rng);
    }

    // Park benches
    for (let i = 0; i < 5; i++) {
        const bx = zone.startX + 300 + i * (width / 5);
        drawBench(scene, bx, getTerrainY(bx));
    }

    // Lamp posts
    for (let i = 0; i < 6; i++) {
        const lx = zone.startX + 200 + i * (width / 6);
        drawLampPost(scene, lx, getTerrainY(lx));
    }

    // Decorative fence segments
    const fenceG = scene.add.graphics().setDepth(-2);
    fenceG.lineStyle(1.5, 0x795548, 0.5);
    for (let i = 0; i < 8; i++) {
        const fx = zone.startX + 150 + i * (width / 8);
        const fy = getTerrainY(fx);
        // Fence posts
        fenceG.fillStyle(0x795548, 0.5);
        fenceG.fillRect(fx, fy - 20, 3, 20);
        fenceG.fillRect(fx + 30, fy - 20, 3, 20);
        // Fence rail
        fenceG.lineBetween(fx, fy - 16, fx + 33, fy - 16);
        fenceG.lineBetween(fx, fy - 8, fx + 33, fy - 8);
    }

    // Butterflies (small animated-looking shapes)
    for (let i = 0; i < 6; i++) {
        const bx = zone.startX + rng.between(100, width - 100);
        const by = rng.between(200, 400);
        const bg = scene.add.graphics().setDepth(-1);
        const bc = flowerColors[i % flowerColors.length];
        bg.fillStyle(bc, 0.6);
        bg.fillEllipse(bx - 5, by - 2, 8, 6);
        bg.fillEllipse(bx + 5, by - 2, 8, 6);
        bg.fillStyle(0x212121);
        bg.fillRect(bx - 1, by - 4, 2, 8);
    }
}

// === SHARED DECORATIVE ELEMENTS ===

function drawNormalTree(scene, x, groundY, rng) {
    const g = scene.add.graphics();
    g.setDepth(-3);
    const h = rng.between(50, 80);
    g.fillStyle(0x6D4C41);
    g.fillRect(x - 4, groundY - h + 20, 8, h - 20);
    g.fillStyle(0x4CAF50);
    g.fillCircle(x, groundY - h + 10, 22);
    g.fillStyle(0x388E3C);
    g.fillCircle(x - 8, groundY - h + 22, 16);
    g.fillCircle(x + 8, groundY - h + 22, 16);
}

function drawFallTree(scene, x, groundY, color) {
    const g = scene.add.graphics();
    g.setDepth(-3);
    g.fillStyle(0x5D4037);
    g.fillRect(x - 4, groundY - 60, 8, 60);
    g.fillStyle(color);
    g.fillCircle(x, groundY - 70, 24);
    g.fillCircle(x - 12, groundY - 55, 18);
    g.fillCircle(x + 12, groundY - 55, 18);
    g.fillStyle(color, 0.5);
    g.fillCircle(x - 15, groundY - 3, 3);
    g.fillCircle(x + 20, groundY - 2, 2);
}

function drawLampPost(scene, x, groundY) {
    const g = scene.add.graphics();
    g.setDepth(-2);
    g.fillStyle(0x37474F);
    g.fillRect(x - 2, groundY - 70, 4, 70);
    g.fillStyle(0x37474F);
    g.fillRect(x - 8, groundY - 72, 16, 4);
    g.fillStyle(0xFFF9C4, 0.3);
    g.fillCircle(x, groundY - 70, 15);
    g.fillStyle(0xFDD835);
    g.fillCircle(x, groundY - 73, 4);
}

function drawStreetLight(scene, x, groundY) {
    const g = scene.add.graphics();
    g.setDepth(-2);
    g.fillStyle(0x546E7A);
    g.fillRect(x - 2, groundY - 80, 4, 80);
    g.fillStyle(0x546E7A);
    g.fillRect(x, groundY - 82, 20, 3);
    g.fillStyle(0xFFF176, 0.4);
    g.fillEllipse(x + 18, groundY - 75, 20, 30);
    g.fillStyle(0xFDD835);
    g.fillCircle(x + 18, groundY - 82, 4);
}

function drawBench(scene, x, groundY) {
    const g = scene.add.graphics();
    g.setDepth(-2);
    g.fillStyle(0x795548);
    g.fillRoundedRect(x - 20, groundY - 18, 40, 6, 2);
    g.fillStyle(0x5D4037);
    g.fillRect(x - 16, groundY - 12, 4, 12);
    g.fillRect(x + 12, groundY - 12, 4, 12);
    g.fillStyle(0x795548);
    g.fillRoundedRect(x - 18, groundY - 32, 4, 18, 2);
    g.fillRoundedRect(x + 14, groundY - 32, 4, 18, 2);
    g.fillRoundedRect(x - 18, groundY - 32, 36, 4, 2);
}
