import * as THREE from 'three';

export class SceneObject {
    updateBehaviour = [];

    constructor() {

    }

    getMesh() { return this.mesh; }

    getColour() { return this.material.color; }

    getPosition() { return this.mesh.position; }

    getRotation() { return this.mesh.rotation; }

    getScale() { return this.mesh.scale; }

    getId() { return this.id; }

    setColour(r, g, b) {
        if (!this.properties.material instanceof Array) {
            this.properties.material.color.setRGB(r / 255, g / 255, b / 255);
        }
    }

    setPosition(x, y, z) {
        this.mesh.position.set(x, y, z);
    }

    setScale(x, y, z) {
        this.mesh.scale.set(x, y, z);
    }

    setLinePositions(arr) {
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
    }

    setRotation(x, y, z) {
        this.mesh.rotation.x = x;
        this.mesh.rotation.y = y;
        this.mesh.rotation.z = z;
    }

    addRotation(x, y, z) {
        this.mesh.rotation.x += x;
        this.mesh.rotation.y += y;
        this.mesh.rotation.z += z;
    }

    lookAt(x, y, z) {
        this.mesh.lookAt(x, y, z);
    }

    setId(string) {
        this.id = string;
    }

    // Note that, if the function 'behaviour' uses 'this' inside itself,
    // 'behaviour' should bind 'this' as the parameter is passed through
    addToUpdate(behaviour) {
        this.update = (function() {
            let cachedUpdate = this.update;
            this.updateBehaviour[behaviour.name] = behaviour;

            return function() {
                this.updateBehaviour[behaviour.name]();

                return cachedUpdate.apply(this, arguments);
            }
        }).bind(this)();
    }

    removeFromUpdate(functionName) {
        this.updateBehaviour[functionName] = () => {return};
    }

    addObjectToScene() {
        const e = new CustomEvent('ObjectCreated', {
            detail: {
                obj: this
            }
        });
        document.body.dispatchEvent(e);
    }
};