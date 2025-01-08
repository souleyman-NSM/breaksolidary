// screens/WelcomeScreen.jsx

import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { CustomButton, Loader } from "../components/"; // Import des composants personnalisés

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#161622" style="light" />
      <View style={styles.innerContainer}>
        <Image
          source={require('../assets/images/logo.png')} // Assurez-vous d'avoir un logo dans le dossier assets
          style={styles.logo}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/images/cards.png')} // Assurez-vous d'avoir une image cards dans le dossier assets
          style={styles.cards}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Un geste{"\n"}
            simple pour une joie{"\n"}
            infinie{" "}
            <Text style={styles.highlight}>BreakSolidaire</Text>
          </Text>
          <Image
            source={require('../assets/images/path.png')} // Assurez-vous d'avoir une image path dans le dossier assets
            style={styles.path}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.subtitle}>
          Notre mission est d'aider les personnes en situation de précarité
        </Text>
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Sélectionner votre connexion"
            handlePress={() => navigation.navigate('Home')}
            color="#841584"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 130,
    height: 84,
    marginBottom: 20,
  },
  cards: {
    width: '100%',
    height: 298,
    maxWidth: 380,
    marginBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  highlight: {
    color: '#F0A500',
  },
  path: {
    width: 136,
    height: 15,
    position: 'absolute',
    bottom: -10,
    right: -40,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
});
