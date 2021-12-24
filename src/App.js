import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Main from './components/main';
import RightNavigation from './components/rightNavigation';
import About from './components/about';
import Splash from './components/splash';
import { sectionContentMap } from './components/sectionContent/sectionContentMap';
import './scss/layout.scss';
import './scss/animations.scss';

export default function App() {
    return (
        <Router>
            <Splash subjects={Object.keys(sectionContentMap)}/>
                <Switch>
                    <Route exact path="/web">
                        <div className="layout">
                            <Main sections={sectionContentMap.web}/>
                            <RightNavigation sections={sectionContentMap.web}/>
                        </div>
                    </Route>
                    <Route exact path="/threejs">
                        <div className="layout">
                            <Main sections={sectionContentMap.threejs}/>
                            <RightNavigation sections={sectionContentMap.threejs}/>
                        </div>
                    </Route>
                    <Route exact path="/scenes">
                        <div className="layout">
                            <Main sections={sectionContentMap.scenes}/>
                            <RightNavigation sections={sectionContentMap.scenes}/>
                        </div>
                    </Route>
                    <Route exact path="/games">
                        <div className="layout">
                            <Main sections={sectionContentMap.games}/>
                            <RightNavigation sections={sectionContentMap.games}/>
                        </div>
                    </Route>
                    <Route exact path="/shaders">
                        <div className="layout">
                            <Main sections={sectionContentMap.shaders}/>
                            <RightNavigation sections={sectionContentMap.shaders}/>
                        </div>
                    </Route>
                </Switch>
            <Switch>
                <Route exact path="/about">
                    <About/>
                </Route>
            </Switch>
        </Router>
    );
}
