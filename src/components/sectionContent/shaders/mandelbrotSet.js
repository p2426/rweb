import { useEffect, useRef, useState } from "react";
import { Scene } from "../../../3js/scene";
import { MandelbrotShaderObject } from "../../../3js/shaders/shaderObjects/mandelbrotShaderObject";

export default function MandelbrotSet({type, title}) {
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
            colour: [0, 0, 0],
            antialias: false,
            alpha: false
        });

        const shaderObject = new MandelbrotShaderObject({
            shader: 'mandelbrot',
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
            <p>The Mandelbrot set has become popular outside mathematics both for its aesthetic appeal and as an example of a complex structure arising from the application of simple rules. It is one of the best-known examples of mathematical visualization, mathematical beauty, and motif.</p>
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