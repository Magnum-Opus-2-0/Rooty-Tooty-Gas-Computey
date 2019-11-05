import React from 'react';
//import { makeStyles } from '@material-ui/core/styles';
//import Modal from '@material-ui/core/modal';

// "start: "node src/server.js",
// "start": "react-scripts start",

const DEF_DISTANCE = 10;

class FilterPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filters: ['Arco', 'Chevron', 'Texaco', 'Mobil', '76'],
            selectedFilters: [],
            distance: DEF_DISTANCE,
        };
        this.handler = this.handler.bind(this);
        this.handleDistanceChange = this.handleDistanceChange.bind(this);
    }

    filter(data, filters) {
        //console.log(data)

        if (filters.length < 1) {
            return data;
        }

        //this.state.selectedFilters = ['Arco', 'Texaco'];
        let filteredData = [];
        for (let i = 0; i < data.length; i++) {
            console.log(i);
            for (let j = 0; j < filters.length; j++) {
                console.log("data[i].name: " + data[i].name + "  selectedFilter[j]: " + filters[j]);
                if (data[i].name == filters[j]) {
                    filteredData.push(data[i]);
                }
            }
        }
        return filteredData;
    }

    handler(value, isSelected) {
        let array = [value];
        this.props.updateFilters(array);
    }

    handleDistanceChange(event) {
        this.setState({distance: event.target.value});
        console.log('Max search distance: ' + this.state.distance);
    }

    sendSelectedFilters() {
        console.log("FilterPopup::test()")
        const nodeList = document.querySelectorAll('#gasStationsList option:checked')
        const filterList = Array.from(nodeList).map(elem => elem.value)
        this.props.setSelectedFilter(filterList)
    }

    render() {
        console.log("FilterPopup::render()")
        const options = this.state.filters.map((filter) => 
            <option value={filter}>{filter}</option>
        );
        // const options = this.state.filters.map((filter) => 
        //     <option onClick={this.props.setSelectedFilter} value={filter}>{filter}</option>
        // );
        return (
            <div>
                <div>Filters:</div>
                <select id='gasStationsList' name='filters' multiple onChange={() => this.sendSelectedFilters()}>
                    {options}
                </select>
                <MaxDistance
                    handleChange={this.handleDistanceChange}
                />
            </div>
        );
    }
}

class FilterOption extends React.Component {
    render() {
        let handler = this.props.handler;
        return (
            <option onClick={() => handler(this.props.value, this.props.selected)} value={this.props.value}>{this.props.value}</option>
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
                    placeholder={DEF_DISTANCE}
                    onChange={event => this.props.handleChange(event)}
                />
                </label>
            </div>
        );
    }

}

export default FilterPopup;