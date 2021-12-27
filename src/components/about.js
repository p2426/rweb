import { useEffect, useRef } from 'react';
import translateWithMouse from '../global/translateWithMouse';
import '../scss/about.scss';

export default function About() {
    const image = useRef();
    const container = useRef();
    const info = useRef();

    // Allow for a random image on creation
    const imageMap = ['IMG_3040', 'IMG_3063', 'IMG_3088', 'IMG_3091', 'IMG_3434', 'IMG_3449', 'IMG_3571', 'IMG_3885', 'IMG_3977', 'IMG_3984', 'IMG_4047',
                      'IMG_4075', 'IMG_4078', 'IMG_4117', 'IMG_4124', 'IMG_4127', 'IMG_4294', 'IMG_4304', 'IMG_6445', 'IMG_6450', 'IMG_6474', 'IMG_6531',
                      'P7120040', 'P7210003'];
    let currentImageIndex = Math.round(Math.random() * (imageMap.length - 1));

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

        translateWithMouse(e, info.current, 50, 50, info.current.offsetWidth / 2, info.current.offsetHeight / 2);
    }

    useEffect(() => {
        // For some obsurd reason, if the element has a class that contains 'background-image' or 'mask-image',
        // or any other property with a url as the value, on each mousemove event, it will request the images
        // and cause a load of pile-up requests. Controlling caching on the server to no avail; simply setting the values
        // that store images as styles directly on the element and not in a class stops this from re-requesting constantly
        // (╯°□°）╯︵ ┻━┻
        image.current.style.webkitMaskImage = 'url(./images/watercolour-mask.png)';
        image.current.style.backgroundImage = `url(./images/${imageMap[currentImageIndex]}.jpg)`;
        document.body.addEventListener('mousemove', handleMouseOver);
        return () => document.body.removeEventListener('mousemove', handleMouseOver);
    }, []);

    const imageSelectorClick = (index) => {
        currentImageIndex = index;
        if (currentImageIndex > imageMap.length - 1) {
            currentImageIndex = 0;
        } else if (currentImageIndex < 0) {
            currentImageIndex = imageMap.length - 1;
        }
        image.current.style.backgroundImage = `url(https://phoenixmee.com/images/${imageMap[currentImageIndex]}.jpg)`;
    }

    return (
        <div ref={container} className='about__container'>
            <button className='about__image-selector about__image-selector--previous' onClick={() => imageSelectorClick(currentImageIndex - 1)}></button>
            <div ref={image} className='about__image'></div>
            <button className='about__image-selector about__image-selector--next' onClick={() => imageSelectorClick(currentImageIndex + 1)}></button>
            <p ref={info} className='about__info'>My name is Phoenix. I am a game and web developer living in London. Feel free to <a href={'//www.linkedin.com/in/phoenixmee/'} target='_blank' rel='noopener noreferrer'>get in touch</a>. In the meantime, enjoy some photos of my time in Japan.</p>
        </div>
    );
}