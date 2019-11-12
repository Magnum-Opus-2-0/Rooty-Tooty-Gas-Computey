import React from 'react';

const DEFAULT_FILTER_DISTANCE = 10; // in miles

/*
    FilterPopup class
    Contains a drop-down menu that lists all gas station filters available.
*/
class FilterPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filters: ['Arco', 'Chevron', 'Texaco', 'Mobil', '76'],
            selectedFilters: [],
            distance: DEFAULT_FILTER_DISTANCE,
        };
        this.handleDistanceChange = this.handleDistanceChange.bind(this);
        this.selectId = "gasStationsList"
    }

    /*
        handleDistanceChange()
        Sets this state's distance. Called from <MaxDistance>.
    */
    handleDistanceChange(event) {
        this.setState({distance: event.target.value});
    }

    /*
        sendSelectedFilters()
        Gets all the filters selected (in the filter drop-down menu) as an array of strings.
        Calls setSelectedFilter() to modify the filter list of this component's parent state.
    */
    sendSelectedFilters() {
        const nodeList = document.querySelectorAll('#'+this.selectId+' option:checked')
        const filterList = Array.from(nodeList).map(elem => elem.value)
        this.props.setSelectedFilter(filterList)
    }

    /*
        render()
        Returns a <div> containing a drop-down menu <select> that 
        has all gas station <option> that the user can filter by.
    */
    render() {
        const options = this.state.filters.map((filter) => 
            <option value={filter}>{filter}</option>
        );
        return (
            <div>
                <div>Filters:</div>
                <select id={this.selectId} name='filters' multiple onChange={() => this.sendSelectedFilters()}>
                    {options}
                </select>
                <MaxDistance
                    handleChange={this.handleDistanceChange}
                />
            </div>
        );
    }
}

/**
 * An input field in which the user will type the maximum distance to search.
 *
 * props: {
 *     handleChange {function}  The handler function that saves the data from
 *                              the input field.
 * }
 *
 * state: none
 */
class MaxDistance extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <label>Max Distance
                <input
                    type="number"
                    name="maxDistanceInput"
                    placeholder={DEFAULT_FILTER_DISTANCE}
                    onChange={event => this.props.handleChange(event)}
                />
                </label>
            </div>
        );
    }

}

export default FilterPopup;