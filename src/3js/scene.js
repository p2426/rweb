import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Main
export class Scene {
    constructor(FPS = 60, sceneSettings, cameraSettings, eventSettings, styleSettings) {
        this.FPS = FPS;
        this.sceneSettings = sceneSettings;
        this.cameraSettings = cameraSettings;
        this.eventSettings = eventSettings;
        this.styleSettings = styleSettings;
        this.objects = [];
        this.createScene(this.sceneSettings);
        this.setCameraSettings(this.cameraSettings);
        this.attachEvents(this.eventSettings);
        this.applyStyleSettings(this.styleSettings);

        // Setup render loop
        this.now = Date.now();
        this.delta = Date.now();
        this.then = Date.now();
        this.interval = 1000 / this.FPS;
        this.update();
    }

    createScene(sceneSettings = { parent: document.body, width: window.innerWidth, height: window.innerHeight, colour: new THREE.Color(), antialias: true, alpha: true }) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, sceneSettings.width/sceneSettings.height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: sceneSettings.antialias, alpha: sceneSettings.alpha });
        this.renderer.setSize(sceneSettings.width, sceneSettings.height);
        sceneSettings.parent.appendChild(this.renderer.domElement);
        
        sceneSettings.alpha ? this.renderer.setClearColor(sceneSettings.colour, 0) : this.scene.background = sceneSettings.colour;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    setCameraSettings(cameraSettings = { enableKeys: true, enableZoom: false, 
        leftKey: 65, upKey: 87, rightKey: 68, downKey: 83, rightMouse: null, middleMouse: null, 
        leftMouse: THREE.MOUSE.ROTATE, cameraPosition: { x: 0, y: 0, z: 0 },
        cameraTarget: { x: 0, y: 0, z: 0 }}) {

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableKeys = cameraSettings.enableKeys;
        this.controls.enableZoom = cameraSettings.enableZoom;
        this.controls.keys = {
            LEFT: cameraSettings.leftKey,
            UP: cameraSettings.upKey,
            RIGHT: cameraSettings.rightKey,
            BOTTOM: cameraSettings.downKey
        }
        this.controls.mouseButtons = {
            LEFT: cameraSettings.leftMouse,
            MIDDLE: cameraSettings.middleMouse,
            RIGHT: cameraSettings.rightMouse
        }
        this.controls.target = new THREE.Vector3(cameraSettings.cameraTarget.x, cameraSettings.cameraTarget.y, cameraSettings.cameraTarget.z);
        this.setCameraPosition(cameraSettings.cameraPosition.x, cameraSettings.cameraPosition.y, cameraSettings.cameraPosition.z);
        this.controls.update();
    
        //Other Mouse events
        // $(document.body).mousedown(function(e) {
        //     switch(e.which) {
        //         case 1: {
        //             console.log("LMB was clicked");
        //             break;
        //         }
        //         case 2: {
        //             console.log("MMB was clicked");
        //             break;
        //         }
        //         case 3: {
        //             console.log("RMB was clicked");
        //             break;
        //         }
        //         default: break;
        //     }
        // });
    }

    attachEvents(eventSettings = { enableContentMenu: false }) {
        // Resize is essential
        window.addEventListener("resize", () => {
            this.resetSceneDimensions();
        });

        // An object is created, add it to scene
        document.body.addEventListener('ObjectCreated', (e) => {
            if (e.detail.obj) {
                this.addObjectToScene(e.detail.obj);
            }
        });

        // Disabling default rightclick menu
        // if (!eventSettings.enableContentMenu) {
        //     window.oncontextmenu = () => { 
        //         return false; 
        //     }
        // }
    }

    resetSceneDimensions() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    applyStyleSettings(styleSettings = { position: 'absolute', bottom: 0, zIndex: 4 }) {
        this.renderer.domElement.style.position = styleSettings.position;
        this.renderer.domElement.style.bottom = styleSettings.bottom;
        this.renderer.domElement.style.zIndex = styleSettings.zIndex;
    }

    // Render loop
    update() {
        requestAnimationFrame(() => { 
            this.update(); 
        });
        this.now = Date.now();
        this.delta = this.now - this.then;

        // Rendering to be targeted to the given framerate
        if (this.delta > this.interval) {
            
            this.objects.forEach((object) => {
                object.properties.update();
            });
        
            this.renderer.render(this.scene, this.camera);

            this.then = this.now - (this.delta % this.interval);
        }
    }

    reRenderScene() {
        this.renderer.render(this.scene, this.camera);
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