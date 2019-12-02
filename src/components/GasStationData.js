import React from 'react'
import { geolocated } from "react-geolocated";
import './styles/GasStationData.css'
import StationCalculation from "../data/StationCalculation";
import MapContainer from './Map.js'
import GasStationWrapper from '../data/GasStationWrapper';
import user from '../data/UserData';
import { UncontrolledCollapse } from 'reactstrap';

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
                if (value.station && value.reg_price && value.mid_price && value.pre_price && value.lat && value.lng && value.id) {
                    let name = GasStationContainer.mapStationNames(value.station);
                    const prices = {
                        regular: value.reg_price,
                        mid: value.mid_price,
                        premium: value.pre_price
                    };
                    const coords = {
                        latitude: value.lat,
                        longitude: value.lng
                    };
                    const gasStation = new GasStationWrapper(name, prices, coords, value.id);
                    result.push(gasStation);
                    // Populate allStationsArr
                    // result.push(new GasStationWrapper(
                    //     GasStationContainer.mapStationNames(value.station),
                    //     value.reg_price,
                    //     value.lat,
                    //     value.lng,
                    //     value.id
                    //     ));

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
                const prices = {
                    regular: value.reg_price,
                    mid: value.mid_price,
                    premium: value.pre_price
                };
                const coords = {
                    latitude: value.lat,
                    longitude: value.lng
                };
                const gasStation = new GasStationWrapper(value.station, prices, coords, value.id);
                fiveStations.push(gasStation);
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
            switch (this.props.calcFunctionSelected) {
                case "price":
                    return sc.comparePrice(stationA, stationB);
                case "distance":
                    return sc.compareDistance(stationA, stationB, user.location);
                case "smart":
                    return sc.compareCostUser(stationA, stationB, user);
                default:
                    return -1;
            }
        });

        return allStationsArr;
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

    filterByGasGrade(stationList, regular, mid, premium) {
        if (!regular && !mid && !premium) {
            return stationList;
        }

        let filteredStationList = [];
        for (let station of stationList) {
            const hasRegular = !regular || station.priceRegular != Infinity;
            const hasMid = !mid || station.priceMid != Infinity;
            const hasPremium = !premium || station.pricePremium != Infinity;
            if (hasRegular && hasMid && hasPremium) {
                filteredStationList.push(station);
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
        filteredData = this.filterByGasGrade(filteredData, this.props.gasGrades.regular, this.props.gasGrades.mid, this.props.gasGrades.premium);
        filteredData = this.sortData(filteredData).slice(0, 25);
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

            const stations = this.props.stationsData.map((stationData, index) => {
                const stationPrice = Number.parseFloat(stationData.priceRegular).toFixed(2);
                const stationDistance = sc.calcDistance(user.location, stationData.coords).toFixed(2);
                const stationCost = sc.calcCostUser(stationData, user).toFixed(2);

                return (
                    <StationListItem
                        name={stationData.name}
                        price={stationPrice}
                        distance={stationDistance}
                        cost={stationCost}
                        key={stationData.key}
                        station={stationData}
                        index={index}
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
 *     station  {object}        The station from which we will pull prices.
 *     index    {number}        The index of the element in the list.
 * }
 * state: none
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

    /**
     * Render the React component.
     *
     * @returns {HTMLElement}   A <li> containing the station's name.
     */
    render() {
        return (
            <li key={this.props.key}>
                <h2>{this.props.name}</h2>
                {/*<h6>${this.props.priceRegular} per gallon</h6>*/}
                <FuelPrices station={this.props.station}
                            index={this.props.index}/>
                <h6>{this.props.distance} miles away</h6>
                {this.printCost()}
            </li>
        );
    }
}

/**
 * A component that contains all fuel prices for the specified gas station.
 *
 * The regular price is always displayed, and the component expands to reveal
 * mid and premium prices when the regular price is clicked.
 *
 * props: {
 *     station  {object}    The gas station from which to pull prices.
 *     index    {number}    The index of the station in the list.
 * }
 *
 * state: none
 */
class FuelPrices extends React.Component {
    constructor(props) {
        super(props);
    }

    displayPrice(price) {
        if (price && !isNaN(price) && price != Infinity && price > 0) {
            return '$' + price + ' per gallon';
        }

        return 'N/A';
    }

    render() {
        return (
            <div>
                <h6 id={'reg_price_' + this.props.index}
                    className='FuelPriceCollapse'
                >
                    <strong>Unleaded</strong>: {this.displayPrice(this.props.station.priceRegular)}
                </h6>
                <UncontrolledCollapse toggler={'#reg_price_' + this.props.index}>
                    {/* TODO: Get other prices from station when they become available to us */}
                    <h6 id={'reg_price_' + this.props.index}
                        className='FuelPriceCollapse'
                    >
                        <strong>Unleaded Plus</strong>: {this.displayPrice(this.props.station.priceMid)}
                    </h6>
                    <h6 id={'reg_price_' + this.props.index}
                        className='FuelPriceCollapse'
                    >
                        <strong>Premium</strong>: {this.displayPrice(this.props.station.pricePremium)}
                    </h6>
                </UncontrolledCollapse>
            </div>
        );
    }
}



export default geolocated({
    positionOptions: {
        enableHighAccuracy: true,
    },
    userDecisionTimeout: 10000,
})(withCookies(GasStationContainer));


