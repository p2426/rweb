import { useEffect, useRef } from 'react';
import '../scss/about.scss';

export default function About() {
    const image = useRef();
    const container = useRef();
    const imageCount = 23;
    // Allow for a random image on creation
    const imageMap = ['IMG_3040', 'IMG_3063', 'IMG_3088', 'IMG_3091', 'IMG_3434', 'IMG_3449', 'IMG_3571', 'IMG_3885', 'IMG_3977', 'IMG_3984', 'IMG_4047',
                      'IMG_4075', 'IMG_4078', 'IMG_4117', 'IMG_4124', 'IMG_4127', 'IMG_4294', 'IMG_4304', 'IMG_6445', 'IMG_6450', 'IMG_6474', 'IMG_6531',
                      'P7120040', 'P7210003'];
    const rand = Math.round(Math.random() * (imageMap.length - 1));

    const handleMouseOver = (e) => {
        if (!image.current) return;

        const width = image.current.offsetWidth;
        const height = image.current.offsetHeight;
        const imageXPosScalar = 40; // 40
        const imageYPosScalar = 40; // 40
        const translateXScalar = 20; // 20
        const translateYScalar = 20; // 20
        const translateZScalar = 2.5; // 2.5

        // Normalise coords to center of window; flip both x and y
        const x = -((e.clientX / width) - ((window.innerWidth / width) / 2));
        const y = -((e.clientY / height) - ((window.innerHeight / height) / 2));
        // Normalise coords to center of self; flip both x and y
        // const x = -(((e.clientX / width + .5) - 1) * 2).toFixed(2);
        // const y = -(((e.clientY / height + .5) - 1) * 2).toFixed(2);

        image.current.style.backgroundPosition = `${x * imageXPosScalar}px ${y * imageYPosScalar}px`;
        image.current.style.transform = `perspective(10px) translate3d(${x * translateXScalar}px, ${y * translateYScalar}px, ${(y * translateZScalar)}px)`;
    }

    useEffect(() => {
        // For some obsurd reason, if the element has a class that contains 'background-image' or 'mask-image',
        // or any other property with a url as the value, on each mousemove event, it will request the images
        // and cause a load of pile-up requests. Controlling caching on the server to no avail; simply setting the values
        // that store images as styles directly on the element and not in a class stops this from re-requesting constantly
        // (╯°□°）╯︵ ┻━┻
        image.current.style.webkitMaskImage = 'url(https://phoenixmee.com/images/watercolour-mask.png)';
        image.current.style.backgroundImage = `url(https://phoenixmee.com/images/${imageMap[rand]}.jpg)`;
        document.body.addEventListener('mousemove', handleMouseOver);
        return () => document.body.removeEventListener('mousemove', handleMouseOver);
    }, []);

    const buttonSelectorClick = (index) => {
        image.current.style.backgroundImage = `url(https://phoenixmee.com/images/${imageMap[index]}.jpg)`;
    }

    return (
        <div ref={container} className='about__container'>
            <ImageSelector click={buttonSelectorClick} imageCount={imageCount} selectedIndex={rand}/>
            <div ref={image} className='about__image'></div>
        </div>
    );
}

const ImageSelector = ({ click, imageCount, selectedIndex }) => {
    const buttons = useRef([]);

    useEffect(() => {
        setButtonSelected(selectedIndex);
    }, []);

    const handleClick = (index) => {
        setButtonSelected(index);
        click(index);
    }

    const setButtonSelected = (index) => {
        buttons.current.forEach(button => button.classList.remove('selected'));
        buttons.current[index].classList.add('selected');
    }

    return (
        <div className='about__image-selector'>
            {new Array(imageCount).fill(0).map((iter, index) => {
                return <button key={index} ref={el => buttons.current[index] = el} onClick={() => handleClick(index)}></button>
            })}
        </div>
    );
}