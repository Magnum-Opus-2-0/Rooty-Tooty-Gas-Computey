import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Col } from 'reactstrap';
import FuelEconomyGov from '../data/FuelEconomyGov';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import './styles/CarOptions.css'
import Tooltip from 'rc-tooltip';
import { withCookies } from 'react-cookie';

const FuelEconomy = new FuelEconomyGov();

// Currently the only options we need are to set the path to the root so cookies are accessible to all modules/pages.
const cookiesOptions = { path: '/' };

class DropdownMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentYear: "",
            make: [],
            currentMake: "",
            model: [],
            currentModel: "",
            option: [],
            optionText: [],
            currentOption: "",
            carCityMPG: "",
            carHWMPG: "",
            userInputTank: 0,
            id: [],
            currentID: "",
            currentCar: null,
            optionState: null,
        };

        this.yearChange = this.yearChange.bind(this);
        this.makeChange = this.makeChange.bind(this);
        this.modelChange = this.modelChange.bind(this);
        this.optionChange = this.optionChange.bind(this);
        // this.handleSlider = this.handleSlider.bind(this);
    }

    /**
    *   Passes in the event which is the year selected
    *   Saves the year to the state currentYear
    *   Calls fetchMakesBy which passes in currentYear
    *   @returns {HTMLElement} A <option> containing car makes
    */
    yearChange(event) {
        // When user selects multiple fields but decides to select another year
        // This.setState will clear the make, model, and option dropdown menu
        this.setState({
            make: <option></option>,
            model: <option></option>,
            option: <option></option>
        });
        // console.log("Year selected")
        this.setState({ currentYear: event.target.value }, () => {
            let make = FuelEconomy.fetchMakesBy(this.state.currentYear);
            // Adds one or more elements to the beginning of an array and returns the new length of the array
            make.unshift("");
            this.setState({
                make: make.map(make => {
                    return (
                        <option>
                            {make}
                        </option>
                    );
                })
            });
        });
    }

    /**
    *   Passes in the event which is the make selected
    *   Saves the make to the state currentMake
    *   Calls fetchModelsBy which passes in currentYear and currentMake
    *   @returns {HTMLElement} A <option> containing car models
    */
    makeChange(event) {
        // When user selects multiple fields but decides to select another make
        // This.setState will clear model and option dropdown menu
        this.setState({
            model: <option></option>,
            option: <option></option>
        });
        // console.log("Make selected")
        this.setState({ currentMake: event.target.value }, () => {
            let model = FuelEconomy.fetchModelsBy(this.state.currentYear, this.state.currentMake);
            // Adds one or more elements to the beginning of an array and returns the new length of the array
            model.unshift("");
            this.setState({
                model: model.map(model => {
                    return (
                        <option>
                            {model}
                        </option>
                    );
                })
            });
        });

    }

    /**
    *   Passes in the event which is the model selected
    *   Saves the model to the state currentModel
    *   Calls fetchOptionsBy which passes in currentYear, currentMake, currentModel
    *   Maps the car id to state id [] based on available options
    *   Ex: Array [ " ", 39557 ]
    *   Maps the car opt to state optionText [] based on available options
    *   Ex: Array [ " ", "Auto (AM-S8), 4 cyl, 2.4 L" ]
    *   @returns {HTMLElement} A <option> containing car options
    */

    modelChange(event) {
        // When user selects multiple fields but decides to select another model
        // This.setState will clear the option dropdown menu
        this.setState({
            option: <option></option>
        });
        // console.log("Model selected")
        this.setState({ currentModel: event.target.value }, () => {
            let option = FuelEconomy.fetchOptionsBy(this.state.currentYear, this.state.currentMake, this.state.currentModel)
            // Adds one or more elements to the beginning of an array and returns the new length of the array
            option.unshift("")
            this.setState({
                id: option.map(option => {
                    return option.id ? option.id: " "

                }),
                optionText: option.map(option => {
                    return option.opt ? option.opt : " "

                }),
                option: option.map(option => {
                    return (
                        <option>
                            {option.opt}
                        </option>
                    );
                })
            }, () => {
                    // console.log(this.state.id)
                    // console.log(this.state.optionText)
            });
        });
    }

    /**
    *   Passes in the event which is the option selected
    *   Saves the option to the state currentOption
    *   Saves the id to the state currentID
    *   Calls fetchCarBy which passes in currentID
    */
    optionChange(event) {
        this.setState({ currentOption: event.target.value }, () => {
            this.setState({
                currentID: this.state.id[this.state.optionText.indexOf(this.state.currentOption)]

            }, () => {
                    // console.log("Button clicked")
                    if (this.state.currentID) {
                        this.setState({
                            currentCar: FuelEconomy.fetchCarBy(this.state.currentID),
                        }, () => {
                            //console.log(this.state.currentCar)

                            // Save the car data only after the user gone through all the drop downs
                            this.saveCarData();
                        });
                    }
            });
        });
    }

    handleSlider(props) {
        const { value, dragging, index, ...restProps } = props;

        return (
            <Tooltip
                prefixCls="rc-slider-tooltip"
                overlay={value + '%'}
                visible={dragging}
                placement="top"
                key={index}
            >
                <Slider.Handle value={value} {...restProps} />
            </Tooltip>
        );
    };

    /**
     *  Renders the list of car years
     *
     *  @returns {HTMLElement} An <option> containing car years
    */
    render() {
        const { cookies } = this.props;

        const wrapperStyle = { width: 400 };
        // const { inputValue } = this.state;
        let years = FuelEconomy.fetchYears();
        // Adds one or more elements to the beginning of an array and returns the new length of the array
        years.unshift("");
        years = years.map(year => {
            return (
                <option>
                    {year}
                </option>
            );
        });

        return (
            <div className="userform">
                <h4>Please input your car</h4>
                <br />
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup row>
                        <Label for="exampleSelect" sm={2}>Select year</Label>
                        <Col sm={10}>
                            <Input type="select" name="select" id="exampleSelect" onChange={this.yearChange}>
                                {years}
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="exampleSelect" sm={2}>Select make</Label>
                        <Col sm={10}>
                            <Input type="select" name="select" id="exampleSelect" onChange={this.makeChange}>
                                {this.state.make}
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="exampleSelect" sm={2}>Select model</Label>
                        <Col sm={10}>
                            <Input type="select" name="select" id="exampleSelect" onChange={this.modelChange}>
                                {this.state.model}
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="exampleSelect" sm={2}>Select options</Label>
                        <Col sm={10}>
                            <Input type="select" name="select" id="exampleSelect" onChange={this.optionChange}>
                                {this.state.option}
                            </Input>
                        </Col>
                    </FormGroup>
                    <h6 className="mpgtext">
                        City MPG: {this.state.currentCar ? this.state.currentCar["city08"] : "N/A"}
                    </h6>
                    <h6 className="mpgtext">
                        Highway MPG: {this.state.currentCar ? this.state.currentCar["highway08"] : "N/A"}
                    </h6>
                    <br />
                    <h6 className="mpgtext">
                    Car Tank:
                    </h6>
                    <div style={wrapperStyle}>
                        <Slider min={0}
                                max={100}
                                defaultValue={50}
                                step={10}
                                handle={this.handleSlider}
                                // When we change the slider, save the user's tank fill to cookies
                                onAfterChange={(value) => { cookies.set('tankFill', value / 100.0, cookiesOptions); }}/>
                    </div>
                </Form>
            </div>
        );
    }

    /**
     * Save the user's car data to cookies.
     *
     * Data saved: year, make, model, option, combined mpg and car id
     */
    saveCarData() {
        // Make cookies available to this function
        const { cookies } = this.props;

        // Save all of the car data at once, so that we don't have mismatched data if the user doesn't finish choosing
        // their car from the dropdowns
        cookies.set('year', this.state.currentYear, cookiesOptions);
        cookies.set('make', this.state.currentMake, cookiesOptions);
        cookies.set('model', this.state.currentModel, cookiesOptions);
        cookies.set('mpg', this.state.currentCar.comb08, cookiesOptions);
        cookies.set('carID', this.state.currentID, cookiesOptions);
        cookies.set('option', this.state.currentOption, cookiesOptions);
    }
}

export default withCookies(DropdownMenu);
