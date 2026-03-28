/**
 * Bigger, rotation-based animated character inspired by Leonardi's interactive resume.
 * ~40% larger proportions, pivot-based limb animation, expressive face.
 */
export function createCharacter(scene, stage) {
    const c = scene.add.container(0, 0);

    const SKIN = 0xC68642;
    const SKIN_HI = 0xD4A06A;
    const SKIN_SH = 0xAA7030;
    const HAIR = 0x1A1A1A;
    const WHITE = 0xFFFFFF;
    const BLACK = 0x111111;

    const outfits = {
        1: { shirt: 0xE53935, shirtHi: 0xEF5350, pants: 0x5D4037, pantsHi: 0x6D4C41, shoe: 0x4E342E },
        2: { shirt: 0xFAFAFA, shirtHi: 0xFFFFFF, pants: 0x263238, pantsHi: 0x37474F, shoe: 0x212121 },
        3: { shirt: 0x1E88E5, shirtHi: 0x42A5F5, pants: 0x37474F, pantsHi: 0x455A64, shoe: 0x3E2723 },
        4: { shirt: 0x2E7D32, shirtHi: 0x43A047, pants: 0x37474F, pantsHi: 0x455A64, shoe: 0x4E342E },
        5: { shirt: 0x1565C0, shirtHi: 0x1E88E5, pants: 0x212121, pantsHi: 0x333333, shoe: 0x1A1A1A },
        6: { shirt: 0xC62828, shirtHi: 0xE53935, pants: 0x1A1A2E, pantsHi: 0x252540, shoe: 0x111111 },
    };
    const o = outfits[stage] || outfits[1];

    // ── SHADOW ──
    c.add(scene.add.ellipse(0, 78, 50, 14, 0x000000, 0.18));

    // ── LEGS (pivot at hip — rotation-based animation) ──
    const legH = 33, legW = 18;
    const leftLegC = scene.add.container(-10, 40);
    const llg = scene.add.graphics();
    llg.fillStyle(o.pants); llg.fillRoundedRect(-legW / 2, 0, legW, legH, 4);
    llg.fillStyle(o.pantsHi, 0.3); llg.fillRect(-legW / 2, 0, 5, legH);
    leftLegC.add(llg);
    const lsh = scene.add.graphics();
    lsh.fillStyle(o.shoe); lsh.fillRoundedRect(-11, legH - 3, 22, 12, { tl: 2, tr: 2, bl: 5, br: 5 });
    lsh.fillStyle(WHITE, 0.15); lsh.fillRect(-9, legH - 3, 18, 4);
    leftLegC.add(lsh);
    c.add(leftLegC);

    const rightLegC = scene.add.container(10, 40);
    const rlg = scene.add.graphics();
    rlg.fillStyle(o.pants); rlg.fillRoundedRect(-legW / 2, 0, legW, legH, 4);
    rlg.fillStyle(o.pantsHi, 0.3); rlg.fillRect(legW / 2 - 5, 0, 5, legH);
    rightLegC.add(rlg);
    const rsh = scene.add.graphics();
    rsh.fillStyle(o.shoe); rsh.fillRoundedRect(-11, legH - 3, 22, 12, { tl: 2, tr: 2, bl: 5, br: 5 });
    rsh.fillStyle(WHITE, 0.15); rsh.fillRect(-9, legH - 3, 18, 4);
    rightLegC.add(rsh);
    c.add(rightLegC);

    // ── TORSO ──
    const torso = scene.add.graphics();
    const tw = 48, th = 44;
    torso.fillStyle(o.shirt);
    torso.fillRoundedRect(-tw / 2, 0, tw, th, 8);
    torso.fillStyle(o.shirtHi, 0.4);
    torso.fillRoundedRect(-tw / 2, 0, 14, th, { tl: 8, tr: 0, bl: 8, br: 0 });

    if (stage === 2) {
        torso.fillStyle(WHITE);
        torso.fillTriangle(-11, 0, 0, 0, -6, 11);
        torso.fillTriangle(11, 0, 0, 0, 6, 11);
        torso.fillStyle(0xC62828);
        torso.fillTriangle(-3.5, 5, 3.5, 5, 0, 30);
        torso.fillStyle(0xB71C1C, 0.5);
        torso.fillTriangle(0, 5, 3.5, 5, 0.7, 30);
    } else if (stage === 4) {
        torso.fillStyle(0x1B5E20, 0.5);
        torso.fillRoundedRect(-14, 25, 28, 14, 4);
        torso.lineStyle(1.5, WHITE, 0.4);
        torso.lineBetween(-4, 1, -5, 14);
        torso.lineBetween(4, 1, 5, 14);
        torso.fillStyle(0x1B5E20);
        torso.fillEllipse(-8, -1, 14, 8);
        torso.fillEllipse(8, -1, 14, 8);
    } else if (stage >= 5) {
        torso.lineStyle(1, o.shirtHi, 0.5);
        torso.lineBetween(0, 3, 0, th - 3);
        for (let by = 8; by <= 36; by += 9) {
            torso.fillStyle(0xE0E0E0); torso.fillCircle(0, by, 2.5);
        }
        torso.fillStyle(SKIN);
        torso.fillTriangle(-10, 0, 0, 0, -3, 10);
        torso.fillTriangle(10, 0, 0, 0, 3, 10);
    }
    c.add(torso);
    torso.setPosition(0, -4);

    // ── ARMS (pivot at shoulder — rotation-based animation) ──
    const armW = 14, armH = 36;

    const leftArmC = scene.add.container(-tw / 2 - 4, 2);
    const lag = scene.add.graphics();
    lag.fillStyle(stage >= 3 ? o.shirt : SKIN);
    lag.fillRoundedRect(-armW / 2, 0, armW, armH, 5);
    if (stage >= 3) { lag.fillStyle(o.shirtHi, 0.3); lag.fillRect(-armW / 2, 0, 4, armH); }
    lag.fillStyle(SKIN); lag.fillCircle(0, armH + 2, 7);
    lag.fillStyle(SKIN_HI, 0.3); lag.fillCircle(-1, armH + 1, 3);
    leftArmC.add(lag);
    c.add(leftArmC);

    const rightArmC = scene.add.container(tw / 2 + 4, 2);
    const rag = scene.add.graphics();
    rag.fillStyle(stage >= 3 ? o.shirt : SKIN);
    rag.fillRoundedRect(-armW / 2, 0, armW, armH, 5);
    if (stage >= 3) { rag.fillStyle(o.shirtHi, 0.3); rag.fillRect(armW / 2 - 4, 0, 4, armH); }
    rag.fillStyle(SKIN); rag.fillCircle(0, armH + 2, 7);
    rag.fillStyle(SKIN_HI, 0.3); rag.fillCircle(1, armH + 1, 3);
    rightArmC.add(rag);
    c.add(rightArmC);

    // ── NECK ──
    const nk = scene.add.graphics();
    nk.fillStyle(SKIN); nk.fillRect(-7, 0, 14, 11);
    nk.fillStyle(SKIN_SH, 0.4); nk.fillRect(-7, 7, 14, 4);
    c.add(nk); nk.setPosition(0, -14);

    // ── HEAD ──
    const head = scene.add.graphics();
    const headR = 25;

    head.fillStyle(SKIN); head.fillCircle(0, 0, headR);
    head.fillStyle(SKIN_HI, 0.3); head.fillCircle(-5, -4, headR - 5);

    // ── HAIR ──
    head.fillStyle(HAIR);
    if (stage <= 1) {
        head.fillEllipse(0, -14, 56, 24);
        head.fillRect(-25, -24, 50, 14);
        for (let s = -16; s <= 16; s += 8)
            head.fillTriangle(s - 5, -24, s + 5, -24, s + (s > 0 ? 3 : -3), -33);
    } else if (stage === 2) {
        head.fillEllipse(0, -14, 56, 24);
        head.fillRect(-25, -24, 50, 14);
    } else {
        head.fillEllipse(0, -14, 56, 24);
        head.fillRect(-25, -24, 50, 14);
        head.fillStyle(SKIN, 0.15);
        head.fillRect(7, -24, 3, 11);
        head.fillStyle(HAIR);
        head.fillEllipse(-19, -19, 16, 14);
    }

    // ── EARS ──
    head.fillStyle(SKIN); head.fillEllipse(-headR + 1, 1, 9, 12);
    head.fillEllipse(headR - 1, 1, 9, 12);
    head.fillStyle(SKIN_SH, 0.3); head.fillEllipse(-headR + 1, 1, 5, 7);
    head.fillEllipse(headR - 1, 1, 5, 7);

    // ── EYES ──
    const eyeY = -2, eyeSpacing = 10;
    head.fillStyle(WHITE);
    head.fillEllipse(-eyeSpacing, eyeY, 15, 12);
    head.fillEllipse(eyeSpacing, eyeY, 15, 12);
    head.fillStyle(0x3E2723);
    head.fillCircle(-eyeSpacing + 1, eyeY, 4.5);
    head.fillCircle(eyeSpacing + 1, eyeY, 4.5);
    head.fillStyle(BLACK);
    head.fillCircle(-eyeSpacing + 1, eyeY, 2.5);
    head.fillCircle(eyeSpacing + 1, eyeY, 2.5);
    head.fillStyle(WHITE);
    head.fillCircle(-eyeSpacing, eyeY - 2, 1.8);
    head.fillCircle(eyeSpacing, eyeY - 2, 1.8);
    head.fillCircle(-eyeSpacing + 3, eyeY + 1.5, 0.9);
    head.fillCircle(eyeSpacing + 3, eyeY + 1.5, 0.9);

    // ── EYEBROWS ──
    head.fillStyle(HAIR);
    head.fillRoundedRect(-eyeSpacing - 7, eyeY - 9, 14, 3, 1.5);
    head.fillRoundedRect(eyeSpacing - 7, eyeY - 9, 14, 3, 1.5);

    // ── NOSE ──
    head.fillStyle(SKIN_SH);
    head.fillEllipse(0, 7, 7, 5);
    head.fillStyle(SKIN, 0.5);
    head.fillEllipse(-1, 6, 4, 3);

    // ── MOUTH ──
    head.lineStyle(2.5, 0x7B3F00);
    head.beginPath();
    head.arc(0, 11, 7, 0.15, Math.PI - 0.15, false);
    head.strokePath();
    head.fillStyle(0xAA6633, 0.3);
    head.fillEllipse(0, 14, 11, 4);

    // ── CHEEK BLUSH ──
    head.fillStyle(0xE8A090, 0.25);
    head.fillEllipse(-15, 7, 9, 5);
    head.fillEllipse(15, 7, 9, 5);

    // ── GLASSES (stage 5+) ──
    if (stage >= 5) {
        head.lineStyle(2.5, 0x333333);
        head.strokeRoundedRect(-eyeSpacing - 8, eyeY - 7, 16, 14, 4);
        head.strokeRoundedRect(eyeSpacing - 8, eyeY - 7, 16, 14, 4);
        head.lineStyle(2.5, 0x333333);
        head.lineBetween(-eyeSpacing + 8, eyeY, eyeSpacing - 8, eyeY);
        head.lineBetween(-eyeSpacing - 8, eyeY, -headR + 3, eyeY - 1);
        head.lineBetween(eyeSpacing + 8, eyeY, headR - 3, eyeY - 1);
        head.lineStyle(1, WHITE, 0.2);
        head.lineBetween(-eyeSpacing - 4, eyeY - 4, -eyeSpacing - 1, eyeY - 4);
        head.lineBetween(eyeSpacing - 4, eyeY - 4, eyeSpacing - 1, eyeY - 4);
    }

    c.add(head);
    head.setPosition(0, -42);

    // ── BACKPACK (student stages) ──
    if (stage >= 2 && stage <= 4) {
        const bp = scene.add.graphics();
        const bpC = stage === 4 ? 0x2E7D32 : stage === 3 ? 0x1565C0 : 0xE65100;
        const bpD = stage === 4 ? 0x1B5E20 : stage === 3 ? 0x0D47A1 : 0xBF360C;
        bp.fillStyle(bpC);
        bp.fillRoundedRect(-11, 0, 22, 30, 7);
        bp.fillStyle(bpD, 0.5);
        bp.fillRoundedRect(-8, 5, 16, 14, 4);
        bp.lineStyle(1, 0x000000, 0.2); bp.lineBetween(0, 5, 0, 19);
        bp.lineStyle(3, bpC);
        bp.lineBetween(-7, 0, -10, -14);
        bp.lineBetween(7, 0, 10, -14);
        c.add(bp); bp.setPosition(-33, -4);
    }

    // ── ID BADGE (professional) ──
    if (stage >= 5) {
        const bd = scene.add.graphics();
        bd.fillStyle(WHITE);
        bd.fillRoundedRect(-7, 0, 14, 16, 3);
        bd.fillStyle(stage === 6 ? 0xC62828 : 0x1565C0);
        bd.fillRect(-5, 4, 10, 5);
        bd.lineStyle(1, 0x888888);
        bd.lineBetween(0, 0, 4, -16);
        c.add(bd); bd.setPosition(22, 8);
    }

    // Store animated parts
    c.leftLeg = leftLegC;
    c.rightLeg = rightLegC;
    c.leftArm = leftArmC;
    c.rightArm = rightArmC;
    c.headGfx = head;
    c.torsoGfx = torso;
    c.shadow = c.list[0];

    return c;
}

/**
 * Rotation-based walk animation — legs and arms pivot at hips/shoulders
 */
export function animateWalk(container, walkTimer, isMoving, isGrounded, time) {
    if (isMoving && isGrounded) {
        const legAngle = Math.sin(walkTimer) * 0.35;   // ~20 degrees
        const armAngle = Math.sin(walkTimer) * 0.3;     // counter-swing
        const bounce = Math.abs(Math.sin(walkTimer * 2)) * 3;
        const torsoLean = 0.04;  // ~2.5 degrees forward lean

        // Legs rotate at hip pivot
        container.leftLeg.rotation = legAngle;
        container.rightLeg.rotation = -legAngle;

        // Arms counter-rotate at shoulder pivot
        container.leftArm.rotation = -armAngle;
        container.rightArm.rotation = armAngle;

        // Torso lean forward slightly when moving
        if (container.torsoGfx) container.torsoGfx.rotation = torsoLean;

        // Head bob + slight sway
        if (container.headGfx) {
            container.headGfx.y = -42 - bounce;
            container.headGfx.x = Math.sin(walkTimer * 0.5) * 1;
        }
    } else {
        // Idle: gentle breathing + subtle sway
        const breathe = Math.sin((time || 0) * 0.003) * 2;

        container.leftLeg.rotation = 0;
        container.rightLeg.rotation = 0;
        container.leftArm.rotation = 0;
        container.rightArm.rotation = 0;

        if (container.torsoGfx) container.torsoGfx.rotation = 0;
        if (container.headGfx) {
            container.headGfx.y = -42 + breathe;
            container.headGfx.x = 0;
        }
    }
}

/**
 * Create parachute variant for Level 2
 */
export function createParachuteCharacter(scene, stage) {
    const c = createCharacter(scene, stage);

    // Parachute canopy above head
    const chute = scene.add.graphics();
    chute.fillStyle(0xFF5722, 0.9);
    chute.fillEllipse(0, 0, 100, 50);
    // Stripes
    chute.fillStyle(0xFFC107, 0.7);
    chute.fillEllipse(-20, 0, 25, 45);
    chute.fillEllipse(20, 0, 25, 45);
    // Re-fill edges
    chute.fillStyle(0xFF5722, 0.9);
    chute.fillEllipse(-40, 0, 25, 40);
    chute.fillEllipse(40, 0, 25, 40);
    chute.setPosition(0, -110);
    c.add(chute);

    // Strings from canopy to shoulders
    const strings = scene.add.graphics();
    strings.lineStyle(1.5, 0x8D6E63, 0.8);
    strings.lineBetween(-20, -4, -40, -85);
    strings.lineBetween(20, -4, 40, -85);
    strings.lineBetween(-20, -4, -10, -85);
    strings.lineBetween(20, -4, 10, -85);
    c.add(strings);

    c.chuteGfx = chute;
    c.stringsGfx = strings;

    return c;
}
