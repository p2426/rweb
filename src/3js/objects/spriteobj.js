import * as THREE from 'three';
import { SceneObject } from './sceneobject';

export class SpriteObj extends SceneObject {
    properties = {
        id: "unset",
        material: new THREE.SpriteMaterial(),
        scale: {x: 1, y: 1, z: 1},
        position: {x: 0, y: 0, z: 0},
        update: () => {},
    }

    constructor(settings) {
        super();

        if (settings) { 
            Object.keys(settings).map(x => this.properties[x] = settings[x]);
        }

        this.properties.material.minFilter = THREE.LinearFilter;
        this.mesh = new THREE.Sprite(this.properties.material);

        this.setId(this.properties.id);
        this.setPosition(this.properties.position.x, this.properties.position.y, this.properties.position.z);
        this.setScale(this.properties.scale.x, this.properties.scale.y, this.properties.scale.z)
    }
}