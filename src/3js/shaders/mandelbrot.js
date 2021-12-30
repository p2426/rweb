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
        u_pos: {
            value: new THREE.Vector2(0.0, 0.0)
        },
        u_scale: {
            value: new THREE.Vector2(4.0, 4.0)
        },
        u_angle: {
            value: 0.0
        },
        // u_palette: {
        //     value: new THREE.TextureLoader().load('./textures/pal.png')
        // }
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

        uniform vec2 u_resolution;  // Canvas size in pixels
        uniform float u_time;       // Elapsed time since instantiated
        uniform vec2 u_pos;
        uniform vec2 u_scale;
        uniform float u_angle;
        // uniform sampler2D u_palette;
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
            vec2 transform = vec2(u_pos + (vUv - 0.5) * u_scale);
            transform = rotate(transform, u_pos, u_angle);

            vec2 z = vec2(0, 0);
            float i;
            for (i = 0.0; i < MAX_ITERATIONS; i++) {
                z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + transform;
                if (length(z) > 2.0) break;
            }

            // gl_FragColor = texture2D(u_palette, vec2((i == MAX_ITERATIONS ? 0.0 : i) / 100.0));
            gl_FragColor = vec4(vec3(i / MAX_ITERATIONS), 1.0);
        }
    `;

    constructor(...args) {
        super(...args);
    }
}