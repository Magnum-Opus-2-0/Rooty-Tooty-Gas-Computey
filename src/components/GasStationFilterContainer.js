import React, { useState } from 'react';
import FilterPopup from './FilterPopup.js';
import GasStationContainer from './GasStationData';
import Firebase from './Firebase'
import {Nav, Navbar, NavItem, Collapse} from 'reactstrap';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import {Button, ButtonGroup} from 'reactstrap';
import { Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';

export default class GasStationFilterContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedFilters: [],
            filterDropdownOpen: false,
            filterTypeDropdownOpen: false,
            // availableFilters: ['Arco', 'Chevron', 'Texaco', 'Mobil', '76'],
            availableFilters: ['Sunoco', 'Xtramart', 'Shell'],
            filterButtons: [],
            maxDistance: 50,
            gasQualityRegular: true,
            gasQualityMid: true,
            gasQualityPremium: true,
        }

        this.setSelectedFilters = this.setSelectedFilters.bind(this)
        this.filterDropdownToggle = this.filterDropdownToggle.bind(this)
        this.filterTypeDropdownToggle = this.filterTypeDropdownToggle.bind(this)
        //this.addFilter = this.addFilter.bind(this)

        this.filterOptions = this.getFilterOptions(this.state.availableFilters)
        this.filterButtons = []

        //this.test = this.test.bind(this)
    }

    getFilterOptions(filterList) {
        const optionStyle = {
            'background-color': 'white',
            'color': 'black',
            'border': 'none',
            'width': '100%',
        }
        let elemList = filterList.map(filter => {
            console.log(this)
            return (
                <React.Fragment>
                    <Button style={optionStyle} onClick={(event) => this.addFilter(filter)}>{filter}</Button><br/>
                </React.Fragment>
            )
        })
        return elemList
    }

    filterDropdownToggle() {
        this.setState({filterDropdownOpen: !this.state.filterDropdownOpen})
    }

    filterTypeDropdownToggle() {
        this.setState({filterTypeDropdownOpen: !this.state.filterTypeDropdownOpen})
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

    setFilterButtons(list) {
        const buttonStyle = {'margin-right': '0.1em'}
        let filterButtons = list.map(filter => {
            return (
                <React.Fragment>
                    <Button style={buttonStyle} onClick={(event) => this.removeFilter(filter)}>{filter}</Button>
                </React.Fragment>
            )
        })
        this.setState({filterButtons: filterButtons})
    }

    addFilter(value) {
        if (this.state.selectedFilters.includes(value)) {
            return;
        }

        const list = this.state.selectedFilters.slice()
        list.push(value)
        this.setState({selectedFilters: list})

        this.setFilterButtons(list)
    }

    removeFilter(filter) {
        let list = this.state.selectedFilters.slice()
        const index = list.indexOf(filter)
        if (index >= 0) {
            list.splice(index, 1)
            this.setState({selectedFilters: list})
        }

        this.setFilterButtons(list)
    }

    setMaxDistance(event) {
        const distance = parseFloat(event.target.value)
        if (!isNaN(distance) && distance >= 0) {
            this.setState({maxDistance: distance})
        } else if (event.target.value == "") {
            this.setState({maxDistance: 0})
        } else {
            this.setState({maxDistance: this.state.maxDistance})
        }
    }

    toggleCheckbox(event, gasQuality) {
        switch(gasQuality) {
            case 'regular':
                this.setState({gasQualityRegular: !this.state.gasQualityRegular})
                break
            case 'mid':
                this.setState({gasQualityMid: !this.state.gasQualityMid})
                break
            case 'premium':
                this.setState({gasQualityPremium: !this.state.gasQualityPremium})
                break
        }
    }

    render() {
        const buttonGroupStyle = {'margin-left':'0.4em'}

        return (
            <React.Fragment>
                {/* Navigation bar for the filters */}
                <Navbar color="light" light expand="md">
                    <Collapse isOpen={true} navbar>
                        <Nav>
                            <InputGroup>
                                {/* Gas type filter */}
                                <Dropdown isOpen={this.state.filterTypeDropdownOpen} toggle={this.filterTypeDropdownToggle} >
                                    <DropdownToggle caret> Gas Type</DropdownToggle>
                                    <DropdownMenu>
                                        <Input onClick={(e) => this.toggleCheckbox(e, 'regular')} addon type="checkbox" aria-label="Regular" checked={this.state.gasQualityRegular} /> Regular<br/>
                                        <Input onClick={(e) => this.toggleCheckbox(e, 'mid')} addon type="checkbox" aria-label="Mid" checked={this.state.gasQualityMid} /> Mid<br/>
                                        <Input onClick={(e) => this.toggleCheckbox(e, 'premium')} addon type="checkbox" aria-label="Premium" checked={this.state.gasQualityPremium} /> Premium<br/>
                                    </DropdownMenu>
                                </Dropdown>
                                {/* Distance filter */}
                                <InputGroupText>Distance</InputGroupText>
                                <Input onChange={(e) => this.setMaxDistance(e)} type="number" min="1" max="100" placeholder="max distance" value={this.state.maxDistance}></Input>
                                {/* Filter dropdown */}
                                <Dropdown isOpen={this.state.filterDropdownOpen} toggle={this.filterDropdownToggle} >
                                    <DropdownToggle caret>Gas Stations</DropdownToggle>
                                    <DropdownMenu>
                                        {this.filterOptions}
                                    </DropdownMenu>
                                </Dropdown>
                                {/* Filter buttons */}
                                <div style={buttonGroupStyle}>
                                    {this.state.filterButtons}
                                </div>
                                
                            </InputGroup>
                        </Nav>
                    </Collapse>
                </Navbar>

                {/* Main body of the Find page */}
                <GasStationContainer selectedFilters={this.state.selectedFilters} maxDistance={this.state.maxDistance} firebase={this.props.firebase} />
                {/* <FilterPopup setSelectedFilters={this.setSelectedFilters} /> */}
            </React.Fragment>
        );
    }
}