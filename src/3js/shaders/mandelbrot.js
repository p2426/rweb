import * as THREE from 'three';
import { CustomShader } from "./customshader";

export class MandelbrotShader extends CustomShader {
    uniforms = {
        u_time: {
            value: 0.0
        },
        u_resolution: {
            value: new THREE.Vector2(0.0, 0.0)
        },
        u_posScale: {
            value: new THREE.Vector4(0.0, 0.0, 4.0, 4.0)
        }
    };

    // Vertex Shader
    vertexContent = `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `;

    // Fragment Shader
    fragmentContent = `
        #define MAX_ITERATIONS 255.0

        uniform vec2 u_resolution;  // Canvas size in pixels
        uniform float u_time;       // Elapsed time since instantiated
        uniform vec4 u_posScale;
        varying vec2 vUv;

        void main() {
            vec2 transform = vec2(u_posScale.xy + (vUv - 0.5) * u_posScale.zw);
            vec2 z = vec2(0, 0);
            float i;
            for (i = 0.0; i < MAX_ITERATIONS; i++) {
                z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + transform;
                if (length(z) > 2.0) break;
            }
            gl_FragColor = vec4(vec3(i / MAX_ITERATIONS), 1.0);
        }
    `;

    constructor(...args) {
        super(...args);
    }
}