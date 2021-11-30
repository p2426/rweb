import '../scss/navigation.scss';
import { useEffect, useRef } from 'react';

export default function RightNavigation(props) {
    const ul = useRef();
    const items = useRef([]);
    const mainSections = useRef();

    // Bind event to a target element's scroll to update the style of the items in the list,
    // when the section is scrolled to. This binding should not have dependencies, and be updated
    // on re-render
    useEffect(() => {
        // Add push/fade animation to items in the list
        if (Number(props.animateItems)) {
            // For some reason, there is no nice way to reset a css animation :()
            ul.current.classList.remove('animate__push-right-fade-in--list');
            /*eslint no-unused-expressions: 0*/
            ul.current.offsetWidth;
            ul.current.classList.add('animate__push-right-fade-in--list');
        }
        // Store sections in ref to also be used in click event for items
        const main = document.querySelector('main');
        mainSections.current = Array.from(main.querySelectorAll('.section'));

        const sectionDimensions = mainSections.current.map(section => {
            return {
                top: section.offsetTop,
                bottom: section.offsetTop + section.offsetHeight,
            };
        });

        const bindMainScroll = () => {
            sectionDimensions.forEach((section, index) => {
                // In a range; set the active state on the nav item, removing active on any others
                if (main.scrollTop >= section.top && main.scrollTop < section.bottom && !items.current[index].classList.contains('active')) {
                    items.current[index].classList.add('active');
                    const otherItems = items.current.map(x => x);
                    otherItems.splice(index, 1);
                    otherItems.forEach(item => item?.classList.remove('active'));
                }
            });
        };

        main.addEventListener('scroll', bindMainScroll);
        return () => main.removeEventListener('scroll', bindMainScroll);
    });

    const handleItemClick = (e, index) => {
        if (!mainSections.current.length) {
            return;
        }

        mainSections.current[index].scrollIntoView({
            behaviour: 'smooth',
            block: 'start'
        });
    }

    return (
        <nav>
            <ul ref={ul} className={('right ' +
                                    (Number(props.animateStrip) ? 'animate__after-strip--vertical ' : 'after-strip--vertical ') +
                                    (Number(props.animateItems) ? 'animate__push-right-fade-in--list' : '')).trim()}>
                {props.sections.map((section, index) => {
                    return <li key={index} ref={el => items.current[index] = el} onClick={(e) => { handleItemClick(e, index) }}>{section}</li>
                })}
            </ul>
        </nav>
    );
}