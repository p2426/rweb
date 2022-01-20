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
            <p>There are many packages out there that tackle representing data in graphs, some more sophisticated and efficient than others. I'm a slight masochist, so let's create our own graphing canvas and try to round it off with click and hover events, while being as efficient as possible. Let's begin by creating a simple Line Chart, which will set us up for extending it into other charting types; also laying the foundations for the base class - the most important part of any component.</p>
            <p><i>Code and explanation to follow soon.</i></p>
            <div ref={container} className='chart__container--medium chart__container--center'></div>
        </div>
        </>
    );
}