import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import Header from './Header';
import Footer from './Footer';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import { compose, withProps } from 'recompose';
// import Map from './Map';


// import 
// google maps api key: AIzaSyCDY4rM7wJyPImzmpVBD2mrtH5tnolGEBo

// Initialize Firebase
const config = {
  apiKey: "AIzaSyCHX2hBMWitBPvti3SFbk_rsHGWMgUX4pI",
  authDomain: "react-dog-parks.firebaseapp.com",
  databaseURL: "https://react-dog-parks.firebaseio.com",
  projectId: "react-dog-parks",
  storageBucket: "react-dog-parks.appspot.com",
  messagingSenderId: "582459261551"
};
firebase.initializeApp(config);

class App extends React.Component {
  constructor() {
    super();    
    this.state = {
      name: '',
      address: '',
      geolocation: '',
      fen: false,
      cdw: false,
      sda: false
    }
    this.makeMarker = this.makeMarker.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  };
  
  componentDidMount() {
    const dbRef = firebase.database().ref();
      dbRef.on('value', (snapshot) => {
        const dogParks = snapshot.val();
        const parkGeolocation = []          
        
        // All dog parks
        // const fenced = dogParks.filter((dogPark) => {        
        //   const geoLat = dogPark.lat;
        //   const geoLng = dogPark.lng;
        //   const fenced = dogPark.fen;

        //   if (this.state.fen === false) {
        //    return dogPark.fen === true;
        //   } else {
        //     return dogPark.fen === false;
        //   }
        // });
        // console.log(fenced);
             
        // this.setState({
        //   geolocation: parkGeolocation
        // });   
        // console.log(this.state);        
      });   

  }


   

  makeMarker() {
    // Users current location
    navigator.geolocation.getCurrentPosition(function (position) {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      // console.log(userLat, userLng);
    });
    
    // 
    const geolocations = Array.from(this.state.geolocation);

    const MapWithAMarker = withScriptjs(withGoogleMap(props =>
      <GoogleMap
      defaultZoom={11}
      defaultCenter={{ lat: 43.731394, lng: -79.3575282}}
      >
   
      {        
        geolocations.map((location,i) => {
          // console.log(location);
          return (
            <Marker position={{ lat: location.geoLat, lng: location.geoLng }} 
            key={i} 
            onClick={props.onToggleOpen}
            >
            {props.isOpen && <InfoWindow onCloseClick={props.onToggleOpen}>
                <FaAnchor />
              </InfoWindow>}
            </Marker>
          )        
        })
      }        
      </GoogleMap>     
    ));
    
    return (
      <MapWithAMarker
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: '100%' }} />}
          containerElement={<div style={{ height: '75vh' }} />}
          mapElement={<div style={{ height: '100%' }} />} />
    )    
  }
  handleRadioChange(e) {
    // console.log(e.target.value);    
  }

  handleChange(e) {     
    this.setState({
      [e.target.name]: e.target.value === 'false' ? true: false
    });
    const geolocations = Array.from(this.state.geolocation);
    
    const dbRef = firebase.database().ref();
    dbRef.on('value', (snapshot) => {
      const dogParks = snapshot.val();
      const parkGeolocation = []          
      
      // All dog parks
      const fenced = dogParks.filter((dogPark) => {        
        // const fenced = dogPark.fen;
        
        if (this.state.fen === false) {
          return dogPark.fen === true;
        } else {
          return dogPark.fen === false;
        }
      }).map((geocode) => {
        // console.log(geocode.lat);
        const geoLat = geocode.lat;
        const geoLng = geocode.lng;
          
        parkGeolocation.push({geoLat, geoLng});          
        });
        console.log(parkGeolocation);
        

        
        // parkGeolocation.push(fenced.)        
      this.setState({
          geolocation: parkGeolocation
        });
      });        
      console.log(this.state.fen);   
    }
  
  render() {
    return (
      <div className="wrapper">
        <Header />
        <form>
          <label htmlFor="viewAll">View All</label>
          <input type="radio" name="mapType" id="viewAll" />

          <label htmlFor="custom">Custom</label>
          <input type="radio" name="mapType" id="custom"/>

          <label htmlFor="fence">Fenced</label>
          <input type="checkbox" id="fence" name="fen" onChange={this.handleChange} value={this.state.fen}/>

          <label htmlFor="smallDog">Small Dogs Area</label>
          <input type="checkbox" id="smallDog" name="sda" onChange={this.handleChange} value={this.state.sda}/>

          <label htmlFor="commercial">Commercial dog walkers allowed</label>
          <input type="checkbox" id="commercial" name="cdw" onChange={this.handleChange} value={this.state.cdw}/>
        </form>
        <div className="mapContainer">
        {this.makeMarker()}
          
        </div>
        <Footer />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));


