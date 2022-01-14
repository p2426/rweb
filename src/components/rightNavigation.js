import '../scss/navigation.scss';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function RightNavigation({sections}) {
    const ul = useRef();
    const items = useRef([]);
    const mainSections = useRef();
    const location = useLocation();
    const [sectionLoaded, setSectionLoaded] = useState([]);
    const [sectionImporting, setSectionImporting] = useState(null);
    let sectionDimensions = useRef([]);

    // Bind event to a target element's scroll to update the style of the items in the list,
    // when the section is scrolled to.
    useEffect(() => {
        // Store sections in ref to also be used in click event for items
        const main = document.querySelector('main');
        mainSections.current = Array.from(main.querySelectorAll('.section'));

        sectionDimensions.current = mainSections.current.map(section => {
            const bounds = section.getBoundingClientRect();
            return {
                // No ways of rounding will make the vertical bounds connect, need to minus 1
                top: (Math.round(bounds.top) + Math.round(document.documentElement.scrollTop)) - 1,
                bottom: Math.round(bounds.bottom) + Math.round(document.documentElement.scrollTop)
            }
        });

        const bindMainScroll = (e) => {
            sectionDimensions.current.forEach((section, index) => {
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
    }, [sectionLoaded]);

    useEffect(() => {
        setSectionLoaded([]);
    }, [location]);

    // For the bolding of items in this component to be accurate to which section is in the viewport,
    // we should recalculate bounds of sections once they have been loaded and therefore resized
    useEffect(() => {
        const runSectionLoaded = (e) => {
            setSectionLoaded(sectionLoaded => [...sectionLoaded, e.detail.title]);
        };
        const runSectionImporting = (e) => {
            setSectionImporting(e.detail.title);
        }
        document.body.addEventListener('SectionLoaded', runSectionLoaded);
        document.body.addEventListener('SectionImporting', runSectionImporting);
        return () => {
            document.body.removeEventListener('SectionLoaded', runSectionLoaded);
            document.body.removeEventListener('SectionImporting', runSectionImporting);
        }
    }, []);

    const handleItemClick = (e, index) => {
        window.scrollTo({
            top: sectionDimensions.current[index].top,
            behavior: 'smooth'
        })
    }

    return (
        <nav>
            <ul ref={ul} className='right after-strip--vertical'>
                {sections.map((section, index) => {
                    return <li key={index}
                               ref={el => items.current[index] = el}
                               onClick={(e) => handleItemClick(e, index)}
                               className={sectionLoaded.includes(section.props.title) ? 'loaded' : 
                                          sectionImporting === section.props.title ? 'loading' : ''}>{section.props.title}</li>
                })}
            </ul>
        </nav>
    );
}