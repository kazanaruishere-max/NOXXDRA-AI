// src/lib/math.ts
/**
 * Mathematical utilities for high-performance 3D animation
 * Optimized for 120-240 FPS with minimal allocations
 */

import * as THREE from 'three';

// ============================================================================
// CONSTANTS - Tunable parameters
// ============================================================================

export const ROTATION_LIMITS = {
    HEAD_YAW: 30,      // degrees
    HEAD_PITCH: 18,    // degrees
    NECK_YAW: 18,      // degrees
    NECK_PITCH: 12,    // degrees
    CHEST_YAW: 10,     // degrees
    CHEST_PITCH: 6,    // degrees
    EYE_OFFSET: 8,     // degrees
} as const;

export const SMOOTHING = {
    CURSOR: 0.08,      // Exponential smoothing for cursor (lower = smoother)
    HEAD: 0.12,        // Head rotation smoothing
    NECK: 0.10,        // Neck rotation smoothing
    CHEST: 0.06,       // Chest rotation smoothing
    EYES: 0.15,        // Eye rotation smoothing
} as const;

export const IDLE_ANIMATION = {
    BREATHING_SPEED: 0.8,        // Hz
    BREATHING_AMPLITUDE: 0.015,  // Scale factor
    JITTER_FREQUENCY: 0.25,      // Hz
    JITTER_AMPLITUDE: 0.8,       // Degrees
    WEIGHT_SHIFT_SPEED: 0.15,    // Hz
    WEIGHT_SHIFT_AMPLITUDE: 1.2, // Degrees
} as const;

// ============================================================================
// REUSABLE OBJECTS - Prevent GC pressure
// ============================================================================

const _tempQuat = new THREE.Quaternion();
const _tempEuler = new THREE.Euler();
const _tempVec3 = new THREE.Vector3();

// ============================================================================
// CORE MATH FUNCTIONS
// ============================================================================

/**
 * Frame-rate independent linear interpolation
 */
export const lerp = (current: number, target: number, speed: number, dt: number): number => {
    return current + (target - current) * Math.min(1, speed * dt);
};

/**
 * Exponential smoothing with frame-rate independence
 * Provides ultra-smooth motion at high FPS
 */
export const expSmooth = (current: number, target: number, smoothing: number, dt: number): number => {
    const alpha = 1 - Math.exp(-smoothing * dt * 60);
    return current + (target - current) * alpha;
};

/**
 * Clamp value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
    return Math.max(min, Math.min(max, value));
};

/**
 * Map value from one range to another
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
 * Degrees to radians
 */
export const degToRad = (degrees: number): number => {
    return degrees * (Math.PI / 180);
};

/**
 * Radians to degrees
 */
export const radToDeg = (radians: number): number => {
    return radians * (180 / Math.PI);
};

/**
 * Frame-rate independent quaternion slerp
 * Reuses temporary quaternion to avoid allocations
 */
export const slerpQuat = (
    current: THREE.Quaternion,
    target: THREE.Quaternion,
    speed: number,
    dt: number
): void => {
    const alpha = Math.min(1, speed * dt);
    current.slerp(target, alpha);
};

/**
 * Create clamped rotation quaternion from Euler angles
 * Reuses temporary objects
 */
export const createClampedRotation = (
    yaw: number,
    pitch: number,
    roll: number,
    maxYaw: number,
    maxPitch: number,
    maxRoll: number
): THREE.Quaternion => {
    const clampedYaw = clamp(yaw, -maxYaw, maxYaw);
    const clampedPitch = clamp(pitch, -maxPitch, maxPitch);
    const clampedRoll = clamp(roll, -maxRoll, maxRoll);

    _tempEuler.set(
        degToRad(clampedPitch),
        degToRad(clampedYaw),
        degToRad(clampedRoll),
        'YXZ'
    );

    _tempQuat.setFromEuler(_tempEuler);
    return _tempQuat.clone();
};

/**
 * Smooth noise function for procedural animation
 * Uses Perlin-like interpolation
 */
export const smoothNoise = (time: number, frequency: number): number => {
    const t = time * frequency;
    const i = Math.floor(t);
    const f = t - i;

    // Smooth interpolation
    const u = f * f * (3 - 2 * f);

    // Pseudo-random values
    const a = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
    const b = Math.sin((i + 1) * 12.9898 + 78.233) * 43758.5453;

    const aFrac = a - Math.floor(a);
    const bFrac = b - Math.floor(b);

    return aFrac * (1 - u) + bFrac * u;
};

/**
 * Easing function: Exponential out
 */
export const easeOutExpo = (t: number): number => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

/**
 * Easing function: Cubic in-out
 */
export const easeInOutCubic = (t: number): number => {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
