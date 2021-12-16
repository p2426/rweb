import { useEffect, useRef } from "react";
import { Cube } from "../../../3js/objects/cube";
import { Scene } from "../../../3js/scene";
import useOnScreen from "../../../hooks/useOnScreen";

export default function WrappingThreeJS({type, title}) {
    return (
        <>
        <div className='header'>
            <div className={'indicator' + ' indicator--' + type}></div>
            <h1 className='title'>{title}</h1>
        </div>
        <div className='body'>
            <p><a href={'//threejs.org'} target='_blank' rel='noopener noreferrer'>Three.js</a> is a high-level general purpose 3D graphics library for the web, based on WebGL. It makes creating WebGL applications simple and abstracts a lot of the complexities in creating 3D graphics. There are some useful extensions to it that include audio, particle systems, physics - if you're looking for an all-in-one package for creating games on the web, this is your best bet, though not everything comes out-the-box. It's an amazing and still well maintained package, even after 10 years.</p>
            <p>Using 3JS is pretty straight forward, but let's begin by creating some wrapper classes to bend it into being even easier to use.</p>
            <SceneDemoOne/>
            <pre><code>
{`
const scene = new Scene({
    parent: container,
    width: container.clientWidth,
    height: 600,
    colour: [221, 221, 211],
    antialias: false,
    alpha: false
}, {
    cameraPosition: [0, 0, 4],
});

const cube = new Cube({
    colour: [128, 0, 32]
});

cube.setUpdate((time, res) => {
    cube.addRotation(time.delta / 600, time.delta / 1000, 0);
});

scene.addObjectToScene(cube);
`}
            </code></pre>
            <p>Let's work backwards from the code and rationalise what has been done, while brushing over some lower level concepts of computer graphics. For reference, here are the default settings for the scene, and camera:</p>
            <pre><code>
{`
sceneSettings = {
    parent: document.body,
    width: window.innerWidth,
    height: window.innerHeight,
    colour: [221, 221, 211],
    antialias: true,
    alpha: true
};

cameraSettings = {
    fov: 50,
    near: 0.1,
    far: 1000,
    enableKeys: true,
    enableZoom: false,
    leftKey: 65,
    upKey: 87,
    rightKey: 68,
    downKey: 83,
    rightMouse: null,
    middleMouse: null,
    leftMouse: THREE.MOUSE.ROTATE,
    cameraPosition: [0, 0, 0],
    cameraTarget: [0, 0, 0]
};
`}
            </code></pre>
            <p>It's safe to assume that most of the important stuff happens in the <code>Scene</code> class - and there are 4 main classes that need to be instantiated, which can be tweaked using the objects passed in through the <code>Scene</code> constructor. Default settings are set up inside to make scene creation less verbose and more logical - but first of all, a <code>THREE.Scene</code> must be created in order to place meshes, lights, cameras, etc. You can read more about what can be passed into a 3JS scene in their documentation (<a href={'//threejs.org/docs/?q=scene#api/en/scenes/Scene'} target='_blank' rel='noopener noreferrer'>Scene</a>) - but we're not actually using any settings there for now.</p>
            <pre><code>
{`
this.scene = new THREE.Scene();
`}
            </code></pre>
            <p>Secondly, a <code>THREE.WebGLRenderer</code> is instantiated with only 2 properties passed though, the <code>antialias</code> and <code>alpha</code> properties in the <code>Scene</code> constructor. This very object is what enables the display of your creations, and really tapping into the base of your GPU by allowing GPU-accelerated usage of physics and image processing, as well as partical effects all as part of the <code>{'<canvas>'}</code> element on a web page. This renderer can also be used to create Shaders, small mathematical programs written in GLSL to run directly on the GPU hardware to create post-processing effects, vertex and fragment effects, changing up the look of any object or pixel in the scene. A great resource on what Shaders are and how to use them can be found over at <a href={'//thebookofshaders.com/01'} target='_blank' rel='noopener noreferrer'>The book of shaders</a>.</p>
            <pre><code>
{`
this.renderer = new THREE.WebGLRenderer({
    antialias: this.sceneSettings.antialias,
    alpha: this.sceneSettings.alpha
});
`}
            </code></pre>
            <p>The next important instantiation is the <code>THREE.PerspectiveCamera</code> - and optionally, some way to control the camera with <code>OrbitControls</code>. As opposed to an orthgraphic camera, the <code>THREE.PerspectiveCamera</code> is used to mimic the human eyes, and well, <i>create perspective</i> with it's field of view (<code>fov</code>), aspect ratio, <code>near</code> and <code>far</code> planes. Simply put, the near and far planes allow the fine-tuning of what is rendered in the scene, depending on where you put it. Digging deeper (and what is simplified by using 3JS); 3D graphics programs like Open/WebGL use matrix maths on translation, rotation and scale, and formulates them as model, view and projection matrices. This data is uploaded to the GPU and a vertex shader transforms each vertex (or point) into the more understandable vector coordinate system (x, y, z, w). This is also known as <i>clip space</i>, which is what the <code>near</code> and <code>far</code> attributes are for - anything within the distance of those values along the vector of the camera will be rendered, anything outside of that boundary will be <i>clipped</i>, which is an incredibly important optimisation technique. This is just scratching the surface of the importance of understanding matrix maths in 3D graphics, luckily you don't <i>have</i> to, but knowing the fundamentals will go a long way - you can read more <a href={'//www.opengl-tutorial.org/beginners-tutorials/tutorial-3-matrices/'} target='_blank' rel='noopener noreferrer'>here</a>.</p>
            <pre><code>
{`
this.camera = new THREE.PerspectiveCamera(this.cameraSettings.fov,
                                          this.sceneSettings.width / this.sceneSettings.height,
                                          this.cameraSettings.near,
                                          this.cameraSettings.far);
this.controls = new OrbitControls(this.camera, this.renderer.domElement);
`}
            </code></pre>
            <p>Finally, let's take a look at the constructor where this is all done, and follow on in other sections with other code that hasn't been explained yet.</p>
            <pre><code>
{`
constructor(sceneSettings, cameraSettings) {
    // Overwrite existing keys in default settings objects
    this.sceneSettings = { ...this.sceneSettings, ...sceneSettings };
    this.cameraSettings = { ...this.cameraSettings, ...cameraSettings };

    // Instances
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
        antialias: this.sceneSettings.antialias,
        alpha: this.sceneSettings.alpha
    });
    this.camera = new THREE.PerspectiveCamera(this.cameraSettings.fov,
                                              this.sceneSettings.width / this.sceneSettings.height,
                                              this.cameraSettings.near,
                                              this.cameraSettings.far);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // Initialise
    this.initRenderer();
    this.initCamera();

    // Start render loop
    this.update();
}
`}
            </code></pre>
        </div>
        </>
    );
}

export const SceneDemoOne = () => {
    const container = useRef();
    let isOnScreen = useOnScreen(container);
    let scene = useRef();

    useEffect(() => {
        scene.current = new Scene({
            parent: container.current,
            width: container.current.clientWidth,
            height: 600,
            colour: [221, 221, 211],
            antialias: false,
            alpha: false
        }, {
            cameraPosition: [0, 0, 4],
        });

        const cube = new Cube({
            id: 'cubey',
            colour: [128, 0, 32]
        });
        cube.setUpdate((time, res) => {
            cube.addRotation(time.delta / 600, time.delta / 1000, 0);
        });
        scene.current.addObjectToScene(cube);
    }, []);

    useEffect(() => {
        scene.current.pause(!isOnScreen);
    }, [isOnScreen]);

    return (
        <div ref={container} className='standard-margin-bottom'></div>
    );
}