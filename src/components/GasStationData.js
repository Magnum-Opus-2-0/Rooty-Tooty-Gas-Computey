import React from 'react'
import './styles/GasStationData.css'

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
    }

    /**
     * Handle the user clicking the FIND button.
     *
     * Gets the user's current location. Makes the API call to find gas station
     * data nearby. Stores data in the component's state.
     */
    handleClick() {
        console.log('FIND Clicked');
        // Todo: Get location
        // Todo: Access Gas Station API
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
                    stationsData={
                        /*this.state.stationsData*/
                        [
                            {
                                name: 'Arco',
                                key: 'unique-arco',
                            },
                            {
                                name: 'Chevron',
                                key: 'unique-chevron',
                            },
                            {
                                name: 'Texaco',
                                key: 'unique-texaco',
                            },
                            {
                                name: 'Mobil',
                                key: 'unique-mobile',
                            }
                        ]
                    }
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
        // First we have to put all of the <StationListItems> in an object so that we can output them all at once later.
        // We cannot use a loop inside the return statement.
        const stations = this.props.stationsData.map(stationData => {
            return (
                <StationListItem
                    value={stationData.name}
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

export default GasStationContainer
