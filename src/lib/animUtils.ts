// src/lib/animUtils.ts
/**
 * Frame-rate independent animation utilities for high-FPS (120-240) support
 * All interpolation functions use dt (delta time) for consistent behavior
 */

import * as THREE from 'three';

/**
 * Frame-rate independent linear interpolation
 * @param current - Current value
 * @param target - Target value
 * @param speed - Interpolation speed (higher = faster, typically 5-20)
 * @param dt - Delta time in seconds
 */
export const lerp = (current: number, target: number, speed: number, dt: number): number => {
    return current + (target - current) * Math.min(1, speed * dt);
};

/**
 * Exponential smoothing with frame-rate independence
 * Provides smoother motion at high FPS while maintaining consistency
 * @param current - Current value
 * @param target - Target value
 * @param smoothing - Smoothing factor (0-1, lower = smoother, typically 0.1-0.3)
 * @param dt - Delta time in seconds
 */
export const expSmooth = (current: number, target: number, smoothing: number, dt: number): number => {
    // Convert smoothing to frame-rate independent factor
    // Using exponential decay: new = current + (target - current) * (1 - e^(-smoothing * dt * 60))
    const alpha = 1 - Math.exp(-smoothing * dt * 60);
    return current + (target - current) * alpha;
};

/**
 * Map a value from one range to another
 */
export const mapRange = (
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
): number => {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

/**
 * Clamp a value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
    return Math.max(min, Math.min(max, value));
};

/**
 * Ease-out cubic function for smoother deceleration
 */
export const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
};

/**
 * Frame-rate independent quaternion slerp
 * @param current - Current quaternion
 * @param target - Target quaternion
 * @param speed - Interpolation speed (typically 5-15)
 * @param dt - Delta time in seconds
 */
export const slerpQuat = (
    current: THREE.Quaternion,
    target: THREE.Quaternion,
    speed: number,
    dt: number
): THREE.Quaternion => {
    const alpha = Math.min(1, speed * dt);
    return current.clone().slerp(target, alpha);
};

/**
 * Create a quaternion from Euler angles with clamping
 * Reuses quaternion to avoid allocations
 */
const _tempQuat = new THREE.Quaternion();
const _tempEuler = new THREE.Euler();

export const createClampedRotation = (
    x: number,
    y: number,
    z: number,
    maxX: number,
    maxY: number,
    maxZ: number
): THREE.Quaternion => {
    const clampedX = clamp(x, -maxX, maxX);
    const clampedY = clamp(y, -maxY, maxY);
    const clampedZ = clamp(z, -maxZ, maxZ);

    _tempEuler.set(clampedX, clampedY, clampedZ, 'XYZ');
    _tempQuat.setFromEuler(_tempEuler);

    return _tempQuat.clone();
};

/**
 * Degrees to radians conversion
 */
export const degToRad = (degrees: number): number => {
    return degrees * (Math.PI / 180);
};

/**
 * Simple FPS counter for performance monitoring
 */
export class FPSCounter {
    private frames: number[] = [];
    private lastTime = performance.now();

    update(): number {
        const now = performance.now();
        const delta = now - this.lastTime;
        this.lastTime = now;

        if (delta > 0) {
            const fps = 1000 / delta;
            this.frames.push(fps);

            // Keep last 60 frames
            if (this.frames.length > 60) {
                this.frames.shift();
            }
        }

        return this.getAverage();
    }

    getAverage(): number {
        if (this.frames.length === 0) return 60;
        return this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
    }

    getCurrent(): number {
        return this.frames[this.frames.length - 1] || 60;
    }
}

/**
 * Device capability detection for adaptive LOD
 */
export interface DeviceCapability {
    tier: 'high' | 'medium' | 'low';
    targetFPS: number;
    enablePostProcessing: boolean;
    enableMicroMotion: boolean;
}

export const detectDeviceCapability = (): DeviceCapability => {
    // Check hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency || 4;

    // Check device memory (if available)
    const memory = (navigator as any).deviceMemory || 4;

    // Check if mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Determine tier
    let tier: 'high' | 'medium' | 'low' = 'medium';

    if (cores >= 8 && memory >= 8 && !isMobile) {
        tier = 'high';
    } else if (cores <= 4 || memory <= 4 || isMobile) {
        tier = 'low';
    }

    // Set capabilities based on tier
    return {
        tier,
        targetFPS: tier === 'high' ? 120 : tier === 'medium' ? 60 : 30,
        enablePostProcessing: tier === 'high',
        enableMicroMotion: tier !== 'low',
    };
};
