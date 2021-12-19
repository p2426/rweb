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
    }, {
        props: { type: 'web', title: 'useOnScreen' },
        filename: 'useOnScreen',
    }, {
        props: { type: 'web', title: 'orphaned elements' },
        filename: 'orphanedElements',
    }],
    scenes: [{
        props: { type: 'scenes', title: 'a casio experience' },
        filename: 'aCasioExperience',
    }],
    games: [{
        props: { type: 'games', title: 'start: wrapping three.js' },
        filename: 'wrappingThreeJS',
    }, {
        props: { type: 'games', title: 'init functions' },
        filename: 'initFunctions',
    }, {
        props: { type: 'games', title: 'update loop' },
        filename: 'updateLoop',
    }, {
        props: { type: 'games', title: 'end: the cube' },
        filename: 'theCube',
    }, {
        props: { type: 'games', title: 'the royal game of ur' },
        filename: 'theRoyalGameOfUr',
    }],
    shaders: [{
        props: { type: 'shaders', title: 'placeholder' },
        filename: 'placeholder',
    }],
    about: ''
}