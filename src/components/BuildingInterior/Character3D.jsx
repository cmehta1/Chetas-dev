import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

/* ── Bone names for filtered typing animation ── */
const TYPING_BONES = [
    'thighL', 'thighR', 'shinL', 'shinR', 'forearmL', 'forearmR',
    'handL', 'handR', 'f_pinky03R', 'f_pinky02L', 'f_pinky02R',
    'f_pinky01L', 'f_pinky01R', 'palm04L', 'palm04R', 'f_ring01L',
    'thumb01L', 'thumb01R', 'thumb03L', 'thumb03R', 'palm02L',
    'palm02R', 'palm01L', 'palm01R', 'f_index01L', 'f_index01R',
    'palm03L', 'palm03R', 'f_ring02L', 'f_ring02R', 'f_ring01R',
    'f_ring03L', 'f_ring03R', 'f_middle01L', 'f_middle02L',
    'f_middle03L', 'f_middle01R', 'f_middle02R', 'f_middle03R',
    'f_index02L', 'f_index03L', 'f_index02R', 'f_index03R',
    'thumb02L', 'f_pinky03L', 'upper_armL', 'upper_armR', 'thumb02R',
    'toeL', 'heel02L', 'toeR', 'heel02R',
];

/* ── Outfit colors per variant ── */
const OUTFIT = {
    teen:          { shirt: '#2979FF', pants: '#4E342E' },
    adult:         { shirt: '#1565C0', pants: '#1A237E' },
    'adult-beard': { shirt: '#8B4513', pants: '#000000' },
};

const VARIANT_FOR_ZONE = {
    1: 'teen', 2: 'teen',
    4: 'adult', 5: 'adult',
    6: 'adult-beard', 7: 'adult-beard',
};

/* ── Programmatic glasses — attached to head bone ── */
function createGlasses() {
    const g = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({
        color: 0x222222, metalness: 0.85, roughness: 0.15,
    });
    const lensMat = new THREE.MeshPhysicalMaterial({
        color: 0xAABBEE, transparent: true, opacity: 0.12,
        roughness: 0.02, metalness: 0.05, clearcoat: 1.0,
        clearcoatRoughness: 0.0,
    });

    const lr = 0.032;
    const gap = 0.01;
    const fz = 0.085;

    [-1, 1].forEach(s => {
        const cx = s * (lr + gap);
        const frame = new THREE.Mesh(new THREE.TorusGeometry(lr, 0.003, 10, 28), frameMat);
        frame.position.set(cx, 0, fz);
        g.add(frame);
        const lens = new THREE.Mesh(new THREE.CircleGeometry(lr - 0.002, 28), lensMat);
        lens.position.set(cx, 0, fz + 0.001);
        g.add(lens);
        const temple = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.0016, 0.1, 6), frameMat);
        temple.rotation.x = Math.PI / 2;
        temple.position.set(s * (lr * 2 + gap + 0.005), 0, fz - 0.05);
        g.add(temple);
    });
    const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, gap * 2, 6), frameMat);
    bridge.rotation.z = Math.PI / 2;
    bridge.position.set(0, 0, fz);
    g.add(bridge);

    return g;
}

/* ── LERP helper ── */
function lerp(a, b, t) { return a + (b - a) * t; }

/* ── Camera keyframes (matching reference GsapScroll) ── */
const CAM_START = { x: 0, y: 13.1, z: 24.7 };
const CAM_END   = { x: 0, y: 8.4,  z: 75 };

const CHAR_ROT_START = { x: 0, y: 0 };
const CHAR_ROT_END   = { x: 0.12, y: 0.92 };

const NECK_X_END = 0.6;

export default function Character3D({ zoneId, scrollRef }) {
    const mountRef = useRef(null);

    useEffect(() => {
        const container = mountRef.current;
        if (!container) return;

        const variant = VARIANT_FOR_ZONE[zoneId] || 'adult';
        const outfit = OUTFIT[variant] || OUTFIT.adult;

        /* ── Scene ── */
        const scene = new THREE.Scene();
        const w = container.clientWidth;
        const h = container.clientHeight;

        /* ── Camera — start close-up on head ── */
        const camera = new THREE.PerspectiveCamera(14.5, w / h, 0.1, 1000);
        camera.position.set(CAM_START.x, CAM_START.y, CAM_START.z);
        camera.zoom = 1.1;
        camera.updateProjectionMatrix();

        /* ── Renderer ── */
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        container.appendChild(renderer.domElement);

        /* ── Lighting ── */
        const directionalLight = new THREE.DirectionalLight(0x5eead4, 0);
        directionalLight.position.set(-0.47, -0.32, -1);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0x22d3ee, 0, 100, 3);
        pointLight.position.set(3, 12, 4);
        pointLight.castShadow = true;
        scene.add(pointLight);

        /* ── HDR Environment ── */
        new RGBELoader().setPath('/models/').load('char_enviorment.hdr', (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.environment = texture;
            scene.environmentIntensity = 0.64;
            scene.environmentRotation.set(5.76, 85.85, 1);
        });

        /* ── Load character model ── */
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/draco/');
        loader.setDRACOLoader(dracoLoader);

        let headBone = null;
        let neckBone = null;
        let mixer = null;
        let characterObj = null;
        let monitorMat = null;
        let screenLightMat = null;
        let screenLightIntensity = 0;
        const clock = new THREE.Clock();

        setInterval(() => { screenLightIntensity = Math.random(); }, 200);

        loader.load('/models/character.glb', async (gltf) => {
            const character = gltf.scene;
            characterObj = character;
            await renderer.compileAsync(character, camera, scene);

            /* ── Setup monitor & screenlight (start hidden, fade in on scroll) ── */
            character.children.forEach(obj => {
                if (obj.name === 'Plane004') {
                    obj.traverse(child => {
                        if (child.isMesh) {
                            child.material.transparent = true;
                            child.material.opacity = 0;
                            if (child.material.name === 'Material.018' || child.material.name === 'Material018') {
                                monitorMat = child.material;
                                child.material.color.set('#FFFFFF');
                            }
                        }
                    });
                }
                if (obj.name === 'screenlight') {
                    obj.material.transparent = true;
                    obj.material.opacity = 0;
                    obj.material.emissive.set('#B0F5EA');
                    screenLightMat = obj.material;
                }
            });

            /* Customize clothing colors per variant */
            character.traverse((child) => {
                if (child.isMesh) {
                    if (child.material) {
                        if (child.name === 'BODYSHIRT') {
                            const mat = child.material.clone();
                            mat.color = new THREE.Color(outfit.shirt);
                            child.material = mat;
                        } else if (child.name === 'Pant') {
                            const mat = child.material.clone();
                            mat.color = new THREE.Color(outfit.pants);
                            child.material = mat;
                        }
                    }
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            scene.add(character);

            /* Foot positioning */
            const footR = character.getObjectByName('footR');
            const footL = character.getObjectByName('footL');
            if (footR) footR.position.y = 3.36;
            if (footL) footL.position.y = 3.36;

            /* Bones for mouse tracking & scroll animation */
            headBone = character.getObjectByName('spine006') || null;
            neckBone = character.getObjectByName('spine005') || null;

            /* Attach glasses */
            if (headBone) {
                const glasses = createGlasses();
                glasses.position.set(0, 0.04, 0);
                headBone.add(glasses);
            }

            /* ── Animations ── */
            mixer = new THREE.AnimationMixer(character);

            const introClip = gltf.animations.find(c => c.name === 'introAnimation');
            if (introClip) {
                const action = mixer.clipAction(introClip);
                action.setLoop(THREE.LoopOnce, 1);
                action.clampWhenFinished = true;
                action.reset().play();
            }

            ['key1', 'key2', 'key5', 'key6'].forEach(name => {
                const clip = THREE.AnimationClip.findByName(gltf.animations, name);
                if (clip) {
                    const action = mixer.clipAction(clip);
                    action.play();
                    action.timeScale = 1.2;
                }
            });

            const typingClip = THREE.AnimationClip.findByName(gltf.animations, 'typing');
            if (typingClip) {
                const filtered = typingClip.tracks.filter(t =>
                    TYPING_BONES.some(b => t.name.includes(b)),
                );
                if (filtered.length) {
                    const filteredClip = new THREE.AnimationClip(
                        'typing_filtered', typingClip.duration, filtered,
                    );
                    const action = mixer.clipAction(filteredClip);
                    action.enabled = true;
                    action.play();
                    action.timeScale = 1.2;
                }
            }

            setTimeout(() => {
                const blink = gltf.animations.find(c => c.name === 'Blink');
                if (blink && mixer) mixer.clipAction(blink).play().fadeIn(0.5);
            }, 2500);

            /* Turn on lights */
            directionalLight.intensity = 1;

            dracoLoader.dispose();
        }, undefined, (err) => console.error('Model load error:', err));

        /* ── Mouse tracking ── */
        const mouse = { x: 0, y: 0 };
        const interpolation = { x: 0.1, y: 0.2 };
        const maxRotation = Math.PI / 6;

        const onMouseMove = (e) => {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        const onTouchMove = (e) => {
            if (e.touches.length > 0) {
                mouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
            }
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('touchmove', onTouchMove);

        /* ── Animation loop ── */
        let animId;
        // Smoothed values — LERP toward targets each frame for buttery animation
        const smooth = { camX: CAM_START.x, camY: CAM_START.y, camZ: CAM_START.z,
                         charRX: 0, charRY: 0, neckRX: 0, monOpacity: 0 };
        const SMOOTH_SPEED = 0.06; // lower = smoother but laggier

        const animate = () => {
            animId = requestAnimationFrame(animate);

            /* ── Scroll-driven camera & character animation ── */
            const p = scrollRef?.current ?? 0;
            // Camera pull-back starts at scroll 20%, finishes at 80%
            const camP = Math.max(0, Math.min(1, (p - 0.2) / 0.6));
            const eased = camP * camP * (3 - 2 * camP); // smoothstep

            // Compute targets
            const targetCamX = lerp(CAM_START.x, CAM_END.x, eased);
            const targetCamY = lerp(CAM_START.y, CAM_END.y, eased);
            const targetCamZ = lerp(CAM_START.z, CAM_END.z, eased);

            // Smoothly interpolate toward targets
            smooth.camX = lerp(smooth.camX, targetCamX, SMOOTH_SPEED);
            smooth.camY = lerp(smooth.camY, targetCamY, SMOOTH_SPEED);
            smooth.camZ = lerp(smooth.camZ, targetCamZ, SMOOTH_SPEED);

            camera.position.x = smooth.camX;
            camera.position.y = smooth.camY;
            camera.position.z = smooth.camZ;

            if (characterObj) {
                const targetCharRX = lerp(CHAR_ROT_START.x, CHAR_ROT_END.x, eased);
                const targetCharRY = lerp(CHAR_ROT_START.y, CHAR_ROT_END.y, eased);
                smooth.charRX = lerp(smooth.charRX, targetCharRX, SMOOTH_SPEED);
                smooth.charRY = lerp(smooth.charRY, targetCharRY, SMOOTH_SPEED);
                characterObj.rotation.x = smooth.charRX;
                characterObj.rotation.y = smooth.charRY;
            }

            if (neckBone) {
                smooth.neckRX = lerp(smooth.neckRX, NECK_X_END * eased, SMOOTH_SPEED);
                neckBone.rotation.x = smooth.neckRX;
            }

            // Monitor & screenlight fade in at 40-70% scroll
            const monP = Math.max(0, Math.min(1, (p - 0.4) / 0.3));
            smooth.monOpacity = lerp(smooth.monOpacity, monP, SMOOTH_SPEED);
            if (monitorMat) monitorMat.opacity = smooth.monOpacity;
            if (screenLightMat) {
                screenLightMat.opacity = smooth.monOpacity;
                screenLightMat.emissiveIntensity = screenLightIntensity * 8 * smooth.monOpacity;
            }
            // Point light driven by screen
            pointLight.intensity = smooth.monOpacity > 0.5 ? screenLightIntensity * 15 * smooth.monOpacity : 0;

            /* ── Head tracks mouse (only when close-up, reduce as we pull back) ── */
            // Use smoothed camera progress for consistent feel
            const smoothEased = Math.max(0, Math.min(1, (smooth.camZ - CAM_START.z) / (CAM_END.z - CAM_START.z)));
            if (headBone) {
                const mouseWeight = 1 - smoothEased; // less tracking as camera pulls back
                if (mouseWeight > 0.05) {
                    headBone.rotation.y = THREE.MathUtils.lerp(
                        headBone.rotation.y,
                        mouse.x * maxRotation * mouseWeight,
                        interpolation.y,
                    );
                    const clampedY = Math.max(-0.3, Math.min(0.4, mouse.y));
                    headBone.rotation.x = THREE.MathUtils.lerp(
                        headBone.rotation.x,
                        (-clampedY * maxRotation - 0.5 * maxRotation) * mouseWeight,
                        interpolation.x,
                    );
                }
            }

            if (mixer) mixer.update(clock.getDelta());
            renderer.render(scene, camera);
        };
        animate();

        /* ── Resize ── */
        const onResize = () => {
            const nw = container.clientWidth;
            const nh = container.clientHeight;
            camera.aspect = nw / nh;
            camera.updateProjectionMatrix();
            renderer.setSize(nw, nh);
        };
        window.addEventListener('resize', onResize);

        return () => {
            cancelAnimationFrame(animId);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('resize', onResize);
            scene.clear();
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [zoneId]);

    return <div ref={mountRef} className="character3d-canvas" />;
}
