import { useEffect, useRef } from 'react';
import Section from './section';
import '../scss/main.scss';

export default function Main(props) {
    const main = useRef();

    useEffect(() => {
        main.current.classList.remove('animate__slide-up--main');
        /*eslint no-unused-expressions: 0*/
        main.current.offsetWidth;
        main.current.classList.add('animate__slide-up--main');

        // Broadcast load complete
        const e = new CustomEvent('SubjectLoaded');
        document.body.dispatchEvent(e);
    });

    return (
        <main ref={main} className='animate__slide-up--main'>
            {props.sections.map((section, index) => <Section key={index} section={section}/>)}
        </main>
    );
}