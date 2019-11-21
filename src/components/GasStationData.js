import React from 'react'
import { geolocated } from "react-geolocated";
import './styles/GasStationData.css'
import FilterPopup from './FilterPopup.js'
import StationCalculation from "../data/StationCalculation";
import MapContainer from './Map.js'
import Firebase from './Firebase'
import GasStationWrapper from '../data/GasStationWrapper';
import user from '../data/UserData';


/**
 * A container to hold all other gas station data components.
 *
 * Handles functionality for clicking the find button and holds the data
 * returned from the API.
 *
 * props: none
 * state: {
 *     stationsData {Array} An array of objects containing the data for each gas
 *                          station nearby.
 * }
 */
class GasStationContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stationsData: [],
            findClicked: false,
        };

        this.retrieveData = this.retrieveData.bind(this);
    }

    /** retrieveData
     * Handle the user clicking the FIND button.
     *
     * Gets the user's current location. Makes the API call to find gas station
     * data nearby. Stores data in the component's state.
     */
    retrieveData(){
        // console.log('FIND Clicked');
        let sc = new StationCalculation();

        if(!this.props.isGeolocationAvailable ) {
            console.error('Browser not supported.');
            return false;
        } else if (!this.props.isGeolocationEnabled) {
            console.error('Location not enabled.');
            return false;
        } else if (!this.props.coords) {
            console.warn('Location not yet found. Try again in a moment.');
            return false;
        }

        // Set the user's location
        user.location.latitude = this.props.coords.latitude;
        user.location.longitude = this.props.coords.longitude;

        let allStationsRef = this.props.firebase.getAllStationsRef();

        function onData(data) {

            let allStationsRaw = data.val();

            // TODO: integrate StationCalculation::compareCost here
            //       in an anonymous function.
            //       Must be anonymous in order to receive more than 2 arguments.
            let allStationsArr = allStationsRaw.reduce((result, value) => {

                // If not all fields are valid,
                // don't push a GasStationWrapper.
                // In effect, this filters our data by stations
                // with all fields valid.
                if (value.station && value.reg_price && value.lat && value.lng && value.id)
                    result.push(new GasStationWrapper(
                        value.station,
                        value.reg_price,
                        value.lat,
                        value.lng,
                        value.id
                        ));

                return result;
            }, []);

            //Todo: filter and sort array here
            let sc = new StationCalculation();  // TODO replace with compareCost once we have the info

            // Sort by price * distance
            allStationsArr.sort((stationA, stationB) => {

                let stationA_PD = stationA.price * sc.calcDistance(stationA.coords, user.location);
                let stationB_PD = stationB.price * sc.calcDistance(stationB.coords, user.location);

                return Math.sign(stationA_PD - stationB_PD);

            });

            let fiveStations = allStationsArr.slice(0,5);

            this.setState({ stationsData: fiveStations});
            this.setState({findClicked: true});

        };
        onData = onData.bind(this);
        allStationsRef.on("value", onData);

        return true;
    }

    /**
     * Return the list of filtered gas stations.
     *
     * @returns {HTMLElement}   An <ol> containing StationListElements.
     */
    filterByGasStationName(stationList, filterList) {

        const filteredStationList = [];
        if (filterList == null || filterList.length < 1) {
            return stationList
        }

        for (let i = 0; i < stationList.length; i++) {
            for (let j = 0; j < filterList.length; j++) {
                if (stationList[i].name && stationList[i].name == filterList[j]) {
                    filteredStationList.push(stationList[i])
                    break
                }
            }
        }
        return filteredStationList;
    }

    /**
     * Render all components related to gas station data.
     *
     * @returns {HTMLElement}   The <div> containing all gas station data
     *                          related components.
     */
    render() {
        let filteredData = this.filterByGasStationName(this.state.stationsData, this.props.selectedFilters);
        let mapStyle = {'height': '80vh'};
        
        return(
            <React.Fragment>
                <div className="container">
                   <div className="row">
                        <div className="col">
                            <StationsList
                                name="Station List"
                                stationsData={filteredData}
                                coords={this.props.coords}
                                dataCall={this.retrieveData}

                            />
                        </div>
                        <div className="col" style={mapStyle}>
                            <MapContainer
                                coords={this.props.coords}
                                stations={filteredData}
                                buttonClicked={this.state.findClicked}
                            />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

/**
 * The list of nearby gas stations.
 *
 * props: {
 *     stationsData  {Array} The nearby gas station data objects.
 * }
 * state: none
 */
class StationsList extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            dataRetrieved: false,
        }
    }


    render() {

        // console.log("GasStationData::render()");
        // console.log(this.props);
        // First we have to put all of the <StationListItems> in an object so that we can output them all at once later.
        // We cannot use a loop inside the return statement.
        //const filterPopup = new FilterPopup();
        //const filteredData = filterPopup.filter(this.props.stationsData);
        //const stations = filteredData.map(stationData => {
        let sc = new StationCalculation();


        if(!this.state.dataRetrieved){
            if(this.props.dataCall()){
                this.setState({dataRetrieved: true})
            }
        }

        if(this.state.dataRetrieved) {
            console.log("GasStationData::render()");
            console.log(this.props);
            // First we have to put all of the <StationListItems> in an object so that we can output them all at once later.
            // We cannot use a loop inside the return statement.
            //const filterPopup = new FilterPopup();
            //const filteredData = filterPopup.filter(this.props.stationsData);
            //const stations = filteredData.map(stationData => {
            let sc = new StationCalculation();

            //this.setState({stationsData: filteredData});
            const stations = this.props.stationsData.map(stationData => {
                return (
                    <StationListItem
                        value={stationData.name + ': $' + Number.parseFloat(stationData.price).toFixed(2) + '\n'
                        + sc.calcDistance(this.props.coords, stationData.coords).toFixed(2) + ' miles.'}
                        key={stationData.key}
                    />
                );
            });

            return (
                <div className="Centered">
                    <ol onClick={() => console.log('ASS')}>
                        {stations}
                    </ol>
                </div>
            );

        } else return null;
    }   //end Render()
}

/**
 * A list item containing the data for a nearby gas station.
 *
 * props: {
 *     key      {*}         The unique identifier for each the specified car.
 *     value    {string}    The name, and other gas station data.
 * }
 * state: none
 *
 * @param props {object}    The props object passed to this React component.
 * @returns {HTMLElement}   A <li> containing the station's name.
 */
function StationListItem(props) {
    return (
        <li key={props.key}>
            {props.value}
        </li>
    );
}



export default geolocated({
    positionOptions: {
        enableHighAccuracy: true,
    },
    userDecisionTimeout: 10000,
})(GasStationContainer);


