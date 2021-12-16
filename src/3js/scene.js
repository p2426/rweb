import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class Scene {
    // Main objects
    scene;
    camera;
    renderer;
    controls;

    // Scene objects
    objects = [];

    // Settings
    sceneSettings = {
        parent: document.body,
        width: window.innerWidth,
        height: window.innerHeight,
        colour: [221, 221, 211],
        antialias: true,
        alpha: true
    };
    cameraSettings = {
        fov: 50,
        near: 0.1,
        far: 1000,
        enableKeys: true,
        enableZoom: false,
        leftKey: 65,
        upKey: 87,
        rightKey: 68,
        downKey: 83,
        rightMouse: null,
        middleMouse: null,
        leftMouse: THREE.MOUSE.ROTATE,
        cameraPosition: [0, 0, 0],
        cameraTarget: [0, 0, 0]
    };

    // Rendering
    frameRequest;
    time = {
        now: 0,
        then: 0,
        delta: 0,
        elapsed: 0,
    }
    paused = false;

    get sceneResolution() {
        return {
            x: this.sceneSettings.width,
            y: this.sceneSettings.height
        }
    }

    constructor(sceneSettings, cameraSettings) {
        // Overwrite existing keys in default settings objects
        this.sceneSettings = { ...this.sceneSettings, ...sceneSettings };
        this.cameraSettings = { ...this.cameraSettings, ...cameraSettings };

        // Instances
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({
            antialias: this.sceneSettings.antialias,
            alpha: this.sceneSettings.alpha
        });
        this.camera = new THREE.PerspectiveCamera(this.cameraSettings.fov, this.sceneSettings.width / this.sceneSettings.height, this.cameraSettings.near, this.cameraSettings.far);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // Initialise
        this.initRenderer();
        this.initCamera();

        // Start render loop
        this.update();
    }

    initRenderer() {
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(this.sceneSettings.width, this.sceneSettings.height);
        this.sceneSettings.parent.appendChild(this.renderer.domElement);
        const colour = new THREE.Color(`rgb(${this.sceneSettings.colour.toString()})`);
        this.sceneSettings.alpha ? this.renderer.setClearColor(colour, 0) : this.scene.background = colour;
    }

    initCamera() {
        this.controls.enableKeys = this.cameraSettings.enableKeys;
        this.controls.enableZoom = this.cameraSettings.enableZoom;
        this.controls.keys = {
            LEFT: this.cameraSettings.leftKey,
            UP: this.cameraSettings.upKey,
            RIGHT: this.cameraSettings.rightKey,
            BOTTOM: this.cameraSettings.downKey
        }
        this.controls.mouseButtons = {
            LEFT: this.cameraSettings.leftMouse,
            MIDDLE: this.cameraSettings.middleMouse,
            RIGHT: this.cameraSettings.rightMouse
        }
        this.controls.target = new THREE.Vector3(...this.cameraSettings.cameraTarget);
        this.setCameraPosition(...this.cameraSettings.cameraPosition);
    }

    // Rendering
    // Main loop
    update() {
        this.frameRequest = requestAnimationFrame(() => {
            this.update();
        });

        this.time.now = performance.now();
        this.time.delta = this.time.now - this.time.then;
        this.time.elapsed += this.time.delta / 1000;

        // Run object logic
        this.objects.forEach((object) => {
            object.properties.update(this.time, this.sceneResolution);
        });

        // Re-render scene
        this.renderer.render(this.scene, this.camera);

        this.time.then = performance.now();
    }

    pause(state) {
        this.paused = state;
        this.paused ? cancelAnimationFrame(this.frameRequest) : this.update();
    }

    resetSceneDimensions() {
        this.renderer.setSize(this.sceneSettings.width, this.sceneSettings.height);
        this.camera.aspect = this.sceneSettings.width / this.sceneSettings.height;
        this.camera.updateProjectionMatrix();
    }

    // Adding/removing objects to scene
    addObjectToScene(obj) {
        this.objects.push(obj);
        this.scene.add(obj.getMesh());
    }

    removeObjectById(id) {
        const obj = this.objects.find(obj => obj.id === id);
        const index = this.objects.findIndex(obj => obj.id === id);
        this.objects.splice(index, 1);
        this.removeObject(obj);
    }

    removeObject(obj) {
        this.scene.remove(obj.getMesh());
    }

    // Camera control
    getCameraPosition() {
        return this.camera.position;
    }

    setCameraPosition(x, y, z) {
        this.camera.position.set(x, y, z);
        this.controls.update();
    }

    setCameraTarget(x, y, z) {
        this.controls.target = new THREE.Vector3(x, y, z);
        this.controls.update();
    }

    setCameraRotation(x, y, z) {
        this.camera.rotation.set(x, y, z);
    }
}