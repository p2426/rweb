import * as THREE from 'three';
import { SceneObject } from './sceneobject';

export class Cube extends SceneObject {
    properties = {
        id: "unset",
        shader: undefined,
        scale: {x: 1, y: 1, z: 1},
        segments: {x: 1, y: 1, z: 1},
        position: {x: 0, y: 0, z: 0},
        rotation: {x: 0, y: 0, z: 0},
        colour: {r: 135, g: 206, b: 235},
        update: () => {},
    }

    constructor(settings) {
        super();

        this.properties = {
            ...this.properties,
            ...settings
        };

        this.geometry = new THREE.BoxGeometry(
            this.properties.scale.x, 
            this.properties.scale.y, 
            this.properties.scale.z,
            this.properties.segments.x, 
            this.properties.segments.y, 
            this.properties.segments.z );

        if (this.properties.shader) {
            this.properties.material = new THREE.ShaderMaterial({
                side: THREE.DoubleSide,
                uniforms: this.properties.shader.getUniforms(),
                vertexShader: this.properties.shader.vertexShader.getContent(),
                fragmentShader: this.properties.shader.fragmentShader.getContent()
            });
            this.properties.shader.init(this.geometry);
        }

        this.properties.material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(...Object.values(this.properties.colour).map(c => c / 255))
        });
        this.mesh = new THREE.Mesh(this.geometry, this.properties.material);
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true;
        // Give mesh a reference to this class for ease of Raycasting
        this.mesh.classRef = this;

        this.setId(this.properties.id);
        this.setPosition(this.properties.position.x, this.properties.position.y, this.properties.position.z);
        this.setRotation(this.properties.rotation.x, this.properties.rotation.y, this.properties.rotation.z);

        this.addObjectToScene();
    }

    getScale() {
        return {x: this.geometry.parameters.width, y: this.geometry.parameters.height, z: this.geometry.parameters.depth};
    }
}