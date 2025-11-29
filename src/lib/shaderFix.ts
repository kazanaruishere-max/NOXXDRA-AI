import * as THREE from 'three';

/**
 * Shader Fix Injector for Spline/Three.js r160+ Compatibility
 * 
 * Fixes:
 * 1. 'geometryNormal' : undeclared identifier (by replacing usage with vNormal)
 * 2. 'geometryNormal' : redefinition (by removing conflicting declarations)
 * 3. 'unroll_loop_start' : unrecognized pragma (removed)
 */
export function patchMaterialShader(material: THREE.Material) {
    // Strict Idempotency Check
    if (material.userData.shaderFixApplied) return;
    material.userData.shaderFixApplied = true;

    if (!material.onBeforeCompile) return;

    const originalOnBeforeCompile = material.onBeforeCompile;

    material.onBeforeCompile = (shader, renderer) => {
        if (originalOnBeforeCompile) {
            originalOnBeforeCompile(shader, renderer);
        }

        // --- Fix 1: 'geometryNormal' undeclared identifier ---
        // We replace 'geometryNormal' with 'normalize(vNormal)' in specific usage patterns.
        // This fixes the "undeclared" error without defining a new variable.

        shader.fragmentShader = shader.fragmentShader.replace(
            /dFdx\(\s*geometryNormal\s*\)/g,
            'dFdx( normalize(vNormal) )'
        );

        shader.fragmentShader = shader.fragmentShader.replace(
            /dFdy\(\s*geometryNormal\s*\)/g,
            'dFdy( normalize(vNormal) )'
        );

        // --- Fix 2: 'geometryNormal' redefinition ---
        // If the shader somehow contains "vec3 geometryNormal = ...", we REMOVE it to prevent redefinition errors.
        // This handles cases where Spline or Three.js might inject it, causing conflicts.
        // We replace it with a comment or empty string.

        // Regex to match "vec3 geometryNormal = ...;"
        // We be careful not to match partial words.
        shader.fragmentShader = shader.fragmentShader.replace(
            /vec3\s+geometryNormal\s*=\s*[^;]+;/g,
            '// geometryNormal declaration removed by shaderFix'
        );

        // --- Fix 3: 'unroll_loop' pragmas ---
        const pragmas = [
            '#pragma unroll_loop_start',
            '#pragma unroll_loop_end',
            '#pragma unroll_loop'
        ];

        pragmas.forEach(pragma => {
            const regex = new RegExp(pragma, 'g');
            shader.fragmentShader = shader.fragmentShader.replace(regex, '');
            shader.vertexShader = shader.vertexShader.replace(regex, '');
        });

        // console.log('✅ Material patched:', material.name);
    };

    material.needsUpdate = true;
}

/**
 * Recursive function to patch all materials in a scene/object
 */
export function fixSplineSceneShaders(object: THREE.Object3D) {
    object.traverse((child: any) => {
        if (child.isMesh && child.material) {
            if (Array.isArray(child.material)) {
                child.material.forEach(patchMaterialShader);
            } else {
                patchMaterialShader(child.material);
            }

            // Ensure visibility and shadows
            child.castShadow = true;
            child.receiveShadow = true;
            child.frustumCulled = false;
        }
    });
}
