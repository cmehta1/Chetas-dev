/**
 * Improved character with multi-joint limbs (knee/elbow bends),
 * belt detail, better shoes, and natural walk animation.
 * Stage progression 1-6 with growing scale preserved.
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
        1: { shirt: 0xE53935, shirtHi: 0xEF5350, pants: 0x5D4037, pantsHi: 0x6D4C41, shoe: 0x4E342E, belt: 0x4E342E },
        2: { shirt: 0xFAFAFA, shirtHi: 0xFFFFFF, pants: 0x263238, pantsHi: 0x37474F, shoe: 0x212121, belt: 0x1A1A1A },
        3: { shirt: 0x1E88E5, shirtHi: 0x42A5F5, pants: 0x37474F, pantsHi: 0x455A64, shoe: 0x3E2723, belt: 0x263238 },
        4: { shirt: 0x2E7D32, shirtHi: 0x43A047, pants: 0x37474F, pantsHi: 0x455A64, shoe: 0x4E342E, belt: 0x263238 },
        5: { shirt: 0x1565C0, shirtHi: 0x1E88E5, pants: 0x212121, pantsHi: 0x333333, shoe: 0x1A1A1A, belt: 0x111111 },
        6: { shirt: 0xC62828, shirtHi: 0xE53935, pants: 0x1A1A2E, pantsHi: 0x252540, shoe: 0x111111, belt: 0x0A0A14 },
    };
    const o = outfits[stage] || outfits[1];

    // ── SHADOW ──
    c.add(scene.add.ellipse(0, 78, 50, 14, 0x000000, 0.18));

    // ── LEGS (two-part: thigh pivots at hip, shin pivots at knee) ──
    const thighH = 17, shinH = 16, legW = 16;

    // Left leg
    const leftLegC = scene.add.container(-9, 40);
    const ltg = scene.add.graphics();
    ltg.fillStyle(o.pants); ltg.fillRoundedRect(-legW / 2, 0, legW, thighH, 3);
    ltg.fillStyle(o.pantsHi, 0.3); ltg.fillRect(-legW / 2, 0, 4, thighH);
    leftLegC.add(ltg);

    const leftShinC = scene.add.container(0, thighH);
    const lsg = scene.add.graphics();
    lsg.fillStyle(o.pants); lsg.fillRoundedRect(-legW / 2, 0, legW, shinH, { tl: 0, tr: 0, bl: 3, br: 3 });
    lsg.fillStyle(o.pantsHi, 0.25); lsg.fillRect(-legW / 2, 0, 4, shinH);
    lsg.fillStyle(o.shoe); lsg.fillRoundedRect(-10, shinH - 2, 20, 10, { tl: 2, tr: 2, bl: 4, br: 4 });
    lsg.fillStyle(WHITE, 0.12); lsg.fillRect(-8, shinH - 2, 16, 3);
    lsg.fillStyle(0x000000, 0.3); lsg.fillRect(-10, shinH + 6, 20, 2);
    leftShinC.add(lsg);
    leftLegC.add(leftShinC);
    c.add(leftLegC);

    // Right leg
    const rightLegC = scene.add.container(9, 40);
    const rtg = scene.add.graphics();
    rtg.fillStyle(o.pants); rtg.fillRoundedRect(-legW / 2, 0, legW, thighH, 3);
    rtg.fillStyle(o.pantsHi, 0.3); rtg.fillRect(legW / 2 - 4, 0, 4, thighH);
    rightLegC.add(rtg);

    const rightShinC = scene.add.container(0, thighH);
    const rsg = scene.add.graphics();
    rsg.fillStyle(o.pants); rsg.fillRoundedRect(-legW / 2, 0, legW, shinH, { tl: 0, tr: 0, bl: 3, br: 3 });
    rsg.fillStyle(o.pantsHi, 0.25); rsg.fillRect(legW / 2 - 4, 0, 4, shinH);
    rsg.fillStyle(o.shoe); rsg.fillRoundedRect(-10, shinH - 2, 20, 10, { tl: 2, tr: 2, bl: 4, br: 4 });
    rsg.fillStyle(WHITE, 0.12); rsg.fillRect(-8, shinH - 2, 16, 3);
    rsg.fillStyle(0x000000, 0.3); rsg.fillRect(-10, shinH + 6, 20, 2);
    rightShinC.add(rsg);
    rightLegC.add(rightShinC);
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
        torso.lineBetween(0, 3, 0, th - 8);
        for (let by = 8; by <= 32; by += 8) {
            torso.fillStyle(0xE0E0E0); torso.fillCircle(0, by, 2.5);
        }
        torso.fillStyle(SKIN);
        torso.fillTriangle(-10, 0, 0, 0, -3, 10);
        torso.fillTriangle(10, 0, 0, 0, 3, 10);
    }

    // Belt
    torso.fillStyle(o.belt);
    torso.fillRect(-tw / 2, th - 5, tw, 4);
    torso.fillStyle(0xD0D0D0);
    torso.fillRoundedRect(-4, th - 6, 8, 5, 1);

    c.add(torso);
    torso.setPosition(0, -4);

    // ── ARMS (two-part: upper arm pivots at shoulder, forearm at elbow) ──
    const uArmH = 18, fArmH = 16, armW = 13;

    // Left arm
    const leftArmC = scene.add.container(-tw / 2 - 3, 2);
    const luag = scene.add.graphics();
    luag.fillStyle(stage >= 3 ? o.shirt : SKIN);
    luag.fillRoundedRect(-armW / 2, 0, armW, uArmH, 4);
    if (stage >= 3) { luag.fillStyle(o.shirtHi, 0.3); luag.fillRect(-armW / 2, 0, 4, uArmH); }
    leftArmC.add(luag);

    const leftForearmC = scene.add.container(0, uArmH);
    const lfag = scene.add.graphics();
    lfag.fillStyle(SKIN);
    lfag.fillRoundedRect(-armW / 2 + 1, 0, armW - 2, fArmH, 4);
    lfag.fillStyle(SKIN_HI, 0.25); lfag.fillRect(-armW / 2 + 1, 0, 3, fArmH);
    lfag.fillStyle(SKIN); lfag.fillCircle(0, fArmH + 1, 6);
    lfag.fillStyle(SKIN_HI, 0.3); lfag.fillCircle(-1, fArmH, 2.5);
    leftForearmC.add(lfag);
    leftArmC.add(leftForearmC);
    c.add(leftArmC);

    // Right arm
    const rightArmC = scene.add.container(tw / 2 + 3, 2);
    const ruag = scene.add.graphics();
    ruag.fillStyle(stage >= 3 ? o.shirt : SKIN);
    ruag.fillRoundedRect(-armW / 2, 0, armW, uArmH, 4);
    if (stage >= 3) { ruag.fillStyle(o.shirtHi, 0.3); ruag.fillRect(armW / 2 - 4, 0, 4, uArmH); }
    rightArmC.add(ruag);

    const rightForearmC = scene.add.container(0, uArmH);
    const rfag = scene.add.graphics();
    rfag.fillStyle(SKIN);
    rfag.fillRoundedRect(-armW / 2 + 1, 0, armW - 2, fArmH, 4);
    rfag.fillStyle(SKIN_HI, 0.25); rfag.fillRect(armW / 2 - 4, 0, 3, fArmH);
    rfag.fillStyle(SKIN); rfag.fillCircle(0, fArmH + 1, 6);
    rfag.fillStyle(SKIN_HI, 0.3); rfag.fillCircle(1, fArmH, 2.5);
    rightForearmC.add(rfag);
    rightArmC.add(rightForearmC);
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
    c.leftShin = leftShinC;
    c.rightShin = rightShinC;
    c.leftArm = leftArmC;
    c.rightArm = rightArmC;
    c.leftForearm = leftForearmC;
    c.rightForearm = rightForearmC;
    c.headGfx = head;
    c.torsoGfx = torso;
    c.shadow = c.list[0];

    return c;
}

/**
 * Multi-joint walk animation — realistic gait with stride phases,
 * knee drive, arm pump, torso twist, and vertical bounce.
 */
export function animateWalk(container, walkTimer, isMoving, isGrounded, time) {
    if (isMoving && isGrounded) {
        const t = walkTimer;

        // === LEGS: hip swing with asymmetric knee drive ===
        const stride = Math.sin(t) * 0.55;
        container.leftLeg.rotation = stride;
        container.rightLeg.rotation = -stride;

        // Knee bend: shin kicks back as leg pushes off, drives forward on swing
        if (container.leftShin) {
            // Back leg bends more (push-off), front leg straightens (reaching)
            const leftPhase = Math.sin(t);
            container.leftShin.rotation = leftPhase > 0
                ? leftPhase * 0.75  // back leg: strong knee bend
                : Math.abs(leftPhase) * 0.15; // front leg: slight bend on contact
        }
        if (container.rightShin) {
            const rightPhase = -Math.sin(t);
            container.rightShin.rotation = rightPhase > 0
                ? rightPhase * 0.75
                : Math.abs(rightPhase) * 0.15;
        }

        // === ARMS: opposite to legs, with elbow pump ===
        const armSwing = Math.sin(t) * 0.45;
        container.leftArm.rotation = -armSwing;
        container.rightArm.rotation = armSwing;

        // Forearm bends on backward swing (like a runner pumping arms)
        if (container.leftForearm) {
            const leftArmBack = Math.sin(t);
            container.leftForearm.rotation = leftArmBack > 0
                ? leftArmBack * 0.55  // arm swinging back: elbow bends
                : 0.05; // arm forward: nearly straight
        }
        if (container.rightForearm) {
            const rightArmBack = -Math.sin(t);
            container.rightForearm.rotation = rightArmBack > 0
                ? rightArmBack * 0.55
                : 0.05;
        }

        // === TORSO: lean forward + slight twist with each step ===
        if (container.torsoGfx) {
            container.torsoGfx.rotation = 0.05 + Math.sin(t) * 0.025;
            // Vertical torso bounce: dips at mid-stride, rises at step contact
            container.torsoGfx.y = -4 + Math.abs(Math.sin(t)) * 1.5;
        }

        // === HEAD: smooth bob following body rhythm, slight counter-tilt ===
        const stepBounce = Math.abs(Math.sin(t)) * 3;
        if (container.headGfx) {
            container.headGfx.y = -42 - stepBounce;
            container.headGfx.rotation = Math.sin(t) * -0.03; // subtle counter-tilt
            container.headGfx.x = Math.sin(t * 0.5) * 0.8;
        }

        // === SHADOW: pulses with footfalls ===
        if (container.shadow) {
            const shadowPulse = 1 + Math.abs(Math.sin(t)) * 0.08;
            container.shadow.setScale(shadowPulse, 1);
        }
    } else {
        // === IDLE: breathing, weight shift, subtle life ===
        const breathe = Math.sin((time || 0) * 0.003) * 1.5;
        const shift = Math.sin((time || 0) * 0.0015) * 0.015;

        container.leftLeg.rotation = 0;
        container.rightLeg.rotation = 0;
        if (container.leftShin) container.leftShin.rotation = 0;
        if (container.rightShin) container.rightShin.rotation = 0;

        // Arms hang with slight sway
        const armIdle = Math.sin((time || 0) * 0.002) * 0.03;
        container.leftArm.rotation = armIdle;
        container.rightArm.rotation = -armIdle;
        if (container.leftForearm) container.leftForearm.rotation = 0.02;
        if (container.rightForearm) container.rightForearm.rotation = 0.02;

        if (container.torsoGfx) {
            container.torsoGfx.rotation = shift;
            container.torsoGfx.y = -4;
        }
        if (container.headGfx) {
            container.headGfx.y = -42 + breathe;
            container.headGfx.x = 0;
            container.headGfx.rotation = 0;
        }
        if (container.shadow) {
            container.shadow.setScale(1, 1);
        }
    }
}

/**
 * Create parachute variant for Level 2
 */
export function createParachuteCharacter(scene, stage) {
    const c = createCharacter(scene, stage);

    const chute = scene.add.graphics();
    chute.fillStyle(0xFF5722, 0.9);
    chute.fillEllipse(0, 0, 100, 50);
    chute.fillStyle(0xFFC107, 0.7);
    chute.fillEllipse(-20, 0, 25, 45);
    chute.fillEllipse(20, 0, 25, 45);
    chute.fillStyle(0xFF5722, 0.9);
    chute.fillEllipse(-40, 0, 25, 40);
    chute.fillEllipse(40, 0, 25, 40);
    chute.setPosition(0, -110);
    c.add(chute);

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
