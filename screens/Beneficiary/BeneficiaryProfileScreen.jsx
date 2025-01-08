// screens/Beneficiary/BeneficiaryProfileScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { fetchUserProfile, updateBasketStatus } from '../../services/profileService';
import { auth } from '../../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import LogoutButton from '../../components/LogoutButton';
import { useNavigation } from '@react-navigation/native';

export default function BeneficiaryProfileScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userProfile = await fetchUserProfile(currentUser.uid);
          console.log('User Profile:', userProfile); // Debugging logs
          setUser(userProfile);
        } else {
          navigation.navigate('Login');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Erreur lors de la récupération des données utilisateur.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigation]);

  const handleAcceptBasket = async (basketId) => {
    try {
      setLoading(true);
      await updateBasketStatus(basketId, 'validé');
      const updatedBaskets = user.baskets.map((basket) =>
        basket.id === basketId ? { ...basket, status: 'validé' } : basket
      );
      setUser({ ...user, baskets: updatedBaskets });
      Alert.alert('Succès', 'Le panier a été validé.');
    } catch (err) {
      console.error('Error accepting basket:', err);
      setError('Erreur lors de la validation du panier.');
    } finally {
      setLoading(false);
    }
  };

  const handleBasketPickedUp = async (basketId) => {
    try {
      setLoading(true);
      await updateBasketStatus(basketId, 'récupéré');
      const updatedBaskets = user.baskets.map((basket) =>
        basket.id === basketId ? { ...basket, status: 'récupéré' } : basket
      );
      setUser({ ...user, baskets: updatedBaskets });
      Alert.alert('Succès', 'Le panier a été récupéré.');
    } catch (err) {
      console.error('Error updating basket status:', err);
      setError('Erreur lors de la mise à jour du panier.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFA001" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderBasket = (basket) => (
    <View key={basket.id} style={styles.basketCard}>
      <Text style={styles.basketText}>Nom : {basket.restaurantName}</Text>
      <Text style={styles.basketText}>Adresse : {basket.restaurantAddress}</Text>
      <Text style={styles.basketText}>Description : {basket.description}</Text>
      <Text style={styles.basketText}>Statut : {basket.status}</Text>
      {basket.status === 'en attente' && (
        <TouchableOpacity onPress={() => handleAcceptBasket(basket.id)} style={styles.button}>
          <Text style={styles.buttonText}>Accepter le panier</Text>
        </TouchableOpacity>
      )}
      {basket.status === 'validé' && (
        <TouchableOpacity onPress={() => handleBasketPickedUp(basket.id)} style={styles.button}>
          <Text style={styles.buttonText}>Marquer comme récupéré</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.outerContainer}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View style={styles.profileInfo}>
            <TouchableOpacity onPress={() => Alert.alert('Changer de photo de profil', 'Cette fonctionnalité sera bientôt disponible.')}>
              <View style={styles.profilePictureContainer}>
                <Image source={{ uri: user?.avatar || 'default-avatar-url' }} style={styles.profilePicture} />
              </View>
            </TouchableOpacity>
            <View>
              <Text style={styles.username}>{user?.pseudo}</Text>
              <Text style={styles.fullName}>{user?.firstName} {user?.lastName}</Text>
            </View>
          </View>
          <LogoutButton />
        </View>
      </View>

      {user?.baskets?.length > 0 ? (
        <View style={styles.basketsContainer}>
          <Text style={styles.sectionTitle}>Vos Paniers</Text>
          {user.baskets.map(renderBasket)}
        </View>
      ) : (
        <Text style={styles.noBasketText}>Aucun panier réservé.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flexGrow: 1,
    paddingTop: 50,
    backgroundColor: '#1E1E2D',
    padding: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E2D',
  },
  header: {
    marginBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePictureContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#F0A500',
    marginRight: 15,
    overflow: 'hidden',
  },
  profilePicture: {
    width: '100%',
    height: '100%',
  },
  username: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  fullName: {
    fontSize: 16,
    color: '#B0B0B0',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 16,
  },
  basketsContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFA001',
    marginBottom: 10,
  },
  basketCard: {
    backgroundColor: '#2A2A3C',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },
  basketText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  noBasketText: {
    fontSize: 16,
    color: '#B0B0B0',
    marginTop: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FFA001',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
