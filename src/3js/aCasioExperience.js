import { Scene } from "./scene";
import MathFunctions from '../global/mathfunctions';

export default class CasioScene extends Scene {
    cameraLerpPosition;
    cameraLerpPositionSpeed;
    cameraLerpTarget;
    cameraLerpTargetSpeed;

    constructor(...args) {
        super(...args);
    }

    initScene() {
        this.setCameraLerpPosition(0, 0, 2.5);
        this.setCameraLerpPositionSpeed(1);
        this.setCameraLerpTarget(0, 0, 0);
        this.setCameraLerpTargetSpeed(1);
    }

    sceneUpdate() {
        this.setCameraPosition(MathFunctions.lerp(this.getCameraPosition().x, this.cameraLerpPosition[0], this.time.deltaTime * this.cameraLerpPositionSpeed),
                               MathFunctions.lerp(this.getCameraPosition().y, this.cameraLerpPosition[1], this.time.deltaTime * this.cameraLerpPositionSpeed),
                               MathFunctions.lerp(this.getCameraPosition().z, this.cameraLerpPosition[2], this.time.deltaTime * this.cameraLerpPositionSpeed));
        this.setCameraTarget(MathFunctions.lerp(this.getCameraTarget().x, this.cameraLerpTarget[0], this.time.deltaTime * this.cameraLerpTargetSpeed),
                             MathFunctions.lerp(this.getCameraTarget().y, this.cameraLerpTarget[1], this.time.deltaTime * this.cameraLerpTargetSpeed),
                             MathFunctions.lerp(this.getCameraTarget().z, this.cameraLerpTarget[2], this.time.deltaTime * this.cameraLerpTargetSpeed));
    }

    setCameraLerpPosition(x, y, z) {
        this.cameraLerpPosition = [x, y, z];
    }

    setCameraLerpPositionSpeed(speed) {
        this.cameraLerpPositionSpeed = speed;
    }

    setCameraLerpTarget(x, y, z) {
        this.cameraLerpTarget = [x, y, z];
    }

    setCameraLerpTargetSpeed(speed) {
        this.cameraLerpTargetSpeed = speed;
    }

    setCameraAngleState(state) {
        switch(state) {
            case 0:
                this.setCameraLerpPosition(0, 0, 2.5);
                this.setCameraLerpTarget(0, 0, 0);
                this.setCameraLerpPositionSpeed(1);
                break;
            case 1:
                this.setCameraLerpPosition(.5, 2, .5);
                this.setCameraLerpTarget(0, .25, 0);
                this.setCameraLerpPositionSpeed(1);
                break;
            case 2:
                this.setCameraLerpPosition(0, 0, -2.5);
                this.setCameraLerpTarget(0, 0, 0);
                this.setCameraLerpPositionSpeed(1);
                break;
            case 3:
                this.setCameraLerpPosition(0, -1.8, .2);
                this.setCameraLerpTarget(.1, 0, -.2);
                this.setCameraLerpPositionSpeed(1);
                break;
            case 4:
                this.setCameraLerpPosition(2.5, .5, 0);
                this.setCameraLerpTarget(0, -.25, 0);
                this.setCameraLerpPositionSpeed(1);
                break;
            case 5:
                this.setCameraLerpPosition(-.2, -.2, -.1);
                this.setCameraLerpTarget(.2, 1, .4);
                this.setCameraLerpPositionSpeed(1);
                break;
            default:
                break;
        }
    }
}