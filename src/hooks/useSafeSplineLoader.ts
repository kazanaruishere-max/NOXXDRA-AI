import { useLoader, useGraph } from '@react-three/fiber';
import * as THREE from 'three';
import SplineLoader from '@splinetool/loader';

export function useSafeSplineLoader(url: string): THREE.Object3D | null {
    // Use useLoader with the SplineLoader class
    // This will suspend until loaded
    const scene = useLoader(SplineLoader, url) as THREE.Object3D;

    // Defensive check: ensure scene exists
    if (!scene) {
        console.warn('⚠️ Spline scene loaded but returned undefined/null');
        return null;
    }

    // If the loader returns a structure that isn't directly a generic Object3D but has .scene (like GLTF), handle it.
    // SplineLoader usually returns an Object3D (Group or Scene).

    return scene;
}
