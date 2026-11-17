import { GAME_WIDTH, getCameraMargin, isMobilePortrait } from '../config/constants';

/* Camera "look-ahead": while the player heads forward the character sits near the left
   of the screen, so most of the view shows the road (and skills) coming up. When the
   player turns back, the camera eases the character toward the centre. */

const AHEAD_POSITION = 0.25;   // character at 25% of the visible width when moving forward
const LERP_X = 0.5;            // tight horizontal follow so the character doesn't drift right while running
const LERP_Y = 0.08;
const EASE = 0.045;            // how quickly the look-ahead swings when changing direction

/** Width of the world actually visible on screen (phones in portrait crop the sides). */
export function visibleWidth() {
    return GAME_WIDTH - getCameraMargin() * 2;
}

/** Start following the player with look-ahead. Call once in create(). */
export function startCameraFollow(scene) {
    const cam = scene.cameras.main;
    const mobile = isMobilePortrait();
    const width = visibleWidth();
    scene.cameraLead = {
        ahead: -width * (0.5 - AHEAD_POSITION),
        back: 0,
        y: mobile ? 30 : 50,
    };
    scene.cameraLead.current = scene.facingRight === false ? scene.cameraLead.back : scene.cameraLead.ahead;
    cam.startFollow(scene.player, true, LERP_X, LERP_Y);
    cam.setFollowOffset(scene.cameraLead.current, scene.cameraLead.y);
}

/** Ease the look-ahead toward the direction the player is facing. Call every frame. */
export function updateCameraLead(scene) {
    const lead = scene.cameraLead;
    if (!lead) return;
    const target = scene.facingRight ? lead.ahead : lead.back;
    lead.current += (target - lead.current) * EASE;
    scene.cameras.main.setFollowOffset(lead.current, lead.y);
}

/** Keep a centred text object (e.g. "+ Java ★★★★") fully inside the visible screen
    for as long as it exists — the camera keeps moving while the text fades out. */
export function keepInView(scene, obj, pad = 10) {
    const half = visibleWidth() / 2;
    if (obj.setWordWrapWidth && obj.width > half * 2 - pad * 2) {
        obj.setWordWrapWidth(half * 2 - pad * 2).setAlign('center');
    }
    const clamp = () => {
        if (!obj.active) return;
        const cam = scene.cameras.main;
        // The camera moves after this runs, so respect both where it is and where it's heading.
        const now = cam.midPoint.x;
        const next = scene.player ? scene.player.x - cam.followOffset.x : now;
        const hw = obj.displayWidth / 2;
        const min = Math.max(now, next) - half + pad + hw;
        const max = Math.min(now, next) + half - pad - hw;
        obj.x = min > max ? (now + next) / 2 : Math.min(max, Math.max(min, obj.x));
    };
    clamp();
    scene.events.on('postupdate', clamp);
    obj.once('destroy', () => scene.events.off('postupdate', clamp));
    return obj;
}
