import React from 'react';
import GasStationContainer from './GasStationData';
import {Nav, Navbar, Collapse} from 'reactstrap';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import {Button} from 'reactstrap';
import { Input, InputGroup, InputGroupText } from 'reactstrap';
import { withCookies } from 'react-cookie';

class GasStationFilterContainer extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedFilters: [],
            gasStationDropdownOpen: false,
            gasGradeDropdownOpen: false,
            gasCalcDropdownOpen: false,
            calcFunctionSelected: "price",
            smartFunctionDisabled: false,
            // availableFilters: ['Arco', 'Chevron', 'Texaco', 'Mobil', '76'],
            availableFilters: ['Sunoco', 'Xtramart', 'Shell'],
            filterButtons: [],
            maxDistance: 25,
            gasGradeRegular: true,
            gasGradeMid: true,
            gasGradePremium: true,
            filterOptions: []
        }

        this.setSelectedFilters = this.setSelectedFilters.bind(this)
        this.gasStationDropdownToggle = this.gasStationDropdownToggle.bind(this)
        this.gasGradeDropdownToggle = this.gasGradeDropdownToggle.bind(this)
        this.retrieveStationNames = this.retrieveStationNames.bind(this);
        this.gasCalcDropdownToggle = this.gasCalcDropdownToggle.bind(this);
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

    gasCalcDropdownToggle() {
        this.setState({gasCalcDropdownOpen: !this.state.gasCalcDropdownOpen})
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
        const distance = parseFloat(event.target.value);
        if (!isNaN(distance) && distance >= 0 && distance <= 9999) {
            this.setState({maxDistance: distance});
        } else if (event.target.value == "" || distance <= 0) {
            this.setState({maxDistance: 0});
        } else {
            this.setState({maxDistance: this.state.maxDistance});
        }
    }

    toggleCheckbox(event, gasGrade) {
        switch(gasGrade) {
            case 'regular':
                this.setState({gasGradeRegular: !this.state.gasGradeRegular})
                break
            case 'mid':
                this.setState({gasGradeMid: !this.state.gasGradeMid})
                break
            case 'premium':
                this.setState({gasGradePremium: !this.state.gasGradePremium})
                break
        }
    }

    selectComparisonFunction(event) {
        this.setState({calcFunctionSelected: event.target.value})
    }

    render() {
        const buttonGroupStyle = {'margin-left':'0.4em'}
        const { cookies } = this.props;
        const mpg = cookies.get('combMPG');
        const tankSize = cookies.get('tankSize');
        const tankFill = cookies.get('tankFill');
        let smartButtonDisabled = mpg === undefined || tankSize === undefined || tankFill === undefined;
        let dropdownName = '-----';
        if (this.state.calcFunctionSelected == "price") {
            dropdownName = 'Compare Price';
        } else if (this.state.calcFunctionSelected == "distance") {
            dropdownName = 'Compare Distance';
        } else if (this.state.calcFunctionSelected == "smart") {
            dropdownName = 'Smart Calculation';
        }
        return (
            <React.Fragment>
                {/* Navigation bar for the filters */}
                <Navbar color="light" light expand="md">
                    <Collapse isOpen={true} navbar>
                        <Nav>
                            <InputGroup>
                                {/* Calculation Switching */}
                                <Dropdown className="pr-2" isOpen={this.state.gasCalcDropdownOpen} toggle={this.gasCalcDropdownToggle} >
                                    <DropdownToggle caret>
                                        {dropdownName}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem onClick={(e) => this.selectComparisonFunction(e)} value="price">Compare Price</DropdownItem>
                                        <DropdownItem onClick={(e) => this.selectComparisonFunction(e)} value="distance">Compare Distance</DropdownItem>
                                        <DropdownItem onClick={(e) => this.selectComparisonFunction(e)} value="smart" disabled={smartButtonDisabled ? 'disabled' : null}>Smart Calculation</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                                {/* Gas grade filter */}
                                <Dropdown className="pr-2" isOpen={this.state.gasGradeDropdownOpen} toggle={this.gasGradeDropdownToggle} >
                                    <DropdownToggle caret> Gas Grade</DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem header>Gas stations must have</DropdownItem>
                                        <Input onClick={(e) => this.toggleCheckbox(e, 'regular')} addon type="checkbox" aria-label="Unleaded" checked={this.state.gasGradeRegular} /> Unleaded<br/>
                                        <Input onClick={(e) => this.toggleCheckbox(e, 'mid')} addon type="checkbox" aria-label="Unleaded Plus" checked={this.state.gasGradeMid} /> Unleaded Plus<br/>
                                        <Input onClick={(e) => this.toggleCheckbox(e, 'premium')} addon type="checkbox" aria-label="Premium" checked={this.state.gasGradePremium} /> Premium<br/>
                                    </DropdownMenu>
                                </Dropdown>
                                {/* Distance filter */}
                                <InputGroupText>Distance</InputGroupText>
                                <Input style={{'max-width':'15%'}} onChange={(e) => this.setMaxDistance(e)} type="number" min="0" max="9999" placeholder="in miles" value={this.state.maxDistance > 0 ? this.state.maxDistance : ""}></Input>
                                {/* Filter dropdown */}
                                <Dropdown className="pl-2"isOpen={this.state.gasStationDropdownOpen} toggle={this.gasStationDropdownToggle} >
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
                    calcFunctionSelected={this.state.calcFunctionSelected} 
                    gasGrades={{
                        regular: this.state.gasGradeRegular,
                        mid: this.state.gasGradeMid,
                        premium: this.state.gasGradePremium
                    }}
                />
                {/* <FilterPopup setSelectedFilters={this.setSelectedFilters} /> */}
            </React.Fragment>
        );
    }
}

export default withCookies(GasStationFilterContainer);

