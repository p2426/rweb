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
            colour: 'rgb(221, 221, 211)',
            antialias: false,
            alpha: false
        }, {
            cameraPosition: [0, 0, 5],
        });

        const cube = new Cube({
            colour: {r: 99, g: 202, b: 223}
        });
        cube.setUpdate((time, res) => {
            cube.addRotation(0.0025, 0.005, 0);
        });
        scene.current.addObjectToScene(cube);
    }, []);

    useEffect(() => {
        scene.current.pause = !isOnScreen;
    }, [isOnScreen]);

    return (
        <div ref={container}></div>
    );
}