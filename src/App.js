import React from 'react';
import './App.css';

import GasStationContainer from './components/GasStationData.js'
import CarInfo from "./components/CarInfo";

class Welcome extends React.Component {
	render() {
		return <h1>Welcome, {this.props.name}</h1>;
	}
}


function App() {
  return (
    <div className="TopLevelDiv">
        <GasStationContainer/>
        <CarInfo/>
    </div>

  );
}

export default App;
