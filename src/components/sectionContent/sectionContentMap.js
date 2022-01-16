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
    }, {
        props: { type: 'web', title: 'charting data' },
        filename: 'chartingData',
    }, {
        props: { type: 'web', title: 'node backend test' },
        filename: 'nodeBackendTest',
    }],
    threejs: [{
        props: { type: 'threejs', title: 'wrapping three.js' },
        filename: 'wrappingThreeJS',
    }, {
        props: { type: 'threejs', title: 'init functions' },
        filename: 'initFunctions',
    }, {
        props: { type: 'threejs', title: 'update loop' },
        filename: 'updateLoop',
    }, {
        props: { type: 'threejs', title: 'stopping time' },
        filename: 'stoppingTime',
    }, {
        props: { type: 'threejs', title: 'being efficient' },
        filename: 'beingEfficient',
    }, {
        props: { type: 'threejs', title: 'the cube' },
        filename: 'theCube',
    }, {
        props: { type: 'threejs', title: 'a shader scene' },
        filename: 'aShaderScene',
    }],
    shaders: [{
        props: { type: 'shaders', title: 'mandelbrot fractal' },
        filename: 'mandelbrotSet',
    }, {
        props: { type: 'shaders', title: 'julia set' },
        filename: 'juliaSet',
    }],
    scenes: [{
        props: { type: 'scenes', title: 'a manéo experience' },
        filename: 'aManeoExperience',
    }],
    games: [{
        props: { type: 'games', title: 'the royal game of ur' },
        filename: 'theRoyalGameOfUr',
    }],
    about: ''
}