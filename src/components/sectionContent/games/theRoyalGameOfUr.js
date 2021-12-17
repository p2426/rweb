export default function TheRoyalGameOfUr({type, title}) {
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