import '../../../scss/sectionContent/orphanedElements.scss';

export default function OrphanedElements({type, title}) {
    return (
        <>
        <div className='header'>
            <div className={'indicator' + ' indicator--' + type}></div>
            <h1 className='title'>{title}</h1>
        </div>
        <div className='body'>
            <p>Following on from the above section, I consider an element to be ophaned when it is outside of the viewport - and it's important for cleanup to happen in different forms to enforce a better experience for the user. Typically, users will not know or understand what's going on under the hood of your website and the impact that many style recalculations and CPU usage may have on their machine. Taking this website as an example, is there a point of having interactions and animations with elements that are outside of the viewport? No, so let's clean them up - and that's why the importance of the <code>useOnScreen</code> hook created above is emphasised.</p>
            <p>Browsers do a <i>good</i> job of limiting CPU usage when a tab is not focused, but there's still memory allocated to it. For a person with more than one monitor, this is more of a problem, because a tab open on one screen while you do something else on the other will still allow the 'focused' tab to run at full capacity.</p>
            <div className='usage-container'>
                <div className='usage-stats-container'>
                    <div className='usage-stat'>
                        <p><i><b>Idle - orphaned animation</b></i></p>
                    </div>
                    <div className='usage-stat'>
                        <p>CPU usage</p>
                        <p className='usage-stat--text-red'>14.3%</p>
                    </div>
                    <div className='usage-stat'>
                        <p>JS heap size</p>
                        <p className='usage-stat--text-blue'>9.8MB</p>
                    </div>
                    <div className='usage-stat'>
                        <p>DOM Nodes</p>
                        <p className='usage-stat--text-darkgreen'>391</p>
                    </div>
                    <div className='usage-stat'>
                        <p>JS event listeners</p>
                        <p className='usage-stat--text-green'>176</p>
                    </div>
                    <div className='usage-stat'>
                        <p>Style recalcs / sec</p>
                        <p className='usage-stat--text-magenta'>144.6</p>
                    </div>
                </div>
                <div className='usage-stats-container'>
                    <div className='usage-stat'>
                        <p><i><b>Idle - no orphaned animation</b></i></p>
                    </div>
                    <div className='usage-stat'>
                        <p>CPU usage</p>
                        <p className='usage-stat--text-red'>0%</p>
                    </div>
                    <div className='usage-stat'>
                        <p>JS heap size</p>
                        <p className='usage-stat--text-blue'>9.8MB</p>
                    </div>
                    <div className='usage-stat'>
                        <p>DOM Nodes</p>
                        <p className='usage-stat--text-darkgreen'>391</p>
                    </div>
                    <div className='usage-stat'>
                        <p>JS event listeners</p>
                        <p className='usage-stat--text-green'>166</p>
                    </div>
                    <div className='usage-stat'>
                        <p>Style recalcs / sec</p>
                        <p className='usage-stat--text-magenta'>0</p>
                    </div>
                </div>
            </div>
            <p>The stats above are coming from the infinitely animated SVG path in the "drawings" SVGs sections - of course it's rare to have infinitely animated elements on a page, but the point still stands. With a little bit of code, we can reduce the resource usage of the page, most notable here, the CPU usage and the Style recalcs / sec. This is a huge win, to reduce the CPU usage from 14%~ to 0% (while completely idle) and 144~ style recalcs / sec in all circumstances (which, I assume, will differ based on your monitor refresh rate and frame cap of your GPU/embedded graphics), should never be overlooked - as developers we must get into the habit of cleaning up after ourselves and creating the best possible experience for users.</p>
            <pre><code>
{`
const AnimatedPath = () => {
    const svg = useRef();
    const isOnScreen = useOnScreen(svg);

    return (
        <svg ref={svg} xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180" fill="none">
            <path className={isOnScreen ? 'drawing-example-three' : ''}
                  d="M30.6646 75.7909L90 30.6284L149.335 75.7909L126.662 148.895H53.3379L30.6646 75.7909Z" stroke="black"/>
        </svg>
    );
}
`}
            </code></pre>
            <p>Our trusty <code>useOnScreen</code> hook to the rescue again. Using a condition within the JSX, which changes because of our hook, will force a re-render without the class to which the animation is attached - and apply it again when it is in view. This may be unwanted for animations you <i>explicitly</i> want to continue while out of the viewport, but I would question whether that is a higher priority than saving on resource usage.</p>
        </div>
        </>
    );
}