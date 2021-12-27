import { useEffect, useRef, useState } from "react";
import { ShaderObject } from "../../../3js/objects/shaderobject";
import { Scene } from "../../../3js/scene";

export default function Placeholder({type, title}) {
    const sceneContainer = useRef();
    const [isReady, setIsReady] = useState(false);
    let scene = useRef();

    useEffect(() => {
        return () => scene.current?.dispose();
    }, []);

    useEffect(() => {
        if (!isReady) return;

        scene.current = new Scene({
            parent: sceneContainer.current,
            width: sceneContainer.current.parentElement.clientWidth,
            height: 600,
            colour: [221, 221, 211],
            antialias: false,
            alpha: false
        });

        const shaderObject = new ShaderObject({
            shader: 'sinShader'
        });

        scene.current.addObjectToScene(shaderObject);
    }, [isReady]);

    return (
        <>
        <div className='header'>
            <div className={'indicator' + ' indicator--' + type}></div>
            <h1 className='title'>{title}</h1>
        </div>
        <div className='body'>
            <p>Addendum: let's set up a scene to demonstrate rendering a single fragment shader to a plane - it's a great way to start getting into the world of shaders. This set up will be optimised later, it's a bit untidy, but simple - the <code>Scene</code> is instantiated as usual, we just need to create a <code><a href={'//threejs.org/docs/#api/en/core/BufferGeometry'} target='_blank' rel='noopener noreferrer'>BufferGeometry</a></code> to apply the shader to, and create a base class for our custom shaders to inherit.</p>
            {isReady && <div ref={sceneContainer} className='canvas-container standard-margin-bottom'></div>}
            {!isReady && <LoadingOverlay click={() => setIsReady(true)}/>}
        </div>
        </>
    );
}

const LoadingOverlay = ({ click }) => {
    return (
        <div onClick={click} className='canvas-container canvas-container--loading'>
            <p className='canvas-container--clickable'>Click to load scene</p>
        </div>
    );
}