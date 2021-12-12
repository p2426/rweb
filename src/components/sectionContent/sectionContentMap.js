// Contains a map of components to render, by hinting to the filename to import.
// A URL extension will render components to the Main component expecting the key of the extension to exist, ie.
// phoenixmee.com/web will render components in the key 'web', etc
// Sections will dynamically import a default component from location:
// `./sectionContent/${section.props.type}/${section.filename}`
// RightNavigation component uses 'title' to render/highlight section while scrolling.
export const sectionContentMap = {
    web: [{
        props: { type: 'web', title: '"drawing" SVGs' },
        filename: 'drawingSVGs',
    }, {
        props: { type: 'web', title: 'SPA subdirectory handling' },
        filename: 'SPASubdirectoryHandling',
    }],
    games: [{
        props: { type: 'games', title: 'wrapping three.js' },
        filename: 'wrappingThreeJS',
    }],
    shaders: [{
        props: { type: 'shaders', title: 'placeholder' },
        filename: 'placeholder',
    }],
    other: [{
        props: { type: 'other', title: 'placeholder' },
        filename: 'placeholder',
    }],
    about: ''
}