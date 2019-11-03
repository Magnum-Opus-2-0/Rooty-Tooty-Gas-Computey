import React from 'react';
import './App.css';

import FilterPopup from './components/FilterPopup.js';
import TestParentA from './components/EdwardTest.js'
import DropdownMenu from './components/CarInfo.js';
import GasStationContainer from './components/GasStationData.js';
import CarInfo from "./components/CarInfo";
import MultipleSelect from './components/FilterMultiSelect.js';

class Welcome extends React.Component {
    constructor(props) {
        super(props);
    }
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
                <TestParentA />

                <DropdownMenu/>
                <GasStationContainer selectedFilters={this.state.selectedFilters} />
                <FilterPopup updateFilters={this.updateFilters} />
                <br />
                <MultipleSelect />
            </div>
        );
    }
}

export default App;
