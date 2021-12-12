import { useEffect, useRef } from "react";
import { Cube } from "../../../3js/objects/cube";
import { Scene } from "../../../3js/scene";

export default function WrappingThreeJS({type, title}) {
    return (
        <>
        <div className='header'>
            <div className={'indicator' + ' indicator--' + type}></div>
            <h1 className='title'>{title}</h1>
        </div>
        <div className='body'>
            <p><a href={'//threejs.org'} target='_blank' rel='noopener noreferrer'>Three.js</a> is an exciting general purpose 3D graphics library for the web, based on WebGL. It makes creating WebGL applications simple and abstracts a lot of the complexities in creating 3D graphics. There are some useful extensions to it that include audio, particle systems, physics - if you're looking for an all-in-one package for creating games on the web, this is your best bet, though not everything comes out-the-box. It's an amazing and still well maintained package, even after 10 years.</p>
            <p>Let's demonstrate how easy it is to start creating wrapper classes and set up a scene and a render loop for any kind of game logic.</p>
            <SceneDemoOne/>
        </div>
        </>
    );
}

export const SceneDemoOne = () => {
    const container = useRef();
    let scene = useRef();

    useEffect(() => {
        scene = new Scene(60, {
            parent: container.current,
            width: container.current.clientWidth,
            height: 600,
            colour: null,
            antialias: true,
            alpha: false
        }, {
            enableKeys: true,
            enableZoom: false, 
            leftKey: 65,
            upKey: 87,
            rightKey: 68,
            downKey: 83,
            rightMouse: null,
            middleMouse: null, 
            leftMouse: null,
            cameraPosition: { x: 0, y: 0, z: -5 },
            cameraTarget: { x: 0, y: 0, z: 0 }
        });

        const cube = new Cube();
        cube.setUpdate(() => {
            cube.addRotation(0.01, 0.02, 0);
        });
        scene.addObjectToScene(cube);
    }, []);

    return (
        <div ref={container}></div>
    );
}