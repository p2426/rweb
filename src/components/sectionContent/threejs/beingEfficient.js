export default function Placeholder({type, title}) {
    return (
        <>
        <div className='header'>
            <div className={'indicator' + ' indicator--' + type}></div>
            <h1 className='title'>{title}</h1>
        </div>
        <div className='body'>
            <p>Building on what we have set up in the above section; we want to be able to cancel animation frames and control time when they're not <i>needed</i> - ie, when the scene element is outside the viewport and/or when the current tab isn't focused. By default I have set up the <code>Scene</code> class to have an <code>autoPauser</code> using the trusty <a href={'//developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API'} target='_blank' rel='noopener noreferrer'>Intersection Observer API</a>, which we will be using in two slightly different ways - to pause the scene when the parent element of the <code>{`<canvas>`}</code> is outside the viewport, and also to pause the scene when the <code>window</code> itself is out of focus.</p>
            <pre><code>
{`// Set pause state on element intersection with Viewport
autoPauser = new IntersectionObserver(([entry]) => {
    this.inView = entry.isIntersecting;
    this.pause(!this.inView);
});

...

// Set pause state on this window's visibility ie. is the tab minimised/not focused
document.addEventListener('visibilitychange', () => {
    if (!this.inView) return;

    this.pause(document.visibilityState === 'hidden');
}, false);
`}
            </code></pre>
            <p>The first part is declared in the class variable definitions even before the constructor - neat and minimal. The second part is called in the constructor, or rather in the <code>initScene</code> function, as a way of extending classes to be able to build upon this initialisation function with their own. The reason why we also track an <code>inView</code> variable is because the <code>IntersectionObserver</code> does not observe whether the element <i>is not viewable</i>, just that it is <i>outside the viewport</i> - an element can be inside the viewport and the tab just be minimised. So the <code>inView</code> variable becomes handy in the <code><a href={'//developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event'} target='_blank' rel='noopener noreferrer'>visibilitychange</a></code> event callback function; we need to know if the scene is already paused when the event fires, as to not unpause the scene if it's not in view.</p>
        </div>
        </>
    );
}