import * as THREE from 'three';
import { SceneObject } from './sceneobject';

export class Line extends SceneObject {
    constructor(id = "unset", shader = undefined, update = () => {},
                positions = [0, 0, 0, 0, 100, 0], colour = {r: 135, g: 206, b: 235}) {

        super();

        if (shader) {
            this.shader = shader;
            this.material = new THREE.ShaderMaterial({
                uniforms: shader.getUniforms(),
                vertexShader: shader.vertexShader.getContent(),
                fragmentShader: shader.fragmentShader.getContent()
            });
        } else {
            this.material = new THREE.MeshBasicMaterial({ color: 0x87ceeb });
            this.setColour(colour.r, colour.g, colour.b);
        }

        this.geometry = new THREE.BufferGeometry();
        this.mesh = new THREE.Line(this.geometry, this.material);
        this.update = update;

        this.setId(id);
        this.setLinePositions(positions);
    }
}