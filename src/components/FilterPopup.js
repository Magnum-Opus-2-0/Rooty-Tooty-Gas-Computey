import React from 'react';
//import { makeStyles } from '@material-ui/core/styles';
//import Modal from '@material-ui/core/modal';



class FilterPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filters: ['Arco', 'Chevron', 'Texaco', 'Mobil'],
            selectedFilters: []
        }
        this.handler = this.handler.bind(this);
    }

    filter(data) {
        console.log(data)

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

export default FilterPopup;