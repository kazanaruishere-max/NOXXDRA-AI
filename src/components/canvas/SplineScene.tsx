'use client';

import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import SplineLoader from '@splinetool/loader';

/**
 * CameraRig Component
 * Enforces the "Zero Degree Azimuth" and "Eye-Level Elevation" rules.
 * This component runs inside the Canvas and has access to the R3F state.
 */
function CameraRig() {
    const { camera, controls } = useThree();
    const controlsRef = useRef<any>(null);

    // Force Camera Alignment on Mount
    useEffect(() => {
        // 1. Force Position: X=0 (Center), Y=1.5 (Eye Level), Z=35 (Distance)
        const targetPosition = new THREE.Vector3(0, 1.5, 35);

        // 2. Force Target: Look at the robot's head/chest (Y=1.5)
        const targetLookAt = new THREE.Vector3(0, 1.5, 0);

        camera.position.copy(targetPosition);
        camera.lookAt(targetLookAt);

        // 3. Update Controls if they exist
        if (controls) {
            // @ts-ignore
            controls.target.copy(targetLookAt);
            // @ts-ignore
            controls.update();
        }

        console.log('🎥 Camera Rig Locked: [0, 1.5, 35] -> [0, 1.5, 0]');
    }, [camera, controls]);

    return null; // This component is logic-only
}

/**
 * SplineContent Component
 * Loads the scene and removes embedded cameras to prevent conflicts.
 */
function SplineContent() {
    const url = 'https://prod.spline.design/zTI9YYJSoNLYkzol/scene.splinecode';
    const scene = useLoader(SplineLoader, url);

    // Ref to the primitive to access the loaded object
    const primitiveRef = useRef<any>(null);

    useEffect(() => {
        if (scene) {
            // TRAVERSAL: Remove embedded cameras and lights if needed
            // We want to rely on our own R3F camera and lights (or keep Spline lights if they are good)
            scene.traverse((object: any) => {
                if (object.isCamera) {
                    console.log('🚫 Removing Embedded Spline Camera:', object.name);
                    object.parent?.remove(object);
                }
            });
        }
    }, [scene]);

    return (
        <primitive
            ref={primitiveRef}
            object={scene}
            scale={1} // Ensure scale is normalized
            position={[0, -5, 0]} // Offset Y to bring robot to floor level if needed (adjust based on model)
        />
    );
}

/**
 * SplineScene Component
 * The main entry point.
 */
export default function SplineScene() {
    return (
        <div className="w-full h-full relative">
            <Canvas
                className="w-full h-full"
                shadows
                dpr={[1, 2]} // Optimization for high DPI screens
                gl={{
                    antialias: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    outputEncoding: THREE.sRGBEncoding,
                    alpha: true
                }}
            >
                {/* R3F Camera: Explicitly defined to override anything else */}
                <PerspectiveCamera
                    makeDefault
                    position={[0, 1.5, 35]}
                    fov={45}
                    near={0.1}
                    far={1000}
                />

                {/* Controls: Locked to prevent extreme rotation */}
                <OrbitControls
                    enablePan={false}
                    enableZoom={false}
                    minPolarAngle={Math.PI / 2 - 0.1} // Limit vertical rotation (almost horizontal)
                    maxPolarAngle={Math.PI / 2 + 0.1}
                    minAzimuthAngle={-Math.PI / 6} // Limit horizontal rotation (+/- 30 deg)
                    maxAzimuthAngle={Math.PI / 6}
                    target={[0, 1.5, 0]} // Lock target to head height
                    makeDefault
                />

                {/* The Rig Logic */}
                <CameraRig />

                {/* Lighting: Add our own to ensure visibility if Spline lights are removed/dim */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
                <spotLight position={[0, 10, 0]} intensity={0.8} penumbra={1} />

                {/* Async Loader */}
                <Suspense fallback={null}>
                    <SplineContent />
                </Suspense>
            </Canvas>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#f8fafc] via-transparent to-transparent opacity-50" />
        </div>
    );
}
