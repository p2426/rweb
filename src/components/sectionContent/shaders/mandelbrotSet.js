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
        return () => {
            scene.current?.dispose();
            sceneContainer.current?.removeEventListener('wheel', sceneOnWheel);
        }
    }, []);

    useEffect(() => {
        if (!isReady) return;

        scene.current = new Scene({
            parent: sceneContainer.current,
            width: sceneContainer.current.parentElement.clientWidth,
            height: 1090,
            colour: [0, 0, 0],
            antialias: false,
            alpha: false
        });

        shaderObject.current = new MandelbrotShaderObject({
            shader: 'mandelbrot',
        });

        scene.current.addObjectToScene(shaderObject.current);

        sceneContainer.current.addEventListener('wheel', sceneOnWheel);
    }, [isReady]);

    const sceneMouseMove = (e) => {
        if (e.buttons === 1) {
            shaderObject.current.addPos(-e.movementX / 1000, e.movementY / 1000);
        } else if (e.buttons === 2) {
            shaderObject.current.addAngle(e.movementX / 360);
        }
    }

    const sceneOnWheel = (e) => {
        e.preventDefault();
        const scaleFactor = e.deltaY < 0 ? 0.8 : 1.2;
        shaderObject.current.addScale(scaleFactor, scaleFactor);
    }

    return (
        <>
        <div className='header'>
            <div className={'indicator' + ' indicator--' + type}></div>
            <h1 className='title'>{title}</h1>
        </div>
        <div className='body'>
            <p>The Mandelbrot set has become popular outside mathematics both for its aesthetic appeal and as an example of a complex structure arising from the application of simple rules. It is one of the best-known examples of mathematical visualization, mathematical beauty, and motif.</p>
            {isReady && <div ref={sceneContainer} onMouseMove={sceneMouseMove} className='canvas-container standard-margin-bottom' style={{ height: '1090px' }}>
                {/* <div ref={sceneUI} className='canvas-container canvas-container__ui' style={{ height: '1090px' }}></div> */}
            </div>}
            {!isReady && <LoadingOverlay click={() => setIsReady(true)}/>}
        </div>
        </>
    );
}

const LoadingOverlay = ({ click }) => {
    return (
        <div onClick={click} className='canvas-container canvas-container--loading' style={{ height: '1090px' }}>
            <p>Controls:</p>
            <p>Pan: Left click and drag</p>
            <p>Rotate: Right click and drag</p>
            <p>Zoom: Mouse wheel</p>
            <p className='canvas-container--clickable'>Click to load scene</p>
        </div>
    );
}