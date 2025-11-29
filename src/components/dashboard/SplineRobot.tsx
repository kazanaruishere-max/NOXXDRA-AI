'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import SplineLoader from '@splinetool/loader';

/**
 * Robot scene with built-in cursor tracking and idle animations
 */
function RobotScene() {
    const { scene } = useThree();
    const [splineRoot, setSplineRoot] = useState<THREE.Object3D | null>(null);

    // Cursor tracking refs
    const cursorRef = useRef({ x: 0, y: 0 });
    const targetRef = useRef({ x: 0, y: 0 });

    // Bone refs
    const bonesRef = useRef<{
        head?: THREE.Object3D;
        neck?: THREE.Object3D;
        chest?: THREE.Object3D;
        spine?: THREE.Object3D;
    }>({});

    // Time ref for idle animations
    const timeRef = useRef(0);

    // Mouse move handler
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Normalize to -1 to 1
            targetRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            targetRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

            console.log('🖱️ Mouse:', targetRef.current);
        };

        window.addEventListener('mousemove', handleMouseMove);
        console.log('✅ Mouse listener attached');

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // Load Spline scene
    useEffect(() => {
        const loader = new SplineLoader();

        console.log('🎬 Loading Spline scene...');

        loader.load(
            'https://prod.spline.design/zTI9YYJSoNLYkzol/scene.splinecode',
            (loadedScene) => {
                scene.add(loadedScene);
                setSplineRoot(loadedScene);

                console.log('✅ Spline scene loaded');

                // Find bones
                const bones: any = {};
                loadedScene.traverse((child) => {
                    const name = child.name.toLowerCase();

                    if (name.includes('head') && !name.includes('neck')) {
                        bones.head = child;
                        console.log('🎯 Found HEAD:', child.name);
                    } else if (name.includes('neck')) {
                        bones.neck = child;
                        console.log('🎯 Found NECK:', child.name);
                    } else if (name.includes('chest') || name.includes('spine2')) {
                        bones.chest = child;
                        console.log('🎯 Found CHEST:', child.name);
                    } else if (name.includes('spine') && !name.includes('2')) {
                        bones.spine = child;
                        console.log('🎯 Found SPINE:', child.name);
                    }
                });

                bonesRef.current = bones;
                console.log('🤖 Bones ready:', {
                    head: !!bones.head,
                    neck: !!bones.neck,
                    chest: !!bones.chest,
                    spine: !!bones.spine
                });
            },
            undefined,
            (error) => {
                console.error('❌ Error loading:', error);
            }
        );

        return () => {
            if (splineRoot) {
                scene.remove(splineRoot);
            }
        };
    }, [scene]);

    // Animation loop
    useFrame((state, delta) => {
        if (!splineRoot) return;

        // Smooth cursor tracking
        cursorRef.current.x += (targetRef.current.x - cursorRef.current.x) * 0.1;
        cursorRef.current.y += (targetRef.current.y - cursorRef.current.y) * 0.1;

        // Update time for idle animations
        timeRef.current += delta;

        const bones = bonesRef.current;
        const { x, y } = cursorRef.current;

        // Breathing animation
        const breathe = Math.sin(timeRef.current * 2) * 0.02;

        // HEAD - Follow cursor strongly
        if (bones.head) {
            bones.head.rotation.y = THREE.MathUtils.lerp(
                bones.head.rotation.y,
                x * 0.5,
                0.1
            );
            bones.head.rotation.x = THREE.MathUtils.lerp(
                bones.head.rotation.x,
                y * 0.3,
                0.1
            );
        }

        // NECK - Follow cursor moderately
        if (bones.neck) {
            bones.neck.rotation.y = THREE.MathUtils.lerp(
                bones.neck.rotation.y,
                x * 0.3,
                0.08
            );
            bones.neck.rotation.x = THREE.MathUtils.lerp(
                bones.neck.rotation.x,
                y * 0.2,
                0.08
            );
        }

        // CHEST - Follow cursor subtly + breathing
        if (bones.chest) {
            bones.chest.rotation.y = THREE.MathUtils.lerp(
                bones.chest.rotation.y,
                x * 0.15,
                0.05
            );
            bones.chest.rotation.x = THREE.MathUtils.lerp(
                bones.chest.rotation.x,
                y * 0.1,
                0.05
            );
            bones.chest.scale.setScalar(1 + breathe);
        }

        // SPINE - Very subtle + breathing
        if (bones.spine) {
            bones.spine.rotation.y = THREE.MathUtils.lerp(
                bones.spine.rotation.y,
                x * 0.08,
                0.04
            );
            bones.spine.scale.setScalar(1 + breathe * 0.5);
        }
    });

    return null;
}

/**
 * Lighting
 */
function Lights() {
    return (
        <>
            <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
            <directionalLight position={[-3, 2, -5]} intensity={0.5} />
            <directionalLight position={[0, -5, -5]} intensity={0.3} />
            <ambientLight intensity={0.4} />
        </>
    );
}

/**
 * Main component
 */
export default function SplineRobot() {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="relative w-full h-full overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                        <p className="text-sm text-gray-600">Loading robot...</p>
                    </div>
                </div>
            )}

            <Canvas
                camera={{ position: [0, 248.98, 360], fov: 45, near: 70, far: 100000 }}
                gl={{ antialias: true, alpha: true }}
                onCreated={() => {
                    setIsLoading(false);
                    console.log('🎨 Canvas ready');
                }}
                frameloop="always"
                style={{ background: '#e2e2e2' }}
            >
                <Lights />
                <RobotScene />
            </Canvas>
        </div>
    );
}
