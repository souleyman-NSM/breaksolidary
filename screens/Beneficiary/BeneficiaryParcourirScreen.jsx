// screens/Beneficiary/BeneficiaryParcourirScreen.jsx

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Text, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { db } from '../../firebaseConfig';

const GOOGLE_PLACES_API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY'; // Remplacez par votre clé API

export default function BeneficiaryParcourirScreen({ navigation }) {
  const [donors, setDonors] = useState([]);
  const [address, setAddress] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01, // Rayon restreint autour de l'utilisateur
        longitudeDelta: 0.01, // Rayon restreint autour de l'utilisateur
      });
    };

    const fetchDonors = async () => {
      try {
        const snapshot = await db.collection('users')
          .where('type', '==', 'donor')
          .where('verified', '==', true)
          .get();

        const donorsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDonors(donorsData);
      } catch (error) {
        console.error('Error fetching donor data:', error);
      }
    };

    getLocation();
    fetchDonors();
  }, []);

  const fetchAddressSuggestions = async (input) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
        params: {
          input,
          key: GOOGLE_PLACES_API_KEY,
          components: 'country:fr',
        },
      });

      if (response.data.predictions) {
        setPredictions(response.data.predictions);
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    }
  };

  const handleSelectAddress = async (placeId) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
        params: {
          place_id: placeId,
          key: GOOGLE_PLACES_API_KEY,
        },
      });
      const location = response.data.result.geometry.location;
      setSelectedLocation(location);
      setAddress(response.data.result.formatted_address);
      setPredictions([]);
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const handleMarkerPress = (donor) => {
    navigation.navigate('DonorDetails', { donorId: donor.id });
  };

  const renderSuggestion = ({ item }) => (
    <TouchableOpacity style={styles.suggestion} onPress={() => handleSelectAddress(item.place_id)}>
      <Text>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Parcourir les Donateurs</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une adresse..."
          placeholderTextColor="#888"
          value={address}
          onChangeText={(text) => {
            setAddress(text);
            fetchAddressSuggestions(text);
          }}
        />
        {predictions.length > 0 && (
          <FlatList
            data={predictions}
            keyExtractor={(item) => item.place_id}
            renderItem={renderSuggestion}
            style={styles.suggestionList}
          />
        )}
      </View>
      <MapView
        style={StyleSheet.absoluteFill}
        showsUserLocation={true}
        showsMyLocationButton={true}
        region={userLocation}
      >
        {donors.map((donor) => (
          <Marker
            key={donor.id}
            coordinate={{
              latitude: donor.latitude,
              longitude: donor.longitude,
            }}
            title={donor.restaurantName}
            description={`Paniers disponibles: ${donor.availableBaskets}`}
            onPress={() => handleMarkerPress(donor)}
          />
        ))}
        {selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.lat,
              longitude: selectedLocation.lng,
            }}
            title="Adresse Sélectionnée"
            description={address}
          />
        )}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Ajouter Marqueur" onPress={() => Alert.alert('Ajouter Marqueur', `Marqueur ajouté à ${address}`)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
  },
  header: {
    height: 180,
    backgroundColor: '#1E1E2D',
    paddingTop: 30,
    paddingHorizontal: 20,
    justifyContent: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 15,
  },
  searchInput: {
    height: 40,
    borderRadius: 20,
    backgroundColor: '#444',
    color: '#FFFFFF',
    paddingHorizontal: 20,
  },
  suggestionList: {
    backgroundColor: '#fff',
    borderRadius: 5,
    maxHeight: 200,
    marginTop: 10,
    position: 'absolute',
    width: '100%',
    zIndex: 2,
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
});
