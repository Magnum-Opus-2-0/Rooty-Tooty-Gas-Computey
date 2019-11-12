import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Col } from 'reactstrap';
import FuelEconomyGov from '../data/FuelEconomyGov';

const FuelEconomy = new FuelEconomyGov();

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
            id: [],
            currentID: "",
            currentCar: null,
            optionState: null
        };

        this.yearChange = this.yearChange.bind(this);
        this.makeChange = this.makeChange.bind(this);
        this.modelChange = this.modelChange.bind(this);
        this.optionChange = this.optionChange.bind(this);
    }

    yearChange(event) {
        this.setState({
            make: <option></option>,
            model: <option></option>,
            option: <option></option>
        });
        // console.log("Year selected")
        this.setState({ currentYear: event.target.value }, () => {
            let make = FuelEconomy.fetchMakesBy(this.state.currentYear);
            make.unshift("")
            this.setState({
                make: make.map(make => {
                    return (
                        <option>
                            {make}
                        </option>
                    );
                })
            })
            // console.log(this.state.currentYear)
        });
    }

    makeChange(event) {
        this.setState({
            model: <option></option>,
            option: <option></option>
        });
        // console.log("Make selected")
        this.setState({ currentMake: event.target.value }, () => {
            let model = FuelEconomy.fetchModelsBy(this.state.currentYear, this.state.currentMake);
            model.unshift("")
            this.setState({
                model: model.map(model => {
                    return (
                        <option>
                            {model}
                        </option>
                    );
                })
            })
            // console.log(this.state.currentMake)
        });

    }

    modelChange(event) {
        this.setState({
            option: <option></option>
        });
        // console.log("Model selected")
        this.setState({ currentModel: event.target.value }, () => {
            let option = FuelEconomy.fetchOptionsBy(this.state.currentYear, this.state.currentMake, this.state.currentModel)
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
            })
            // console.log(this.state.currentModel)
        });
    }

    optionChange(event) {
        // console.log("Option selected")
        this.setState({ currentOption: event.target.value }, () => {
            this.setState({

                currentID: this.state.id[this.state.optionText.indexOf(this.state.currentOption)]

            }, () => {
                    // console.log("Button clicked")
                    if (this.state.currentID) {
                        this.setState({
                            currentCar: FuelEconomy.fetchCarBy(this.state.currentID)
                        }, () => {
                            // console.log(this.state.currentCar)
                        })
                    }
            })

        });
    }

    render() {

        let years = FuelEconomy.fetchYears();
        years.unshift("");
        years = years.map(year => {
            return (
                <option>
                    {year}
                </option>
            );
        })

        return (
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
            </Form>
        );
    }
}

export default DropdownMenu;
