import React from 'react'
import {Map, GoogleApiWrapper} from 'google-maps-react'

//For testing purposes. This should be moved to a .css later. Probably.
const mapStyles ={
    width: '100%',
    height: '100%',
};


class MapContainer extends React.Component{
    constructor(props){
        super(props)
    }

    render() {
        return(
            <Map
                google={this.props.google}
                zoom={13} //13 seems to be the best default value for initial zoom
                style={mapStyles}
                initialCenter={{lat: 33.9760506, lng: -117.32105179999999}} //TODO: Get value from actual user data.
                />
        );
    }
}

export default GoogleApiWrapper({
    apiKey:'AIzaSyBKdUXDjhwy0AbK1OjnBbuwE8DfjZ9dFtg'
})(MapContainer);