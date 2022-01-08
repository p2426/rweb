export default class Chart {
    parent;
    canvas;
    context;
    hitCanvas;
    hitCanvasContext;

    // Dimensions
    height = 300;
    width = 300;

    // Animation
    animated = false;
    updateInterval = 5;
    frameRequest;
    time = {
        now: 0,
        then: 0,
        deltaTime: 0,
        elapsed: 0,
        ticker: 0,
        tickerCount: 0
    }

    // Interactable
    interactable = false;

    // Pausing
    paused = false;
    inView;
    autoPauser = new IntersectionObserver(([entry]) => {
        this.inView = entry.isIntersecting;
        this.pause(!this.inView);
    }, {
        threshold: 0.1
    });

    constructor({ parent, width, height, animated, updateInterval, interactable }) {
        this.parent = parent;
        this.width = width || this.width;
        this.height = height || this.height;
        this.animated = animated || this.animated;
        this.updateInterval = updateInterval || this.updateInterval;
        this.interactable = interactable || this.interactable;

        this.createCanvas();

        if (this.interactable) {
            this.bindInteractableEvents();
            this.hitCanvas = new HitCanvas({
                width: this.width,
                height: this.height
            });
        }

        if (this.animated) {
            this.pause(false);
            this.autoPauser.observe(this.parent);
            document.addEventListener('visibilitychange', this.handleDocumentVisibility.bind(this), false);
        }
    }

    // Rendering
    // Main loop
    update() {
        this.frameRequest = requestAnimationFrame(() => {
            if (!this.paused) {
                this.update();
            }
        });

        this.time.now = performance.now();
        this.time.deltaTime = (this.time.now - this.time.then) / 1000;
        this.time.elapsed += this.time.deltaTime;
        this.time.ticker += this.time.deltaTime;

        if (this.time.ticker > this.updateInterval) {
            this.frameUpdate();
            this.time.ticker = 0;
            this.time.tickerCount += 1;
        }

        this.time.then = performance.now();
    }

    // Logic to run once a new frame renders
    frameUpdate() {}

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

    // Canvas
    createCanvas() {
        this.canvas = document.createElement('canvas');

        if (!this.canvas.getContext instanceof Function) {
            alert('Canvas tag is not supported on your browser; canvas will not be created.');
            return;
        }

        this.context = this.canvas.getContext('2d');
        this.setCanvasWidth(this.width);
        this.setCanvasHeight(this.height);
        this.parent?.appendChild(this.canvas);
    }

    setCanvasWidth(v) {
        this.canvas.setAttribute('width', v);
    }

    setCanvasHeight(v) {
        this.canvas.setAttribute('height', v);
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.hitCanvas?.clearCanvas();
    }

    // Events
    bindInteractableEvents() {
        this.canvas.addEventListener('click', this.handleClick.bind(this));
    }

    handleClick(e) {
        const hit = this.detectHittableObject(e);
        hit?.click();
    }

    handleDocumentVisibility(e) {
        if (!this.inView) return;
        this.pause(document.visibilityState === 'hidden');
    }

    detectHittableObject(e) {
        const x = e.layerX;
        const y = e.layerY;
        const hitImageData = this.hitCanvas.context.getImageData(x, y, 1, 1).data;
        return this.hitCanvas.getHit(hitImageData);
    }

    // Cleanup
    dispose() {
        this.pause(true);
        document.removeEventListener('visibilitychange', this.handleDocumentVisibility.bind(this));
        this.canvas.removeEventListener('click', this.handleClick);
    }
}

// This class represents a non-visible canvas. The purpose of this class is to be drawn to and assign a random unique colour to the drawing,
// so it can be hit detected when a regular document event is fired, like click, mouseover, etc.
// Before drawing an object to this canvas, the 'setHitAttributes({})' function must be used to apply the random colour, and be able to pass
// functions that fire based on the event that is called, for example, the object should contain a key of 'click' and the value be
// a function that will be called, when a click event happens in the visible canvas
// ** Revisit this approach as detecting hits requires hittable objects to be drawn twice, once to this invisible canvas,
// and again for the visible canvas
// This approach was used as the native Hit Region functionally will/has become deprecated
class HitCanvas {
    canvas;
    context;

    width;
    height;

    hittables = {};

    constructor(settings) {
        this.width = settings.width;
        this.height = settings.height;

        this.canvas = document.createElement('canvas');
        this.setCanvasWidth(this.width);
        this.setCanvasHeight(this.height);
        this.context = this.canvas.getContext('2d');
    }

    getUniqueColour() {
        while(true) {
            const r = Math.round(Math.random() * 255);
            const g = Math.round(Math.random() * 255);
            const b = Math.round(Math.random() * 255);
            const result = `rgb(${r},${g},${b})`;
            if (!this.hittables[result]) {
                return result;
            }
        }
    }

    setHitAttributes(data) {
        const uniqueColour = this.getUniqueColour();
        this.context.fillStyle = uniqueColour;
        this.hittables[uniqueColour] = new HittableCanvasObject(data);
    }

    getHit(rgba = []) {
        if (rgba[3] === 0) {
            return;
        }
        return this.hittables[`rgb(${rgba[0]},${rgba[1]},${rgba[2]})`];
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.hittables = {};
    }

    setCanvasWidth(v) {
        this.canvas.setAttribute('width', v);
    }

    setCanvasHeight(v) {
        this.canvas.setAttribute('height', v);
    }
}

class HittableCanvasObject {
    data = {};

    constructor(data = {}) {
        this.data = data;
        this.assignFunctions();
    }

    assignFunctions() {
        for (const [key, value] of Object.entries(this.data)) {
            if (value instanceof Function) {
                this[key] = value;
            }
        }
    }
}