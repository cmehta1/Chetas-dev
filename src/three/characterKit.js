import * as THREE from 'three';

/* Shared setup for the 3D character model (public/models/character.glb).
   Used by the building interiors in the game and by the ChetasOS home screen. */

/* ── Bone names for filtered typing animation ── */
export const TYPING_BONES = [
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
export const OUTFIT = {
    teen:          { shirt: '#2979FF', pants: '#4E342E' },
    adult:         { shirt: '#1565C0', pants: '#1A237E' },
    'adult-beard': { shirt: '#8B4513', pants: '#000000' },
};

export const VARIANT_FOR_ZONE = {
    1: 'teen', 2: 'teen',
    4: 'adult', 5: 'adult',
    6: 'adult-beard', 7: 'adult-beard',
};

/* ── Programmatic glasses — attached to head bone ── */
export function createGlasses() {
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
