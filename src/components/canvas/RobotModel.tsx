'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSafeSplineLoader } from '@/hooks/useSafeSplineLoader';
import { fixSplineSceneShaders } from '@/lib/shaderFix';

interface RobotModelProps {
    url: string;
    onLoaded?: () => void;
}

export function RobotModel({ url, onLoaded }: RobotModelProps) {
    const scene = useSafeSplineLoader(url);
    const mixerRef = useRef<THREE.AnimationMixer | null>(null);
    const { camera } = useThree();

    // Defensive: If scene is null (should be caught by Suspense, but just in case)
    if (!scene) return null;

    useEffect(() => {
        // Critical: Double-check scene exists and has traverse method
        if (!scene || typeof scene.traverse !== 'function') {
            console.error('❌ Invalid scene object:', scene);
            return;
        }

        // 1. Apply Shader Fixes & Safe Traversal
        try {
            // Apply the shader patch to fix 'geometryNormal' errors
            fixSplineSceneShaders(scene);

            scene.traverse((object: any) => {
                if (object.isMesh) {
                    object.castShadow = true;
                    object.receiveShadow = true;
                    // Ensure frustum culling doesn't hide the robot if bounds are off
                    object.frustumCulled = false;
                }
                // Remove embedded cameras to avoid conflicts with R3F camera
                if (object.isCamera) {
                    object.visible = false;
                    if (object.parent) {
                        object.parent.remove(object);
                    }
                }
            });
        } catch (err) {
            console.error('❌ Error traversing/patching scene:', err);
        }

        // 2. Animation Setup
        // Spline scenes often have animations embedded.
        if (scene.animations && scene.animations.length > 0) {
            mixerRef.current = new THREE.AnimationMixer(scene);
            scene.animations.forEach((clip: THREE.AnimationClip) => {
                const action = mixerRef.current?.clipAction(clip);
                action?.play();
            });
        }

        // 3. Notify Parent
        if (onLoaded) onLoaded();

    }, [scene, onLoaded]);

    // 4. Animation Loop
    useFrame((state, delta) => {
        if (mixerRef.current) {
            mixerRef.current.update(delta);
        }
    });

    return (
        <primitive
            object={scene}
            scale={1}
            position={[0, 0, 0]} // Reset to origin for proven camera config
        />
    );
}
