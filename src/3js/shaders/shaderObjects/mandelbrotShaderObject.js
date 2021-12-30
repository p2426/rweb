import * as THREE from 'three';
import { ShaderObject } from '../../objects/shaderobject';

export class MandelbrotShaderObject extends ShaderObject {
    pos = new THREE.Vector2(-.5, 0.0);
    scale = new THREE.Vector2(2.5, 2.5);
    angle = 0.0;
    smoothPos = new THREE.Vector2(0.0, 0.0);
    smoothScale = new THREE.Vector2(0.0, 0.0);
    smoothAngle = 0.0;

    constructor(...args) {
        super(...args);
    }

    update(time, resolution) {
        super.update(time, resolution);
        this.smoothPos.lerp(new THREE.Vector2(this.pos.x, this.pos.y), 0.03);
        this.smoothScale.lerp(new THREE.Vector2(this.scale.x, this.scale.y), 0.03);
        this.smoothAngle = THREE.MathUtils.lerp(this.smoothAngle, this.angle, 0.03);
        this.properties.shader.uniforms.u_pos.value = this.smoothPos;
        this.properties.shader.uniforms.u_scale.value = this.smoothScale;
        this.properties.shader.uniforms.u_angle.value = this.smoothAngle;
    }

    addPos(x, y) {
        // Direction vector must account for scale - x and y are uniform
        let dir = new THREE.Vector2(x * this.scale.x, y * this.scale.x);
        // It must also consider angle - rotate around a point
        const s = Math.sin(this.angle);
        const c = Math.cos(this.angle);
        dir = new THREE.Vector2(dir.x * c - dir.y * s, dir.x * s + dir.y * c);
        // Add to current position
        this.pos.add(dir);
    }

    addScale(v) {
        this.scale.setX(this.scale.x * v);
        this.scale.setY(this.scale.y * v);
    }

    addAngle(v) {
        this.angle += v;
    }
}