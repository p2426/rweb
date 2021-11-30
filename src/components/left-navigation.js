import '../scss/navigation.scss';
import { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

export default function LeftNavigation(props) {
    const ul = useRef();
    const items = useRef([]);
    const history = useHistory();

    useEffect(() => {
        // Set current active item based on path
        const path = history.location.pathname.slice(1);
        if (path.length) {
            setOnlyActiveItem(items.current.filter(item => item.textContent.toLowerCase() === path)[0]);
        }
    });

    // Using useHistory here to stop the 'flicker' a Link tag has when redirecting;
    // just push a new path
    const handleClick = (url, item) => {
        history.push(url);
        setOnlyActiveItem(item);
    }

    const setOnlyActiveItem = (item) => {
        items.current.forEach(item => item.classList.remove('active'));
        item.classList.add('active');
    }

    return (
        <nav>
            <ul ref={ul} className='left animate__after-strip--vertical animate__push-left-fade-in--list'>
                {props.sections.map((section, index) => {
                    return <li key={index} ref={el => items.current[index] = el} onClick={(e) => handleClick(section.toLowerCase(), items.current[index])}>{section}</li>
                })}
            </ul>
        </nav>
    );
}