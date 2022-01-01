import * as THREE from 'three';
import { SceneObject } from './sceneobject';
import { SinShader } from '../shaders/sinShader';
import { MandelbrotShader } from '../shaders/mandelbrot';
import { JuliaShader } from '../shaders/julia';

export class ShaderObject extends SceneObject {
    properties = {
        id: "unset",
        shader: null,
        shaderDefinitions: {},
        material: null,
        scale: [1, 1, 1],
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        update: () => {}
    }

    shaderMap = {
        sinShader: SinShader,
        mandelbrot: MandelbrotShader,
        julia: JuliaShader,
    }

    constructor(settings) {
        super();

        this.properties = { ...this.properties, ...settings};

        this.geometry = new THREE.PlaneBufferGeometry(2, 2);
        this.properties.shader = new this.shaderMap[this.properties.shader](this.geometry);

        this.properties.material = new THREE.ShaderMaterial({
            side: THREE.FrontSide,
            defines: this.properties.shaderDefinitions,
            uniforms: this.properties.shader.uniforms,
            vertexShader: this.properties.shader.vertexContent,
            fragmentShader: this.properties.shader.fragmentContent
        });
        this.properties.material.transparent = true;

        this.mesh = new THREE.Mesh(this.geometry, this.properties.material);
        this.mesh.castShadow = false;
        this.mesh.receiveShadow = false;

        this.setId(this.properties.id);
        this.setPosition(...this.properties.position);
        this.setRotation(...this.properties.rotation);
        this.setScale(...this.properties.scale);
        this.properties.update = this.update.bind(this);
    }

    update(time, resolution) {
        this.properties.shader.update(time, resolution);
    }
}