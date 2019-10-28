import React from 'react';

class CarInfo extends React.Component {
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
}

export default CarInfo;