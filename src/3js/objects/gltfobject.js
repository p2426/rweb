import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { SceneObject } from './sceneobject';

// Extracts a single mesh child from a GLTF scene, holds things like its textures/materials/animations
export class GLTFObject extends SceneObject {
    properties = {
        id: "unset",
        gltfPath: "",
        gltfChildName: "",
        scale: {x: 1, y: 1, z: 1},
        position: {x: 0, y: 0, z: 0},
        rotation: {x: 0, y: 0, z: 0},
        update: () => {},
    }

    constructor(settings) {
        super();

        if (settings) { 
            Object.keys(settings).map(x => this.properties[x] = settings[x]);
        }

        // Load Model
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(this.properties.gltfPath, (gltf) => {

            // Mesh
            console.log(gltf.scene.children);
            this.mesh = gltf.scene.children.filter(o => o.name === this.properties.gltfChildName)[0];
            console.log(this.mesh);
            // this.mesh.geometry.computeVertexNormals(true);
            // this.mesh.geometry.computeFaceNormals(true);
            this.mesh.receiveShadow = true;
            this.mesh.castShadow = true;
            // Give mesh a reference to this class for ease of Raycasting
            this.mesh.classRef = this;

            // Material
            const map = this.mesh.material.map;
            const material = new THREE.MeshPhongMaterial({map: map});
            this.mesh.material = material;

            // Animations
            this.animations = gltf.animations.filter(a => a.name.includes(this.properties.gltfChildName));

            this.setId(this.properties.id);
            this.setScale(this.properties.scale.x, this.properties.scale.y, this.properties.scale.z);
            this.setPosition(this.properties.position.x, this.properties.position.y, this.properties.position.z);
            this.setRotation(this.properties.rotation.x, this.properties.rotation.y, this.properties.rotation.z);

            this.start();

        }, (xhr) => {
            console.log('xhr', xhr);
        }, (error) => {
            console.log('error', error);
        });
    }

    // To be called by extensions after the OBJ has been loaded in constructor
    start() {}
}