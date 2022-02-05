import { useRef } from 'react';
import useOnMobile from '../../../hooks/useOnMobile';
import useOnScreen from '../../../hooks/useOnScreen';
import '../../../scss/sectionContent/drawingSVGs.scss';

export default function DrawingSVGs({type, title}) {
    const isMobile = useOnMobile();

    return (
        <>
        <div className='header'>
            <div className={'indicator' + ' indicator--' + type}></div>
            <h1 className='title'>{title}</h1>
        </div>
        <div className='body'>
            <p className='no-margin-bottom'>SVGs are great for rendering irregular shapes that cannot be achieved easily by manipulating your regular DOM element or <code>{`<div>`}</code>. Or maybe (like me) you just like the ease of creating an SVG in a program like <a href={'//inkscape.org'} target='_blank' rel='noopener noreferrer'>Inkscape</a> or <a href={'//www.figma.com'} target='_blank' rel='noopener noreferrer'>Figma</a> and being able to export it with all its layers and ids intact. Essentially, an <code>{'<svg>'}</code> is similar to the <code>{'<canvas>'}</code>, setting up a viewport for rendering into.</p>
            <div className='flex flex--centre-vertical flex--column-mobile'>
                <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180" fill="none">
                    <path d="M30.6646 75.7909L90 30.6284L149.335 75.7909L126.662 148.895H53.3379L30.6646 75.7909Z" stroke="black"/>
                </svg>
                <pre><code>
{isMobile ? `Code available on desktop version` : `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180" fill="none">
    <path d="M30.6646 75.7909L90 30.6284L149.335 75.7909L126.662 148.895H53.3379L30.6646 75.7909Z" stroke="black"/>
</svg>`}
                </code></pre>
            </div>
            <p>Considering the above HTML, we can see the <code>{'<path>'}</code> is drawn in order of instructions, from <code>M30.6646</code> {'>'} <code>75.7909L90</code> and so on - as opposed to trying to control the border of a <code>{'<div>'}</code> element where there is no 'order' in how it is rendered, it <i>just</i> is. Knowing this, we can apply 2 styles to the <code>{'<path>'}</code> itself to get the ordered drawing effect.</p>
            <div className='flex flex--centre-vertical flex--column-mobile'>
                <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180" fill="none">
                    <path className='drawing-example' d="M30.6646 75.7909L90 30.6284L149.335 75.7909L126.662 148.895H53.3379L30.6646 75.7909Z" stroke="black"/>
                </svg>
                <pre><code>
{isMobile ? `Code available on desktop version` : `.drawing-example {
    stroke-dasharray: 375;
    stroke-dashoffset: 0;
}`}
                </code></pre>
                <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180" fill="none">
                    <path className='drawing-example-two' d="M30.6646 75.7909L90 30.6284L149.335 75.7909L126.662 148.895H53.3379L30.6646 75.7909Z" stroke="black"/>
                </svg>
                <pre><code>
{isMobile ? `Code available on desktop version` : `.drawing-example-two {
    stroke-dasharray: 375;
    stroke-dashoffset: 150;
}`}
                </code></pre>
            </div>
            <p>So what's going on? Using <code>stroke-dasharray</code> we can define the length of a dash along the stroke - and by <i>knowing</i> that the whole path is 375 pixels, we're setting the whole length of the path to be a single dash.</p>
            <p>We can then use <code>stroke-dashoffset</code> to limit each dash in the array, or eventually, the whole shape. So by offsetting the dash to the length of the dasharray, nothing will be rendered - moving the offset to 0, the whole dash will be rendered. In the class <code>.drawing-example-two</code> we are simply offsetting the dash by 2 sides, or (375 / 5) * 2 = 150.</p>
            <div className='flex flex--centre-vertical flex--column-mobile'>
                <AnimatedPath/>
                <pre><code>
{isMobile ? `Code available on desktop version` : `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180" fill="none">
    <path class='drawing-example-three'
          d="M30.6646 75.7909L90 30.6284L149.335 75.7909L126.662 148.895H53.3379L30.6646 75.7909Z" stroke="black"/>
</svg>

.drawing-example-three {
    stroke-dasharray: 375;
    stroke-dashoffset: 375;
    animation: SVGDrawingExample 2s linear infinite;
}

@keyframes SVGDrawingExample {
    0% { stroke-dashoffset: 375; }
    100% { stroke-dashoffset: 0; }
}`}
                </code></pre>
            </div>
            <p>All that's left to do is to plug the logic previously described into an animation - starting from offsetting the dash as the value of the dasharray, rendering nothing, to then setting the offset of the dash to 0 over 2 seconds. The animation syntax is important of course, but I wont go over that, you can read more about that <a href={'//developer.mozilla.org/en-US/docs/Web/CSS/animation'} target='_blank' rel='noopener noreferrer'>here</a>.</p>
        </div>
        </>
    );
}

const AnimatedPath = () => {
    const svg = useRef();
    const isOnScreen = useOnScreen(svg);

    return (
        <svg ref={svg} xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180" fill="none">
            <path className={isOnScreen ? 'drawing-example-three' : ''} d="M30.6646 75.7909L90 30.6284L149.335 75.7909L126.662 148.895H53.3379L30.6646 75.7909Z" stroke="black"/>
        </svg>
    );
}