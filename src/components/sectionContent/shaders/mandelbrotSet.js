import { useEffect, useRef, useState } from "react";
import { Scene } from "../../../3js/scene";
import { MandelbrotShaderObject } from "../../../3js/shaders/shaderObjects/mandelbrotShaderObject";

export default function MandelbrotSet({type, title}) {
    const sceneContainer = useRef();
    const sceneUI = useRef();
    const [isReady, setIsReady] = useState(false);
    let scene = useRef();
    let shaderObject = useRef();

    useEffect(() => {
        return () => scene.current?.dispose();
    }, []);

    useEffect(() => {
        if (!isReady) return;

        scene.current = new Scene({
            parent: sceneContainer.current,
            width: sceneContainer.current.parentElement.clientWidth,
            height: 1090,
            colour: [0, 0, 0],
            antialias: false,
            alpha: false,
            pausedCallback: whenScenePaused
        });

        shaderObject.current = new MandelbrotShaderObject({
            shader: 'mandelbrot',
        });

        scene.current.addObjectToScene(shaderObject.current);
    }, [isReady]);

    const whenScenePaused = (state) => {
        state ? document.removeEventListener('keydown', bindControls) : document.addEventListener('keydown', bindControls);
    }

    const bindControls = (e) => {
        switch (e.keyCode) {
            case 65: // a
                e.preventDefault();
                shaderObject.current.addPos(-0.1, 0);
                break;
            case 68: // d
                e.preventDefault();
                shaderObject.current.addPos(0.1, 0);
                break;
            case 87: // w
                e.preventDefault();
                shaderObject.current.addPos(0, 0.1);
                break;
            case 83: // s
                e.preventDefault();
                shaderObject.current.addPos(0, -0.1);
                break;
            case 82: // r
                e.preventDefault();
                shaderObject.current.multiplyScale(0.9, 0.9);
                break;
            case 84: // t
                e.preventDefault();
                shaderObject.current.multiplyScale(1.1, 1.1);
                break;
            default:
                break;
        }
    }

    return (
        <>
        <div className='header'>
            <div className={'indicator' + ' indicator--' + type}></div>
            <h1 className='title'>{title}</h1>
        </div>
        <div className='body'>
            <p>The Mandelbrot set has become popular outside mathematics both for its aesthetic appeal and as an example of a complex structure arising from the application of simple rules. It is one of the best-known examples of mathematical visualization, mathematical beauty, and motif.</p>
            {isReady && <div ref={sceneContainer} className='canvas-container standard-margin-bottom' style={{ height: '1090px' }}>
                <div ref={sceneUI} className='canvas-container canvas-container__ui' style={{ height: '1090px' }}></div>
            </div>}
            {!isReady && <LoadingOverlay click={() => setIsReady(true)}/>}
        </div>
        </>
    );
}

const LoadingOverlay = ({ click }) => {
    return (
        <div onClick={click} className='canvas-container canvas-container--loading' style={{ height: '1090px' }}>
            <p className='canvas-container--clickable'>Click to load scene</p>
        </div>
    );
}