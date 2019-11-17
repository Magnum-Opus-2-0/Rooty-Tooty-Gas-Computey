import React, { useState } from 'react';
import FilterPopup from './FilterPopup.js';
import GasStationContainer from './GasStationData';
import {Nav, Navbar, NavItem, Collapse} from 'reactstrap';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';

export default class GasStationFilterContainer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
        	selectedFilters: [],
        	filterDropdownOpen: false
        }

        this.setSelectedFilters = this.setSelectedFilters.bind(this)
        this.filterDropdownToggle = this.filterDropdownToggle.bind(this)
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

	render() {
		return (
			<React.Fragment>
				{/* Navigation bar for the filters */}
				<Navbar color="light" light expand="md">
					<Collapse isOpen={true} navbar>
						<Dropdown isOpen={this.state.filterDropdownOpen} toggle={this.filterDropdownToggle} >
							<DropdownToggle caret>
								Filters
							</DropdownToggle>
							{/*<DropdownMenu>
								<DropdownItem header>Gas Stations</DropdownItem>
								<DropdownItem>Item A</DropdownItem>
								<DropdownItem>Item B</DropdownItem>
							</DropdownMenu>
						</Dropdown>*/}
						
						{/*<Nav>
							<NavItem>Test1</NavItem>
							<NavItem>Test2</NavItem>
							<NavItem>Test3</NavItem>

						</Nav>*/}
					</Collapse>
				</Navbar>

				{/* Main body of the Find page */}
				<GasStationContainer selectedFilters={this.state.selectedFilters} />
                <FilterPopup setSelectedFilters={this.setSelectedFilters} />
			</React.Fragment>
		);
	}
}