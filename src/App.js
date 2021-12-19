import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Main from './components/main';
import RightNavigation from './components/rightNavigation';
import MainImage from './components/mainImage';
import Splash from './components/splash';
import { sectionContentMap } from './components/sectionContent/sectionContentMap';
import './scss/layout.scss';
import './scss/animations.scss';

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
                    <Route exact path="/scenes">
                        <Main sections={sectionContentMap.scenes}/>
                        <RightNavigation sections={sectionContentMap.scenes}/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}
