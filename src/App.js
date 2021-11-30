import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Main from './components/main';
import RightNavigation from './components/right-navigation';
import LeftNavigation from './components/left-navigation';
import MainImage from './components/main-image';
import Splash from './components/splash';
import './scss/layout.scss';
import './scss/animations.scss';

export default function App() {
    const mainSections = {
        web: ['Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', 'Web', ],
        games: ['Games', 'Games', 'Games', 'Games', 'Games', 'Games', 'Games', 'Games', 'Games', 'Games', 'Games', 'Games', 'Games', 'Games', 'Games', 'Games', 'Games', 'Games', 'Games', 'Games', 'Games', 'Games', 'Games', 'Games', 'Games', ],
        shaders: ['Shaders', 'Shaders', 'Shaders', 'Shaders', 'Shaders', 'Shaders', 'Shaders', 'Shaders', 'Shaders', 'Shaders', 'Shaders', 'Shaders', 'Shaders', 'Shaders', 'Shaders', 'Shaders', 'Shaders', 'Shaders', 'Shaders', 'Shaders', 'Shaders', 'Shaders', ],
        other: ['Other', 'Other', 'Other']
    };

    return (
        <Router>
            <Switch>
                <Route exact path="/about">
                    <MainImage/>
                </Route>
            </Switch>
            <Splash subjects={['Web', 'Games', 'Shaders', 'Other', 'About']}/>
            <div className="layout">
                <Switch>
                    <Route exact path="/web">
                        <LeftNavigation sections={['Web', 'Games', 'Shaders', 'Other', 'About']}/>
                        <Main sections={mainSections.web}/>
                        <RightNavigation sections={mainSections.web} animateStrip='1' animateItems='1'/>
                    </Route>
                    <Route exact path="/games">
                        <LeftNavigation sections={['Web', 'Games', 'Shaders', 'Other', 'About']}/>
                        <Main sections={mainSections.games}/>
                        <RightNavigation sections={mainSections.games} animateStrip='1' animateItems='1'/>
                    </Route>
                    <Route exact path="/shaders">
                        <LeftNavigation sections={['Web', 'Games', 'Shaders', 'Other', 'About']}/>
                        <Main sections={mainSections.shaders}/>
                        <RightNavigation sections={mainSections.shaders} animateStrip='1' animateItems='1'/>
                    </Route>
                    <Route exact path="/other">
                        <LeftNavigation sections={['Web', 'Games', 'Shaders', 'Other', 'About']}/>
                        <Main sections={mainSections.other}/>
                        <RightNavigation sections={mainSections.other} animateStrip='1' animateItems='1'/>
                    </Route>
                    <Route exact path="/about">
                        <LeftNavigation sections={['Web', 'Games', 'Shaders', 'Other', 'About']}/>
                        <Main sections={[]}/>
                        <RightNavigation sections={[]} animateStrip='1' animateItems='1'/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}
