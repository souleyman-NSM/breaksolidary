// screens/Beneficiary/BeneficiarySignUpScreen.jsx

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, Image, TextInput, FlatList, TouchableOpacity, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { CustomButton, FormField } from '../../components';
import { images } from '../../constants';
import { auth, db } from '../../firebaseConfig';
import axios from 'axios';

const PLACES_API_KEY = 'AIzaSyAr7zIz2jYQAy-Ch5XJaBZmjOwJDLZA860';

const fetchAddressSuggestions = async (input) => {
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
      params: {
        input,
        key: PLACES_API_KEY,
        components: 'country:fr',
      },
    });
    return response.data.predictions || [];
  } catch (error) {
    console.error('Error fetching address suggestions:', error);
    return [];
  }
};

const fetchPlaceDetails = async (placeId) => {
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
      params: {
        place_id: placeId,
        key: PLACES_API_KEY,
      },
    });
    return response.data.result;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
};

export default function BeneficiarySignUpScreen() {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    if (restaurantAddress.length > 2) {
      fetchAddressSuggestions(restaurantAddress).then(setPredictions);
    } else {
      setPredictions([]);
    }
  }, [restaurantAddress]);

  const handleSignUp = async () => {
    setSubmitting(true);
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      let location = null;
      if (selectedPlace) {
        location = selectedPlace.geometry.location;
      }

      await db.collection('users').doc(user.uid).set({
        email: user.email,
        type: 'beneficiary',
        firstName,
        lastName,
        pseudo,
        phoneNumber,
        address: restaurantAddress,
        city: selectedPlace?.address_components?.find(ac => ac.types.includes('locality'))?.long_name || '',
        verified: false,
        latitude: location?.lat || null,
        longitude: location?.lng || null,
      });

      navigation.navigate('Waiting');
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectAddress = async (placeId) => {
    const placeDetails = await fetchPlaceDetails(placeId);
    if (placeDetails) {
      setRestaurantAddress(placeDetails.formatted_address);
      setSelectedPlace(placeDetails);
      setPredictions([]);
      Keyboard.dismiss();
    }
  };

  const renderSuggestion = ({ item }) => (
    <TouchableOpacity
      key={item.place_id}
      style={styles.suggestion}
      onPress={() => handleSelectAddress(item.place_id)}
    >
      <Text style={styles.suggestionText}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.innerContainer}>
          <Image
            source={images.logo}
            resizeMode="contain"
            style={styles.logo}
          />
          <Text style={styles.title}>
            Inscrivez-vous en tant que bénéficiaire
          </Text>

          <FormField
            title="Prénom"
            value={firstName}
            handleChangeText={setFirstName}
            otherStyles="mt-7"
          />

          <FormField
            title="Nom"
            value={lastName}
            handleChangeText={setLastName}
            otherStyles="mt-7"
          />

          <View style={styles.formFieldContainer}>
            <Text style={styles.formFieldTitle}>Adresse</Text>
            <TextInput
              style={styles.addressInput}
              value={restaurantAddress}
              onChangeText={setRestaurantAddress}
              placeholder="Entrez l'adresse"
              placeholderTextColor="#888"
            />
            {predictions.length > 0 && (
              <FlatList
                data={predictions}
                keyExtractor={(item) => item.place_id}
                renderItem={renderSuggestion}
                style={styles.suggestionListContainer}
              />
            )}
          </View>

          <FormField
            title="Numéro de téléphone"
            value={phoneNumber}
            handleChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            otherStyles="mt-7"
          />

          <FormField
            title="Pseudo"
            value={pseudo}
            handleChangeText={setPseudo}
            otherStyles="mt-7"
          />

          <FormField
            title="Email"
            value={email}
            handleChangeText={setEmail}
            keyboardType="email-address"
            otherStyles="mt-7"
          />

          <FormField
            title="Mot de Passe"
            value={password}
            handleChangeText={setPassword}
            secureTextEntry
            otherStyles="mt-7"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <CustomButton
            title="S'inscrire"
            handlePress={handleSignUp}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    width: 115,
    height: 34,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  formFieldContainer: {
    width: '100%',
    marginBottom: 10,
  },
  formFieldTitle: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 8,
    marginTop: 20,
  },
  addressInput: {
    height: 50,
    color: '#FFFFFF',
    backgroundColor: '#2A2A3A',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  suggestionListContainer: {
    backgroundColor: '#ddd',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    maxHeight: 200,
    zIndex: 2,
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
});