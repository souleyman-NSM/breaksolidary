// screens/Auth/ConfirmationScreen.jsx

import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '../../components';

export default function ConfirmationScreen() {
  const navigation = useNavigation();

  const handleGoToLogin = () => {
    navigation.navigate('Login'); // Rediriger vers l'écran de connexion
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Vérifiez votre e-mail</Text>
        <Text style={styles.message}>
          Un e-mail de vérification a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception et suivre les instructions pour activer votre compte.
        </Text>
        <CustomButton 
          title="Retour à la connexion" 
          onPress={handleGoToLogin} 
          color="#FF6F61" // Couleur personnalisée du bouton
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622', // Couleur de fond sombre
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF', // Couleur du texte blanche
    textAlign: 'center',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: '#E0E0E0', // Couleur du texte légèrement grise pour plus de contraste
    textAlign: 'center',
    marginBottom: 20,
  },
});

