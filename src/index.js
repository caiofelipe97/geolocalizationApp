import React, { useState, useEffect } from 'react';

import { View, ActivityIndicator, StyleSheet, PermissionsAndroid  } from 'react-native';

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

import Geolocation from '@react-native-community/geolocation';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    backgroundColor: '#7158c1',
    alignItems: 'center',
  },

  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
})

const App = () => {
  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState({});

  useEffect(()=>{
    const requestPermissions = async () =>{
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization();
        Geolocation.setRNConfiguration({
          skipPermissionRequests: false,
         authorizationLevel: 'whenInUse',
       });
       Geolocation.getCurrentPosition(({coords})=>{
        setCoordinates(coords);
        setLoading(false);
      })
      }
      else {
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if(permission === "granted") {
          Geolocation.getCurrentPosition(({coords})=>{
            console.log(coords);
            setCoordinates(coords);
            setLoading(false);
          })
        }
      }
    }
    requestPermissions()
  },[])
  console.log(coordinates);
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <MapView
                provider={PROVIDER_GOOGLE}

          initialRegion={{
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            latitudeDelta: 0.0068,
            longitudeDelta: 0.0068,
          }}
          style={styles.map}
        />
      )}
    </View>
  );
};

export default App;
