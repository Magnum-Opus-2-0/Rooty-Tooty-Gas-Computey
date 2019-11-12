import React from 'react';
import FilterPopup from './FilterPopup.js';
import GasStationContainer from './GasStationData';

class GasStationFilterContainer extends React.Component {
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

const Find = () => (
    <div>
        <h1>Find gas.</h1>
        <GasStationFilterContainer />
    </div>
)

export default Find;
