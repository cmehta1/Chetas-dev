import Phaser from 'phaser';
import { GAME_HEIGHT, GROUND_Y, TERRAIN, getTerrainY } from '../config/constants';

/**
 * Creates rich, detailed backgrounds for each zone.
 */
export function renderZoneBackground(scene, zone) {
    const width = zone.endX - zone.startX;
    const cx = zone.startX + width / 2;

    // === SKY GRADIENT ===
    const skyGfx = scene.add.graphics();
    skyGfx.setDepth(-20);
    const steps = 40;
    const topColor = Phaser.Display.Color.IntegerToColor(zone.skyTop);
    const bottomColor = Phaser.Display.Color.IntegerToColor(zone.skyBottom);
    for (let i = 0; i < steps; i++) {
        const t = i / steps;
        const color = Phaser.Display.Color.Interpolate.ColorWithColor(topColor, bottomColor, 100, Math.floor(t * 100));
        const hexColor = Phaser.Display.Color.GetColor(color.r, color.g, color.b);
        const bandHeight = GROUND_Y / steps + 1;
        skyGfx.fillStyle(hexColor);
        skyGfx.fillRect(zone.startX, i * bandHeight, width, bandHeight + 1);
    }

    // === CELESTIAL BODY (sun/moon) ===
    if (zone.theme === 'flight' || zone.theme === 'oracle-tech') {
        drawMoon(scene, zone.startX + width * 0.8, 80, zone);
        drawStarryNight(scene, zone);
    } else {
        drawSun(scene, zone.startX + width * 0.75, 70, zone);
    }

    // === CLOUDS ===
    const rng = new Phaser.Math.RandomDataGenerator([`bg${zone.id}`]);
    const numClouds = zone.isCutscene ? 12 : 5;
    for (let i = 0; i < numClouds; i++) {
        const cx2 = zone.startX + rng.between(50, width - 50);
        const cy = rng.between(40, 200);
        drawCloud(scene, cx2, cy, rng.between(60, 140), zone);
    }

    // === GROUND (terrain-following) ===
    drawGround(scene, zone);

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
    const g = scene.add.graphics();
    g.setDepth(-18);
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
}

function drawMoon(scene, x, y, zone) {
    const g = scene.add.graphics();
    g.setDepth(-18);
    g.fillStyle(0xECEFF1, 0.2);
    g.fillCircle(x, y, 40);
    g.fillStyle(0xECEFF1);
    g.fillCircle(x, y, 18);
    g.fillStyle(zone.skyTop);
    g.fillCircle(x + 6, y - 3, 14);
}

function drawStarryNight(scene, zone) {
    const g = scene.add.graphics();
    g.setDepth(-19);
    const rng = new Phaser.Math.RandomDataGenerator([`stars${zone.id}`]);
    for (let i = 0; i < 30; i++) {
        const sx = zone.startX + rng.between(20, zone.endX - zone.startX - 20);
        const sy = rng.between(10, 250);
        const size = rng.between(1, 3);
        g.fillStyle(0xFFFFFF, rng.realInRange(0.3, 0.9));
        g.fillCircle(sx, sy, size);
    }
}

function drawCloud(scene, x, y, width, zone) {
    const g = scene.add.graphics();
    g.setDepth(-15);
    const alpha = zone.isCutscene ? 0.9 : 0.6;
    g.fillStyle(0xFFFFFF, alpha);
    g.fillEllipse(x, y, width, width * 0.35);
    g.fillEllipse(x - width * 0.2, y + 5, width * 0.5, width * 0.25);
    g.fillEllipse(x + width * 0.25, y + 3, width * 0.4, width * 0.22);
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
    const g = scene.add.graphics();
    g.setDepth(-5);

    const houseColors = [0xE74C3C, 0xF39C12, 0x3498DB, 0xE91E63, 0x9C27B0, 0xFF9800];
    for (let i = 0; i < 5; i++) {
        const hx = zone.startX + 150 + i * 300;
        const hw = rng.between(70, 110);
        const hh = rng.between(80, 140);
        const gy = getTerrainY(hx);
        const color = houseColors[i % houseColors.length];
        drawColorfulHouse(g, hx, gy, hw, hh, color);
    }

    drawTemple(g, zone.startX + zone.endX - zone.startX - 300, getTerrainY(zone.endX - 300));

    for (let i = 0; i < 4; i++) {
        const tx = zone.startX + rng.between(80, zone.endX - zone.startX - 80);
        drawBanyanTree(scene, tx, getTerrainY(tx));
    }

    drawAutoRickshaw(scene, zone.startX + 600, getTerrainY(zone.startX + 600) + 5);
}

function drawColorfulHouse(g, x, groundY, w, h, color) {
    g.fillStyle(color);
    g.fillRect(x - w / 2, groundY - h, w, h);
    g.fillStyle(0x795548);
    g.fillTriangle(x - w / 2 - 10, groundY - h, x + w / 2 + 10, groundY - h, x, groundY - h - 30);
    g.fillStyle(0x5D4037);
    g.fillRoundedRect(x - 10, groundY - 35, 20, 35, { tl: 10, tr: 10, bl: 0, br: 0 });
    g.fillStyle(0xFFF9C4);
    g.fillRoundedRect(x - w / 2 + 8, groundY - h + 15, 15, 20, { tl: 8, tr: 8, bl: 0, br: 0 });
    g.fillRoundedRect(x + w / 2 - 23, groundY - h + 15, 15, 20, { tl: 8, tr: 8, bl: 0, br: 0 });
}

function drawTemple(g, x, groundY) {
    g.fillStyle(0xFFCC80);
    g.fillRect(x - 40, groundY - 100, 80, 100);
    g.fillStyle(0xFFB74D);
    for (let s = 0; s < 3; s++) {
        g.fillRect(x - 45 - s * 5, groundY - 5 - s * 8, 90 + s * 10, 8);
    }
    g.fillStyle(0xFFCC80);
    g.fillTriangle(x - 25, groundY - 100, x + 25, groundY - 100, x, groundY - 170);
    g.fillStyle(0xFFA726);
    g.fillCircle(x, groundY - 170, 10);
    g.fillStyle(0xFF5722);
    g.fillTriangle(x, groundY - 180, x, groundY - 195, x + 18, groundY - 188);
    g.lineStyle(1.5, 0x795548);
    g.lineBetween(x, groundY - 180, x, groundY - 200);
    g.fillStyle(0x4E342E);
    g.fillRoundedRect(x - 10, groundY - 70, 20, 30, { tl: 10, tr: 10, bl: 0, br: 0 });
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
    for (let i = 0; i < 3; i++) {
        const bx = zone.startX + 300 + i * 600;
        drawSchoolBuilding(scene, bx, getTerrainY(bx), rng);
    }
    drawPlayground(scene, zone.startX + 1500, getTerrainY(zone.startX + 1500));
    for (let i = 0; i < 5; i++) {
        const tx = zone.startX + rng.between(80, zone.endX - zone.startX - 200);
        drawNormalTree(scene, tx, getTerrainY(tx), rng);
    }
}

function drawSchoolBuilding(scene, x, groundY, rng) {
    const g = scene.add.graphics();
    g.setDepth(-5);
    const w = 120;
    const h = 100;
    g.fillStyle(0xFFF8E1);
    g.fillRect(x - w / 2, groundY - h, w, h);
    g.fillStyle(0xBF360C);
    g.fillRect(x - w / 2 - 5, groundY - h - 8, w + 10, 10);
    g.fillStyle(0x81D4FA);
    for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 3; c++) {
            g.fillRect(x - 45 + c * 35, groundY - h + 15 + r * 35, 20, 22);
            g.lineStyle(1, 0x5D4037);
            g.strokeRect(x - 45 + c * 35, groundY - h + 15 + r * 35, 20, 22);
            g.lineBetween(x - 45 + c * 35 + 10, groundY - h + 15 + r * 35, x - 45 + c * 35 + 10, groundY - h + 37 + r * 35);
        }
    }
    g.fillStyle(0x4E342E);
    g.fillRoundedRect(x - 12, groundY - 40, 24, 40, { tl: 12, tr: 12, bl: 0, br: 0 });
}

function drawPlayground(scene, x, groundY) {
    const g = scene.add.graphics();
    g.setDepth(-4);
    g.lineStyle(3, 0x616161);
    g.lineBetween(x - 20, groundY, x - 10, groundY - 50);
    g.lineBetween(x + 20, groundY, x + 10, groundY - 50);
    g.lineBetween(x - 10, groundY - 50, x + 10, groundY - 50);
    g.lineStyle(1.5, 0x795548);
    g.lineBetween(x, groundY - 50, x - 5, groundY - 15);
    g.lineBetween(x, groundY - 50, x + 5, groundY - 15);
    g.fillStyle(0x795548);
    g.fillRect(x - 8, groundY - 15, 16, 4);
}

// === INDIAN COLLEGE ===
function drawIndianCollege(scene, zone, rng) {
    for (let i = 0; i < 3; i++) {
        const bx = zone.startX + 400 + i * 800;
        drawCollegeBuilding(scene, bx, getTerrainY(bx), i);
    }
    for (let i = 0; i < 6; i++) {
        const tx = zone.startX + rng.between(100, zone.endX - zone.startX - 200);
        drawNormalTree(scene, tx, getTerrainY(tx), rng);
    }
    drawBench(scene, zone.startX + 1200, getTerrainY(zone.startX + 1200));
    drawBench(scene, zone.startX + 2200, getTerrainY(zone.startX + 2200));
}

function drawCollegeBuilding(scene, x, groundY, variant) {
    const g = scene.add.graphics();
    g.setDepth(-5);
    const w = 160;
    const h = 130 + variant * 20;
    const colors = [0xE8EAF6, 0xFFF3E0, 0xE0F2F1];
    g.fillStyle(colors[variant % colors.length]);
    g.fillRect(x - w / 2, groundY - h, w, h);
    g.fillStyle(0xBDBDBD);
    for (let p = 0; p < 4; p++) {
        g.fillRect(x - w / 2 + 10 + p * 45, groundY - h, 8, h);
    }
    g.fillStyle(0x90CAF9);
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 4; c++) {
            g.fillRect(x - w / 2 + 22 + c * 38, groundY - h + 15 + r * 38, 18, 24);
        }
    }
    g.fillStyle(0x5D4037);
    g.fillRoundedRect(x - 15, groundY - 50, 30, 50, { tl: 15, tr: 15, bl: 0, br: 0 });
}

// === FLIGHT SCENE ===
function drawFlightScene(scene, zone, rng) {
    const cx = zone.startX + (zone.endX - zone.startX) / 2;

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

    const earth = scene.add.graphics();
    earth.setDepth(-8);
    earth.fillStyle(0x4CAF50, 0.3);
    earth.fillEllipse(cx, GROUND_Y + 200, zone.endX - zone.startX + 200, 300);
    earth.fillStyle(0x2196F3, 0.2);
    earth.fillEllipse(cx + 200, GROUND_Y + 220, 400, 250);

    const indiaLabel = scene.add.text(zone.startX + 100, 420, 'INDIA', {
        fontFamily: 'Arial', fontSize: '24px', color: '#ffffff', stroke: '#000000', strokeThickness: 2,
    });
    indiaLabel.setAlpha(0.5).setDepth(-1);

    const usaLabel = scene.add.text(zone.endX - 200, 420, 'USA', {
        fontFamily: 'Arial', fontSize: '24px', color: '#ffffff', stroke: '#000000', strokeThickness: 2,
    });
    usaLabel.setAlpha(0.5).setDepth(-1);

    const path = scene.add.graphics();
    path.setDepth(-3);
    path.lineStyle(2, 0xFFFFFF, 0.3);
    for (let d = 0; d < 20; d++) {
        const dx = zone.startX + 100 + d * ((zone.endX - zone.startX - 200) / 20);
        const dy = 380 - Math.sin(d / 20 * Math.PI) * 100;
        if (d > 0) {
            const pdx = zone.startX + 100 + (d - 1) * ((zone.endX - zone.startX - 200) / 20);
            const pdy = 380 - Math.sin((d - 1) / 20 * Math.PI) * 100;
            path.lineBetween(pdx, pdy, dx, dy);
        }
    }
}

// === US CAMPUS ===
function drawUSCampus(scene, zone, rng) {
    for (let i = 0; i < 4; i++) {
        const bx = zone.startX + 300 + i * 650;
        drawAmericanBuilding(scene, bx, getTerrainY(bx), rng, i);
    }
    const fallColors = [0xE65100, 0xBF360C, 0xF57F17, 0xFF6F00, 0xD84315];
    for (let i = 0; i < 7; i++) {
        const tx = zone.startX + rng.between(80, zone.endX - zone.startX - 200);
        drawFallTree(scene, tx, getTerrainY(tx), fallColors[i % fallColors.length]);
    }
    for (let i = 0; i < 4; i++) {
        const lx = zone.startX + 200 + i * 600;
        drawLampPost(scene, lx, getTerrainY(lx));
    }
    drawBench(scene, zone.startX + 800, getTerrainY(zone.startX + 800));
    drawBench(scene, zone.startX + 1800, getTerrainY(zone.startX + 1800));
}

function drawAmericanBuilding(scene, x, groundY, rng, variant) {
    const g = scene.add.graphics();
    g.setDepth(-5);
    const w = 130 + variant * 15;
    const h = 110 + variant * 20;
    g.fillStyle(0x8D6E63);
    g.fillRect(x - w / 2, groundY - h, w, h);
    g.lineStyle(0.5, 0x6D4C41, 0.3);
    for (let r = 0; r < h / 12; r++) {
        g.lineBetween(x - w / 2, groundY - h + r * 12, x + w / 2, groundY - h + r * 12);
        const offset = r % 2 === 0 ? 0 : 15;
        for (let c = 0; c < w / 30; c++) {
            g.lineBetween(x - w / 2 + c * 30 + offset, groundY - h + r * 12, x - w / 2 + c * 30 + offset, groundY - h + (r + 1) * 12);
        }
    }
    g.fillStyle(0xECEFF1);
    g.fillRect(x - w / 2 - 3, groundY - h - 5, w + 6, 8);
    g.fillStyle(0xFFF9C4);
    for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 3; c++) {
            const wx = x - w / 2 + 20 + c * (w / 3 - 5);
            const wy = groundY - h + 20 + r * 45;
            g.fillRect(wx, wy, 22, 30);
            g.lineStyle(1.5, 0xECEFF1);
            g.strokeRect(wx, wy, 22, 30);
            g.lineBetween(wx + 11, wy, wx + 11, wy + 30);
            g.lineBetween(wx, wy + 15, wx + 22, wy + 15);
        }
    }
    g.fillStyle(0x3E2723);
    g.fillRoundedRect(x - 12, groundY - 45, 24, 45, { tl: 12, tr: 12, bl: 0, br: 0 });
    g.fillStyle(0xBDBDBD);
    g.fillRect(x - 20, groundY - 5, 40, 5);
}

// === MICHIGAN OFFICE (Midway Dental Supply) ===
function drawMichiganOffice(scene, zone, rng) {
    // Suburban Michigan: brick office, residential houses, parking lot, trees
    const width = zone.endX - zone.startX;

    // Small brick office buildings
    for (let i = 0; i < 3; i++) {
        const bx = zone.startX + 250 + i * (width / 3 - 50);
        const gy = getTerrainY(bx);
        const g = scene.add.graphics().setDepth(-5);
        const bw = rng.between(80, 110);
        const bh = rng.between(70, 100);
        // Brick body
        g.fillStyle(0x8D4E3C);
        g.fillRect(bx - bw / 2, gy - bh, bw, bh);
        // Brick texture
        g.lineStyle(0.5, 0x6D3A2E, 0.3);
        for (let r = 0; r < bh / 8; r++) {
            g.lineBetween(bx - bw / 2, gy - bh + r * 8, bx + bw / 2, gy - bh + r * 8);
            const offset = r % 2 === 0 ? 0 : 12;
            for (let c = 0; c < bw / 24; c++)
                g.lineBetween(bx - bw / 2 + c * 24 + offset, gy - bh + r * 8, bx - bw / 2 + c * 24 + offset, gy - bh + (r + 1) * 8);
        }
        // Windows
        g.fillStyle(0xB3E5FC, 0.7);
        for (let c = 0; c < 3; c++) {
            g.fillRect(bx - bw / 2 + 12 + c * (bw / 3), gy - bh + 15, 18, 22);
        }
        // Roof
        g.fillStyle(0x5D4037);
        g.fillRect(bx - bw / 2 - 3, gy - bh - 5, bw + 6, 7);
    }

    // Residential houses
    for (let i = 0; i < 4; i++) {
        const hx = zone.startX + 150 + i * (width / 4);
        const gy = getTerrainY(hx);
        const g = scene.add.graphics().setDepth(-6);
        const hw = 60, hh = 50;
        const colors = [0xE8D5B7, 0xD7CCC8, 0xBCAAA4, 0xF5F5DC];
        g.fillStyle(colors[i % 4]);
        g.fillRect(hx - hw / 2, gy - hh, hw, hh);
        // Roof
        g.fillStyle(0x5D4037);
        g.fillTriangle(hx - hw / 2 - 8, gy - hh, hx + hw / 2 + 8, gy - hh, hx, gy - hh - 28);
        // Door
        g.fillStyle(0x3E2723);
        g.fillRoundedRect(hx - 7, gy - 28, 14, 28, { tl: 7, tr: 7, bl: 0, br: 0 });
        // Window
        g.fillStyle(0xFFF9C4);
        g.fillRect(hx - 22, gy - hh + 12, 14, 16);
        g.fillRect(hx + 8, gy - hh + 12, 14, 16);
    }

    // Parking lot
    const parkX = zone.startX + width / 2;
    const parkY = getTerrainY(parkX);
    const parkG = scene.add.graphics().setDepth(-3);
    parkG.fillStyle(0x424242, 0.4);
    parkG.fillRect(parkX - 60, parkY + 5, 120, 15);
    parkG.lineStyle(1, 0xFFFFFF, 0.3);
    for (let i = 0; i < 5; i++) parkG.lineBetween(parkX - 50 + i * 25, parkY + 5, parkX - 50 + i * 25, parkY + 20);

    // Trees (deciduous)
    for (let i = 0; i < 6; i++) {
        const tx = zone.startX + rng.between(50, width - 50);
        drawNormalTree(scene, tx, getTerrainY(tx), rng);
    }

    // Street lights
    for (let i = 0; i < 4; i++) {
        const lx = zone.startX + 200 + i * (width / 4);
        drawStreetLight(scene, lx, getTerrainY(lx));
    }

    // Lake in background
    const lakeG = scene.add.graphics().setDepth(-8);
    lakeG.fillStyle(0x64B5F6, 0.3);
    lakeG.fillEllipse(zone.startX + width * 0.7, 280, 200, 40);
    lakeG.fillStyle(0xFFFFFF, 0.1);
    lakeG.fillEllipse(zone.startX + width * 0.7 - 20, 276, 60, 8);
}

// === KANSAS CITY CORPORATE (Cerner) ===
function drawKansasCityCorporate(scene, zone, rng) {
    const width = zone.endX - zone.startX;

    // Large glass corporate buildings
    for (let i = 0; i < 4; i++) {
        const bx = zone.startX + 300 + i * (width / 4 - 20);
        const gy = getTerrainY(bx);
        const bw = rng.between(80, 120);
        const bh = rng.between(160, 240);
        const g = scene.add.graphics().setDepth(-6);

        // Glass body
        g.fillStyle(0x546E7A);
        g.fillRect(bx - bw / 2, gy - bh, bw, bh);
        // Glass panels
        g.fillStyle(0x90CAF9, 0.35);
        const cols = Math.floor(bw / 16);
        const rows = Math.floor(bh / 20);
        for (let r = 0; r < rows; r++)
            for (let c = 0; c < cols; c++)
                g.fillRect(bx - bw / 2 + 4 + c * 16, gy - bh + 4 + r * 20, 12, 16);
        // Roof cap
        g.fillStyle(0x37474F);
        g.fillRect(bx - bw / 2, gy - bh - 4, bw, 6);
    }

    // Healthcare cross on main building
    const crossX = zone.startX + width / 2;
    const crossY = getTerrainY(crossX) - 200;
    const crossG = scene.add.graphics().setDepth(-5);
    crossG.fillStyle(0x4CAF50, 0.8);
    crossG.fillRect(crossX - 4, crossY - 12, 8, 24);
    crossG.fillRect(crossX - 12, crossY - 4, 24, 8);

    // Fountain
    const ftnX = zone.startX + width * 0.4;
    const ftnY = getTerrainY(ftnX);
    const ftnG = scene.add.graphics().setDepth(-3);
    ftnG.fillStyle(0x78909C);
    ftnG.fillEllipse(ftnX, ftnY - 5, 50, 12);
    ftnG.fillRect(ftnX - 3, ftnY - 25, 6, 20);
    ftnG.fillStyle(0x64B5F6, 0.5);
    ftnG.fillEllipse(ftnX, ftnY - 25, 18, 6);
    // Water spray
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

// === ORACLE TECH HUB ===
function drawOracleTechHub(scene, zone, rng) {
    const width = zone.endX - zone.startX;

    // Futuristic glass towers with red Oracle accents
    for (let i = 0; i < 4; i++) {
        const bx = zone.startX + 250 + i * (width / 4 - 30);
        const gy = getTerrainY(bx);
        const bw = rng.between(70, 110);
        const bh = rng.between(180, 280);
        const g = scene.add.graphics().setDepth(-6);

        // Dark sleek body
        g.fillStyle(0x263238);
        g.fillRect(bx - bw / 2, gy - bh, bw, bh);
        // Red accent windows
        g.fillStyle(0xE74C3C, 0.35);
        const cols = Math.floor(bw / 16);
        const rows = Math.floor(bh / 20);
        for (let r = 0; r < rows; r++)
            for (let c = 0; c < cols; c++)
                g.fillRect(bx - bw / 2 + 4 + c * 16, gy - bh + 4 + r * 20, 12, 16);
        // Red accent strip
        g.fillStyle(0xC62828, 0.8);
        g.fillRect(bx - bw / 2, gy - bh, 3, bh);
        g.fillRect(bx + bw / 2 - 3, gy - bh, 3, bh);
        // Roof
        g.fillStyle(0x1A237E);
        g.fillRect(bx - bw / 2, gy - bh - 5, bw, 7);
        // Antenna
        if (bh > 220) {
            g.lineStyle(2, 0x78909C);
            g.lineBetween(bx, gy - bh - 5, bx, gy - bh - 35);
            g.fillStyle(0xF44336);
            g.fillCircle(bx, gy - bh - 35, 3);
        }
    }

    // Oracle red "O" logo on tallest building
    const logoX = zone.startX + width * 0.6;
    const logoY = getTerrainY(logoX) - 230;
    const logoG = scene.add.graphics().setDepth(-5);
    logoG.lineStyle(4, 0xC62828, 0.9);
    logoG.strokeCircle(logoX, logoY, 14);

    // Data center motif — server rack hints
    const dcX = zone.startX + width * 0.3;
    const dcY = getTerrainY(dcX);
    const dcG = scene.add.graphics().setDepth(-4);
    dcG.fillStyle(0x37474F);
    dcG.fillRect(dcX - 30, dcY - 60, 60, 60);
    for (let r = 0; r < 5; r++) {
        dcG.fillStyle(0x4FC3F7, 0.3);
        dcG.fillRect(dcX - 25, dcY - 55 + r * 11, 50, 8);
        // LED dots
        dcG.fillStyle(0x4CAF50, 0.8);
        dcG.fillCircle(dcX + 20, dcY - 51 + r * 11, 2);
    }

    // Rooftop garden on one building
    const gardenX = zone.startX + width * 0.5;
    const gardenY = getTerrainY(gardenX) - 200;
    const gardenG = scene.add.graphics().setDepth(-5);
    gardenG.fillStyle(0x4CAF50, 0.6);
    gardenG.fillRoundedRect(gardenX - 25, gardenY - 8, 50, 8, 4);
    gardenG.fillStyle(0x2E7D32, 0.5);
    for (let t = 0; t < 3; t++) {
        gardenG.fillCircle(gardenX - 15 + t * 15, gardenY - 14, 8);
    }

    // Street lights (modern style)
    for (let i = 0; i < 6; i++) {
        const lx = zone.startX + 150 + i * (width / 6);
        drawStreetLight(scene, lx, getTerrainY(lx));
    }

    // Sparse modern trees
    for (let i = 0; i < 3; i++) {
        const tx = zone.startX + rng.between(100, width - 100);
        drawNormalTree(scene, tx, getTerrainY(tx), rng);
    }
}

function drawModernBuilding(scene, x, groundY, w, h, rng, isOracle) {
    const g = scene.add.graphics();
    g.setDepth(-6);
    const baseColor = isOracle ? 0x37474F : 0x455A64;
    g.fillStyle(baseColor);
    g.fillRect(x - w / 2, groundY - h, w, h);
    const windowColor = isOracle ? 0xE74C3C : 0x90CAF9;
    g.fillStyle(windowColor, 0.4);
    const cols = Math.floor(w / 18);
    const rows = Math.floor(h / 22);
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            g.fillRect(x - w / 2 + 6 + c * 18, groundY - h + 6 + r * 22, 12, 16);
        }
    }
    g.fillStyle(0x263238);
    g.fillRect(x - w / 2, groundY - h - 4, w, 6);
    if (h > 180) {
        g.lineStyle(2, 0x78909C);
        g.lineBetween(x, groundY - h - 4, x, groundY - h - 25);
        g.fillStyle(0xF44336);
        g.fillCircle(x, groundY - h - 25, 3);
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
