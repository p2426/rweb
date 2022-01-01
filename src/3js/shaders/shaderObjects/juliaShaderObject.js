import * as THREE from 'three';
import { MandelbrotShaderObject } from './mandelbrotShaderObject';

export class JuliaShaderObject extends MandelbrotShaderObject {
    seed = new THREE.Vector2(0.35, 0.4);

    constructor(...args) {
        super(...args);
    }

    update(time, resolution) {
        super.update(time, resolution);
        this.properties.shader.uniforms.u_seed.value = this.seed;
    }

    setSeedX(x) {
        this.seed.setX(x);
    }

    setSeedY(y) {
        this.seed.setY(y);
    }
}