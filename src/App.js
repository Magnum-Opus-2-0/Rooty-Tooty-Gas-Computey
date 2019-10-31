import React from 'react';
import './App.css';

import FilterPopup from './components/FilterPopup.js';
import DropdownMenu from './components/CarInfo.js';
import GasStationContainer from './components/GasStationData.js';
import MapContainer from './components/Map'
import CarInfo from "./components/CarInfo";

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
            <div className="TopLevelDiv">
                <DropdownMenu/>
                <GasStationContainer selectedFilters={this.state.selectedFilters} />
                <FilterPopup updateFilters={this.updateFilters} />
                <MapContainer/>
            </div>
        );
    }
}

export default App;
