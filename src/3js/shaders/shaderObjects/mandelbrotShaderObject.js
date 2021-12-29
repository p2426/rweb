import * as THREE from 'three';
import { ShaderObject } from '../../objects/shaderobject';

export class MandelbrotShaderObject extends ShaderObject {
    pos = new THREE.Vector2(-.5, 0.0);
    scale = new THREE.Vector2(2.5, 2.5);
    smoothPos = new THREE.Vector2(0.0, 0.0);
    smoothScale = new THREE.Vector2(0.0, 0.0);

    constructor(...args) {
        super(...args);
    }

    update(time, resolution) {
        super.update(time, resolution);
        this.smoothPos.lerp(new THREE.Vector2(this.pos.x, this.pos.y), 0.03);
        this.smoothScale.lerp(new THREE.Vector2(this.scale.x, this.scale.y), 0.03);
        this.properties.shader.uniforms.u_pos.value = this.smoothPos;
        this.properties.shader.uniforms.u_scale.value = this.smoothScale;
    }

    addPos(x, y) {
        this.pos.setX(this.pos.x + x * this.scale.x);
        this.pos.setY(this.pos.y + y * this.scale.x);
    }

    multiplyScale(x, y) {
        this.scale.setX(this.scale.x * x);
        this.scale.setY(this.scale.y * y);
    }
}