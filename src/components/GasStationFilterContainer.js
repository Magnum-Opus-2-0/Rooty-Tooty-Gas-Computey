import React from 'react';
import FilterPopup from './FilterPopup.js';
import GasStationContainer from './GasStationData';

export default class GasStationFilterContainer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
        	selectedFilters: []
        }

        this.setSelectedFilters = this.setSelectedFilters.bind(this)
    }

    /*
		setSelectedFilters()
		Sets the selectFilters state. Called from a child component.
		arguments:
			list: array of strings
    */
    setSelectedFilters(list) {
        this.setState({selectedFilters : list})
    }

	render() {
		return (
			<div>
				<GasStationContainer selectedFilters={this.state.selectedFilters} />
                <FilterPopup setSelectedFilters={this.setSelectedFilters} />
			</div>
		);
	}
}