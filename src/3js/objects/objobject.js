import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { SceneObject } from './sceneobject';

export class OBJObject extends SceneObject {
    properties = {
        id: "unset",
        objectPath: "",
        texturePath: "",
        scale: {x: 1, y: 1, z: 1},
        position: {x: 0, y: 0, z: 0},
        rotation: {x: 0, y: 0, z: 0},
        update: this.update.bind(this),
    }

    constructor(settings) {
        super();

        if (settings) { 
            Object.keys(settings).map(x => this.properties[x] = settings[x]);
        }

        // Load Model
        var objLoader = new OBJLoader();
        objLoader.load(this.properties.objectPath, (object) => {

            object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    this.mesh = child;
                    this.mesh.geometry.computeVertexNormals(true);
                    this.mesh.geometry.computeFaceNormals(true);
                    this.mesh.receiveShadow = true;
                    this.mesh.castShadow = true;
                    // Give mesh a reference to this class for ease of Raycasting
                    this.mesh.classRef = this;
                }
            });

            // Load Texture
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(this.properties.texturePath, (texture) => {
                texture.minFilter = THREE.LinearFilter;
                const material = new THREE.MeshPhongMaterial({ map: texture });
                this.mesh.material = material;
            });

            this.setId(this.properties.id);
            this.setScale(this.properties.scale.x, this.properties.scale.y, this.properties.scale.z);
            this.setPosition(this.properties.position.x, this.properties.position.y, this.properties.position.z);
            this.setRotation(this.properties.rotation.x, this.properties.rotation.y, this.properties.rotation.z);

            this.start();

        }, (xhr) => {

        }, (error) => {

        });
    }

    // To be called by extensions after the OBJ has been loaded in constructor
    start() {}
}