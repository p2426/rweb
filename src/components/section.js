import { useEffect, useRef, useState } from 'react';
import useOnScreen from '../hooks/useOnScreen';
import '../scss/section.scss';

export default function Section({section}) {
    const container = useRef();
    const [firstVisual, setFirstVisual] = useState(false);
    const [contentComponent, setContentComponent] = useState({ component: null });
    const isOnScreen = useOnScreen(container);

    useEffect(() => {
        setFirstVisual(false);
        setContentComponent({ component: null });
    }, [section]);

    useEffect(() => {
        if (isOnScreen && !firstVisual) {
            setFirstVisual(isOnScreen);
            // Broadcast SectionImporting so the RightNavigation can apply the correct state to the RightNavigation
            const e = new CustomEvent('SectionImporting', {
                detail: {
                    title: section.props.title
                }
            });
            document.body.dispatchEvent(e);

            // NOTE: We cannot 'truely' dynamically import with a variable, because it could be anything
            // and codesplitting happens at compile time, so we must give some static nature to the import path.
            // Babel will codesplit everything at the static path, which is good enough for what we are using it for
            import(`./sectionContent/${section.props.type}/${section.filename}`)
                .then(module => {
                    setContentComponent({ component: module.default });
                })
                .finally(() => {
                    // Broadcast SectionLoaded so the RightNavigation can correctly calculate bounds
                    const e = new CustomEvent('SectionLoaded', {
                        detail: {
                            title: section.props.title
                        }
                    });
                    document.body.dispatchEvent(e);
                });
        }
    }, [isOnScreen]);

    return (
        <div ref={container} className='section'>
            {contentComponent.component ? <contentComponent.component type={section.props.type} title={section.props.title}/> : <Placeholder/>}
        </div>
    );
}

export const Placeholder = () => {
    return (
        <>
        <div className='header'>
            <div className='placeholder-icon'></div>
            <div className='placeholder-line'></div>
        </div>
        <div className='body'>
            <p>Downloading content..</p>
        </div>
        </>
    );
}