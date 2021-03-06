import { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import translateWithMouse from '../global/translateWithMouse';
import useOnMobile from '../hooks/useOnMobile';
import useOnScreen from '../hooks/useOnScreen';
import '../scss/splash.scss';

export default function Splash({subjects}) {
    const history = useHistory();
    const location = useLocation();
    const splash = useRef();
    const subjectSelectionContainer = useRef();
    const subjectTitleContainer = useRef();
    const subjectLoadContainer = useRef();
    const [currentSubject, setCurrentSubject] = useState(history.location.pathname.slice(1));
    const currentPath = history.location.pathname.slice(1);
    const isOnScreen = useOnScreen(splash);
    const isPathAbout = currentPath === 'about';
    const isMobile = useOnMobile();
    const [isPentagonsScaledDown, setIsPentagonsScaledDown] = useState(false);

    // Bind translations of various elements to document body on mousemove, and listen for any Subject content loading
    useEffect(() => {
        document.body.addEventListener('SubjectLoaded', listenToSubjectLoaded);
        window.addEventListener('beforeunload', handleWindowUnload);
        return () => {
            document.body.removeEventListener('SubjectLoaded', listenToSubjectLoaded);
            window.removeEventListener('beforeunload', handleWindowUnload);
        }
    }, []);

    useEffect(() => {
        if (isOnScreen && !isMobile) {
            document.body.addEventListener('mousemove', handleMouseMove);
        }
        return () => document.body.removeEventListener('mousemove', handleMouseMove);
    }, [isOnScreen, isMobile]);

    useEffect(() => {
        handlePathChange();
    }, [location]);

    const handleWindowUnload = (e) => {
        document.body.classList.remove('auto--overflow-y');
        window.scrollTo(0, 0);
    }

    const handleMouseMove = (e) => {
        translateWithMouse(e, subjectSelectionContainer.current, 50, 100, 0, subjectSelectionContainer.current.offsetHeight / 2);
        translateWithMouse(e, subjectTitleContainer.current, 100, 0, subjectTitleContainer.current.offsetWidth / 2, subjectTitleContainer.current.offsetHeight / 2);
        translateWithMouse(e, subjectLoadContainer.current, 50, 50, subjectLoadContainer.current.offsetWidth / 2, subjectLoadContainer.current.offsetHeight / 2);
    }

    // Any changes in URL reset the current subject and 'unload' it; stopping body from being scrollable until a Main is rendered
    const handlePathChange = () => {
        let extension = location.pathname.slice(1) || '';
        extension = subjects.findIndex(item => item.toLowerCase() === extension) >= 0 ? extension : '';
        window.scrollTo(0, 0);
        subjectUnload();
        setCurrentSubject(extension);
    }

    // Using useHistory here to stop the 'flicker' a Link tag has when redirecting; just push a new path
    const subjectExtensionClicked = (e, subject) => {
        const extension = subject.toLowerCase() || '/';
        if (extension === currentPath) {
            return;
        }
        history.push({ pathname: '/' + extension });
    }

    const subjectExtensionMouseOver = (e, subject) => {
        setCurrentSubject(subject.toLowerCase());
    }

    const subjectExtensionMouseOut = (e, subject) => {
        setCurrentSubject(history.location.pathname.slice(1));
    }

    const subjectUnload = () => {
        document.body.classList.remove('auto--overflow-y');
        subjectLoadContainer.current.classList.remove('subject-load-circle--loaded');
    }

    const subjectLoad = () => {
        subjectLoadContainer.current.classList.add('subject-load-circle--loaded');
    }

    const listenToSubjectLoaded = (e) => {
        subjectLoad();
    }

    const pentagonsScaledDown = (e) => {
        setIsPentagonsScaledDown(true);
    }

    return (
        <div ref={splash} className={'splash' + (isPathAbout ? ' no-visibility' : '')}>
            <div ref={subjectSelectionContainer} className={'selections' + (isPathAbout ? ' selections--about' : '')}>
                {subjects.map((subject, index) => {
                    return <SubjectExtension key={index}
                                      index={index}
                                      subject={subject.toLowerCase()}
                                      currentSubject={currentSubject}
                                      mobile={isMobile}
                                      pentagonsScaledDown={isPentagonsScaledDown}
                                      whenMouseOver={subjectExtensionMouseOver}
                                      whenMouseOut={subjectExtensionMouseOut}
                                      whenClicked={subjectExtensionClicked}/>
                })}
            </div>
            <div ref={subjectTitleContainer} className='subject-title'>
                <SubjectTitle currentSubject={currentSubject}/>
            </div>
            <Pentagons subjects={subjects.map(s => s.toLowerCase())}
                       currentSubject={currentSubject}
                       isOnScreen={isOnScreen}
                       whenPentagonsScaleDown={pentagonsScaledDown}/>
            <div ref={subjectLoadContainer} className='subject-load-circle'>
                <SubjectLoadIndicator mobile={isMobile}/>
            </div>
        </div>
    );
}

export const SubjectExtension = ({index, subject, currentSubject, mobile, pentagonsScaledDown, whenMouseOver, whenMouseOut, whenClicked}) => {
    const element = useRef();
    const mobileButton = useRef();

    useEffect(() => {
        element.current.addEventListener('mouseover', mouseOver);
        element.current.addEventListener('mouseout', mouseOut);
        return () => {
            element.current.removeEventListener('mouseover', mouseOver);
            element.current.removeEventListener('mouseout', mouseOut);
        }
    }, []);

    // Visible buttons on mobile to change path to a subject - repositioning
    // Super-hacky; revisit
    useEffect(() => {
        if (!mobile || !pentagonsScaledDown) {
            return;
        }

        const myPentagon = document.body.querySelector(`[data-subject="${subject}"]`);

        if (!myPentagon) {
            return;
        }

        // Going from desktop to mobile, parent could have a style of transform position attached,
        // make sure it is removed before repositioning the button
        mobileButton.current.parentElement.style = '';
        const bounds = myPentagon.getBoundingClientRect();
        mobileButton.current.style.left = bounds.left + 'px';
        mobileButton.current.style.top = bounds.top + 'px';
        mobileButton.current.style.width = bounds.width + 'px';
        mobileButton.current.style.height = bounds.height + 'px';
        mobileButton.current.classList.remove('selection--mobile-no-display');
    }, [mobile, pentagonsScaledDown]);

    const mouseOver = (e) => {
        whenMouseOver(e, subject.toLowerCase());
    }

    const mouseOut = (e) => {
        whenMouseOut(e, subject.toLowerCase());
    }

    return (
        <>
        <button ref={mobileButton} className='selection--mobile selection--mobile-no-display' onClick={(e) => whenClicked(e, subject)} type='button'>{subject}</button>
        <svg ref={element} className='selection selection--draw' onClick={(e) => whenClicked(e, subject)} xmlns="http://www.w3.org/2000/svg" width="94" height="30" viewBox="0 0 94 30" fill="none">
            <line x1="17" y1="15" x2="77" y2="15" stroke="black" strokeWidth="4"/>
            <line className={currentSubject === subject ? `selection--highlight selection--highlight-${subject}` : ''} x1="17" y1="15" x2="77" y2="15" stroke="black" strokeWidth="4"/>
        </svg>
        </>
    );
}

export const SubjectTitle = ({currentSubject}) => {
    return <h1>{currentSubject}</h1>
}

export const SubjectLoadIndicator = ({ mobile }) => {
    const element = useRef();

    const animationEnd = (e) => {
        switch(e.animationName) {
            case 'LoadCircleDraw':
                document.body.classList.add('auto--overflow-y');
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (!mobile) {
            return;
        }

        element.current.parentElement.style = '';
    }, [mobile]);

    return (
        <svg ref={element} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle onAnimationEnd={animationEnd} cx="20" cy="20" r="16" stroke="black" strokeWidth={mobile ? 3 : 4}/>
        </svg>
    );
}

export const Pentagons = ({subjects, currentSubject, isOnScreen, whenPentagonsScaleDown}) => {
    const animationEnd = (e) => {
        switch(e.animationName) {
            case 'PentDraw':
                e.target.classList.remove('pentagon--draw');
                e.target.classList.add(`pentagon--highlight-pulse-${currentSubject}`);
                break;
            case 'PentsScaleDown':
                whenPentagonsScaleDown();
                break;
            default:
                break;
        }
    };

    return (
        <svg className='pentagons pentagons--draw' onAnimationEnd={animationEnd} xmlns="http://www.w3.org/2000/svg" width="734" height="216" viewBox="0 0 734 216" fill="none">
            <path d="M672.86 146.124L614.106 190.844L555.352 146.124L577.812 73.7059H650.4L672.86 146.124Z" stroke="black" strokeWidth="2"/>
            <path data-subject={subjects[5]} data='highlight' onAnimationEnd={animationEnd} className={currentSubject === subjects[5] && isOnScreen ? `pentagon--draw pentagon--highlight-${currentSubject}` : ''} d="M672.86 146.124L614.106 190.844L555.352 146.124L577.812 73.7059H650.4L672.86 146.124Z" stroke="black" strokeWidth="2"/>
            <path d="M455.246 69.9769L514 25.2567L572.754 69.9769L550.294 142.395H477.706L455.246 69.9769Z" stroke="black" strokeWidth="2"/>
            <path data-subject={subjects[4]} data='highlight' onAnimationEnd={animationEnd} className={currentSubject === subjects[4] && isOnScreen ? `pentagon--draw pentagon--highlight-${currentSubject}` : ''} d="M455.246 69.9769L514 25.2567L572.754 69.9769L550.294 142.395H477.706L455.246 69.9769Z" stroke="black" strokeWidth="2"/>
            <path d="M472.86 146.124L414.106 190.844L355.352 146.124L377.812 73.7059H450.4L472.86 146.124Z" stroke="black" strokeWidth="2"/>
            <path data-subject={subjects[3]} data='highlight' onAnimationEnd={animationEnd} className={currentSubject === subjects[3] && isOnScreen ? `pentagon--draw pentagon--highlight-${currentSubject}` : ''} d="M472.86 146.124L414.106 190.844L355.352 146.124L377.812 73.7059H450.4L472.86 146.124Z" stroke="black" strokeWidth="2"/>
            <path d="M255.246 69.9769L314 25.2567L372.754 69.9769L350.294 142.395H277.706L255.246 69.9769Z" stroke="black" strokeWidth="2"/>
            <path data-subject={subjects[2]} data='highlight' onAnimationEnd={animationEnd} className={currentSubject === subjects[2] && isOnScreen ? `pentagon--draw pentagon--highlight-${currentSubject}` : ''} d="M255.246 69.9769L314 25.2567L372.754 69.9769L350.294 142.395H277.706L255.246 69.9769Z" stroke="black" strokeWidth="2"/>
            <path d="M272.86 146.124L214.106 190.844L155.352 146.124L177.812 73.7059H250.4L272.86 146.124Z" stroke="black" strokeWidth="2"/>
            <path data-subject={subjects[1]} data='highlight' onAnimationEnd={animationEnd} className={currentSubject === subjects[1] && isOnScreen ? `pentagon--draw pentagon--highlight-${currentSubject}` : ''} d="M272.86 146.124L214.106 190.844L155.352 146.124L177.812 73.7059H250.4L272.86 146.124Z" stroke="black" strokeWidth="2"/>
            <path d="M55.2458 69.9769L114 25.2567L172.754 69.9769L150.294 142.395H77.7064L55.2458 69.9769Z" stroke="black" strokeWidth="2"/>
            <path data-subject={subjects[0]} data='highlight' onAnimationEnd={animationEnd} className={currentSubject === subjects[0] && isOnScreen ? `pentagon--draw pentagon--highlight-${currentSubject}` : ''} d="M55.2458 69.9769L114 25.2567L172.754 69.9769L150.294 142.395H77.7064L55.2458 69.9769Z" stroke="black" strokeWidth="2"/>
        </svg>
    );
}