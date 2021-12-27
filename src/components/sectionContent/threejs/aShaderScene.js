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
            colour: [0, 0, 0],
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
            <pre><code>
{`scene = new Scene({
    parent: sceneContainer,
    width: sceneContainer.parentElement.clientWidth,
    height: 600,
    colour: [0, 0, 0],
    antialias: false,
    alpha: false
});

const shaderObject = new ShaderObject({
    shader: 'sinShader'
});

scene.addObjectToScene(shaderObject);
`}
            </code></pre>
            <p>Let's work from top to bottom. Much like the <code>Cube</code> class in the above section, the <code>ShaderObject</code> takes some properties in the constructor to set things up - with defaults it doesn't need much, in fact, we want to keep it as minimal as possible, so just a <code>shader</code> property that is mapped to a shader interally. The guts of the <code>ShaderObject</code> class can be seen below.</p>
            <pre><code>
{`import { SinShader } from '../shaders/sinShader';

...

shaderMap = {
    sinShader: SinShader
}

constructor(settings) {
    super();

    this.properties = { ...this.properties, ...settings};

    this.geometry = new THREE.PlaneBufferGeometry(2, 2);
    this.properties.shader = new this.shaderMap[this.properties.shader](this.geometry);

    this.properties.material = new THREE.ShaderMaterial({
        side: THREE.FrontSide,
        uniforms: this.properties.shader.uniforms,
        vertexShader: this.properties.shader.vertexContent,
        fragmentShader: this.properties.shader.fragmentContent
    });
    this.properties.material.transparent = true;

    this.mesh = new THREE.Mesh(this.geometry, this.properties.material);
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = false;

    this.setId(this.properties.id);
    this.setPosition(...this.properties.position);
    this.setRotation(...this.properties.rotation);
    this.setScale(...this.properties.scale);
    this.properties.update = this.update.bind(this);
}

update(time, resolution) {
    this.properties.shader.update(time, resolution);
}
`}
            </code></pre>
            <p>Standard stuff, though there are 2 important things going on. Firstly, we instantiate a new shader based on the <code>shaderMap</code> variable, <i>and</i> apply some of it's properties inside the constructor of the <code>ShaderMaterial</code>. For the purposes of setting up a simple shader scene, the <code>side</code> can stay as <code>FrontSide</code>. The heart of the shader itself is the <code>vertexContent</code> and <code>fragmentContent</code>, this is the code that is executed to get the desired effect - and the <code>uniforms</code> are non-static variables that the shader code uses in its rendering, like time or resolution.</p>
            <p>Before we get to the <code>SinShader</code> we should create a class for all our shaders to inherit from, largely echoing the properties that are applied to the <code>ShaderMaterial</code> above.</p>
            <pre><code>
{`export class CustomShader {
    geometry;
    vertexPositions;

    uniforms = {
        u_time: {
            value: 0.0
        },
        u_resolution: {
            value: new THREE.Vector2(0, 0)
        }
    };

    vertexContent = '';
    fragmentContent = '';

    constructor(geometry) {
        this.geometry = geometry;
        this.vertexPositions = new Float32Array(this.geometry.attributes.position.count);
    }

    // Shader loop should be used to set uniforms, not for calculation
    update(time, resolution) {
        this.uniforms.u_time.value = time.elapsed;
        this.uniforms.u_resolution.value.x = resolution.x + 0.001;
        this.uniforms.u_resolution.value.y = resolution.y + 0.001;
    }
}
`}
            </code></pre>
            <p>Uniform variables are prefixed and snake-cased, as per GLSL convention. Importantly, the uniforms applied to a <code>ShaderMaterial</code> must be an object with the keys matching the uniform variable names in GLSL, <i>also</i> the value of the key must be another object with a single key named <code>value</code>, the value of this being the type defined in GLSL. The GLSL code itself will be stored as a string in the <code>vertexContent</code> and <code>fragmentContent</code>. The <code>update</code> function takes 2 arguments, passed in from way up in the <code>Scene</code> class, that holds the <code>time</code> object and <code>resolution</code> object - this function's sole purpose is to set uniform variables in the shader code.</p>
            <p>And finally, the <code>SinShader</code> itself.</p>
            <pre><code>
{`export class SinShader extends CustomShader {
    // Vertex Shader
    vertexContent = '
        void main() {
            gl_Position = vec4(position, 1.0);
        }
    ';

    // Fragment Shader
    fragmentContent = '
        #ifdef GL_ES
        precision mediump float;
        #endif

        #define PI 3.14159265359

        uniform vec2 u_resolution;  // Canvas size in pixels
        uniform float u_time;       // Elapsed time since instantiated

        float makeLine(float x, float y) {
            return smoothstep(x - 0.01, x, y) - smoothstep(x, x + 0.01, y);
        }

        void main() {
            vec2 coords = gl_FragCoord.xy / u_resolution.xy;

            vec3 colour = vec3(0.0);

            float pct = makeLine(coords.y, (sin((coords.x * PI) + (u_time * 2.0)) + 1.2) / 2.4);
            colour = (1.0 - pct) * colour + pct * vec3(0.0, 1.0, 0.0);

            gl_FragColor = vec4(colour, 1.0);
        }
    ';

    constructor(...args) {
        super(...args);
    }
}
`}
            </code></pre>
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