import * as THREE from 'three';
import { useEffect, useRef, useState } from "react";
import ManeoScene from "../../../3js/aManeoExperience";
import { OBJObject } from "../../../3js/objects/objobject";
import '../../../scss/sectionContent/aManeoExperience.scss';

export default function ManeoExperience({type, title}) {
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState({ state: false, progress: 0 });
    const sceneContainer = useRef();
    let scene = useRef();
    let graphicQuality = useRef('Ultra');
    const resourceCount = 5;
    const stepperCount = 6;
    const [stepperPos, setStepperPos] = useState(null);

    // Clean up scene on unmount
    useEffect(() => {
        return () => scene.current?.dispose();
    }, []);

    // Only called when isLoading has it's state set to true AND progress is 0,
    // then we need to create the scene and load resources
    useEffect(() => {
        if (!isLoading.state && isLoading.progress === 0 || isLoading.progress > 0) return;

        // Scene
        scene.current = new ManeoScene({
            parent: sceneContainer.current,
            width: sceneContainer.current.parentElement.clientWidth,
            height: 600,
            colour: [22, 22, 22],
            antialias: false,
            alpha: false
        }, {
            cameraPosition: [0, 0, 4],
            enableZoom: false,
            enableKeys: false,
            leftMouse: null
        });

        // Watch
        const watch = new OBJObject({
            id: "unset",
            objectName: "Digital_Wristwatch",
            objectPath: "./models/maneoWatch.obj",
            material: "standard",
            diffuseMapPath: `./textures/maneoDiffuse_${graphicQuality.current}.png`,
            normalMapPath: `./textures/maneoNormal_${graphicQuality.current}.png`,
            roughnessMapPath: `./textures/maneoRoughness_${graphicQuality.current}.png`,
            metalnessMapPath: `./textures/maneoMetallic_${graphicQuality.current}.png`,
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

    const startLoading = (quality) => {
        if (isLoading.state) return;

        graphicQuality.current = quality;

        setIsLoading({
            state: true,
            progress: 0
        });
    }

    // Stepper being the angles and 'state' to put the scene in
    const stepperClick = (pos, buttonSelectedCallback) => {
        buttonSelectedCallback();
        scene.current.setCameraAngleState(pos);
        setStepperPos(pos);
    }

    return (
        <>
        <div className='header'>
            <div className={'indicator' + ' indicator--' + type}></div>
            <h1 className='title'>{title}</h1>
        </div>
        <div className='body'>
            <p>It's the early 90s - just before the Japanese economic bubble collapse, and Manéo are promoting their new wrist watch with advanced features, longer battery life, and a metallic wrist strap. The future is now.</p>
            <p><i><b>Currently working on</b></i></p>
            {isLoading.state && <div ref={sceneContainer} className={'canvas-container standard-margin-bottom' + (isReady ? '' : ' no-display')}>
                <div className='maneo-ui'>
                    {stepperPos === 1 && <InfoStageOne_One/>}
                    {stepperPos === 1 && <InfoStageOne_Two/>}
                    {stepperPos === 1 && <InfoStageOne_Three/>}
                    {stepperPos === 2 && <InfoStageTwo_One/>}
                    {stepperPos === 3 && <InfoStageThree_One/>}
                    {stepperPos === 3 && <InfoStageThree_Two/>}
                    {stepperPos === 4 && <InfoStageFour_One/>}
                    {stepperPos === 4 && <InfoStageFour_Two/>}
                    {stepperPos === 5 && <InfoStageFive_One/>}
                </div>
            </div>}
            {!isReady && <LoadingOverlay progress={isLoading.progress} click={startLoading}/>}
            {isReady && <Stepper stepperCount={stepperCount} click={stepperClick}/>}
        </div>
        </>
    );
}

const LoadingOverlay = ({ progress, click }) => {
    return (
        <div className='canvas-container canvas-container--loading'>
            <p>Load scene with graphic quality:</p>
            <div className='maneo-settings'>
                <button onClick={() => click('Low')}>Low</button>
                <button onClick={() => click('Standard')}>Standard</button>
                <button onClick={() => click('Ultra')}>Ultra</button>
            </div>
            <div className='maneo-loading-bar' style={{ width: (progress * 6) + 'px' }}></div>
        </div>
    );
}

const Stepper = ({ stepperCount, click }) => {
    const buttons = useRef([]);
    const buttonCount = new Array(stepperCount).fill(0);
    let currentPos = 0;
    const posTimeout = {
        1: 4500,
        2: 8000,
        3: 6500,
        4: 8000,
        5: 8000,
        0: 8000
    };
    let timeoutRef;

    useEffect(() => {
        cycleStepper();
        return () => clearTimeout(timeoutRef);
    }, []);

    const handleClick = (pos) => {
        click(pos, () => setButtonSelected(pos));
        currentPos = pos;
        currentPos = currentPos === buttons.current.length - 1 ? 0 : pos + 1;
    }

    const cycleStepper = () => {
        handleClick(currentPos);
        timeoutRef = setTimeout(() => {
            cycleStepper();
        }, posTimeout[currentPos]);
    }

    const setButtonSelected = (pos) => {
        buttons.current.forEach(button => button.classList.remove('selected'));
        buttons.current[pos].classList.add('selected');
    }

    return (
        <div className='maneo-stepper'>
            {buttonCount.map((b, index) => 
                <button key={index} ref={el => buttons.current[index] = el} onClick={() => handleClick(index)}></button>
            )}
        </div>
    );
}

const InfoStageOne_One = () => {
    return (
        <div className='maneo-ui-stage-one--one'>
            <svg xmlns="http://www.w3.org/2000/svg" width="140" height="99" viewBox="0 0 140 99" fill="none">
                <circle cx="12" cy="87" r="10" stroke="rgb(22, 161, 171)" strokeWidth="2"/>
                <line x1="19.455" y1="79.1616" x2="139.455" y2="1.16156" stroke="rgb(22, 161, 171)" strokeWidth="2"/>
            </svg>
            <span>single button stopwatch for any situation</span>
        </div>
    );
}

const InfoStageOne_Two = () => {
    return (
        <div className='maneo-ui-stage-one--two'>
            <span>easy configurable date, time and 24hour settings</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="92" height="48" viewBox="0 0 92 48" fill="none">
                <line x1="1.64304" y1="42.4812" x2="70.7678" y2="16.0659" stroke="rgb(22, 161, 171)" strokeWidth="2"/>
                <circle cx="80" cy="12" r="10" stroke="rgb(22, 161, 171)" strokeWidth="2"/>
            </svg>
        </div>
    );
}

const InfoStageOne_Three = () => {
    return (
        <div className='maneo-ui-stage-one--three'>
            <span>visibility anywhere with improved <i>ElectroLuminescence</i></span>
            <svg xmlns="http://www.w3.org/2000/svg" width="140" height="24" viewBox="0 0 140 24" fill="none">
                <line x1="1.9932" y1="13" x2="118.556" y2="12.2077" stroke="rgb(22, 161, 171)" strokeWidth="2"/>
                <circle cx="128" cy="12" r="10" stroke="rgb(22, 161, 171)" strokeWidth="2"/>
            </svg>
        </div>
    );
}

const InfoStageTwo_One = () => {
    return (
        <div className='maneo-ui-stage-two--one'>
            <svg xmlns="http://www.w3.org/2000/svg" width="94" height="28" viewBox="0 0 94 28" fill="none">
                <circle cx="12" cy="14" r="10" stroke="rgb(22, 161, 171)" strokeWidth="2"/>
                <line x1="22" y1="14" x2="92" y2="14" stroke="rgb(22, 161, 171)" strokeWidth="2"/>
            </svg>
            <span>redesigned wrist strap; improved comfort for an all-day wear</span>
        </div>
    );
}

const InfoStageThree_One = () => {
    return (
        <div className='maneo-ui-stage-three--one'>
            <svg xmlns="http://www.w3.org/2000/svg" width="140" height="99" viewBox="0 0 140 99" fill="none">
                <circle cx="12" cy="87" r="10" stroke="rgb(22, 161, 171)" strokeWidth="2"/>
                <line x1="19.455" y1="79.1616" x2="139.455" y2="1.16156" stroke="rgb(22, 161, 171)" strokeWidth="2"/>
            </svg>
            <span>one-size fits all with the reinforced double hinge mechanism</span>
        </div>
    );
}

const InfoStageThree_Two = () => {
    return (
        <div className='maneo-ui-stage-three--two'>
            <span>complete the look with the manéo embossed signature</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="92" height="48" viewBox="0 0 92 48" fill="none">
                <line x1="1.64304" y1="42.4812" x2="70.7678" y2="16.0659" stroke="rgb(22, 161, 171)" strokeWidth="2"/>
                <circle cx="80" cy="12" r="10" stroke="rgb(22, 161, 171)" strokeWidth="2"/>
            </svg>
        </div>
    );
}

const InfoStageFour_One = () => {
    return (
        <div className='maneo-ui-stage-four--one'>
            <span>smart, ergonomic links for full length customisability</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="87" height="57" viewBox="0 0 87 57" fill="none">
                <line x1="1.87566" y1="2.0778" x2="66.2362" y2="38.598" stroke="rgb(22, 161, 171)" strokeWidth="2"/>
                <circle cx="75" cy="45" r="10" stroke="rgb(22, 161, 171)" strokeWidth="2"/>
            </svg>
        </div>
    );
}

const InfoStageFour_Two = () => {
    return (
        <div className='maneo-ui-stage-four--two'>
            <svg xmlns="http://www.w3.org/2000/svg" width="49" height="74" viewBox="0 0 49 74" fill="none">
                <line x1="17.8693" y1="20.5057" x2="46.8693" y2="71.5057" stroke="rgb(22, 161, 171)" strokeWidth="2"/>
                <circle cx="12" cy="12" r="10" stroke="rgb(22, 161, 171)" strokeWidth="2"/>
            </svg>
            <span>water resistant, shock-proof, and scratch-proof 7mm thick face</span>
        </div>
    );
}

const InfoStageFive_One = () => {
    return (
        <div className='maneo-ui-stage-five--one'>
            <svg xmlns="http://www.w3.org/2000/svg" width="94" height="28" viewBox="0 0 94 28" fill="none">
                <circle cx="12" cy="14" r="10" stroke="rgb(22, 161, 171)" strokeWidth="2"/>
                <line x1="22" y1="14" x2="92" y2="14" stroke="rgb(22, 161, 171)" strokeWidth="2"/>
            </svg>
            <span>stainless steel back, vacuum certified, longer battery life</span>
        </div>
    );
}