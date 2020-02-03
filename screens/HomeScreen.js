import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import firebase from 'firebase';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      displayName: '',
      location: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    };
  }

  componentDidMount() {
    const {email, displayName} = firebase.auth().currentUser;
    this.setState({email, displayName});
    this.requestLocationPermission();
  }

  signOutUser = () => {
    firebase.auth().signOut();
  };

  requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      this.locateCurrentPosition();
    } else {
      try {
        let granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.locateCurrentPosition();
        } else {
          Alert.alert('Location permission denied!');
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  locateCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        this.setState({
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
        });
      },
      error => Alert.alert(error.message),
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 1000},
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.MapView}
          provider={PROVIDER_GOOGLE}
          ref={map => (this._map = map)}
          showsUserLocation={true}
          region={this.state.location}
        />
        <View style={{marginTop: 10, alignItems: 'center'}}>
          <Text style={{fontSize: 15}}>
            Logged in as {this.state.displayName}
          </Text>
        </View>
        <View style={{marginTop: 520}}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('Camera')}>
            <Text style={{color: '#fff'}}>Take Picture</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 10}}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.signOutUser()}>
            <Text style={{color: '#fff'}}>LogOut</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  MapView: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  button: {
    marginHorizontal: 40,
    backgroundColor: '#e9446a',
    borderRadius: 10,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
