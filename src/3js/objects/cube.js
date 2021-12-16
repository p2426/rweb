import * as THREE from 'three';
import { SceneObject } from './sceneobject';

export class Cube extends SceneObject {
    properties = {
        id: "unset",
        shader: undefined,
        material: undefined,
        scale: [1, 1, 1],
        segments: [1, 1, 1],
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        colour: [135, 206, 235],
        update: () => {},
    }

    constructor(settings) {
        super();

        this.properties = { ...this.properties, ...settings};

        this.geometry = new THREE.BoxGeometry(...this.properties.scale, ...this.properties.segments);

        if (this.properties.shader) {
            this.properties.material = new THREE.ShaderMaterial({
                side: THREE.DoubleSide,
                uniforms: this.properties.shader.getUniforms(),
                vertexShader: this.properties.shader.vertexShader.getContent(),
                fragmentShader: this.properties.shader.fragmentShader.getContent()
            });
            this.properties.shader.init(this.geometry);
        } else {
            this.properties.material = new THREE.MeshBasicMaterial({
                color: new THREE.Color(`rgb(${this.properties.colour.toString()})`)
            });
        }

        this.mesh = new THREE.Mesh(this.geometry, this.properties.material);
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true;

        this.setId(this.properties.id);
        this.setPosition(...this.properties.position);
        this.setRotation(...this.properties.rotation);
    }

    getScale() {
        return [this.geometry.parameters.width, this.geometry.parameters.height, this.geometry.parameters.depth];
    }
}