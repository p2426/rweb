import * as THREE from 'three';

export class CustomShader {
    // Uniforms
    uniforms = {
        u_time: {
            value: 0.0
        },
        u_resolution: {
            value: new THREE.Vector2(0, 0)
        }
    };

    // Vertex Shader
    vertexContent = ``;

    // Fragment Shader
    fragmentContent = ``;

    // Object
    geometry;
    vertexPositions;

    constructor(geometry) {
        this.geometry = geometry;
        this.vertexPositions = new Float32Array(this.geometry.attributes.position.count);
    }

    // Shader loop should be used to set uniforms, not for calculation
    update(time, resolution) {
        this.uniforms.u_time.value = time.elapsed;
        this.uniforms.u_resolution.value.x = resolution.x + 0.001;
        this.uniforms.u_resolution.value.y = resolution.y + 0.001;
    }

    getVertexContent() {
        return this.vertexContent;
    }

    getFragmentContent() {
        return this.fragmentContent;
    }

    getUniforms() {
        return this.uniforms;
    }
}