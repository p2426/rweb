import { useEffect, useRef, useState } from "react";
import { Scene } from "../../../3js/scene";
import { JuliaShaderObject } from "../../../3js/shaders/shaderObjects/juliaShaderObject";
import '../../../scss/sectionContent/juliaSet.scss';

export default function JuliaSet({type, title}) {
    const sceneContainer = useRef();
    const seedXInput = useRef();
    const seedYInput = useRef();
    const [isReady, setIsReady] = useState(false);
    const [seedX, setSeedX] = useState(0.35);
    const [seedY, setSeedY] = useState(0.4);
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
            antialias: true,
            alpha: false
        });

        shaderObject.current = new JuliaShaderObject({ shader: 'julia' });

        scene.current.addObjectToScene(shaderObject.current);

        seedChange({ target: seedXInput.current }, true, false);
        seedChange({ target: seedYInput.current }, false, true);
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

    const seedChange = (e, isX, isY) => {
        const value = e.target.value;
        if (value > e.target.attributes.max.value) {
            e.target.value = Number(e.target.attributes.max.value);
        } else if (value < e.target.attributes.min.value) {
            e.target.value = Number(e.target.attributes.min.value);
        }

        if (isX) {
            setSeedX(value);
            shaderObject.current?.setSeedX(value);
        } else {
            setSeedY(value);
            shaderObject.current?.setSeedY(value);
        }
    }

    return (
        <>
        <div className='header'>
            <div className={'indicator' + ' indicator--' + type}></div>
            <h1 className='title'>{title}</h1>
        </div>
        <div className='body'>
            <p>The Julia set is closely related to the Mandelbrot, with very similar calculations, in fact for every point on the complex plane a julia set can be made. The difference is that the Julia set adds a <i>seed</i> per iteration onto the current complex number, instead of starting from 0 - which results and ranges from a dust-like shape to flower-like shapes.</p>
            <p>As opposed to using the iterations to colour the pixels outright, there is a <a href={'//www.iquilezles.org/www/articles/mset_smooth/mset_smooth.htm'} target='_blank' rel='noopener noreferrer'>smoothing technique</a> to mix colours based on the double logerithmic dot product of the polynomial - used in this fractal.</p>
            <p>You can control the seed components with the inputs below, by typing or once clicked with the up and down keys.</p>
            <div className="julia__controls">
                <label>seed.x</label>
                <input ref={seedXInput} type='number' min={0} max={1} step={0.001} defaultValue={0.35} onChange={(e) => { seedChange(e, true, false); }}/>
                <label>seed.y</label>
                <input ref={seedYInput} type='number' min={0} max={1} step={0.001} defaultValue={0.4} onChange={(e) => { seedChange(e, false, true); }}/>
            </div>
            {isReady && <div ref={sceneContainer} onMouseMove={sceneMouseMove} className='canvas-container standard-margin-bottom' style={{ height: '1090px' }}></div>}
            {!isReady && <LoadingOverlay click={() => setIsReady(true)}/>}
            <pre><code>
{`precision highp float;
#define MAX_ITERATIONS 255.0

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pos;
uniform vec2 u_scale;
uniform float u_angle;
uniform vec2 u_seed;
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
    vec2 z = vec2(u_pos + (vUv - 0.5) * u_scale);
    z = rotate(z, u_pos, u_angle);
    z.x += 0.5;

    float i;
    for (i = 0.0; i < MAX_ITERATIONS; i++) {
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + u_seed;
        if (length(z) > 2.0) break;
    }

    float smoothCol = i - log2(log2(dot(z, z)));
    smoothCol = mix(i, smoothCol, 1.0);
    vec3 col = vec3(0.5 + 0.5 * cos(3.0 + smoothCol * 0.15 + vec3(0.0, 0.6, 1.0)));

    gl_FragColor = vec4(col, 1.0);
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