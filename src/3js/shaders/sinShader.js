import { CustomShader } from "./customshader";

export class SinShader extends CustomShader {
    // Vertex Shader
    vertexContent = `
        void main() {
            gl_Position = vec4(position, 1.0);
        }
    `;

    // Fragment Shader
    fragmentContent = `
        #ifdef GL_ES
        precision mediump float;
        #endif

        #define PI 3.14159265359

        uniform vec2 u_resolution;  // Canvas size in pixels
        uniform float u_time;       // Elapsed time since instantiated

        float makeLine(float x, float y) {
            return smoothstep(x - 0.01, x, y) - smoothstep(x, x + 0.01, y);
        }

        void main() {
            vec2 coords = gl_FragCoord.xy / u_resolution.xy;

            vec3 colour = vec3(0.0);

            float pct = makeLine(coords.y, (sin((coords.x * PI) + (u_time * 2.0)) + 1.2) / 2.4);
            colour = (1.0 - pct) * colour + pct * vec3(0.0, 1.0, 0.0);

            gl_FragColor = vec4(colour, 1.0);
        }
    `;

    constructor(...args) {
        super(...args);
    }
}