import React from 'react'
import {Map, GoogleApiWrapper, Marker, InfoWindow} from 'google-maps-react'
import './styles/Map.css'

//For testing purposes. This should be moved to a .css later. Probably.
const mapStyles ={
    width: '100%',
    height: '100%',
};


class MapContainer extends React.Component{
    constructor(props){
        super(props);
        this.state={
            activeMarker: {},
            infoOpen: true,
        };
        this.handleMarkerClick = this.handleMarkerClick.bind(this);
    }

    handleClose = (props) =>{
        if(this.state.infoOpen){
            this.setState({infoOpen: false});
            this.setState({activeMarker: null});

        }
    }

    handleMarkerClick = (props, marker, e) =>{
        console.log('Marker clicked!')

        if(this.state.activeMarker){
            this.setState({activeMarker: null});
            this.setState({infoOpen: false})
        }

        this.setState({activeMarker: marker})
        this.setState({infoOpen: true})

    }
    displayMarkers = () =>{
        return this.props.stations.map((station, index) => {
            return <Marker key={index}
                           id={index}
                           position={{
                lat: station.coords.latitude,
                lng: station.coords.longitude
            }}
                           onClick={this.handleMarkerClick}/>
        })
    }

    displayWindow = () =>{
        if(this.state.infoOpen) {
            return (<InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.infoOpen}
                    onClose={this.handleClose}
                >
                    <div className='PopupText'>
                        Hey! This should display some info!
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