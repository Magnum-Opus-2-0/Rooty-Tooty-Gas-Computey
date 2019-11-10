import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import FilterPopup from './components/FilterPopup.js';
import DropdownMenu from './components/CarInfo.js';
import GasStationContainer from './components/GasStationData.js';
import Home from './components/Home.js';
import Header from './components/Header.js';
import CarInfo from './components/CarInfo.js';
import FindGas from './components/FindGas.js';
import GasMap from './components/GasMap.js';
import PlanYourTrip from './components/PlanYourTrip.js';
import Layout  from './components/Layout';
//import CarInfo from "./components/CarInfo";

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
            <React.Fragment>
                <Header />
                <Layout>
                    <Router>
                        <div className="TopLevelDiv">
                            <Switch>
                                <Route exact path="/" component={Home}></Route>
                                <Route path="/findgas" component={FindGas} />
                                <Route path="/gasmap" component={GasMap}/>
                                <Route path="/planyourtrip" component={PlanYourTrip}/>
                            </Switch>
                            {/* <DropdownMenu/> */}
                            {/* <GasStationContainer selectedFilters={this.state.selectedFilters} /> */}
                            {/* <FilterPopup updateFilters={this.updateFilters} /> */}
                        </div>
                    </Router>
                </Layout>
            </React.Fragment>
        );
    }
}

export default App;
