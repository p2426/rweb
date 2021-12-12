import { Sphere } from './sphere';

export class Atlas extends Sphere {
    deltaTime = 0;

    fNamePrefix = "bound ";

    constructor(...args) {
        super(...args);

        this.#resetUpdate();

        this.#addIdleSpin();
    }

    #resetUpdate() {
        this.update = () => {};
        this.#addShaderUpdate();
        this.#addDeltaTimeUpdate();
        this.setPosition(0, 0, 0);
    }

    setState(state) {
        switch(state) {
            case "idleSpin": {
                this.#addIdleSpin();
                break;
            }
            case "rapidSpin": {
                this.#rapidSpin();
                break;
            }
            case "bounce": {
                this.#bounce(5, 3);
                break;
            }
            case "reset": {
                this.#resetUpdate();
                break;
            }
            default: break;
        }
    }

    // State behaviours
    // ALL Functions that call addToUpdate, must bind an already existing function,
    // this is so that the 'name' of the function can be tracked an later removed.
    // It also must bind 'this' when adding it to update, to keep it's own scope.
    // Implemention in a '3 part' way. Run -> Add -> Remove

    // Shader
    #runShaderUpdate() {
        this.shader.update();
    }

    #addShaderUpdate() {
        if (this.shader.getNeedsUpdate()) { 
            this.addToUpdate(this.#runShaderUpdate.bind(this));
        }
    }

    #removeShaderUpdate() {
        this.removeFromUpdate(this.fNamePrefix + this.#runShaderUpdate.name);
    }

    // DeltaTime
    #runDeltaTimeUpdate() {
        this.deltaTime += 0.01;
    }

    #addDeltaTimeUpdate() {
        this.addToUpdate(this.#runDeltaTimeUpdate.bind(this));
    }

    #removeDeltaTimeUpdate() {
        this.removeFromUpdate(this.fNamePrefix + this.#runDeltaTimeUpdate.name);
    }

    // Idle Spin
    #runIdleSpin() {
        this.addRotation(0.005, 0, 0.01);
    }

    #addIdleSpin() {
        this.addToUpdate(this.#runIdleSpin.bind(this));
    }

    removeIdleSpin() {
        this.removeFromUpdate(this.fNamePrefix + this.#runIdleSpin.name);
    }

    // Bounce
    #bounce(speed, height) {
        let pos = this.getPosition();
        this.deltaTime = 0;

        this.addToUpdate(function() {
            let yPos = (0.5 + Math.sin(this.deltaTime * speed) * 0.5) * height;

            this.setPosition(pos.x, yPos, pos.z);
        }.bind(this));
    }

    // Rapid Spin
    #rapidSpin() {
        this.#resetUpdate();
        this.setRotation(0, 0, 0);
        this.addToUpdate(function() {
            this.addRotation(0, 0.1, 0);
        }.bind(this));
    }
}