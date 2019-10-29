import React from 'react';
import './styles/CarInfo.css'

/*class CarInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: null,
            year: null,
            make: null,
            model: null,
            mpg: null,
        };

    };

    render() {
        return(
          <div>
              Your car's MPG is {this.state.mpg}
          </div>
        );
    }
}*/

class DropdownMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        year: ['','2020', '2019', '2018', '2017', '2016'],
        make: ['','Honda', 'Jaguar', 'Nissan', 'Ford', 'Chevy'],
        model: ['','Accord', 'Corolla', 'Leaf', 'Raptor', 'F-Type']
    };

    this.handleChange = this.handleChange.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
    <div class="DropdownMenu">
      <form onSubmit={this.handleSubmit}>
        <label>
          Select your car's year:
          <select> 
            {this.state.year.map(list => (
                <option key={list} value={list}>
                    {list}
                </option>
            ))}
          </select>
        </label>
        <input type="submit" value="Submit" />
        <br />
        <label>
          Select your car's make:
          <select> 
            {this.state.make.map(list => (
                <option key={list} value={list}>
                    {list}
                </option>
            ))}
          </select>
        </label>
        <input type="submit" value="Submit" />
        <br />
        <label>
          Select your car's model:
          <select> 
            {this.state.model.map(list => (
                <option key={list} value={list}>
                {list}
                </option>
            ))}
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
    );
  }
}

// export default CarInfo;
export default DropdownMenu;