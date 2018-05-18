import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import Header from './Header';
import Footer from './Footer';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { compose, withProps } from 'recompose';
import Map from './Map';


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
      cdw: false,
      fen: false,
      sda: false
    }
  };
  
  componentDidMount() {
    const dbRef = firebase.database().ref();
    dbRef.on('value', (snapshot) => {
      const dogParks = snapshot.val();
      const parkGeolocation = []
      dogParks.filter((dogPark) => {
        parkGeolocation.push(`${dogPark.lat}, ${dogPark.lng}`);        
      }); 
      console.log(parkGeolocation);        
    });    
  }
  
  render() {
    return (
      <div>
        <Header />
        <form>
          <label htmlFor="fence">Fenced</label>
          <input type="checkbox" id="fence"/>

          <label htmlFor="smallDog">Small Dogs Area</label>
          <input type="checkbox" id="smallDog"/>

          <label htmlFor="commercial">Commercial dog walkers allowed</label>
          <input type="checkbox" id="commercial"/>
        </form>
        <div className="mapContainer">
          <Map
            center={{lat: 43.731394, lng: -79.3575282}} 
            zoom={11}
            containerElement={<div style={{height: 100+'%'}} />}
            mapElement={<div style={{height: 100+'%'}} />} />
        </div>
        <Footer />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));