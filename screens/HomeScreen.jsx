// screens/HomeScreen.jsx

import React from 'react';
import { View, Text, Image, Dimensions, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native'; // Utiliser la navigation correcte
import { CustomButton } from "../components"; // Assurez-vous que ce chemin est correct
import { images } from "../constants"; // Assurez-vous que ce chemin est correct

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>
            Sélectionner{"\n"}
            votre connexion{"\n"}
          </Text>
          <CustomButton
            title="Donateur"
            handlePress={() => navigation.navigate('DonorSignUp')}
            containerStyles="w-80 mt-7"
          />
          <CustomButton
            title="Bénéficiaire"
            handlePress={() => navigation.navigate('BeneficiarySignUp')}
            containerStyles="w-80 mt-7"
          />
          <CustomButton
            title="Les Bonnes Affaires"
            handlePress={() => navigation.navigate('DealSignUp')}
            containerStyles="w-80 mt-7"
          />
          <CustomButton
            title="Se connecter"
            handlePress={() => navigation.navigate('Login')}
            containerStyles="w-80 mt-7"
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
    backgroundColor: '#161622', // Couleur de fond principale
    margintop: 10
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    width: 320, // Largeur du bouton
    marginTop: 15, // Espacement entre les boutons
  },
});