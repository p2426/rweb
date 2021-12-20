import * as THREE from 'three';
import { useEffect, useRef, useState } from "react";
import CasioScene from "../../../3js/aCasioExperience";
import { OBJObject } from "../../../3js/objects/objobject";
import '../../../scss/sectionContent/aCasioExperience.scss';

export default function CasioExperience({type, title}) {
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState({ state: false, progress: 0 });
    const sceneContainer = useRef();
    let scene = useRef();
    let graphicQuality = useRef('Ultra');
    const resourceCount = 5;

    // Clean up scene on unmount
    useEffect(() => {
        return () => scene.current?.dispose();
    }, []);

    // Only called when isLoading has it's state set to true AND progress is 0,
    // then we need to create the scene and load resources
    useEffect(() => {
        if (!isLoading.state && isLoading.progress === 0 || isLoading.progress > 0) return;

        // Scene
        scene.current = new CasioScene({
            parent: sceneContainer.current,
            width: sceneContainer.current.parentElement.clientWidth,
            height: 600,
            colour: [22, 22, 22],
            antialias: false,
            alpha: false
        }, {
            cameraPosition: [0, 0, 4],
            enableZoom: true
        });

        // Watch
        const watch = new OBJObject({
            id: "unset",
            objectName: "Digital_Wristwatch",
            objectPath: "./models/casioWatch.obj",
            material: "standard",
            diffuseMapPath: `./textures/casioDiffuse_${graphicQuality.current}.png`,
            normalMapPath: `./textures/casioNormal_${graphicQuality.current}.png`,
            roughnessMapPath: `./textures/casioRoughness_${graphicQuality.current}.png`,
            metalnessMapPath: `./textures/casioMetallic_${graphicQuality.current}.png`,
            scale: {x: 45, y: 45, z: 45},
            position: {x: 0, y: .5, z: 0},
            rotation: {x: 0, y: 0, z: 0},
            progressCallback: resourceProgress
        }, scene.current);

        // Directional Light
        const directionalLight = new THREE.DirectionalLight(0xC0C0C0, 1);
        directionalLight.castShadow = true;
        directionalLight.position.set(0, 1, 0);
        scene.current.addToScene(directionalLight);

        // Ambient Light
        const ambientLight = new THREE.AmbientLight(0xC0C0C0, .5);
        scene.current.addToScene(ambientLight);

        // Spot Light
        const spotLight = new THREE.SpotLight(0xC0C0C0, 1, 20, 1);
        spotLight.position.set(1, -3, 0);
        scene.current.addToScene(spotLight);
    }, [isLoading]);

    // Approximate percentage of loaded resources by simply knowing how many resources have loaded of the total resources known.
    // Finally, set the isReady state
    const resourceProgress = (progress) => {
        if (progress.loaded) {
            if (progress.loaded === progress.total) {
                setIsLoading({
                    state: true,
                    progress: isLoading.progress += (100 / resourceCount)
                });
            }
        } else {
            setIsLoading({
                state: true,
                progress: isLoading.progress += (100 / resourceCount)
            });
        }
        if (isLoading.progress === 100) {
            setIsReady(true);
        }
    }

    const startLoading = (e, quality) => {
        if (isLoading.state) return;

        graphicQuality.current = quality;

        setIsLoading({
            state: true,
            progress: 0
        });
    }

    return (
        <>
        <div className='header'>
            <div className={'indicator' + ' indicator--' + type}></div>
            <h1 className='title'>{title}</h1>
        </div>
        <div className='body'>
            <p>It's the early 90s - just before the Japanese economic bubble collapse, and Casio are promoting their new wrist watch with advanced features, longer battery life, and a metallic wrist strap. The future is now.</p>
            <p><i><b>Currently working on</b></i></p>
            {isLoading.state && <div ref={sceneContainer} className={'canvas-container standard-margin-bottom' + (isReady ? '' : ' no-display')}></div>}
            {!isReady && <LoadingOverlay progress={isLoading.progress} click={startLoading}/>}
        </div>
        </>
    );
}

const LoadingOverlay = ({ progress, click }) => {
    return (
        <div className='canvas-container canvas-container--loading'>
            <p>Load scene with graphic quality:</p>
            <div className='casio-settings'>
                <button onClick={(e) => click(e, 'Low')}>Low</button>
                <button onClick={(e) => click(e, 'Standard')}>Standard</button>
                <button onClick={(e) => click(e, 'Ultra')}>Ultra</button>
            </div>
            <div className='casio-loading-bar' style={{ width: (progress * 6) + 'px' }}></div>
        </div>
    );
}