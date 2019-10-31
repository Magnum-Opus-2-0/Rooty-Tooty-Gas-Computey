import React from 'react'
import { geolocated } from "react-geolocated";
import './styles/GasStationData.css'
import FilterPopup from './FilterPopup.js'
import StationCalculation from "./StationCalculation";
import MapContainer from './Map.js'

/**
 * A placeholder object of gas station data until we can get data using an API.
 *
 * @type {Array}
 */
const debugGasData = [
    {
        name: 'Arco',
        price: 3.82,
        coords: {
            latitude: 33.976067,
            longitude: -117.339343
        },
        key: 'key-arco-iowa',
    },
    {
        name: 'Shell',
        price: 4.00,
        coords: {
            latitude: 33.975381,
            longitude: -117.340335
        },
        key: 'key-shell-university',
    },
    {
        name: '76',
        price: 4.12,
        coords: {
            latitude: 33.983209,
            longitude: -117.341269
        },
        key: 'key-76-blaine',
    },
    {
        name: 'Arco',
        price: 3.80,
        coords: {
            latitude: 33.982567,
            longitude: -117.341772
        },
        key: 'key-arco-blaine',
    },
    {
        name: 'Shell',
        price: 4.38,
        coords: {
            latitude: 33.983350,
            longitude: -117.340284
        },
        key: 'key-arco-iowa',
    },
    {
        name: 'Chevron',
        price: 4.20,
        coords: {
            latitude: 33.955115,
            longitude: -117.332514
        },
        key: 'key-chevron-canyoncrest',
    },
    {
        name: 'Mobil',
        price: 4.05,
        coords: {
            latitude: 33.977036,
            longitude: -117.336895
        },
        key: 'key-mobil-university',
    }];

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
        };
        
        this.handleClick = this.handleClick.bind(this);

        this.props.selectedFilters = ['a', 'b', 'c'];
    }

    getTopFiveStations(stationsList) {
        stationsList.sort()
    }

    /**
     * Handle the user clicking the FIND button.
     *
     * Gets the user's current location. Makes the API call to find gas station
     * data nearby. Stores data in the component's state.
     */
    handleClick() {
        console.log('FIND Clicked');
        let sc = new StationCalculation();

        if(!this.props.isGeolocationAvailable ) {
            console.error('Browser not supported.');
            return;
        } else if (!this.props.isGeolocationEnabled) {
            console.error('Location not enabled.');
            return;
        } else if (!this.props.coords) {
            console.warn('Location not yet found. Try again in a moment.');
            return;
        }
        // Todo: Access Gas Station API
        // Just for now let's use the debug data to see our top 5 stations
        console.log('Longitude: ' + this.props.coords.longitude);
        console.log('Latitude: ' + this.props.coords.latitude);

        const allStations = debugGasData.slice();
        // Todo: Call filter function on this
        const filteredStations = allStations.slice();
        const topFiveStations = filteredStations.slice().sort(sc.comparePrice).slice(0, 5);

        this.setState({stationsData: topFiveStations});
    }

    /**
     * Render all components related to gas station data.
     *
     * @returns {HTMLElement}   The <div> containing all gas station data
     *                          related components.
     */
    render() {
        return(
            <div className="GasStationContainer">
                <div className="Centered">
                    <FindStations
                        name="Find Button"
                        onClick={this.handleClick}
                    />
                </div>
                <StationsList
                    name="Station List"
                    stationsData={this.state.stationsData}
                    coords={this.props.coords}
                    selectedFilters={this.props.selectedFilters}
                />
                <MapContainer
                    coords={this.props.coords}
                    stations={this.state.stationsData}
                />
            </div>
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
    }

    /**
     * Render the list of gas stations.
     *
     * @returns {HTMLElement}   An <ol> containing StationListElements.
     */
    render() {
        console.log("GasStationData::render()");
        console.log(this.props);
        // First we have to put all of the <StationListItems> in an object so that we can output them all at once later.
        // We cannot use a loop inside the return statement.
        //const filterPopup = new FilterPopup();
        //const filteredData = filterPopup.filter(this.props.stationsData);
        //const stations = filteredData.map(stationData => {
        let sc = new StationCalculation();

        let filterPopup = new FilterPopup();
        let filteredData = filterPopup.filter(this.props.stationsData, this.props.selectedFilters);
        this.props.stationsData = filteredData;

        const stations = this.props.stationsData.map(stationData => {
            return (
                <StationListItem
                    value={stationData.name + ': $' + stationData.price.toFixed(2) + '\n'
                    + sc.calcDistance(this.props.coords, stationData.coords).toFixed(2) + ' miles.'}
                    key={stationData.key}
                />
            );
        });

        return (
            <div className="Centered">
                <ol>
                    {stations}
                </ol>
            </div>
        );
    }
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

/**
 * A button that finds nearby gas stations.
 *
 * props: {
 *     onClick  {function}  The click handler function.
 * }
 * state: none
 *
 * @param props {object}    The props object passed to this React component.
 * @returns {HTMLElement}   A <button> with the text "FIND".
 */
function FindStations(props) {
    return (
        <button
            onClick={props.onClick}
        >
            FIND
        </button>
    );
}
export default geolocated({
    positionOptions: {
        enableHighAccuracy: true,
    },
    userDecisionTimeout: 10000,
})(GasStationContainer);


