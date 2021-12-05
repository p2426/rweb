import { useEffect, useRef, useState } from 'react';
import useOnScreen from '../hooks/useOnScreen';
import '../scss/section.scss';

export default function Section(props) {
    const section = useRef();
    const title = useRef();
    const [firstVisual, setFirstVisual] = useState(false);
    let isOnScreen = useOnScreen(section);

    useEffect(() => {
        if (isOnScreen && !firstVisual) {
            setFirstVisual(isOnScreen);
        }
    }, [isOnScreen]);

    return (
        <div ref={section} className={'section' + (firstVisual ? ' animate__push-left-fade-in' : '')}>
            <h1 ref={title} className="animate--slow animate-right-border--horizontal-center">{props.section}</h1>
        </div>
    );
}