import React from 'react'
import {Map, GoogleApiWrapper, Marker, InfoWindow} from 'google-maps-react'
import StationCalculation from "../data/StationCalculation";
import './styles/Map.css'

//For testing purposes. This should be moved to a .css later. Probably.
const mapStyles ={
    width: '50%',
    height: '50%',
};

/**
 * A container to hold all other map data components.
 *
 * Handles functionality for clicking the markers and is responsible for properly rendering the map and
 *  the data contained at each location.
 *
 * props: stations: a list of the top five gas stations. coords: The GPS coordinates of the user
 * state: {
 *     activeMarker {Object} used to keep track of what the user last clicked on.
 *     activeStation {Object} Used to keep track of what station is located at the activeMarker
 *     infoOpen {boolean} Keeps tabs on whether a window should be open or not
 * }
 */
class MapContainer extends React.Component{
    constructor(props){
        super(props);
        this.state={
            activeMarker: {},
            activeStation: {},
            infoOpen: true,
        };
        this.handleMarkerClick = this.handleMarkerClick.bind(this);
    }
    /** handleClose
     * Clears the current activeMarker and activeStation so that we are no longer
     *  displaying the last marker that was clicked on. Sets infoOpen to false to
     *  close the current window so that a new one can be opened.
     *
     * @param  props (unused) - Got this from a tutorial. Sue me
     */
    handleClose = (props) =>{
        if(this.state.infoOpen){
            this.setState({infoOpen: false});
            this.setState({activeMarker: null});
            this.setState({activeStation: null});

        }
    }

    /** handleMarkerClick
     *
     *  Assigns the last marker clicked on to the activeMarker state, and assigns the corresponding stations
     *  to the activeStation state. Sets the infoOpen state to true so that the window can render.
     *
     * @param  props - Needed to get stations to set the activeStation
     * @param marker - Marker that was clicked on. Assigned to the activeMarker state for future reference
     * @param e - The click event. Currently unused.
     */
    handleMarkerClick = (props, marker, e) =>{
        console.log('Marker clicked!');

        this.setState({activeMarker: marker});
        this.setState({infoOpen: true});
        console.log(marker);
        this.setState({activeStation: this.props.stations[marker.id]});
        console.log(this.state.activeStation);

    }

    /** displayMarkers
     * Returns a map of markers corresponding to each station in the props.stations list to be used by the react
     *  renderer.
     */
    displayMarkers = () =>{
        return this.props.stations.map((station, index) => {
            return <Marker key={index}
                           id={index}
                           position={{
                lat: station.coords.latitude,
                lng: station.coords.longitude
            }}
                           onClick= {this.handleMarkerClick}/>
        })
    }


    /** displayWindow
     * Creates a popup window to be rendered on the last marker clicked on. The window displays
     *  the brand name, price and distance to the station.
     */
    displayWindow = () =>{
        if(this.state.infoOpen && this.state.activeStation) {
            let sc = new StationCalculation();
            return (<InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.infoOpen}
                    onClose={this.handleClose}
                >
                    <div className='PopupText'>
                        {console.log(this.state.activeStation)}
                        <h1 className='PopupHeader'> {this.state.activeStation.name} </h1>
                        <div>Price: ${Number.parseFloat(this.state.activeStation.price).toFixed(2)}</div>
                        <div>Distance: {sc.calcDistance(this.props.coords, this.state.activeStation.coords).toFixed(2)} miles.</div>
                    </div>
                </InfoWindow>
            );
        }
        else{
            return null
        }
    }

    render() {
        if(this.props.buttonClicked && this.props.coords) {
            return (
                <Map
                    google={this.props.google}
                    zoom={13} //13 seems to be the best default value for initial zoom
                    style={mapStyles}
                    initialCenter={{
                        lat: this.props.coords.latitude,
                        lng: this.props.coords.longitude,
                    }}
                    >
                    {this.displayMarkers()}
                    {this.displayWindow()}

                </Map>
            );
        }
        else{
            return null
        }
    }

}

/*
{this.displayWindow()}
this.handleMarkerClick(station.coords)
 */

export default GoogleApiWrapper({
    apiKey:'AIzaSyBKdUXDjhwy0AbK1OjnBbuwE8DfjZ9dFtg'
})(MapContainer);