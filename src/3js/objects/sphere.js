import * as THREE from 'three';
import { SceneObject } from './sceneobject';

export class Sphere extends SceneObject {
    properties = {
        id: "unset",
        shader: undefined,
        material: new THREE.MeshBasicMaterial({ color: 0x87ceeb }),
        radius: 0.5,
        scale: {x: 1, y: 1, z: 1},
        segments: {w: 16, h: 16},
        position: {x: 0, y: 0, z: 0},
        rotation: {x: 0, y: 0, z: 0},
        colour: {r: 135, g: 206, b: 235},
        update: () => {},
    }

    constructor(settings) {
        super();

        if (settings) { 
            Object.keys(settings).map(x => this.properties[x] = settings[x]);
        }

        this.geometry = new THREE.SphereBufferGeometry(this.properties.radius, this.properties.segments.w, this.properties.segments.h);

        if (this.properties.shader) {
            this.properties.material = new THREE.ShaderMaterial({
                side: THREE.DoubleSide,
                uniforms: this.properties.shader.getUniforms(),
                vertexShader: this.properties.shader.vertexShader.getContent(),
                fragmentShader: this.properties.shader.fragmentShader.getContent()
            });
            this.properties.shader.init(this.geometry);
        } else {
            this.setColour(this.properties.colour.r, this.properties.colour.g, this.properties.colour.b);
        }

        this.mesh = new THREE.Mesh(this.geometry, this.properties.material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        // Give mesh a reference to this class for ease of Raycasting
        this.mesh.classRef = this;

        this.setId(this.properties.id);
        this.setPosition(this.properties.position.x, this.properties.position.y, this.properties.position.z);
        this.setRotation(this.properties.rotation.x, this.properties.rotation.y, this.properties.rotation.z);
        this.setScale(this.properties.scale.x, this.properties.scale.y, this.properties.scale.z);
    }
}