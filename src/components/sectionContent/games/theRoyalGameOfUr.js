import { useRef, useState } from "react";
import { useEffect } from "react/cjs/react.development";
import useOnScreen from "../../../hooks/useOnScreen";
import RoyalGameOfUr from "../../../3js/royalGameOfUr";
import { Cube } from "../../../3js/objects/cube";
import '../../../scss/sectionContent/royalGameOfUr.scss';

export default function TheRoyalGameOfUr({type, title}) {
    const sceneContainer = useRef();
    const isOnScreen = useOnScreen(sceneContainer);
    const [isReady, setIsReady] = useState(false);
    let scene = useRef();

    useEffect(() => {
        scene.current = new RoyalGameOfUr({
            parent: sceneContainer.current,
            width: sceneContainer.current.clientWidth,
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
        scene.current.addObjectToScene(cube);
    }, []);

    useEffect(() => {
        scene.current.pause(!isOnScreen);
    }, [isOnScreen]);

    return (
        <>
        <div className='header'>
            <div className={'indicator' + ' indicator--' + type}></div>
            <h1 className='title'>{title}</h1>
        </div>
        <div className='body'>
            <p>AKA. the 'Game of Twenty Squares' is a two-player race-to-the-finish style board game first played (we think) 4500 years ago amongst the Kings and Queens of Ur in ancient Mesopotamia, now southern Iraq. This is one of five board games found by Sir Leonard Woolley in the Royal Cemertary at Ur, now held in the British Museum. Not only is it fascinating for a board game to exist at this period of early civilisation, but the game requires an intense balance of luck and skill to win.</p>
            <div ref={sceneContainer} className={'canvas-container standard-margin-bottom' + (isReady ? '' : ' no-display')}></div>
            {!isReady && <div className='canvas-container canvas-container--loading'>
                <p>Loading Scene</p>
            </div>}
        </div>
        </>
    );
}