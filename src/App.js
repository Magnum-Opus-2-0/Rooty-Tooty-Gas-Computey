import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { Cookies } from 'react-cookie';

import './App.css';
import Home from './components/Home.js';
import Header from './components/Header.js';
import Find from './components/Find.js';
import CarOptions from './components/CarOptions.js';

class App extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    state = {
        selectedFilters: []
    };

    setSelectedFilters(list) {
        this.setState({selectedFilters : list})
    }

    render() {
        console.log("App::render()")
        console.log("App::this.props.firebase:");
        console.log(this.props.firebase);
        return (
            <React.Fragment>
                <Header />
                    <Router>
                        <div className="TopLevelDiv">
                            <Switch>
                                <Route exact path="/" component={Home}></Route>
                                <Route path="/find" render={(props) => <Find {...props} firebase={this.props.firebase} /> } />
                                <Route path="/caroptions" component={CarOptions}/>
                            </Switch>
                        </div>
                    </Router>
            </React.Fragment>
        );
    }
}

export default App;
