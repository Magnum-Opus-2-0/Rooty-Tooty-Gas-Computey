import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import FilterPopup from './components/FilterPopup.js';
import GasStationContainer from './components/GasStationData.js';
import Home from './components/Home.js';
import Header from './components/Header.js';
import Find from './components/Find.js';
import CarOptions from './components/CarOptions.js';
import Layout  from './components/Layout';

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
                                <Route path="/find" component={Find} />
                                <Route path="/caroptions" component={CarOptions}/>
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
