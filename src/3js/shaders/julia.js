import * as THREE from 'three';
import { CustomShader } from "./customshader";

export class JuliaShader extends CustomShader {
    uniforms = {
        u_time: {
            value: 0.0
        },
        u_resolution: {
            value: new THREE.Vector2(0.0, 0.0)
        },
        u_pos: {
            value: new THREE.Vector2(0.0, 0.0)
        },
        u_scale: {
            value: new THREE.Vector2(4.0, 4.0)
        },
        u_angle: {
            value: 0.0
        },
        u_seed: {
            value: new THREE.Vector2(0.35, 0.4)
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
        precision highp float;
        #define MAX_ITERATIONS 255.0

        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec2 u_pos;
        uniform vec2 u_scale;
        uniform float u_angle;
        uniform vec2 u_seed;
        varying vec2 vUv;

        // Rotate around a point in 2D space
        vec2 rotate(vec2 p, vec2 pivot, float a) {
            float s = sin(a);
            float c = cos(a);

            p -= pivot;
            p = vec2(p.x * c - p.y * s, p.x * s + p.y * c);
            p += pivot;

            return p;
        }

        void main() {
            vec2 z = vec2(u_pos + (vUv - 0.5) * u_scale);
            z = rotate(z, u_pos, u_angle);
            z.x += 0.5;

            float i;
            for (i = 0.0; i < MAX_ITERATIONS; i++) {
                z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + u_seed;
                if (length(z) > 2.0) break;
            }

            float smoothCol = i - log2(log2(dot(z, z)));
            smoothCol = mix(i, smoothCol, 1.0);
            vec3 col = vec3(0.5 + 0.5 * cos(3.0 + smoothCol * 0.15 + vec3(0.0, 0.6, 1.0)));

            gl_FragColor = vec4(col, 1.0);
        }
    `;

    constructor(...args) {
        super(...args);
    }
}