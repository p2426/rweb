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
        // Store sections in ref to also be used in click event for items
        const main = document.querySelector('main');
        mainSections.current = Array.from(main.querySelectorAll('.section'));

        const sectionDimensions = mainSections.current.map(section => {
            const bounds = section.getBoundingClientRect();
            return {
                // No ways of rounding will make the vertical bounds connect, need to minus 1
                top: (Math.round(bounds.top) + Math.round(document.documentElement.scrollTop)) - 1,
                bottom: Math.round(bounds.bottom) + Math.round(document.documentElement.scrollTop)
            }
        });

        const bindMainScroll = (e) => {
            sectionDimensions.forEach((section, index) => {
                // In a range; set the active state on the nav item, removing active on any others
                if (document.documentElement.scrollTop >= section.top && document.documentElement.scrollTop < section.bottom && !items.current[index].classList.contains('active')) {
                    items.current[index].classList.add('active');
                    const otherItems = items.current.map(x => x);
                    otherItems.splice(index, 1);
                    otherItems.forEach(item => item?.classList.remove('active'));
                }
            });
        };

        document.addEventListener('scroll', bindMainScroll);
        return () => document.removeEventListener('scroll', bindMainScroll);
    });

    // const handleItemClick = (e, index) => {
    //     if (!mainSections.current.length) {
    //         return;
    //     }

    //     mainSections.current[index].scrollIntoView({block: 'start'});
    // }

    return (
        <nav>
            <ul ref={ul} className={('right ' + (Number(props.animateStrip) ? 'animate__after-strip--vertical ' : 'after-strip--vertical ')).trim()}>
                {props.sections.map((section, index) => {
                    // return <li key={index} ref={el => items.current[index] = el} onClick={(e) => { handleItemClick(e, index) }}>{section}</li>
                    return <li key={index} ref={el => items.current[index] = el}>{section}</li>
                })}
            </ul>
        </nav>
    );
}