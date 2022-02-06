export default function UseOnScreen({type, title}) {
    return (
        <>
        <div className='header'>
            <div className={'indicator' + ' indicator--' + type}></div>
            <h1 className='title'>{title}</h1>
        </div>
        <div className='body'>
            <p>Here's a cheeky one; being able to detect when an element is visible in the viewport by the seldom used <a href={'//developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API'} target='_blank' rel='noopener noreferrer'>Intersection Observer API</a>. Being quite new to React and learning about State, Effect, and Hooks, I decided to see if I could make a custom hook and mash all three concepts together to get a result where a section in this website will go and download a JS/CSS chunk from the server and render it when the section's container is in view, ie. Lazy Loading - and I'm quite happy with it. What <i>sounds</i> complicated is made simple due to a mix of React's hooks and the Intersection Observer API.</p>
            <pre><code>
{`export default function useOnScreen(ref) {
    const [isOnScreen, setIsOnScreen] = useState(false);
    const observer = new IntersectionObserver(([entry]) => setIsOnScreen(entry.isIntersecting));

    useEffect(() => {
        observer.observe(ref.current);
        return () => observer.disconnect();
    });

    return isOnScreen;
}
`}
            </code></pre>
            <p>At the top, we need a piece of State to carry the boolean result we are after. Secondly we instantiate a new <code>IntersectionObserver</code> which takes a callback on interception as the first parameter, and a bunch of options for the second - which aren't used here. Destructuring the <code>entry</code> key given in the callback object, we can simply update the state when it <code>isIntersecting</code> - so this will fire and the state will change when the element being observed is in view, and out of view, ie. does it intersect the Viewport. <code>useEffect</code> hook runs when the component using this hook is mounted based on dependencies (there also aren't any needed here) - the important part is observing the element, passed in through the <code>useOnScreen</code> function itself as <code>ref</code> and then tracked by the observer like <code>observer.observe(ref.current);</code>. Finally, return the state value and voilà, you have a custom hook up and running. Now to use it.</p>
            <pre><code>
{`const container = useRef();
const [firstVisual, setFirstVisual] = useState(false);
const isOnScreen = useOnScreen(container);

useEffect(() => {
    setFirstVisual(false);
}, [section]);

useEffect(() => {
    if (isOnScreen && !firstVisual) {
        setFirstVisual(isOnScreen);
        // Do some stuff
    }
}, [isOnScreen]);
`}
            </code></pre>
            <p>Peering behind the curtain of this website once more, this is how each section is set up for a subject. For this use-case, we actually limiting the hook somewhat, but it's aim is to be general purpose enough. Using <code>const isOnScreen = useOnScreen(container);</code> we begin to track the container element, coupled with a bit of state for only applying logic on first visual with <code>const [firstVisual, setFirstVisual] = useState(false);</code> we can now run logic based on if the element is visible in the viewport <i>and</i> its the first time visible - for instance, we could dynamically import modules/content to keep the project tidy and load times to a minimum.</p>
        </div>
        </>
    );
}