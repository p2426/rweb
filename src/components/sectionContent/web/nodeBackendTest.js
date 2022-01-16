import { useEffect } from "react";

export default function NodeBackendTest({type, title}) {

    useEffect(() => {
        fetch('/api/test')
        .then(response => response.json())
        .then(response => console.log(response));
    }, []);

    return (
        <>
        <div className='header'>
            <div className={'indicator' + ' indicator--' + type}></div>
            <h1 className='title'>{title}</h1>
        </div>
        <div className='body'>
            <p>Nothing to see here. Check back soon!</p>
        </div>
        </>
    );
}