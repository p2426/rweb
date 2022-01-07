export default class Chart {
    parent;
    canvas;
    context;
    hitCanvas;

    height = 300;
    width = 300;

    // Rendering
    animated = false;
    updateRate = 5;
    frameRequest;
    time = {
        now: 0,
        then: 0,
        deltaTime: 0,
        elapsed: 0,
        ticker: 0,
    }
    paused = false;
    inView;
    autoPauser = new IntersectionObserver(([entry]) => {
        this.inView = entry.isIntersecting;
        this.pause(!this.inView);
    });

    constructor({ parent, width, height, animated, updateRate }) {
        this.parent = parent;
        this.width = width || this.width;
        this.height = height || this.height;
        this.animated = animated || this.animated;
        this.updateRate = updateRate || this.updateRate;

        this.createCanvas();

        if (this.animated) {
            this.pause(false);

            // Auto-pauser
            this.autoPauser.observe(this.parent);
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

        if (this.time.ticker > this.updateRate) {
            this.frameUpdate();
            this.time.ticker = 0;
        }

        this.time.then = performance.now();
    }

    // Logic to run once a new frame renders
    frameUpdate() {
        console.log(this.time.ticker);
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
}