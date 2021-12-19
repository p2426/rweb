import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { SceneObject } from './sceneobject';
import { TextureLoader } from 'three';

export class OBJObject extends SceneObject {
    objLoader = new OBJLoader();
    mtlLoader = new MTLLoader();
    textureLoader = new TextureLoader();

    properties = {
        id: "unset",
        objectName: "",
        objectPath: "",
        materialPath: "",
        material: "standard",
        diffuseMapPath: "",
        normalMapPath: "",
        roughnessMapPath: "",
        metalnessMapPath: "",
        scale: {x: 1, y: 1, z: 1},
        position: {x: 0, y: 0, z: 0},
        rotation: {x: 0, y: 0, z: 0},
        update: () => {},
        progressCallback: () => {}
    }

    constructor(settings, scene) {
        super();

        if (settings) { 
            Object.keys(settings).map(x => this.properties[x] = settings[x]);
        }

        // Need to condition logic based on if a .mtl file path is given
        if (this.properties.materialPath) {
            // Load Material
            this.mtlLoader.load(this.properties.materialPath,
                materials => {
                    materials.preload();

                    const diffuseMap = this.textureLoader.load(this.properties.diffuseMapPath);
                    materials.materials[this.properties.objectName].map = diffuseMap;
                    this.textures.push(diffuseMap);

                    const normalMap = this.textureLoader.load(this.properties.normalMapPath);
                    materials.materials[this.properties.objectName].normalMap = normalMap;
                    this.textures.push(normalMap);

                    const specularMap = this.textureLoader.load(this.properties.specularMapPath);
                    materials.materials[this.properties.objectName].specularMap = specularMap;
                    this.textures.push(specularMap);

                    // Load Model
                    this.loadMesh(scene, materials);

                },
                // xhr => console.log(xhr),
                // error => console.log(error)
            );
        } else {
            this.loadMesh(scene, null);
        }
    }

    loadMesh(scene, materials) {
        if (materials) {
            this.objLoader.setMaterials(materials);
        }

        // Where there is no materialPath, switch and create a material based on the 'material'
        switch(this.properties.material) {
            case "standard":
                this.material = new THREE.MeshStandardMaterial();

                const diffuseMap = this.textureLoader.load(this.properties.diffuseMapPath, xhr => this.properties.progressCallback(xhr));
                this.material.map = diffuseMap;
                this.textures.push(diffuseMap);

                const normalMap = this.textureLoader.load(this.properties.normalMapPath, xhr => this.properties.progressCallback(xhr));
                this.material.normalMap = normalMap;
                this.textures.push(normalMap);

                const roughnessMap = this.textureLoader.load(this.properties.roughnessMapPath, xhr => this.properties.progressCallback(xhr));
                this.material.roughnessMap = roughnessMap;
                this.material.metalness = .6;
                this.textures.push(roughnessMap);

                const metalnessMap = this.textureLoader.load(this.properties.metalnessMapPath, xhr => this.properties.progressCallback(xhr));
                this.material.metalnessMap = metalnessMap;
                this.textures.push(metalnessMap);
                break;
            default:
                break;
        }

        this.objLoader.load(this.properties.objectPath,
            object => {
                object.traverse(child => {
                    if (child instanceof THREE.Mesh) {
                        this.mesh = child;
                        // this.mesh.geometry.computeVertexNormals(true);
                        // this.mesh.geometry.computeFaceNormals(true);
                        this.mesh.receiveShadow = true;
                        this.mesh.castShadow = true;
                        // Give mesh a reference to this class for ease of Raycasting
                        this.mesh.classRef = this;

                        if (!materials) {
                            this.mesh.material = this.material;
                        }
                    }
                });

                this.setId(this.properties.id);
                this.setScale(this.properties.scale.x, this.properties.scale.y, this.properties.scale.z);
                this.setPosition(this.properties.position.x, this.properties.position.y, this.properties.position.z);
                this.setRotation(this.properties.rotation.x, this.properties.rotation.y, this.properties.rotation.z);
                scene.addObjectToScene(this);
                this.start();
            },
            xhr => this.properties.progressCallback(xhr),
            // error => console.log(error)
        );
    }

    // To be called by extensions after the OBJ has been loaded in constructor
    start() {}
}