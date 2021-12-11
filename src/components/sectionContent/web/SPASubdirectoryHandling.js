export default function SPASubdirectoryHandling({type, title}) {
    return (
        <>
        <div className='header'>
            <div className={'indicator' + ' indicator--' + type}></div>
            <h1 className='title'>{title}</h1>
        </div>
        <div className='body'>
            <p>I suppose this is quite a niche case - but works well for a personal portfolio like this website because there is very little server interaction, just dynamic API fetches. If your Web Hosting Service caps the amount of pages you can have, or charges you more per page, you will most likely resort to creating an SPA (Single Page Application) - which have their ups and downs. But with some server-side tweaks and a nifty front-end framework like React, it can be made more managable.</p>
            <p>Firstly, you will want to intercept requests to the server for pages, giving more control to the browser - to do this I am using the <a href={'//www.npmjs.com/package/react-router-dom'} target='_blank' rel='noopener noreferrer'>react-router-dom</a> package, which has super easy-to-use components for this purpose. Let's look behind the curtain and see how I have set up this website to use the three components extracted from the package.</p>
            <pre><code>
{`
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
...
export default function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/about">
                    <MainImage/>
                </Route>
            </Switch>
            <Splash subjects={Object.keys(sectionContentMap)}/>
            <div className="layout">
                <Switch>
                    <Route exact path="/web">
                        <Main sections={sectionContentMap.web}/>
                        <RightNavigation sections={sectionContentMap.web}/>
                    </Route>
                    <Route exact path="/games">
                        <Main sections={sectionContentMap.games}/>
                        <RightNavigation sections={sectionContentMap.games}/>
                    </Route>
                    <Route exact path="/shaders">
                        <Main sections={sectionContentMap.shaders}/>
                        <RightNavigation sections={sectionContentMap.shaders}/>
                    </Route>
                    <Route exact path="/other">
                        <Main sections={sectionContentMap.other}/>
                        <RightNavigation sections={sectionContentMap.other}/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}`}
            </code></pre>
            <p>Wrapping the markup of the SPA in a <code>{'<Router>'}</code> tag gives more fine-grained control over what components are rendered when. A <code>{'<Switch>'}</code> is used to render components exclusively, not inclusively, so you can think of it like your standard programatical switch statement. <code>{'<Route>'}</code> tags are simply what is hit when a subdirectory is added to the URL. You <i>could</i> just omit the <code>{'<Switch>'}</code> but then you would have to be more careful about the order of the <code>{'<Route>'}</code> tags inside - with a switch, it will break on the first match. You can also tack on the <code>exect</code> attribute on a <code>{'<Route>'}</code> which is handy because a route of <code>{'/contact'}</code> will also match <code>{'/con'}</code>, or even <code>{'/'}</code> for that matter.</p>
            <p>So now, you can safely put <code>{'<a>'}</code> tags with a <code>href</code> to different paths in your application - and because of the benefit of <i>no</i> server interaction and that typically all that is needed for your application to run has already been loaded at the beginning, your 'pages' load lightning-fast. I say '<i>no</i> server interaction', but you would want to be chunking/importing JavaScript and CSS files per route to keep load times to a minimum, to which your routes will be downloading from the server - but you get the drift.</p>
            <p><b>But wait</b>, you may ask the question, 'There <i>is</i> no subdirectory or even page on my server that matches my route'. You may have set up the above Router, Switches and Routes with exact paths, and then in the address bar navigate to <code>www.mywebsite.com/contact</code> to then be hit by a <code>404 Not Found</code>. It works within the application because we are within the Router, but entering a URL with a subdirectory outside of the application will return a 404, because you're right, there <i>is</i> no subdirectory on your server.</p>
            <p>We can fix that. I am using an Apache server and have to change configuration with the <code>.htaccess</code> file in the root. The idea is to re-route traffic back to the only page of the SPA, instead of looking for others. With that in place, the Routing components can then work their magic - resulting in hybrid server/client-side routing logic. Here's the setup:</p>
            <pre><code>
{`
# Allow redirecting of paths to index, where React Router will handle them
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-l
    RewriteRule . /index.html [L]
</IfModule>
`}
            </code></pre>
            <p>The important part is the last line; it will reroute <i>all</i> traffic to the <code>index.html</code> page, so now the SPA is still 'single page', but now you can access subdirectories externally as though it wasn't.</p>
        </div>
        </>
    );
}