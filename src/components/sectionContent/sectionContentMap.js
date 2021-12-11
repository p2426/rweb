import Placeholder from "./placeholder";

// Contains a map of component and their props, to render to the main section.
// App, RightNavigation components expect the objects with in each section to have a
// 'title' in the props object.
// IMPORTANT: a URL extension will render components to the Main component expecting the key of the extension to exist, ie.
// phoenixmee.com/web will render components in the key 'web', etc
// IMPORTANT: Sections will dynamically import a default component from location:
// `./sectionContent/${section.props.type}/${section.filename}`
export const sectionContentMap = {
    web: [{
        props: { type: 'web', title: 'placeholder' },
        filename: 'placeholder',
    }],
    games: [{
        props: { type: 'games', title: 'placeholder' },
        filename: 'placeholder',
    }],
    shaders: [{
        props: { type: 'shaders', title: 'placeholder' },
        filename: 'placeholder',
    }],
    other: [{
        props: { type: 'other', title: 'placeholder' },
        filename: 'placeholder',
    }]
}