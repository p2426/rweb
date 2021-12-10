import Placeholder from "./placeholder";

// Contains a map of component and their props, to render to the main section.
// App, RightNavigation components expect the objects with in each section to at least have a
// 'title' in the props object, and for the path to be a key in the main object, ie:
// phoenixmee.com/web will attempt to render components in the web array, in order,
// and the RightNavigation component will render the title inside props, in order
export const sectionContentMap = {
    web: [{
        props: { type: 'web', title: 'placeholder' },
        component: Placeholder
    }],
    games: [{
        props: { type: 'games', title: 'placeholder' },
        component: Placeholder
    }],
    shaders: [{
        props: { type: 'shaders', title: 'placeholder' },
        component: Placeholder
    }],
    other: [{
        props: { type: 'other', title: 'placeholder' },
        component: Placeholder
    }]
}