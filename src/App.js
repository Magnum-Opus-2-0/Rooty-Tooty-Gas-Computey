import React from 'react';
import './App.css';

import GasStationContainer from './components/GasStationData.js'

class Welcome extends React.Component {
	render() {
		return <h1>Welcome, {this.props.name}</h1>;
	}
}


function App() {
  return (
    <div className="TopLevelDiv">
        <GasStationContainer/>
    </div>
  );
}

export default App;
