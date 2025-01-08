// screens/WaitingScreen.jsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LogoutButton from '../components/LogoutButton';

export default function WaitingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Votre compte est en attente de vérification. Veuillez attendre que l'administrateur vérifie votre compte.</Text>
      <LogoutButton navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#161622',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
});