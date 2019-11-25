import React from 'react';
import GasStationContainer from './GasStationData';
import {Nav, Navbar, Collapse} from 'reactstrap';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import {Button} from 'reactstrap';
import { Input, InputGroup, InputGroupText } from 'reactstrap';

export default class GasStationFilterContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedFilters: [],
            gasStationDropdownOpen: false,
            gasGradeDropdownOpen: false,
            // availableFilters: ['Arco', 'Chevron', 'Texaco', 'Mobil', '76'],
            availableFilters: ['Sunoco', 'Xtramart', 'Shell'],
            filterButtons: [],
            maxDistance: 25,
            gasQualityRegular: true,
            gasQualityMid: true,
            gasQualityPremium: true,
            filterOptions: []
        }

        this.setSelectedFilters = this.setSelectedFilters.bind(this)
        this.gasStationDropdownToggle = this.gasStationDropdownToggle.bind(this)
        this.gasGradeDropdownToggle = this.gasGradeDropdownToggle.bind(this)
        this.retrieveStationNames = this.retrieveStationNames.bind(this);
        //this.addFilter = this.addFilter.bind(this)

        // this.filterOptions = this.getFilterOptions(this.state.availableFilters)
        this.filterButtons = []

        //this.test = this.test.bind(this)
    }

    retrieveStationNames(namesArray) {

        const newFilterOptions = this.getFilterOptions(namesArray);
        this.setState({filterOptions: newFilterOptions});
    }

    getFilterOptions(filterList) {
        const optionStyle = {
            'background-color': 'white',
            'color': 'black',
            'border': 'none',
            'width': '100%',
        }
        let elemList = filterList.map(filter => {
            return (
                <div>
                    <Button style={optionStyle} onClick={(event) => this.addFilter(filter)}>{filter}</Button><br/>
                </div>
            )
        })
        return elemList
    }

    gasStationDropdownToggle() {
        this.setState({gasStationDropdownOpen: !this.state.gasStationDropdownOpen})
    }

    gasGradeDropdownToggle() {
        this.setState({gasGradeDropdownOpen: !this.state.gasGradeDropdownOpen})
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
                                <Dropdown isOpen={this.state.gasGradeDropdownOpen} toggle={this.gasGradeDropdownToggle} >
                                    <DropdownToggle caret> Gas Grade</DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem header>Gas stations must have</DropdownItem>
                                        <Input onClick={(e) => this.toggleCheckbox(e, 'regular')} addon type="checkbox" aria-label="Unleaded" checked={this.state.gasQualityRegular} /> Unleaded<br/>
                                        <Input onClick={(e) => this.toggleCheckbox(e, 'mid')} addon type="checkbox" aria-label="Unleaded Plus" checked={this.state.gasQualityMid} /> Unleaded Plus<br/>
                                        <Input onClick={(e) => this.toggleCheckbox(e, 'premium')} addon type="checkbox" aria-label="Premium" checked={this.state.gasQualityPremium} /> Premium<br/>
                                    </DropdownMenu>
                                </Dropdown>
                                {/* Distance filter */}
                                <InputGroupText>Distance</InputGroupText>
                                <Input onChange={(e) => this.setMaxDistance(e)} type="number" min="1" max="100" placeholder="max distance" value={this.state.maxDistance}></Input>
                                {/* Filter dropdown */}
                                <Dropdown isOpen={this.state.gasStationDropdownOpen} toggle={this.gasStationDropdownToggle} >
                                    <DropdownToggle caret>Gas Stations</DropdownToggle>
                                    <DropdownMenu>
                                        {this.state.filterOptions}
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
                <GasStationContainer retrieveStationNames={this.retrieveStationNames}
                    selectedFilters={this.state.selectedFilters}
                    maxDistance={this.state.maxDistance}
                    firebase={this.props.firebase}
                />
                {/* <FilterPopup setSelectedFilters={this.setSelectedFilters} /> */}
            </React.Fragment>
        );
    }
}
