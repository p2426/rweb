import { useRef } from 'react';
import useOnScreen from '../hooks/useOnScreen';
import '../scss/section.scss';

export default function Section(props) {
    const section = useRef();
    const title = useRef();
    const isOnScreen = useOnScreen(section);

    return (
        <div ref={section} className={'section' + (isOnScreen ? ' animate__push-left-fade-in' : '')}>
            <h1 ref={title} className="animate--slow animate-right-border--horizontal-center">{props.section}</h1>
        </div>
    );
}