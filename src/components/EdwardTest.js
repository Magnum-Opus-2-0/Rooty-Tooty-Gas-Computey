import React from 'react';

export default class TestParentA extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selection : null
        }
        //this.setSelection = this.setSelection.bind(this)
    }

    setSelection(event) {
        console.log("TestParentA::setSelection() --> " + event.target.value)
        this.setState({selection : event.target.value})
    }

    render() {
        console.log("TestParentA::render()")
        return (
            <div>
                <p>I am test Parent A</p>
                <TestChildA selectionHandler={(event) => this.setSelection(event)} />
                <TestChildB selection={this.state.selection} />
                {this.props.children}
            </div>
        );
    }
}

class TestChildA extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selection : null,
            filters : ['Arco', 'Shell', 'Chevron', 'Mobil']
        }
    }

    render() {
        console.log("TestChildA::render()")
        const options = this.state.filters.map((filter) => 
            <option onClick={this.props.selectionHandler} value={filter}>{filter}</option>
        );
        return (
            <div>
                <div>I am child A</div>
                <select>
                    {options}
                </select>
            </div>
        );
    }
}

class TestChildB extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        console.log("TestChildB::render() --> " + this.props.selection)
        return (
            <div>
                I am child B : {this.props.selection}                
            </div>
        );
    }
}