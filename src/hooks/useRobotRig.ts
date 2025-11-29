// src/hooks/useRobotRig.ts
/**
 * Advanced robot rig controller with procedural idle animations
 * Supports cursor tracking, breathing, jitter, and weight-shift
 */

'use client';

import { useRef, useCallback } from 'react';
import * as THREE from 'three';
import {
    degToRad,
    createClampedRotation,
    slerpQuat,
    smoothNoise,
    ROTATION_LIMITS,
    SMOOTHING,
    IDLE_ANIMATION,
} from '@/lib/math';

// ============================================================================
// TYPES
// ============================================================================

interface BoneRefs {
    head?: THREE.Object3D;
    neck?: THREE.Object3D;
    chest?: THREE.Object3D;
    spine?: THREE.Object3D;
    leftShoulder?: THREE.Object3D;
    rightShoulder?: THREE.Object3D;
    leftEye?: THREE.Object3D;
    rightEye?: THREE.Object3D;
}

interface UpdateParams {
    nx: number;  // Normalized cursor X
    ny: number;  // Normalized cursor Y
    dt: number;  // Delta time
}

// ============================================================================
// REUSABLE OBJECTS (prevent GC)
// ============================================================================

const _targetQuat = new THREE.Quaternion();
const _identityQuat = new THREE.Quaternion();

// ============================================================================
// HOOK
// ============================================================================

export function useRobotRig(rootObject?: THREE.Object3D | null) {
    const bonesRef = useRef<BoneRefs>({});
    const timeRef = useRef(0);
    const jitterTimeRef = useRef(0);
    const weightShiftTimeRef = useRef(0);

    // ==========================================================================
    // BONE DISCOVERY
    // ==========================================================================
    const findBones = useCallback((root: THREE.Object3D) => {
        const bones: BoneRefs = {};

        root.traverse((child) => {
            const name = child.name.toLowerCase();

            // Partial matching for flexibility with Spline naming
            if (name.includes('head') && !name.includes('neck')) {
                bones.head = child;
            } else if (name.includes('neck')) {
                bones.neck = child;
            } else if (
                name.includes('chest') ||
                name.includes('spine2') ||
                name.includes('upperspine')
            ) {
                bones.chest = child;
            } else if (
                name.includes('spine') &&
                !name.includes('2') &&
                !name.includes('upper')
            ) {
                bones.spine = child;
            } else if (
                (name.includes('shoulder') || name.includes('clavicle')) &&
                (name.includes('l') || name.includes('left'))
            ) {
                bones.leftShoulder = child;
            } else if (
                (name.includes('shoulder') || name.includes('clavicle')) &&
                (name.includes('r') || name.includes('right'))
            ) {
                bones.rightShoulder = child;
            } else if (
                name.includes('eye') &&
                (name.includes('l') || name.includes('left'))
            ) {
                bones.leftEye = child;
            } else if (
                name.includes('eye') &&
                (name.includes('r') || name.includes('right'))
            ) {
                bones.rightEye = child;
            }
        });

        bonesRef.current = bones;

        // Log found bones
        console.log('🤖 Robot bones found:', {
            head: !!bones.head,
            neck: !!bones.neck,
            chest: !!bones.chest,
            spine: !!bones.spine,
            leftShoulder: !!bones.leftShoulder,
            rightShoulder: !!bones.rightShoulder,
            leftEye: !!bones.leftEye,
            rightEye: !!bones.rightEye,
        });
    }, []);

    // Initialize bones when root is provided
    if (rootObject && Object.keys(bonesRef.current).length === 0) {
        findBones(rootObject);
    }

    // ==========================================================================
    // MAIN UPDATE FUNCTION
    // ==========================================================================
    const updateRig = useCallback(({ nx, ny, dt }: UpdateParams) => {
        const bones = bonesRef.current;

        // Update time accumulators
        timeRef.current += dt;
        jitterTimeRef.current += dt;
        weightShiftTimeRef.current += dt;

        // ========================================================================
        // PROCEDURAL IDLE ANIMATIONS
        // ========================================================================

        // Breathing (chest expansion)
        const breathingPhase = Math.sin(timeRef.current * Math.PI * 2 * IDLE_ANIMATION.BREATHING_SPEED);
        const breathingScale = 1 + breathingPhase * IDLE_ANIMATION.BREATHING_AMPLITUDE;

        // Micro jitter (random head movement)
        const jitterX = smoothNoise(jitterTimeRef.current, IDLE_ANIMATION.JITTER_FREQUENCY) *
            IDLE_ANIMATION.JITTER_AMPLITUDE;
        const jitterY = smoothNoise(jitterTimeRef.current + 100, IDLE_ANIMATION.JITTER_FREQUENCY) *
            IDLE_ANIMATION.JITTER_AMPLITUDE * 0.5;

        // Weight shift (slow side-to-side sway)
        const weightShift = Math.sin(weightShiftTimeRef.current * Math.PI * 2 * IDLE_ANIMATION.WEIGHT_SHIFT_SPEED) *
            IDLE_ANIMATION.WEIGHT_SHIFT_AMPLITUDE;

        // ========================================================================
        // HEAD: Cursor tracking + idle jitter
        // ========================================================================
        if (bones.head) {
            const targetYaw = nx * ROTATION_LIMITS.HEAD_YAW + jitterX;
            const targetPitch = -ny * ROTATION_LIMITS.HEAD_PITCH + jitterY;

            _targetQuat.copy(
                createClampedRotation(
                    targetYaw,
                    targetPitch,
                    0,
                    ROTATION_LIMITS.HEAD_YAW + 5, // Allow jitter to exceed slightly
                    ROTATION_LIMITS.HEAD_PITCH + 3,
                    0
                )
            );

            slerpQuat(bones.head.quaternion, _targetQuat, SMOOTHING.HEAD, dt);
        }

        // ========================================================================
        // NECK: 60% of head rotation
        // ========================================================================
        if (bones.neck) {
            const targetYaw = nx * ROTATION_LIMITS.NECK_YAW * 0.6;
            const targetPitch = -ny * ROTATION_LIMITS.NECK_PITCH * 0.6;

            _targetQuat.copy(
                createClampedRotation(
                    targetYaw,
                    targetPitch,
                    0,
                    ROTATION_LIMITS.NECK_YAW,
                    ROTATION_LIMITS.NECK_PITCH,
                    0
                )
            );

            slerpQuat(bones.neck.quaternion, _targetQuat, SMOOTHING.NECK, dt);
        }

        // ========================================================================
        // CHEST: 40% of head rotation + breathing + weight shift
        // ========================================================================
        if (bones.chest) {
            const targetYaw = nx * ROTATION_LIMITS.CHEST_YAW * 0.4 + weightShift;
            const targetPitch = -ny * ROTATION_LIMITS.CHEST_PITCH * 0.4;

            _targetQuat.copy(
                createClampedRotation(
                    targetYaw,
                    targetPitch,
                    0,
                    ROTATION_LIMITS.CHEST_YAW + 2,
                    ROTATION_LIMITS.CHEST_PITCH,
                    0
                )
            );

            slerpQuat(bones.chest.quaternion, _targetQuat, SMOOTHING.CHEST, dt);

            // Apply breathing scale
            bones.chest.scale.setScalar(breathingScale);
        }

        // ========================================================================
        // SPINE: 20% of head rotation + breathing
        // ========================================================================
        if (bones.spine) {
            const targetYaw = nx * ROTATION_LIMITS.CHEST_YAW * 0.2 + weightShift * 0.5;
            const targetPitch = -ny * ROTATION_LIMITS.CHEST_PITCH * 0.2;

            _targetQuat.copy(
                createClampedRotation(
                    targetYaw,
                    targetPitch,
                    0,
                    ROTATION_LIMITS.CHEST_YAW,
                    ROTATION_LIMITS.CHEST_PITCH,
                    0
                )
            );

            slerpQuat(bones.spine.quaternion, _targetQuat, SMOOTHING.CHEST * 0.8, dt);

            // Subtle breathing
            bones.spine.scale.setScalar(1 + breathingPhase * IDLE_ANIMATION.BREATHING_AMPLITUDE * 0.5);
        }

        // ========================================================================
        // SHOULDERS: Micro adjustment based on cursor
        // ========================================================================
        if (bones.leftShoulder) {
            const targetRoll = -nx * 3; // Subtle roll

            _targetQuat.copy(
                createClampedRotation(0, 0, targetRoll, 0, 0, 5)
            );

            slerpQuat(bones.leftShoulder.quaternion, _targetQuat, SMOOTHING.CHEST * 0.5, dt);
        }

        if (bones.rightShoulder) {
            const targetRoll = nx * 3;

            _targetQuat.copy(
                createClampedRotation(0, 0, targetRoll, 0, 0, 5)
            );

            slerpQuat(bones.rightShoulder.quaternion, _targetQuat, SMOOTHING.CHEST * 0.5, dt);
        }

        // ========================================================================
        // EYES: Exaggerated tracking with offset
        // ========================================================================
        if (bones.leftEye) {
            const targetYaw = nx * ROTATION_LIMITS.EYE_OFFSET;
            const targetPitch = -ny * ROTATION_LIMITS.EYE_OFFSET;

            _targetQuat.copy(
                createClampedRotation(
                    targetYaw,
                    targetPitch,
                    0,
                    ROTATION_LIMITS.EYE_OFFSET,
                    ROTATION_LIMITS.EYE_OFFSET,
                    0
                )
            );

            slerpQuat(bones.leftEye.quaternion, _targetQuat, SMOOTHING.EYES, dt);
        }

        if (bones.rightEye) {
            const targetYaw = nx * ROTATION_LIMITS.EYE_OFFSET;
            const targetPitch = -ny * ROTATION_LIMITS.EYE_OFFSET;

            _targetQuat.copy(
                createClampedRotation(
                    targetYaw,
                    targetPitch,
                    0,
                    ROTATION_LIMITS.EYE_OFFSET,
                    ROTATION_LIMITS.EYE_OFFSET,
                    0
                )
            );

            slerpQuat(bones.rightEye.quaternion, _targetQuat, SMOOTHING.EYES, dt);
        }
    }, []);

    return { updateRig, bones: bonesRef.current };
}
