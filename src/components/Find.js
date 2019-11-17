import React from 'react';
import GasStationContainer from "./GasStationData";
import GasStationFilterContainer from "./GasStationFilterContainer";

const Find = (props) => (
    <GasStationFilterContainer firebase={props.firebase} />
)

export default Find;
