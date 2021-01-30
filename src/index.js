import React, { useState, useEffect } from 'react';

import {
  View,
  ActivityIndicator,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import Geolocation from '@react-native-community/geolocation';

import api from './services/api';

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
  },
});

const App = () => {
  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState({});
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization();
        Geolocation.setRNConfiguration({
          skipPermissionRequests: false,
          authorizationLevel: 'whenInUse',
        });
        Geolocation.getCurrentPosition(
          ({ coords }) => {
            setCoordinates(coords);
            setLoading(false);
          },
          (error) => {
            console.log(error);
          },
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
        );
      } else {
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (permission === 'granted') {
          Geolocation.getCurrentPosition(
            ({ coords }) => {
              setCoordinates(coords);
              setLoading(false);
            },
            (error) => {
              console.log(error);
            },
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
          );
        }
      }
    };
    requestPermissions();
  }, []);

  useEffect(() => {
    async function getData() {
      try {
        const { data } = await api.get(`/points`, {
          params: coordinates,
        });
        setPoints(data);
      } catch (err) {
        console.log(err);
      }
    }
    if (coordinates) getData();
  }, [coordinates]);

  function renderPoints() {
    return points.map((point) => (
      <Marker
        key={point.id}
        coordinate={{
          latitude: parseFloat(point.latitude),
          longitude: parseFloat(point.longitude),
        }}
        title={point.name}
      />
    ));
  }

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
        >
          {renderPoints()}
        </MapView>
      )}
    </View>
  );
};

export default App;
