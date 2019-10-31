import React from 'react'
import {Map, GoogleApiWrapper, Marker} from 'google-maps-react'

//For testing purposes. This should be moved to a .css later. Probably.
const mapStyles ={
    width: '100%',
    height: '100%',
};


class MapContainer extends React.Component{
    constructor(props){
        super(props);

    }

    displayMarkers = () =>{
        return this.props.stations.map((station, index) => {
            return <Marker key={index} id={index} position={{
                lat: station.coords.latitude,
                lng: station.coords.longitude
            }}
                           onClick={() => console.log("You clicked me!")} />
        })
    }

    render() {
        if(this.props.coords) {
            return (
                <Map
                    google={this.props.google}
                    zoom={13} //13 seems to be the best default value for initial zoom
                    style={mapStyles}
                    initialCenter={{
                        lat: this.props.coords.latitude,
                        lng: this.props.coords.longitude,
                    }} // TODO: Get value from actual user data.
                    >
                    {this.displayMarkers()}
                </Map>
            );
        }
    }
}

export default GoogleApiWrapper({
    apiKey:'AIzaSyBKdUXDjhwy0AbK1OjnBbuwE8DfjZ9dFtg'
})(MapContainer);