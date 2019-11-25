import React, { Component } from 'react';
import Layout from "./Layout"
import { Form, FormGroup, Label, Input, Col } from 'reactstrap';
import FuelEconomyGov from '../data/FuelEconomyGov';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import './styles/CarOptions.css'
import Tooltip from 'rc-tooltip';
import InputNumber from "rc-input-number";
import 'rc-input-number/assets/index.css'
import { withCookies } from 'react-cookie';

const FuelEconomy = new FuelEconomyGov();

// Currently the only options we need are to set the path to the root so cookies are accessible to all modules/pages.
const cookiesOptions = { path: '/' };

class DropdownMenu extends Component {
    constructor(props) {
        super(props);

        const { cookies } = this.props;

        if (cookies.get('tankFill') === undefined) {
            cookies.set('tankFill', .5, cookiesOptions);
        }
        if (!cookies.get('option')) {
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

        } else {
            let year = cookies.get('year');
            let make = cookies.get('make');
            let model = cookies.get('model');
            let option = cookies.get('option');

            this.state = {
                currentYear: year,
                make: FuelEconomy.fetchMakesBy(year).map((make) => {return <option>{make}</option>}),
                currentMake: make,
                model: FuelEconomy.fetchModelsBy(year, make).map((model) => {return <option>{model}</option>}),
                currentModel: model,
                option: FuelEconomy.fetchOptionsBy(year, make, model).map((option) => {return <option>{option.opt}</option>}),
                currentOption: option,
                carCityMPG: cookies.get('cityMPG'),
                carHWMPG: cookies.get('highwayMPG'),
                userInputTank: 0,
                id: [],
                currentID: cookies.get('carID'),
                currentCar: null,
                optionState: null
            };
        }

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

    // handleInput(props) {

    // }

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
          <Layout>
            <div className="userform">
                <h4>Please input your car</h4>
                <br />
                {/* <Form onSubmit={this.handleSubmit}> */}
                    <FormGroup row>
                        <Label for="exampleSelect" sm={2}>Select year</Label>
                        <Col sm={10}>
                            <Input type="select"
                                   name="select-years"
                                   id="exampleSelect"
                                   onChange={this.yearChange}
                                   defaultValue={this.state.currentID ? this.state.currentYear : ' '}
                            >
                                {years}
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="exampleSelect" sm={2}>Select make</Label>
                        <Col sm={10}>
                            <Input type="select"
                                   name="select-makes"
                                   id="exampleSelect"
                                   onChange={this.makeChange}
                                   defaultValue={this.state.currentID ? this.state.currentMake : ' '}
                            >
                                {this.state.make}
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="exampleSelect" sm={2}>Select model</Label>
                        <Col sm={10}>
                            <Input type="select"
                                   name="select-models"
                                   id="exampleSelect"
                                   onChange={this.modelChange}
                                   defaultValue={this.state.currentID ? this.state.currentModel : ' '}
                            >
                                {this.state.model}
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="exampleSelect" sm={2}>Select options</Label>
                        <Col sm={10}>
                            <Input type="select"
                                   name="select-options"
                                   id="exampleSelect"
                                   onChange={this.optionChange}
                                   defaultValue={this.state.currentID ? this.state.currentOption : ' '}
                            >
                                {this.state.option}
                            </Input>
                        </Col>
                    </FormGroup>
                    <h6 className="mpgtext">{this.carToString()}</h6>
                    <br />
                    <h6 className="tankfilltext">
                    Tank Fill:
                    </h6>
                    <div style={wrapperStyle}>
                        <Slider min={0}
                                max={100}
                                defaultValue={50}
                                step={10}
                                mobile={true}
                                handle={this.handleSlider}
                                // When we change the slider, save the user's tank fill to cookies
                                onAfterChange={(value) => { cookies.set('tankFill', value / 100.0, cookiesOptions); }}
                        />
                    </div>
                    <br />
                    <h6 className="tanksizetext">
                    Tank Size:
                    </h6>
                    <div>
                        <InputNumber
                            min={0}
                            max={30}
                            style={{ width: 100}}
                            step={1}
                            onChange={(value) => { cookies.set('tankSize', value, cookiesOptions);}}
                            mobile={true}
                        />
                    </div>
                 {/* </Form> */}
               </div>
            </Layout>
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
        cookies.set('option', this.state.currentOption, cookiesOptions);
        cookies.set('combMPG', this.state.currentCar.comb08, cookiesOptions);
        cookies.set('highwayMPG', this.state.currentCar.highway08, cookiesOptions);
        cookies.set('cityMPG', this.state.currentCar.city08, cookiesOptions);
        cookies.set('carID', this.state.currentID, cookiesOptions);
        cookies.set('fuelType', this.state.currentCar.fuelType, cookiesOptions);
    }

    /**
     * Generates a string that represents the user's car.
     *
     * Loads the car data from cookies, so that it will still be there when the
     * user revisits the page.
     *
     * @returns {string}    The car data as a string, if the user has chosen a car.
     *                      Otherwise, the fields appear as N/A.
     */
    carToString() {
        const { cookies } = this.props;

        let city = cookies.get('cityMPG') || 'N/A';
        let highway = cookies.get('highwayMPG') || 'N/A';
        let fuelType = cookies.get('fuelType') || 'N/A';

        return '\nCity MPG: ' + city + '\nHighway MPG: ' + highway + '\n\nRecommended fuel type: ' + fuelType;
    }

    preLoadCarInfo() {
        const { cookies } = this.props;

        let year = cookies.get('year');
        let make = cookies.get('make');
        let model = cookies.get('model');
        let option = cookies.get('option');

        if (option) {
            this.setState({
                make: FuelEconomy.fetchMakesBy(year).map((make) => {return <option>{make}</option>}),
                model: FuelEconomy.fetchModelsBy(year, make).map((model) => {return <option>{model}</option>}),
                option: FuelEconomy.fetchOptionsBy(year, make, model).map((option) => {return <option>{option.opt}</option>})
            }, () => {
                console.log(this.state.make);
            });
        }
    }
}

export default withCookies(DropdownMenu);
