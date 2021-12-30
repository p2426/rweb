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
            <p>The 'Hello world!' of fractals. The Mandelbrot set has become popular outside mathematics both for its aesthetic appeal and as an example of a complex structure arising from the application of simple rules. It is one of the best-known examples of mathematical visualization, mathematical beauty, and motif. I'm a huge fan of Fractal geometry as it always gives amazing results (limited only by the hardware we use) - even better if the application of mathematics looks clean and <i>simple</i>. Wikipedia explains the <a href={'//en.wikipedia.org/wiki/Mandelbrot_set'} target='_blank' rel='noopener noreferrer'>Mandelbrot set</a> better than I ever could.</p>
            {isReady && <div ref={sceneContainer} onMouseMove={sceneMouseMove} className='canvas-container standard-margin-bottom' style={{ height: '1090px' }}>
                {/* <div ref={sceneUI} className='canvas-container canvas-container__ui' style={{ height: '1090px' }}></div> */}
            </div>}
            {!isReady && <LoadingOverlay click={() => setIsReady(true)}/>}
            <pre><code>
{`precision highp float;
#define MAX_ITERATIONS 255.0

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pos;
uniform vec2 u_scale;
uniform float u_angle;
varying vec2 vUv;

// Rotate around a point in 2D space
vec2 rotate(vec2 p, vec2 pivot, float a) {
    float s = sin(a);
    float c = cos(a);

    p -= pivot;
    p = vec2(p.x * c - p.y * s, p.x * s + p.y * c);
    p += pivot;

    return p;
}

void main() {
    vec2 transform = vec2(u_pos + (vUv - 0.5) * u_scale);
    transform = rotate(transform, u_pos, u_angle);

    vec2 z = vec2(0, 0);
    float i;
    for (i = 0.0; i < MAX_ITERATIONS; i++) {
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + transform;
        if (length(z) > 2.0) break;
    }

    gl_FragColor = vec4(vec3(i / MAX_ITERATIONS), 1.0);
}
`}
            </code></pre>
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