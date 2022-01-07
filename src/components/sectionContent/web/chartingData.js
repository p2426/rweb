import { useEffect, useRef } from 'react';
import '../../../scss/chart.scss';
import Chart from '../../charts/chart';
import { LineChart } from '../../charts/lineChart';

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
            <p>A very very long description or something to make up the space of the whole width of this content section's body or something or other. Or perhaps it needs to be even longer, anyway, here's the charting business.</p>
            <div ref={container} className='chart__container--medium chart__container--center'></div>
        </div>
        </>
    );
}