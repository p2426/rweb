export default function UpdateLoop({type, title}) {
    return (
        <>
        <div className='header'>
            <div className={'indicator' + ' indicator--' + type}></div>
            <h1 className='title'>{title}</h1>
        </div>
        <div className='body'>
            <p>The classic loop - the beating heart of any Game Engine. Unfortunately applications inside browsers are single threaded and any loops must be incredibly optimised and tweaked constantly to ensure a smooth experience. Triple A Game Engines will have dedicated threads for all kinds of update loops, one for rendering, one for physics, etc, to allow for more efficient (parallel) processing, while synchronising them to a targeted frame rate. 3D graphics itself is incredibly resource intensive, running millions of calculations a second, thus the reason for a GPU - at the lowest level, it's specifically tuned to deal with math operations and dealing with triplets (vectors), representing a world in 3D space. With that said, your experience of 3D graphics relies heavily on the hardware you use, so it's important to try and make logic <i>frame agnostic</i> wherever possible.</p>
            <pre><code>
{`update() {
    this.frameRequest = requestAnimationFrame(() => {
        if (!this.paused) {
            this.update();
        }
    });

    this.time.now = performance.now();
    this.time.deltaTime = (this.time.now - this.time.then) / 1000;
    this.time.elapsed += this.time.deltaTime;

    // Run object logic
    this.objects.forEach((object) => {
        object.properties.update(this.time, this.sceneResolution);
    });

    // Re-render scene
    this.renderer.render(this.scene, this.camera);

    this.time.then = performance.now();
}
`}
            </code></pre>
            <p>For this we will using inbuilt browser functions - the <a href={'//developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame'} target='_blank' rel='noopener noreferrer'><code>requestAnimationFrame</code></a> function to tell the browser to specifically run a callback before the next repaint operation, which is typically called <i>n</i> times per your monitor's refresh rate, per second - which is handy to avoid artefacts from the mismatch of frame rate and monitor refresh rate, ie. <a href={`//en.wikipedia.org/wiki/Screen_tearing#:~:text=Screen%20tearing%20is%20a%20visual,with%20the%20display's%20refresh%20rate.`} target='_blank' rel='noopener noreferrer'>Screen tearing</a>. The callback passed in is simply the <code>update</code> function, creating recursion and therefore our main loop. On the next update call, <code>this.time.deltaTime</code> will be assigned as <code>(this.time.now - this.time.then) / 1000;</code> which is the time it took to render 1 frame as a piece of time.</p>
            <p>We use the <a href={'//developer.mozilla.org/en-US/docs/Web/API/Performance'} target='_blank' rel='noopener noreferrer'><code>performance</code></a> API (ignoring the support for Opera and Opera Android) to simply grab a more accurate timestamp of when the current frame is being rendered, and again once the loop logic is run and the scene is re-rendered - as opposed to using the timestamp that could be fed in by the parameter in <code>requestAnimationFrame</code>.</p>
            <p>The important part is calculating the delta (<code>this.time.deltaTime</code>) in time taken at the start of the update, to the end of the update, which is can be done by assigning a timestamp (<code>performance.now()</code>) at the start of the <code>update</code> and assigning it to <code>this.time.now</code>, running logic as well as re-rendering the scene, then again grabbing the current timestamp and assigning it to <code>this.time.then</code>. The delta is simply the difference between 'now' and 'then'. Furthermore, going back to allowing rendering to be <i>frame agnostic</i>, any transformations <i>over time</i> should use the <code>deltaTime</code> attribute of time (multiplying or dividing), which will ensure that rotating the cube 360 degress on the x axis over <i>n</i> seconds for example, will take exactly the same amount of time regardless of how long it takes a frame to render.</p>
        </div>
        </>
    );
}