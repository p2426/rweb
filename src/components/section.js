import { useEffect, useRef, useState } from 'react';
import useOnScreen from '../hooks/useOnScreen';
import '../scss/section.scss';

export default function Section({section}) {
    const container = useRef();
    const [firstVisual, setFirstVisual] = useState(false);
    const [applyContent, setApplyContent] = useState(false);
    let isOnScreen = useOnScreen(container);

    useEffect(() => {
        setFirstVisual(false);
        setApplyContent(false);
    }, [section]);

    useEffect(() => {
        if (isOnScreen && !firstVisual) {
            setFirstVisual(isOnScreen);
            setTimeout(() => {
                setApplyContent(true);
                // Broadcast event that this section has rendered, and therefore resized
                const e = new CustomEvent('SectionResized');
                document.body.dispatchEvent(e);
            }, 500);
        }
    }, [isOnScreen]);

    return (
        <div ref={container} className='section'>
            {applyContent ? <Content title={section}/> : <Placeholder/>}
        </div>
    );
}

export const Placeholder = () => {
    return (
        <div className='placeholder'>
            <div className='header'>
                <div className='icon'></div>
                <div className='title'></div>
            </div>
        </div>
    );
}

export const Content= ({title}) => {
    return (
        <h1>{title}</h1>
    );
}