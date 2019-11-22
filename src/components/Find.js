import React from 'react';
import GasStationContainer from "./GasStationData";
import GasStationFilterContainer from "./GasStationFilterContainer";

const Find = (props) => (
	<React.Fragment>
		<GasStationFilterContainer firebase={props.firebase}/>
	</React.Fragment>
)

export default Find;
