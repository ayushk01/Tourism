import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-ionicons';
import {RNCamera} from 'react-native-camera';
import firebase from 'firebase';

class CameraScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      camera: {
        type: RNCamera.Constants.Type.back,
        flashMode: RNCamera.Constants.FlashMode.off,
      },
      button: 'flash',
    };
  }

  componentDidMount() {
    this.requestPermission();
  }

  requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied!');
        }
      } catch (err) {
        Alert.alert(err);
      }
    } else {
      Alert.alert('Unsupported for ios');
    }
  };

  takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      firebase
        .storage()
        .ref()
        .child('images/image.jpg')
        .putString('data:image/jpeg;base64,' + data.base64)
        .then(res => console.log(res))
        .catch(error => console.log(error));
    }
  };

  changeCamera = () => {
    if (this.state.camera.type === RNCamera.Constants.Type.front) {
      this.setState({
        camera: {
          type: RNCamera.Constants.Type.back,
        },
      });
    } else {
      this.setState({
        camera: {
          type: RNCamera.Constants.Type.front,
        },
      });
    }
  };

  changeFlash = () => {
    if (this.state.button === 'flash') {
      this.setState({
        button: 'flash-off',
        camera: {
          type: this.state.camera.type,
          flashMode: RNCamera.Constants.FlashMode.off,
        },
      });
    } else {
      this.setState({
        button: 'flash',
        camera: {
          type: this.state.camera.type,
          flashMode: RNCamera.Constants.FlashMode.on,
        },
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={this.state.camera.type}
          flashMode={this.state.camera.flashMode}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={({barcodes}) => {
            console.log(barcodes);
          }}
        />
        <View style={styles.buttonBar}>
          <TouchableOpacity onPress={() => this.changeCamera()}>
            <Icon name="reverse-camera" style={{color: '#fff'}} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.takePicture()}
            style={styles.capture}>
            <Text style={{fontSize: 14}}></Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.changeFlash()}>
            <Icon name={this.state.button} style={{color: '#fff'}} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  preview: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  capture: {
    flex: 0,
    backgroundColor: 'transparent',
    borderRadius: 100,
    padding: 25,
    paddingHorizontal: 35,
    borderWidth: 6,
    borderColor: '#fff',
    marginLeft: 50,
    marginRight: 50,
  },
  buttonBar: {
    flexDirection: 'row',
    marginBottom: 50,
    alignItems: 'center',
  },
});

export default CameraScreen;
