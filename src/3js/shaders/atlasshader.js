import * as THREE from 'three';
import { CustomShader } from "./customshader";

export class AtlasShader {

    geometry;
    vertexPositions;

    uniforms = {
        delta: {value: 0},
        spikeDelta: {value: 0}
    };

    #needsUpdate = true;

    #time = 0;
    #pulseSpeed = 1;
    #spikePower = 2;
    #spikeSpeed = 2.5;

    // attribute (per vertex properties, only defined in vertex shader)
    // uniform (variables that are controlled outside the main(), and passed in)
    // varying (variables that are outputted by the vshader and inputted into the fshader)
    vertex = {
        content: `
        uniform float delta;
        uniform float spikeDelta;
        attribute float spikePower;

        vec3 lerp(vec3 a, vec3 b, float w) {
            return a + w*(b-a);
        }

        void main() {
            vec3 deltaPosition = position + (normal * delta);
            vec3 spikePosition = deltaPosition + (normal * spikePower);
            vec3 newPosition = lerp(deltaPosition, spikePosition, spikeDelta);

            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
        `
    }

    fragment = {
        content: `
        uniform float delta;

        void main() {
            gl_FragColor = vec4(0.15 + delta, 0, 0, 1.0);
        }
        `
    }

    constructor() {
        this.vertexShader = new CustomShader(this.vertex.content);
        this.fragmentShader = new CustomShader(this.fragment.content);
    }

    // Must be called by the object applying this shader
    init(geometry) {
        this.geometry = geometry;
        this.vertexPositions = new Float32Array(this.geometry.attributes.position.count);
    }

    update() {
        this.#time += 0.01;
        this.uniforms.delta.value = 0.5 + Math.sin(this.#time * this.#pulseSpeed) * 0.5;
        this.uniforms.spikeDelta.value =  0.5 + Math.sin(this.#time * this.#spikeSpeed) * 0.5;

        if (this.uniforms.spikeDelta.value < 0.001) {
            for (let i = 0; i < this.vertexPositions.length; i += Math.ceil(Math.random() + 2)) {
                this.vertexPositions[i] = Math.random() * this.#spikePower;
            }
            this.geometry.setAttribute('spikePower', new THREE.BufferAttribute(this.vertexPositions, 1));
        }
    }

    getUniforms() { return this.uniforms }
    getNeedsUpdate() { return this.#needsUpdate }

    getPulseSpeed() { return this.#pulseSpeed }
    setPulseSpeed(v) { this.#pulseSpeed = v }

    getSpikeSpeed() { return this.#spikeSpeed }
    setSpikeSpeed(v) { this.#spikeSpeed = v }

    getSpikePower() { return this.#spikePower }
    setSpikePower(v) { this.#spikePower = v }
}