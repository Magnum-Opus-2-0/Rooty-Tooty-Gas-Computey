import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import FilterPopup from './components/FilterPopup.js';
import DropdownMenu from './components/CarInfo.js';
import GasStationContainer from './components/GasStationData.js';
import Banner from './components/Banner.js';
import Header from './components/Header.js';
import CarInfo from './components/CarInfo';
import FindGas from './components/FindGas';
import GasMap from './components/GasMap';
import PlanYourTrip from './components/PlanYourTrip';

class Welcome extends React.Component {
	render() {
		return <h1>Welcome, {this.props.name}</h1>;
	}
}

class App extends React.Component {
    state = {
        selectedFilters: ['Arco', 'Chevron']
    }

    updateFilters(selectedFilters) {
        console.log("App::updateFilters --> " + selectedFilters)
        this.setState({selectedFilters: selectedFilters})
    }

    render() {
        this.updateFilters = this.updateFilters.bind(this);
        return (
            <Router>
                <div className="TopLevelDiv">
                    <Banner />
                    <Switch>
                        <Route exact path="/"></Route>
                        <Route path="/findgas">
                            <FindGas />
                        </Route>
                        <Route path="/gasmap">
                            <GasMap />
                        </Route>
                        <Route path="/planyourtrip">
                            <PlanYourTrip />
                        </Route>
                    </Switch>
                    {/* <DropdownMenu/> */}
                    {/* <GasStationContainer selectedFilters={this.state.selectedFilters} /> */}
                    {/* <FilterPopup updateFilters={this.updateFilters} /> */}
                </div>
            </Router>
        );
    }
}

export default App;
