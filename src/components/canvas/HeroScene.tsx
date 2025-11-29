'use client';

import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import SplineLoader from '@splinetool/loader';

/**
 * SplineObject Component
 * Loads and renders the Spline scene using useLoader and primitive.
 */
function SplineObject() {
    const scene = useLoader(SplineLoader, 'https://prod.spline.design/zTI9YYJSoNLYkzol/scene.splinecode');

    // Cleanup or adjustments if needed
    useEffect(() => {
        return () => {
            // Optional cleanup
        };
    }, [scene]);

    return <primitive object={scene} />;
}

/**
 * CameraController Component
 * Forces the camera alignment and manages controls.
 */
function CameraController() {
    const { camera } = useThree();
    const controlsRef = useRef<any>(null);

    useEffect(() => {
        if (camera && controlsRef.current) {
            // FORCE FRONTAL ALIGNMENT
            camera.position.set(0, 10, 35);
            camera.lookAt(0, 10, 0);

            controlsRef.current.target.set(0, 10, 0);
            controlsRef.current.update();

            console.log('🎥 Camera Vector Forced: [0, 10, 35]');
        }
    }, [camera]);

    return (
        <OrbitControls
            ref={controlsRef}
            enableZoom={false}
            enablePan={false}
            minAzimuthAngle={-Math.PI / 6}
            maxAzimuthAngle={Math.PI / 6}
            minPolarAngle={Math.PI / 2 - 0.1}
            maxPolarAngle={Math.PI / 2 + 0.1}
            rotateSpeed={0.5}
            target={[0, 10, 0]}
        />
    );
}

/**
 * HeroScene Component
 * Main entry point for the 3D scene.
 */
export default function HeroScene() {
    return (
        <div className="w-full h-full relative">
            <Canvas
                className="w-full h-full"
                camera={{
                    position: [0, 10, 35],
                    fov: 45,
                    near: 0.1,
                    far: 1000
                }}
                gl={{
                    antialias: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    outputEncoding: THREE.sRGBEncoding,
                    alpha: true
                }}
            >
                <Suspense fallback={null}>
                    <SplineObject />
                </Suspense>

                <CameraController />

                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 10]} intensity={1} />
            </Canvas>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#f8fafc] via-transparent to-transparent opacity-50" />
        </div>
    );
}
