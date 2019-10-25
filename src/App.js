import React from 'react';
import './App.css';

<<<<<<< HEAD
import FilterPopup from './components/FilterPopup';
import CarInfo from './components/CarInfo';
=======
import GasStationContainer from './components/GasStationData.js'
>>>>>>> master

class Welcome extends React.Component {
	render() {
		return <h1>Welcome, {this.props.name}</h1>;
	}
}

function App() {
  return (
<<<<<<< HEAD
    <div className="Hello-Text">
      Hello world 123 123
      <Welcome name="Edward" />
      <FilterPopup name="test" />
      <CarInfo />
=======
    <div className="TopLevelDiv">
        <GasStationContainer/>
>>>>>>> master
    </div>
  );
}

export default App;
