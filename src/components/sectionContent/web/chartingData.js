import { useEffect, useRef } from 'react';
import { LineChart } from '../../charts/lineChart';
import '../../../scss/chart.scss';

export default function ChartingData({type, title}) {
    const container = useRef();
    const chart = useRef();

    useEffect(() => {
        chart.current = new LineChart({
            parent: container.current,
            width: 600,
            height: 600,
            animated: true,
            interactable: true,
            updateInterval: 3
        }, { 
            Monday: [...Array(3)].map(i => Math.round(Math.random() * 1000)),
            Tuesday: [...Array(3)].map(i => Math.round(Math.random() * 1000)),
            Wednesday: [...Array(3)].map(i => Math.round(Math.random() * 1000)),
            Thursday: [...Array(3)].map(i => Math.round(Math.random() * 1000)),
            Friday: [...Array(3)].map(i => Math.round(Math.random() * 1000)),
            Saturday: [...Array(3)].map(i => Math.round(Math.random() * 1000)),
            Sunday: [...Array(3)].map(i => Math.round(Math.random() * 1000)),
        });

        return () => chart.current?.dispose();
    }, []);

    return (
        <>
        <div className='header'>
            <div className={'indicator' + ' indicator--' + type}></div>
            <h1 className='title'>{title}</h1>
        </div>
        <div className='body'>
            <p>There are many packages out there that tackle representing data in graphs, some more sophisticated and efficient than others. I'm a slight masochist, so let's create our own graphing canvas and try to round it off with click and hover events, while being as efficient as possible. Let's begin by creating a simple LineChart class, which will set us up for extending it into other charting types; also laying the foundations for the base class - the most important part of any component.</p>
            <p>As the above has alluded to, we will be using the <code>{'<canvas>'}</code> element to create our charts, <i>not</i> the SVG way. There are benefits and drawbacks of using either/or: <code>{'<canvas>'}</code> is more 'low level' and is better suited to rendering vast amounts of data, frequently changing - think of realtime air-space mapping, or rendering realtime stock market data. Charting with SVG is better suited to smaller amounts of data, though relies on the DOM and therefore has native event handlers, and handles higher resolutions better. There's a nice article on <a href={'//docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/samples/gg193983(v=vs.85)'} target='_blank' rel='noopener noreferrer'>SVG vs. canvas</a> written by Microsoft for a better comparison.</p>
            <div ref={container} className='chart__container--medium chart__container--center'></div>
            <pre><code>{`new LineChart({
    parent: container.current,
    width: 600,
    height: 600,
    animated: true,
    interactable: true,
    updateInterval: 3
}, { 
    Monday: [...Array(3)].map(i => Math.round(Math.random() * 1000)),
    Tuesday: [...Array(3)].map(i => Math.round(Math.random() * 1000)),
    Wednesday: [...Array(3)].map(i => Math.round(Math.random() * 1000)),
    Thursday: [...Array(3)].map(i => Math.round(Math.random() * 1000)),
    Friday: [...Array(3)].map(i => Math.round(Math.random() * 1000)),
    Saturday: [...Array(3)].map(i => Math.round(Math.random() * 1000)),
    Sunday: [...Array(3)].map(i => Math.round(Math.random() * 1000)),
});`}</code></pre>
        <p><i>Code and explanation to follow soon.</i></p>
        </div>
        </>
    );
}