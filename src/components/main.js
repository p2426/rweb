import { useEffect, useRef } from 'react';
import Section from './section';
import '../scss/main.scss';

export default function Main(props) {
    const main = useRef();

    useEffect(() => {
        /*eslint no-unused-expressions: 0*/
        main.current.offsetWidth;

        // Broadcast load complete
        const e = new CustomEvent('SubjectLoaded');
        document.body.dispatchEvent(e);
    });

    return (
        <main ref={main}>
            {props.sections.map((section, index) => <Section key={index} section={section}/>)}
        </main>
    );
}