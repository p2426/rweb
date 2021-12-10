export default function WebSectionOne({type, title}) {
    return (
        <div className='header'>
            <div className={'indicator' + ' indicator--' + type}></div>
            <h1 className='title'>{title}</h1>
        </div>
    );
}