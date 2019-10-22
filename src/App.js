import React from 'react';
import './App.css';

import FilterPopup from './components/FilterPopup';

class Welcome extends React.Component {
	render() {
		return <h1>Welcome, {this.props.name}</h1>;
	}
}


function App() {
  return (
    <div className="Hello-Text">
      Hello world 123 123
      <Welcome name="Edward" />
      <FilterPopup name="test" />
    </div>
  );
}

export default App;
