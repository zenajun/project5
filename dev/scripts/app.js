import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import Header from './Header';
import Footer from './Footer';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import { compose, withProps } from 'recompose';

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
      // name: '',
      // address: '',
      geolocation: '',
      fen: false,
      cdw: false,
      sda: false,
      allParks: false
    }
    this.makeMarker = this.makeMarker.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.filterLocations = this.filterLocations.bind(this);
    this.afterStateUpdates = this.afterStateUpdates.bind(this);
    // this.getNewGeocodes = this.getNewGeocodes.bind(this);
  };
  
  componentDidUpdate() {
    this.afterStateUpdates();
  }
  
  componentDidMount() {
  // this.handleChange();
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
    e.stopPropagation();
    this.setState({
      // [e.target.name]: e.target.value === 'false' ? true : false,
      allParks: e.target.value === 'false' ? false : true
    });
    
    if (this.state.allParks === true) {
       this.setState({
         geolocation: []
       });
    } else {
      const dbRef = firebase.database().ref();
      dbRef.on('value', (snapshot) => {
        const dogParks = snapshot.val();
        const parkGeolocation = []
        
        dogParks.map((dogPark) => {  
          const geoLat = dogPark.lat;
          const geoLng = dogPark.lng;
          // console.log(geoLat, geoLng);
          parkGeolocation.push({geoLat, geoLng})
        });
        this.setState({
          geolocation: parkGeolocation
        });
      });     
    }   
  }

  handleUniquePark(e) {
    console.log('unique click');
    this.setState({
      [e.target.name]: e.target.value === 'false' ? true : false,
      allParks: false
    }, function afterStateUpdates() {;
      // this.filterLocations();
    });

  }
  
  handleChange(e) {    
    this.setState({
      [e.target.name]: e.target.value === 'false' ? true : false,
      allParks: false
    }, function afterStateUpdates() {;    
      this.filterLocations();
    });   
  }
  
  afterStateUpdates() {
    // callback to update to 
  }

  filterLocations() {
    const dbRef = firebase.database().ref();
    dbRef.on('value', (snapshot) => {
      const dogParks = snapshot.val();
      const parkGeolocation = []
      const geoLat = dogParks.lat;
      const geoLng = dogParks.lng;

      // find park that meets the 3 criteria (fen, sda and cdw)
      // Fenced parks
      const fenced = dogParks.filter((dogPark) => {
        const parkGeolocation = []

        if (this.state.fen === true) {
          return dogPark.fen === true;
        } else {
          return dogPark.fen === false;
        }
      }).filter((smallDog) => {             //small dogs
        if (this.state.sda === true) {
          return smallDog.sda === true;          
        } else {
          return smallDog.sda === false;          
        }
      }).filter((dogWalker) => {  // commercial dog walkers
        if (this.state.cdw === true) {
          return dogWalker.cdw === true;
        } else {
          return dogWalker.cdw === false;
        }        
      }).map((geocode) => {
        const geoLat = geocode.lat;
        const geoLng = geocode.lng;

        parkGeolocation.push({ geoLat, geoLng });
      });
      this.setState({
        geolocation: parkGeolocation,
      });
    });
  }

  render() {
    return (
      <div className="wrapper">
        <Header />
        <main>
          <form>
            <label htmlFor="viewAll">View All</label>
            <input type="radio" id="viewAll" name="allParks" onChange={this.handleRadioChange} value={true}/>

            <label htmlFor="viewAll">All Fenced Parks</label>
            <input type="radio" id="allFenced" name="allParks" onChange={this.handleUniquePark} value={this.state.fen}/>

            <label htmlFor="viewAll">All Small Dog Parks</label>
            <input type="radio" id="allSmallDogs" name="allParks" onChange={this.handleUniquePark} value={this.state.sda}/>

            <label htmlFor="viewAll">All Commercial Dog Walker Parks</label>
            <input type="radio" id="allCdw" name="allParks" onChange={this.handleUniquePark} value={this.state.cdw}/>

            <label htmlFor="custom">Filter</label>
            <input type="radio" id="custom" name="allParks" onChange={this.handleRadioChange} value={false}/>
            
            <div className="customPark">
              <label htmlFor="fence">Fenced</label>
              <input type="checkbox" id="fence" name="fen" onChange={this.handleChange} value={this.state.fen}/>

              <label htmlFor="smallDog">Small Dogs Area</label>
              <input type="checkbox" id="smallDog" name="sda" onChange={this.handleChange} value={this.state.sda}/>

              <label htmlFor="commercial">Commercial dog walkers</label>
              <input type="checkbox" id="commercial" name="cdw" onChange={this.handleChange} value={this.state.cdw}/>           
            </div>
          </form>
          <div className="mapContainer">
            {this.makeMarker()}          
          </div>
        </main>
        <Footer />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));


