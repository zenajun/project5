import React, {Component} from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';


class Map extends Component {
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);    
  }
  
  render() {
    const markers = this.props.markers || []
    console.log(markers);
    
    return (
      <GoogleMap
        defaultZoom={this.props.zoom}
        defaultCenter={this.props.center}>
        {markers.map((marker, index) => {
          <Marker
            position={this.props.geolocation} />
        }
        )}

        </GoogleMap>
    )
  }
}

export default withGoogleMap(Map);