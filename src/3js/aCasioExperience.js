import { Scene } from "./scene";
import MathFunctions from '../global/mathfunctions';

export default class CasioScene extends Scene {
    cameraLerpPosition;
    cameraLerpSpeed;

    constructor(...args) {
        super(...args);
    }

    initScene() {
        this.cameraLerpPosition = [0, 0, 2.5];
        this.cameraLerpSpeed = 5;
    }

    sceneUpdate() {
        this.setCameraPosition(MathFunctions.lerp(this.getCameraPosition().x, this.cameraLerpPosition[0], this.time.deltaTime * this.cameraLerpSpeed),
                               MathFunctions.lerp(this.getCameraPosition().y, this.cameraLerpPosition[1], this.time.deltaTime * this.cameraLerpSpeed),
                               MathFunctions.lerp(this.getCameraPosition().z, this.cameraLerpPosition[2], this.time.deltaTime * this.cameraLerpSpeed));
    }

    setCameraLerpPosition(x, y, z) {
        this.cameraLerpPosition = [x, y, z];
    }

    setCameraLerpSpeed(speed) {
        this.cameraLerpSpeed = speed;
    }
}