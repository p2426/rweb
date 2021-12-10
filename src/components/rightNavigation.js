import '../scss/navigation.scss';
import { useEffect, useRef, useState } from 'react';

export default function RightNavigation({sections}) {
    const ul = useRef();
    const items = useRef([]);
    const mainSections = useRef();
    let [sectionResized, setSectionResized] = useState(0);

    // Bind event to a target element's scroll to update the style of the items in the list,
    // when the section is scrolled to.
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
    }, [sectionResized]);

    // For the bolding of items in this component to be accurate to which section is in the viewport,
    // we should recalculate bounds of sections once they have been loaded and therefore resized
    useEffect(() => {
        const runSectionResized = () => {
            setSectionResized(sectionResized++);
        };
        document.body.addEventListener('SectionResized', runSectionResized);
        return () => document.body.removeEventListener('SectionResized', runSectionResized);
    }, []);

    return (
        <nav>
            <ul ref={ul} className='right after-strip--vertical'>
                {sections.map((section, index) => {
                    return <li key={index} ref={el => items.current[index] = el}>{section.props.title}</li>
                })}
            </ul>
        </nav>
    );
}