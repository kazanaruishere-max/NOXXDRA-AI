// src/components/RobotHero.tsx
/**
 * Cinematic robot hero - Robot ALWAYS VISIBLE with camera intro animation
 * Robot is active and animating from the start, camera moves around it
 */

'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import SplineLoader from '@splinetool/loader';
import { useCursorTracker } from '@/hooks/useCursorTracker';
import { useRobotRig } from '@/hooks/useRobotRig';
import { easeOutExpo } from '@/lib/math';

// ============================================================================
// CINEMATIC INTRO CONFIGURATION
// ============================================================================

const INTRO_CONFIG = {
    DURATION: 2.2,                                // Total intro duration (seconds)
    START_POS: new THREE.Vector3(0, 0.2, 0.8),   // Close-up position
    END_POS: new THREE.Vector3(0, 0.1, 1.8),     // Hero angle position
    START_FOV: 38,                                // Close-up field of view
    END_FOV: 45,                                  // Hero angle field of view
    MAX_ROLL: 2,                                  // Max camera roll (degrees)
} as const;

// ============================================================================
// ROBOT SCENE COMPONENT
// ============================================================================

interface RobotSceneProps {
    onIntroComplete?: () => void;
}

function RobotScene({ onIntroComplete }: RobotSceneProps) {
    const { scene, camera } = useThree();
    const [splineRoot, setSplineRoot] = useState<THREE.Object3D | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [introComplete, setIntroComplete] = useState(false);

    const cursorPos = useCursorTracker();
    const { updateRig } = useRobotRig(splineRoot);

    const introTimeRef = useRef(0);
    const cameraRef = useRef<THREE.PerspectiveCamera>(camera as THREE.PerspectiveCamera);

    // ==========================================================================
    // LOAD SPLINE SCENE - Robot visible immediately after load
    // ==========================================================================
    useEffect(() => {
        const loader = new SplineLoader();

        console.log('🎬 Loading Spline scene...');

        loader.load(
            'https://prod.spline.design/zTI9YYJSoNLYkzol/scene.splinecode',
            (loadedScene) => {
                // Add to scene immediately - robot is visible from start
                scene.add(loadedScene);
                setSplineRoot(loadedScene);
                setIsLoaded(true);

                console.log('✅ Robot loaded and visible - Starting camera intro');

                // Optional: Print hierarchy in development
                if (process.env.NODE_ENV === 'development') {
                    printHierarchy(loadedScene);
                }
            },
            undefined,
            (error) => {
                console.error('❌ Error loading Spline scene:', error);
                setIsLoaded(true);
                setIntroComplete(true);
            }
        );

        // Cleanup
        return () => {
            if (splineRoot) {
                scene.remove(splineRoot);

                splineRoot.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.geometry?.dispose();

                        if (Array.isArray(child.material)) {
                            child.material.forEach((mat) => mat.dispose());
                        } else if (child.material) {
                            child.material.dispose();
                        }
                    }
                });
            }
        };
    }, [scene]);

    // ==========================================================================
    // ANIMATION LOOP - Camera intro + Robot rig always active
    // ==========================================================================
    useFrame((state, delta) => {
        if (!isLoaded || !splineRoot) return;

        const cam = cameraRef.current;

        // ========================================================================
        // CINEMATIC INTRO ANIMATION (Camera only, robot stays visible)
        // ========================================================================
        if (!introComplete) {
            introTimeRef.current += delta;
            const progress = Math.min(introTimeRef.current / INTRO_CONFIG.DURATION, 1);
            const easedProgress = easeOutExpo(progress);

            // Interpolate camera position
            cam.position.lerpVectors(
                INTRO_CONFIG.START_POS,
                INTRO_CONFIG.END_POS,
                easedProgress
            );

            // Interpolate field of view
            cam.fov = THREE.MathUtils.lerp(
                INTRO_CONFIG.START_FOV,
                INTRO_CONFIG.END_FOV,
                easedProgress
            );
            cam.updateProjectionMatrix();

            // Subtle camera roll (sine wave for smooth motion)
            const rollProgress = Math.sin(progress * Math.PI);
            cam.rotation.z = THREE.MathUtils.degToRad(rollProgress * INTRO_CONFIG.MAX_ROLL);

            // Complete intro
            if (progress >= 1) {
                setIntroComplete(true);
                cam.rotation.z = 0; // Reset roll
                if (onIntroComplete) {
                    onIntroComplete();
                }
                console.log('✅ Camera intro complete');
            }
        }

        // ========================================================================
        // ROBOT RIG UPDATE - ALWAYS ACTIVE (even during intro)
        // ========================================================================
        // Robot is alive from the moment it loads
        updateRig({
            nx: cursorPos.nx,
            ny: cursorPos.ny,
            dt: delta,
        });
    });

    return null;
}

// ============================================================================
// LIGHTING SETUP
// ============================================================================

function Lights() {
    return (
        <>
            {/* Key light */}
            <directionalLight
                position={[5, 5, 5]}
                intensity={1.2}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />

            {/* Fill light */}
            <directionalLight
                position={[-3, 2, -5]}
                intensity={0.5}
            />

            {/* Rim light */}
            <directionalLight
                position={[0, -5, -5]}
                intensity={0.3}
            />

            {/* Ambient light */}
            <ambientLight intensity={0.4} />
        </>
    );
}

// ============================================================================
// LOADING FALLBACK - Simple wireframe placeholder
// ============================================================================

function LoadingFallback() {
    return (
        <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#888" wireframe />
        </mesh>
    );
}

// ============================================================================
// MAIN ROBOT HERO COMPONENT
// ============================================================================

export default function RobotHero() {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div
            className="relative w-full h-full overflow-hidden"
            style={{
                touchAction: 'pan-y',
            }}
        >
            {/* Loading indicator - Only shows before robot loads */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#e2e2e2] z-10">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
                        <p className="text-sm text-gray-600 font-medium">Initializing robot...</p>
                    </div>
                </div>
            )}

            {/* R3F Canvas - Robot visible immediately after load */}
            <Canvas
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                    stencil: false,
                }}
                onCreated={({ gl }) => {
                    gl.setClearColor('#e2e2e2');
                    setIsLoading(false);
                }}
                frameloop="always"
                style={{
                    background: '#e2e2e2',
                    cursor: 'default',
                }}
                dpr={[1.5, 2]}
                onWheel={(e) => e.stopPropagation()}
            >
                {/* Camera starts at close-up position */}
                <PerspectiveCamera
                    makeDefault
                    position={INTRO_CONFIG.START_POS}
                    fov={INTRO_CONFIG.START_FOV}
                    near={0.1}
                    far={100000}
                />

                <Suspense fallback={<LoadingFallback />}>
                    <Lights />
                    <RobotScene />
                </Suspense>
            </Canvas>
        </div>
    );
}

// ============================================================================
// UTILITY: Print hierarchy for debugging
// ============================================================================

function printHierarchy(object: THREE.Object3D, indent = 0) {
    const prefix = '  '.repeat(indent);
    console.log(`${prefix}${object.name || '(unnamed)'} [${object.type}]`);

    object.children.forEach((child) => {
        printHierarchy(child, indent + 1);
    });
}
