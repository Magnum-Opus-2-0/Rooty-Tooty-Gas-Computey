import React from 'react';
import './App.css';

import FilterPopup from './components/FilterPopup.js';
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
        selectedFilters: []
    }

    setSelectedFilters(list) {
        this.setState({selectedFilters : list})
    }

    render() {
        console.log("App::render()")
        return (
            <div className="TopLevelDiv">
                <DropdownMenu/>
                <GasStationContainer selectedFilters={this.state.selectedFilters} />
                <FilterPopup setSelectedFilter={(event) => this.setSelectedFilters(event)} />
                <br />
                <MultipleSelect />
            </div>
        );
    }
}

export default App;
