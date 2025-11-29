'use client';

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { RobotModel } from './RobotModel';
import { Loader2 } from 'lucide-react';

/**
 * RobotScene Component
 * Using PROVEN camera configuration that worked before dashboard features
 * Camera position: [0, 248.98, 360] - This is the EXACT config that worked!
 */
export default function RobotScene() {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className="w-full h-full relative bg-gradient-to-b from-slate-50 to-slate-100">

            {/* Loading Overlay */}
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <div className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <p className="text-sm font-semibold text-slate-600">Loading Neural Core...</p>
                    </div>
                </div>
            )}

            <Canvas
                className="w-full h-full"
                // CRITICAL: Using EXACT camera config that worked before
                camera={{
                    position: [0, 248.98, 360],
                    fov: 45,
                    near: 70,
                    far: 100000
                }}
                shadows
                dpr={[1, 2]}
                gl={{
                    antialias: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    outputEncoding: THREE.sRGBEncoding
                }}
            >
                {/* Lighting: Studio Setup */}
                <ambientLight intensity={0.4} color="#ffffff" />
                <directionalLight
                    position={[5, 5, 5]}
                    intensity={1.2}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />
                <directionalLight
                    position={[-3, 2, -5]}
                    intensity={0.5}
                />
                <directionalLight
                    position={[0, -5, -5]}
                    intensity={0.3}
                />

                {/* Robot Model with Safe Loader */}
                <Suspense fallback={null}>
                    <RobotModel
                        url="https://prod.spline.design/zTI9YYJSoNLYkzol/scene.splinecode"
                        onLoaded={() => setIsLoaded(true)}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
