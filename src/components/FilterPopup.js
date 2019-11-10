import React from 'react';
//import { makeStyles } from '@material-ui/core/styles';
//import Modal from '@material-ui/core/modal';

const DEF_DISTANCE = 10;

class FilterPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filters: ['Arco', 'Chevron', 'Texaco', 'Mobil'],
            selectedFilters: [],
            distance: DEF_DISTANCE,
        };
        this.handler = this.handler.bind(this);
        this.handleDistanceChange = this.handleDistanceChange.bind(this);
    }

    filter(data) {
        //console.log(data)

        if (this.state.selectedFilters.length < 1) {
            return data;
        }

        //this.state.selectedFilters = ['Arco', 'Texaco'];
        let filteredData = [];
        for (let i = 0; i < data.length; i++) {
            //console.log(i);
            for (let j = 0; j < this.state.selectedFilters.length; j++) {
                //console.log("data[i].name: " + data[i].name + "  selectedFilter[j]: " + this.state.selectedFilters[j]);
                if (data[i].name == this.state.selectedFilters[j]) {
                    filteredData.push(data[i]);
                }
            }
        }
        return filteredData;

        // return [
        //  {
  //               name: 'ArcoFiltered',
  //               key: 'unique-arco',
  //           },
  //           {
  //               name: 'ChevronFiltered',
  //               key: 'unique-chevron',
  //           },
  //           {
  //               name: 'TexacoFiltered',
  //               key: 'unique-texaco',
  //           }
        // ]
    }

    handler(value, isSelected) {
        // this.setState({selectedFilters: []});
        // console.log("clicked Select item -- value:" + value);
        // for (let i = 0; i < this.state.selectedFilters.length; i++) {
        //     if (this.state.selectedFilters[i] == value) {
        //         return;
        //     }
        // }
        // console.log("adding " + value + " to this.state.selectedFilters");
        // this.state.selectedFilters.push(value);
        let array = [value];
        this.props.updateFilters(array);
    }

    handleDistanceChange(event) {
        this.setState({distance: event.target.value});
        console.log('Max search distance: ' + this.state.distance);
    }

    render() {
        return (
            <div>
                <div>Filters:</div>
                <button onClick={this.test} type='button'>
                    Click me!
                </button>
                <select name='filters' multiple>
                    <FilterOption handler={this.handler} value='arco' />
                    <FilterOption handler={this.handler} value='chevron' />
                    <FilterOption handler={this.handler} value='texaco' />
                    <FilterOption handler={this.handler} value='mobil' />
                </select>
                <MaxDistance
                    handleChange={this.handleDistanceChange}
                />
                <p>Selected Filters:</p>
                <ul>
                    <li>item 1</li>
                    <li>item 2</li>
                    <li>item 3</li>
                </ul>
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