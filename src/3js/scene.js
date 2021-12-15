import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class Scene {
    // Instances
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
        colour: 'rgb(0, 0, 0)',
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
    time = {
        now: 0,
        then: 0,
        delta: 0,
        deltaTime: 0,
    }
    pause = false;

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

        // Setup
        this.setupRenderer();
        this.setupCamera();
        this.attachEvents();

        // Start render loop
        this.update();
    }

    setupRenderer() {
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(this.sceneSettings.width, this.sceneSettings.height);
        this.sceneSettings.alpha ? this.renderer.setClearColor(new THREE.Color(this.sceneSettings.colour), 0) : this.scene.background = new THREE.Color(this.sceneSettings.colour);
        this.sceneSettings.parent.appendChild(this.renderer.domElement);
    }

    setupCamera() {
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
        this.controls.update();
        this.setCameraPosition(...this.cameraSettings.cameraPosition);
    }

    attachEvents() {
        // An object is created, add it to scene
        document.body.addEventListener('ObjectCreated', (e) => {
            if (e.detail.obj) {
                this.addObjectToScene(e.detail.obj);
            }
        });
    }

    resetSceneDimensions() {
        this.camera.aspect = this.sceneSettings.width / this.sceneSettings.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.sceneSettings.width, this.sceneSettings.height);
    }

    // Render loop
    update() {
        requestAnimationFrame(() => {
            this.update(); 
        });

        if (!this.pause) {
            this.time.now = performance.now();
            this.time.delta = this.time.now - this.time.then;
            this.time.deltaTime += !this.pause ? (this.time.now - this.time.then) / 1000 : 0;

            // Run object logic
            this.objects.forEach((object) => {
                object.properties.update(this.time, this.sceneResolution);
            });

            // Refresh scene
            this.renderScene();

            this.time.then = performance.now();
        }
    }

    renderScene() {
        this.renderer.render(this.scene, this.camera);
    }

    get sceneResolution() {
        return {
            x: this.sceneSettings.width,
            y: this.sceneSettings.height
        }
    }

    addObjectToScene(obj) {
        this.objects.push(obj);
        this.scene.add(obj.getMesh());
    }

    removeObjectById(id) {
        let obj = this.objects.find(obj => obj.id === id);
        let index = this.objects.findIndex(obj => obj.id === id);
        this.objects.splice(index, 1);
        this.removeObject(obj);
    }

    removeObject(obj) {
        this.scene.remove(obj.getMesh());
    }

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