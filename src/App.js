import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Main from './components/main';
import RightNavigation from './components/rightNavigation';
import MainImage from './components/mainImage';
import Splash from './components/splash';
import './scss/layout.scss';
import './scss/animations.scss';

export default function App() {
    const mainSections = {
        web: ['web', 'web', 'web', 'web', 'web', 'web', 'web', 'web', 'web', 'web', 'web', 'web', 'web', 'web', 'web', 'web', 'web', 'web', 'web', 'web', 'web', 'web', 'web', 'web', 'web', 'web', 'web', 'web', 'web', 'web', 'web', 'web', ],
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
                        <Main sections={mainSections.web}/>
                        <RightNavigation sections={mainSections.web} animateStrip='1' animateItems='1'/>
                    </Route>
                    <Route exact path="/games">
                        <Main sections={mainSections.games}/>
                        <RightNavigation sections={mainSections.games} animateStrip='1' animateItems='1'/>
                    </Route>
                    <Route exact path="/shaders">
                        <Main sections={mainSections.shaders}/>
                        <RightNavigation sections={mainSections.shaders} animateStrip='1' animateItems='1'/>
                    </Route>
                    <Route exact path="/other">
                        <Main sections={mainSections.other}/>
                        <RightNavigation sections={mainSections.other} animateStrip='1' animateItems='1'/>
                    </Route>
                    <Route exact path="/about">
                        <Main sections={[]}/>
                        <RightNavigation sections={[]} animateStrip='1' animateItems='1'/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}
