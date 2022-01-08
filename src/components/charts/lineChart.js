import Chart from "./chart";

export class LineChart extends Chart {
    // Measurements/Data
    xMeasurements = 10;
    xMeasurementPos = {};
    yMeasurements = 10;
    yUnit = 100;
    yUnitMax = undefined;
    dataLength = 3;
    data = { 
        Monday: [...Array(this.dataLength)].map(i => Math.round(Math.random() * 1000)),
        Tuesday: [...Array(this.dataLength)].map(i => Math.round(Math.random() * 1000)),
        Wednesday: [...Array(this.dataLength)].map(i => Math.round(Math.random() * 1000)),
        Thursday: [...Array(this.dataLength)].map(i => Math.round(Math.random() * 1000)),
        Friday: [...Array(this.dataLength)].map(i => Math.round(Math.random() * 1000)),
        Saturday: [...Array(this.dataLength)].map(i => Math.round(Math.random() * 1000)),
        Sunday: [...Array(this.dataLength)].map(i => Math.round(Math.random() * 1000)),
    };

    // Units
    unitFont = '12px system-ui';
    unitFontSize = 12;
    unitLineLength = 5;

    // Plotting
    pointRadius = 3;
    pointPositions = {};

    // Graph offsets
    topOffset = 10;
    bottomOffset = 50;
    rightOffset = 50;
    leftOffset = 50;

    // Graph bounds
    get graphBounds() {
        return {
            top: this.topOffset,
            bottom: (this.height - this.bottomOffset) + this.topOffset,
            right: this.width - this.rightOffset,
            left: this.leftOffset + this.unitLineLength
        }
    };

    constructor(node) {
        super(node);
        this.interpretData();
        this.redrawGraph();
        this.plotPoints();
    }

    // Given a y unit and some data, set up the graph to be drawn
    // measurement - eg. 10, 100, 1000, etc
    // data - in the form of { x: [], y: [] }
    interpretData(measurement = this.yUnit, data = this.data) {
        const dataMin = 0;
        const dataMax = Math.max(...Object.values(data).flat());
        this.yUnitMax = Math.ceil(dataMax / measurement) * measurement;
        this.yMeasurements = this.yUnitMax / measurement;
        this.xMeasurements = Object.keys(data).length;
    }

    // Draws horizontal graph lines
    // Sections are + 1 to account for baseline of the graph, accounting for any offsets
    drawHorizontalGraph(sections = 5) {
        this.context.font = this.unitFont;
        const textY = [];
        const textX = [];
        const textUnits = [];
        let interval = (this.height - this.bottomOffset) / sections;
        this.context.beginPath();
        for (let i = 0; i < sections + 1; i++) {
            const lastLineOffset = i === sections ? -.5 : .5;
            const iterInterval = Math.round(interval * i);
            const y = iterInterval + lastLineOffset + this.topOffset;
            const x = this.leftOffset - this.unitLineLength;
            this.context.moveTo(x, y);
            this.context.lineTo(this.width - this.rightOffset, y);
            textX.push(x);
            textY.push(y);
            textUnits.push(this.yUnit * i);
        }
        this.context.stroke();
        this.drawHorizontalUnitText(textX, textY, textUnits);
    }

    drawVerticalGraph(sections = 5) {
        sections = sections - 1;
        this.context.font = this.unitFont;
        const textY = [];
        const textX = [];
        const textUnits = [];
        let interval = (this.width - this.leftOffset - this.rightOffset) / sections;
        this.context.beginPath();
        for (let i = 0; i < sections + 1; i++) {
            const lastLineOffset = i === sections ? -.5 : .5;
            const iterInterval = Math.round(interval * i);
            const x = this.leftOffset + (iterInterval + lastLineOffset);
            const y = (this.height - this.bottomOffset) + this.unitLineLength + this.topOffset;
            this.context.moveTo(x, this.topOffset);
            this.context.lineTo(x, y);
            textX.push(x);
            textY.push(y);
            let qualitativeData = Object.keys(this.data)[i];
            textUnits.push(qualitativeData);
            this.xMeasurementPos[qualitativeData] = x;
        }
        this.context.stroke();
        this.drawVerticalUnitText(textX, textY, textUnits);
    }

    // Draws the unit text for each horizontal line
    // Lines are drawn from top to bottom (as per canvas orientation default), so units will need to be reversed
    drawHorizontalUnitText(x = [], y = [], units = []) {
        units = units.reverse();
        units.forEach((unit, index) => { 
            this.context.fillText(unit.toString(), x[index] - (this.context.measureText(unit).width + this.unitLineLength), y[index] + 3);
        });
    }

    drawVerticalUnitText(x = [], y = [], units = []) {
        units.forEach((unit, index) => { 
            this.context.fillText(unit.toString(), x[index] - (this.context.measureText(unit).width / 2), y[index] + (this.unitLineLength * 1.5) + (this.unitFontSize / 2));
        });
    }

    // Plots circular points where x meets y, for given data
    plotPoints(data = this.data) {
        for (let [key, value] of Object.entries(data)) {
            const localX = this.xMeasurementPos[key];
            const displacementY = this.graphBounds.bottom - this.graphBounds.top;
            this.pointPositions[key] = []; // Store point positions for line graph
            value = [value].flat();
            value.forEach(v => {
                const percentOfMax = Math.round(v / this.yUnitMax * 100);
                const localY = this.graphBounds.bottom - (displacementY * percentOfMax / 100);
                this.context.beginPath();
                this.context.arc(localX, localY, this.pointRadius, 0, Math.PI * 2);
                this.context.fill();
                // Make the points responsive
                this.hitCanvas.fillStyle = this.hitCanvas.randomRGB;
                this.hitCanvas.setHitAttributes({
                    click: function() {
                        console.log('I am:', this);
                        console.log('My data is:', key, v);
                    },
                    mousemove: function() {
                        console.log('I am:', this);
                    }
                });
                this.hitCanvas.context.beginPath();
                this.hitCanvas.context.arc(localX, localY, this.pointRadius, 0, Math.PI * 2);
                this.hitCanvas.context.fill();
                this.pointPositions[key].push({ x: localX, y: localY });
            });
        }
        this.joinPlottedPoints();
    }

    // Draws lines between already plotted points
    joinPlottedPoints(points = this.pointPositions) {
        const xLen = Object.keys(points).length;
        const coords = Object.values(points);
        const yLen = Math.max(...Object.values(points).map(x => x.length));
        this.context.beginPath();
        for (let i = 0; i < yLen; i++) {
            for (let ii = 0; ii < xLen; ii++) {
                this.context.moveTo(coords[ii][i].x, coords[ii][i].y);
                const nextPoint = coords[ii + 1];
                if (nextPoint) {
                    this.context.lineTo(nextPoint[i].x, nextPoint[i].y);
                } else {
                    this.context.lineTo(coords[ii][i].x, coords[ii][i].y);
                }
            }
        }
        this.context.stroke();
    }

    // Clears and redraws graph with current dimensions
    redrawGraph() {
        this.clearCanvas();
        this.interpretData();
        this.drawVerticalGraph(this.xMeasurements);
        this.drawHorizontalGraph(this.yMeasurements);
        this.plotPoints();
    }

    // Text offsets
    setXTextOffset(val) {
        this.bottomOffset = val;
        this.redrawGraph();
    }

    setYTextOffset(val) {
        this.leftOffset = val;
        this.redrawGraph();
    }

    // Line length
    setUnitLineLength(val) {
        this.unitLineLength = val;
        this.redrawGraph();
    }

    // Y unit
    setYUnit(val) {
        this.yUnit = val;
        this.interpretData();
        this.redrawGraph();
    }

    // Update at intervals
    frameUpdate() {
        super.frameUpdate();
        this.randomiseData();
    }

    // Util
    randomiseData() {
        this.data = { 
            Monday: [...Array(this.dataLength)].map(i => Math.round(Math.random() * 1000)),
            Tuesday: [...Array(this.dataLength)].map(i => Math.round(Math.random() * 1000)),
            Wednesday: [...Array(this.dataLength)].map(i => Math.round(Math.random() * 1000)),
            Thursday: [...Array(this.dataLength)].map(i => Math.round(Math.random() * 1000)),
            Friday: [...Array(this.dataLength)].map(i => Math.round(Math.random() * 1000)),
            Saturday: [...Array(this.dataLength)].map(i => Math.round(Math.random() * 1000)),
            Sunday: [...Array(this.dataLength)].map(i => Math.round(Math.random() * 1000)),
        };
        this.redrawGraph();
    }
}