// components/LogoutButton.jsx

import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig'; // Assurez-vous que ce chemin est correct
import AsyncStorage from '@react-native-async-storage/async-storage';
import logoutIcon from '../assets/icons/logout.png'; // Assurez-vous que le chemin est correct

export default function LogoutButton() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      // Déconnexion de Firebase
      await auth.signOut();

      // Suppression des données utilisateur stockées
      await AsyncStorage.removeItem('userUid');

      // Réinitialisation de la pile de navigation et redirection vers l'écran de connexion
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }], // Changer 'Welcome' en 'Login' si vous voulez naviguer vers la page de connexion
      });
    } catch (error) {
      console.error('Error signing out: ', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion.');
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Image source={logoutIcon} style={styles.buttonIcon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
  },
  buttonIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFA001',
  },
});
