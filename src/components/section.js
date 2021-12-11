import { useEffect, useRef, useState } from 'react';
import useOnScreen from '../hooks/useOnScreen';
import '../scss/section.scss';

export default function Section({section}) {
    const container = useRef();
    const [firstVisual, setFirstVisual] = useState(false);
    const [contentComponent, setContentComponent] = useState(false);
    let isOnScreen = useOnScreen(container);

    useEffect(() => {
        setFirstVisual(false);
        setContentComponent(null);
    }, [section]);

    useEffect(() => {
        if (isOnScreen && !firstVisual) {
            setFirstVisual(isOnScreen);
            // NOTE: We cannot 'truely' dynamically import with a variable, because it could be anything
            // and codesplitting happens at compile time, so we must give some static nature to the import path.
            // Babel will codesplit everything at the static path, which is good enough for this use case
            import(`./sectionContent/${section.props.type}/${section.filename}`)
                .then(module => setContentComponent(module.default(section.props)));
        }
    }, [isOnScreen]);

    return (
        <div ref={container} className='section'>
            {contentComponent ? contentComponent : <Placeholder/>}
        </div>
    );
}

export const Placeholder = () => {
    return (
        <div className='header'>
            <div className='placeholder-icon'></div>
            <div className='placeholder-line'></div>
        </div>
    );
}