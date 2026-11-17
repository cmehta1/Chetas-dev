import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { TYPING_BONES, OUTFIT, createGlasses } from '../../three/characterKit';

/* The game's 3D character as a live wallpaper: a head-and-shoulders bust whose head
   follows the pointer (or touch / phone tilt), blinking and idly moving.
   This module pulls in Three.js, so it is only ever loaded with a dynamic import. */

const FRAMING = {
    desktop: { fov: 14.5, pos: [0, 11.6, 36], target: [0, 11.6, 0] },
    mobile: { fov: 14.5, pos: [0, 11.6, 36], target: [0, 11.6, 0] },
};

export function mountHero(container, { mobile = false, variant = 'adult-beard', onReady } = {}) {
    const frame = FRAMING[mobile ? 'mobile' : 'desktop'];
    const outfit = OUTFIT[variant] || OUTFIT.adult;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(frame.fov, 1, 0.1, 1000);
    camera.position.set(...frame.pos);
    camera.lookAt(...frame.target);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const resize = () => {
        const w = container.clientWidth || 1;
        const h = container.clientHeight || 1;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    /* lights: a cool key from behind-left plus a warm rim to match the dusk wallpaper */
    const key = new THREE.DirectionalLight(0x5eead4, 0);
    key.position.set(-0.47, -0.32, -1);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xff9a5a, 0);
    rim.position.set(1.2, 0.6, -0.8);
    scene.add(rim);

    let disposed = false;
    let paused = false;
    let animId = 0;
    let mixer = null;
    let headBone = null;
    let character = null;
    const timers = [];
    const clock = new THREE.Clock();

    new RGBELoader().setPath('/models/').load('char_enviorment.hdr', (tex) => {
        if (disposed) { tex.dispose(); return; }
        tex.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = tex;
        scene.environmentIntensity = 0.64;
        scene.environmentRotation.set(5.76, 85.85, 1);
    });

    const loader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderPath('/draco/');
    loader.setDRACOLoader(draco);

    loader.load('/models/character.glb', async (gltf) => {
        if (disposed) return;
        character = gltf.scene;

        character.traverse((child) => {
            // The desk, monitor and screen glow belong to the interior scene, not the bust.
            if (child.name === 'Plane004' || child.name === 'screenlight') child.visible = false;
            if (!child.isMesh || !child.material) return;
            if (child.name === 'BODYSHIRT') {
                child.material = child.material.clone();
                child.material.color = new THREE.Color(outfit.shirt);
            } else if (child.name === 'Pant') {
                child.material = child.material.clone();
                child.material.color = new THREE.Color(outfit.pants);
            }
        });

        const footR = character.getObjectByName('footR');
        const footL = character.getObjectByName('footL');
        if (footR) footR.position.y = 3.36;
        if (footL) footL.position.y = 3.36;

        headBone = character.getObjectByName('spine006') || null;
        if (headBone) {
            const glasses = createGlasses();
            glasses.position.set(0, 0.04, 0);
            headBone.add(glasses);
        }

        await renderer.compileAsync(character, camera, scene);
        if (disposed) return;
        scene.add(character);

        mixer = new THREE.AnimationMixer(character);
        const intro = gltf.animations.find(c => c.name === 'introAnimation');
        if (intro) {
            const a = mixer.clipAction(intro);
            a.setLoop(THREE.LoopOnce, 1);
            a.clampWhenFinished = true;
            a.play();
        }
        const typing = THREE.AnimationClip.findByName(gltf.animations, 'typing');
        if (typing) {
            const tracks = typing.tracks.filter(t => TYPING_BONES.some(b => t.name.includes(b)));
            if (tracks.length) {
                const a = mixer.clipAction(new THREE.AnimationClip('typing_filtered', typing.duration, tracks));
                a.timeScale = 1.1;
                a.play();
            }
        }
        timers.push(setTimeout(() => {
            const blink = gltf.animations.find(c => c.name === 'Blink');
            if (blink && mixer) mixer.clipAction(blink).play().fadeIn(0.5);
        }, 1800));

        key.intensity = 1;
        rim.intensity = 0.6;
        draco.dispose();
        onReady?.();
    }, undefined, () => { /* model failed to load: the 2D wallpaper stays */ });

    /* ── where the head looks ── */
    const look = { x: 0, y: 0 };
    let lastInput = 0;
    const setLook = (clientX, clientY) => {
        look.x = (clientX / window.innerWidth) * 2 - 1;
        look.y = -(clientY / window.innerHeight) * 2 + 1;
        lastInput = performance.now();
    };
    const onPointer = (e) => setLook(e.clientX, e.clientY);
    const onTouch = (e) => { if (e.touches[0]) setLook(e.touches[0].clientX, e.touches[0].clientY); };
    let tiltBase = null;
    const onOrient = (e) => {
        if (e.gamma == null || e.beta == null) return;
        if (tiltBase == null) tiltBase = e.beta;
        look.x = Math.max(-1, Math.min(1, e.gamma / 30));
        look.y = Math.max(-1, Math.min(1, (tiltBase - e.beta) / 30));
        lastInput = performance.now();
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    if (mobile) window.addEventListener('deviceorientation', onOrient);

    const MAX = Math.PI / 6;
    const tick = () => {
        animId = requestAnimationFrame(tick);
        const dt = Math.min(clock.getDelta(), 0.1);
        const t = clock.elapsedTime;

        // No input for a while: drift the gaze around slowly so he still feels alive.
        const idle = performance.now() - lastInput > 3500;
        const tx = idle ? Math.sin(t * 0.35) * 0.45 : look.x;
        const ty = idle ? Math.sin(t * 0.23) * 0.2 : look.y;

        if (headBone) {
            headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, tx * MAX, 0.08);
            const cy = Math.max(-0.4, Math.min(0.5, ty));
            headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, -cy * MAX - 0.15 * MAX, 0.08);
        }
        if (character) character.rotation.y = THREE.MathUtils.lerp(character.rotation.y, tx * 0.12, 0.03);

        if (mixer) mixer.update(dt);
        renderer.render(scene, camera);
    };

    const start = () => { if (!animId && !disposed) { clock.getDelta(); tick(); } };
    const stop = () => { cancelAnimationFrame(animId); animId = 0; };
    const onVisibility = () => { if (document.hidden) stop(); else if (!paused) start(); };
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return {
        setPaused(p) {
            paused = p;
            if (p) stop(); else if (!document.hidden) start();
        },
        destroy() {
            disposed = true;
            stop();
            timers.forEach(clearTimeout);
            ro.disconnect();
            window.removeEventListener('pointermove', onPointer);
            window.removeEventListener('touchstart', onTouch);
            window.removeEventListener('touchmove', onTouch);
            window.removeEventListener('deviceorientation', onOrient);
            document.removeEventListener('visibilitychange', onVisibility);
            scene.traverse((o) => {
                if (o.geometry) o.geometry.dispose();
                if (o.material) [].concat(o.material).forEach(m => m.dispose());
            });
            scene.environment?.dispose?.();
            renderer.dispose();
            renderer.domElement.remove();
        },
    };
}
