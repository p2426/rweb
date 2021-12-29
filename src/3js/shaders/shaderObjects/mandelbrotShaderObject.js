import * as THREE from 'three';
import { ShaderObject } from '../../objects/shaderobject';

export class MandelbrotShaderObject extends ShaderObject {
    posScale = new THREE.Vector4(0.0, 0.0, 4.0, 4.0);

    constructor(...args) {
        super(...args);
    }

    update(time, resolution) {
        super.update(time, resolution);
        this.properties.shader.uniforms.u_posScale.value = this.posScale;
    }
}