import React, { useState } from 'react';
import FilterPopup from './FilterPopup.js';
import GasStationContainer from './GasStationData';
import Firebase from './Firebase'
import {Nav, Navbar, NavItem, Collapse} from 'reactstrap';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import {Button, ButtonGroup} from 'reactstrap';

export default class GasStationFilterContainer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
        	selectedFilters: [],
        	filterDropdownOpen: false,
			// availableFilters: ['Arco', 'Chevron', 'Texaco', 'Mobil', '76'],
			availableFilters: ['Sunoco', 'Xtramart', 'Shell'],
        	filterButtons: []
        }

        this.setSelectedFilters = this.setSelectedFilters.bind(this)
        this.filterDropdownToggle = this.filterDropdownToggle.bind(this)
        //this.addFilter = this.addFilter.bind(this)


        this.filterOptions = this.getFilterOptions(this.state.availableFilters)
        this.filterButtons = []
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

	render() {
		const buttonGroupStyle = {'margin-left':'0.4em'}

		return (
			<React.Fragment>
				{/* Navigation bar for the filters */}
				<Navbar color="light" light expand="md">
					<Collapse isOpen={true} navbar>
						<Nav>
							<Dropdown isOpen={this.state.filterDropdownOpen} toggle={this.filterDropdownToggle} >
								<DropdownToggle caret>
									Filters
								</DropdownToggle>
								<DropdownMenu>
									{this.filterOptions}
								</DropdownMenu>
							</Dropdown>
							<div style={buttonGroupStyle}>
								{this.state.filterButtons}
							</div>
						</Nav>
					</Collapse>
				</Navbar>

				{/* Main body of the Find page */}
				<GasStationContainer selectedFilters={this.state.selectedFilters} firebase={this.props.firebase} />
                {/* <FilterPopup setSelectedFilters={this.setSelectedFilters} /> */}
			</React.Fragment>
		);
	}
}
