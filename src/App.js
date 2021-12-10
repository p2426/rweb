import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Main from './components/main';
import RightNavigation from './components/rightNavigation';
import MainImage from './components/mainImage';
import Splash from './components/splash';
import { sectionContentMap } from './components/sectionContent/sectionContentMap';
import './scss/layout.scss';
import './scss/animations.scss';

export default function App() {
    const mainSections = {
        games: ['games', 'games', 'games', 'games', 'games', 'games', 'games', 'games', 'games', 'games', 'games', 'games', 'games', 'games', 'games', 'games', 'games', 'games', 'games', 'games', 'games', 'games', 'games', 'games', 'games', ],
        shaders: ['shaders', 'shaders', 'shaders', 'shaders', 'shaders', 'shaders', 'shaders', 'shaders', 'shaders', 'shaders', 'shaders', 'shaders', 'shaders', 'shaders', 'shaders', 'shaders', 'shaders', 'shaders', 'shaders', 'shaders', 'shaders', 'shaders', ],
        other: ['other', 'other', 'other']
    };

    return (
        <Router>
            <Switch>
                <Route exact path="/about">
                    <MainImage/>
                </Route>
            </Switch>
            <Splash subjects={['web', 'games', 'shaders', 'other', 'about']}/>
            <div className="layout">
                <Switch>
                    <Route exact path="/web">
                        <Main sections={sectionContentMap.web}/>
                        <RightNavigation sections={sectionContentMap.web} animateStrip='1' animateItems='1'/>
                    </Route>
                    <Route exact path="/games">
                        <Main sections={sectionContentMap.games}/>
                        <RightNavigation sections={sectionContentMap.games} animateStrip='1' animateItems='1'/>
                    </Route>
                    <Route exact path="/shaders">
                        <Main sections={sectionContentMap.shaders}/>
                        <RightNavigation sections={sectionContentMap.shaders} animateStrip='1' animateItems='1'/>
                    </Route>
                    <Route exact path="/other">
                        <Main sections={sectionContentMap.other}/>
                        <RightNavigation sections={sectionContentMap.other} animateStrip='1' animateItems='1'/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}
