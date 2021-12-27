export default function StoppingTime({type, title}) {
    return (
        <>
        <div className='header'>
            <div className={'indicator' + ' indicator--' + type}></div>
            <h1 className='title'>{title}</h1>
        </div>
        <div className='body'>
            <p>There will be times you want to stop or pause the loop - maybe a pause menu in a game, or just to not have too many scenes on a page taking up a plethora of resources. Ultimately, we need some condition continuously running in the loop to detect when to break the update loop.</p>
            <pre><code>
{`update() {
    this.frameRequest = requestAnimationFrame(() => {
        if (!this.paused) {
            this.update();
        }
    });
    // Update logic
}

pause(state) {
    this.paused = state;
    if (this.paused) {
        cancelAnimationFrame(this.frameRequest);
    } else {
        this.time.now = performance.now();
        this.time.then = performance.now();
        this.update();
    }
}
`}
            </code></pre>
            <p>There's a 'two for the price of one' happening here. We can store the <code>requestAnimationFrame</code> in <code>this.frameRequest</code> and later make a call to cancel the request when the scene is paused - this will stop the <code>update</code> function from being called again, <i>and</i> stop requests for new frames, saving on CPU processing.</p>
            <p>The <code>else</code> block in the <code>pause</code> function will kick off the scenes update, but also resets time itself. Within our <code>update</code> function in the section above, we are calculating the delta of time as <code>this.time.deltaTime = (this.time.now - this.time.then) / 1000;</code>, so in order to truely stop time, we must reset the <i>then</i>. By setting <i>then</i> to <i>now</i> before the update is called, the update will calculate the delta against a more recent timestamp.</p>
            <p>On the other hand, you may want to accumulate time when the scene is paused or out of view - imagine a real-time strategy game where you're assigning a builders to build a wall around your city that may take 5 minutes - you may want to pause the game if the user scrolls out of view of the game area to read instructions. In which case, your <code>pause</code> function will simply look like the following.</p>
            <pre><code>
{`pause(state) {
    this.paused = state;
    this.paused ? cancelAnimationFrame(this.frameRequest) : this.update();
}
`}
            </code></pre>
        </div>
        </>
    );
}