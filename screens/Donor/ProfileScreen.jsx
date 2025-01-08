// screens/Donor/ProfileScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { fetchUserProfile, fetchUserBaskets, updateUserProfilePicture } from '../../services/profileService';
import { auth } from '../../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import LogoutButton from '../../components/LogoutButton';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [baskets, setBaskets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userProfile = await fetchUserProfile(currentUser.uid);
          const userBaskets = await fetchUserBaskets(currentUser.uid);
          setUser(userProfile);
          setBaskets(userBaskets);
        } else {
          navigation.navigate('Login'); // Rediriger vers la page de connexion si non authentifié
        }
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    loadData();
  }, [navigation]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri;

      try {
        setLoading(true);
        await updateUserProfilePicture(auth.currentUser.uid, selectedImage);
        setUser({ ...user, avatar: selectedImage });
        setLoading(false);
      } catch (err) {
        setError('Erreur lors de la mise à jour de la photo de profil.');
        setLoading(false);
      }
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
    Alert.alert('Erreur', error);
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={baskets}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={() => (
        <View style={styles.header}>
          <View style={styles.topRow}>
            <View style={styles.profileInfo}>
              <TouchableOpacity onPress={pickImage}>
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
          <Text style={styles.basketCount}>
            {baskets.length} {baskets.length === 1 ? 'panier crée' : 'paniers crées'}
          </Text>
        </View>
      )}
      renderItem={({ item }) => (
        <View style={styles.basketItem}>
          <Text style={styles.basketTitle}>{item.category}</Text>
          <Text style={styles.basketDetails}>{item.description}</Text>
        </View>
      )}
      ListEmptyComponent={() => (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Aucune création de panier trouvée.</Text>
        </View>
      )}
      contentContainerStyle={styles.outerContainer}
    />
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flexGrow: 1,
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
    paddingTop: 40,
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
    overflow: 'hidden',
    marginRight: 15,
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
  basketCount: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 10,
    textAlign: 'center',
  },
  basketItem: {
    backgroundColor: '#d6b2ff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptyStateText: {
    color: '#B0B0B0',
    fontSize: 16,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 16,
  },
});
