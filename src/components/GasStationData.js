import React from 'react'
import { geolocated } from "react-geolocated";
import './styles/GasStationData.css'
import StationCalculation from "../data/StationCalculation";
import MapContainer from './Map.js'
import GasStationWrapper from '../data/GasStationWrapper';
import user from '../data/UserData';

import { withCookies } from 'react-cookie';

const debugData = [
    {
        station: 'Arco123',
        reg_price: 3.82,
        lat: 34.919967,
        lng: -117.339343,
        key: 'key-arco-iowa',
        id: 1000,
    },
    {
        station: 'Shell',
        reg_price: 4.00,
        lat: 34.075381,
        lng: -117.340335,
        key: 'key-shell-university',
        id: 2000,
    },
    {
        station: '76',
        reg_price: 4.12,
        lat: 33.983209,
        lng: -117.341269,
        key: 'key-76-blaine',
        id: 3000,
    },
    {
        station: 'Arco',
        price: 3.80,
        lat: 33.982567,
        lng: -117.341772,
        key: 'key-arco-blaine',
        id: 4000,
    },
    {
        station: 'Shell',
        price: 4.38,
        lat: 33.983350,
        lng: -117.340284,
        key: 'key-arco-iowa',
        id: 5000,
    },
    {
        station: 'Chevron',
        price: 4.20,
        lat: 33.955115,
        lng: -117.332514,
        key: 'key-chevron-canyoncrest',
        id: 6000,
    },
    {
        station: 'Mobil',
        price: 4.05,
        lat: 33.977036,
        lng: -117.336895,
        key: 'key-mobil-university',
        id: 7000,
    }
];


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

        const { cookies } = this.props;

        this.state = {
            stationsData: [],
            findClicked: false,
        };

        // Set user properties. If the user has not yet inputted their car data, we use the default values specified by
        // the UserData module.
        user.mpg = cookies.get('combMPG') || user.mpg;
        user.carID = cookies.get('carID') || user.carID;
        user.tankSize = cookies.get('tankSize') || user.tankSize;
        user.tankFill = cookies.get('tankFill') || user.tankFill;

        this.retrieveData = this.retrieveData.bind(this);
    }

    static mapStationNames(name) {

        switch(name) {

            case "1":
            return "7/11*";
            case "M":
            return "Mobil*";
            case "B":
            return "Arco*";
            default:
            return name;
        }
    }

    /** retrieveData
     * Handle the user clicking the FIND button.
     *
     * Gets the user's current location. Makes the API call to find gas station
     * data nearby. Stores data in the component's state.
     */
    retrieveData(){

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

        let allStationsRef = (this.props.firebase) ? this.props.firebase.getAllStationsRef() : null;

        function onData(data) {
            console.log('ON DATA CALLED');

            let allStationsRaw = data.val();
            let stationNames = new Set();

            // TODO: integrate StationCalculation::compareCost here
            //       in an anonymous function.
            //       Must be anonymous in order to receive more than 2 arguments.
            let allStationsArr = allStationsRaw.reduce((result, value) => {

                // If not all fields are valid,
                // don't push a GasStationWrapper.
                // In effect, this filters our data by stations
                // with all fields valid.
                if (value.station && value.reg_price && value.lat && value.lng && value.id) {

                    // Populate allStationsArr
                    result.push(new GasStationWrapper(
                        GasStationContainer.mapStationNames(value.station),
                        value.reg_price,
                        value.lat,
                        value.lng,
                        value.id
                        ));

                    // Populate stationNames
                    stationNames.add(GasStationContainer.mapStationNames(value.station));
                }

                return result;
            }, []);

            // Here, export stationNames to GasStationFilterContainer
            this.props.retrieveStationNames(Array.from(stationNames));


            this.setState({ stationsData: allStationsArr.slice()});
            this.setState({ findClicked: true});

        }

        onData = onData.bind(this);
        if (allStationsRef) {
            allStationsRef.on("value", onData);
        } else {
            // This executes only if firebase is null
            // Populatives list with hard-coded debug data
            let fiveStations = [];
            debugData.map((value) => {
                fiveStations.push(new GasStationWrapper(
                    value.station,
                    value.reg_price,
                    value.lat,
                    value.lng,
                    value.id
                ));
            });
            this.setState({stationsData: fiveStations});
            this.setState({findClicked: true});
        }

        return true;
    }

    sortData(stationsData) {
        //Todo: filter and sort array here
        let sc = new StationCalculation();  // TODO replace with compareCost once we have the info

        // Sort by price * distance
        let allStationsArr = stationsData.slice();
        allStationsArr.sort((stationA, stationB) => {

            // If the user inputted car options let's use the smart calculation.
            // Otherwise we'll use pure distance.
            // TODO: Put a switch statement here to let the user decide the type of calculation
            if (user.tankFill != -1 && user.mpg != -1 && user.tankSize != -1) {
                return sc.compareCostUser(stationA, stationB, user);
            }

            return sc.compareDistance(stationA, stationB, user.location);
        });

        return allStationsArr.slice(0,5);
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
                if (stationList[i].name && stationList[i].name === filterList[j]) {
                    filteredStationList.push(stationList[i])
                    break
                }
            }
        }
        return filteredStationList;
    }

    filterByDistance(stationList, maxDistance) {
        let sc = new StationCalculation();
        let filteredStationList = []
        for (let station of stationList) {
            if (sc.calcDistance(this.props.coords, station.coords) <= maxDistance) {
                filteredStationList.push(station)
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
        let filteredData = this.filterByDistance(this.state.stationsData, this.props.maxDistance);
        filteredData = this.filterByGasStationName(filteredData, this.props.selectedFilters);
        filteredData = this.sortData(filteredData);
        let mapStyle = {'height': '80vh', 'width': '90%'};

        return(
            <React.Fragment>
                <div className="container">
                   <div className="row">
                        <div className="col-sm">
                            <StationsList
                                name="Station List"
                                stationsData={filteredData}
                                coords={this.props.coords}
                                dataCall={this.retrieveData}

                            />
                       </div>
                        <div className="col-sm" style={mapStyle}>
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
    }

    dataRetrieved = false;
    render() {
        // First we have to put all of the <StationListItems> in an object so that we can output them all at once later.
        // We cannot use a loop inside the return statement.

        let sc = new StationCalculation();


        if(!this.dataRetrieved){
            if(this.props.dataCall()){
                this.dataRetrieved = true;
            }
          return null;
        }

        else {
            // First we have to put all of the <StationListItems> in an object so that we can output them all at once later.
            // We cannot use a loop inside the return statement.
            //const filterPopup = new FilterPopup();
            //const filteredData = filterPopup.filter(this.props.stationsData);
            //const stations = filteredData.map(stationData => {
            let sc = new StationCalculation();

            const stations = this.props.stationsData.map(stationData => {
                const stationPrice = Number.parseFloat(stationData.price).toFixed(2);
                const stationDistance = sc.calcDistance(user.location, stationData.coords).toFixed(2);
                const stationCost = sc.calcCostUser(stationData, user).toFixed(2);

                return (
                    <StationListItem
                        name={stationData.name}
                        price={stationPrice}
                        distance={stationDistance}
                        cost={stationCost}
                        key={stationData.key}
                    />
                );
            });

            return (
                <div className="StationListContainer">
                    <ol className="StationList">
                        {stations}
                    </ol>
                </div>
            );

        }
    }   //end Render()
}

/**
 * A list item containing the data for a nearby gas station.
 *
 * props: {
 *     key      {*}             The unique identifier for each the specified car.
 *     name     {string}        The name of the gas station
 *     price    {string}        The price per gallon of the gas station represented
 *                              as a string.
 *     distance {string}        The distance to the gas station in miles represented
 *                              as a string.
 *     cost     {string|null}   The total cost of filling the tank at the gas
 *                              station represented as a string.
 * }
 * state: none
 *
 * @param props {object}    The props object passed to this React component.
 * @returns {HTMLElement}   A <li> containing the station's name.
 */
class StationListItem extends React.Component {
    constructor(props) {
        super(props);
    }

    printCost() {
        if (this.props.cost < 0) {
            return <div/>
        }

        return <h6>${this.props.cost} to fill tank</h6>
    }

    render() {
        return (
            <li key={this.props.key}>
                <h2>{this.props.name}</h2>
                <h6>${this.props.price} per gallon</h6>
                <h6>{this.props.distance} miles away</h6>
                {this.printCost()}
            </li>
        );
    }
}



export default geolocated({
    positionOptions: {
        enableHighAccuracy: true,
    },
    userDecisionTimeout: 10000,
})(withCookies(GasStationContainer));


