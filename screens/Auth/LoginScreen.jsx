// screens/LoginScreen.jsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { CustomButton, FormField } from '../../components'; 
import { images } from '../../constants'; 
import { auth, db } from '../../firebaseConfig'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants'; // Importation de expo-constants

// Accès aux variables d'environnement depuis app.json
const ADMIN_EMAIL = Constants.expoConfig.extra.ADMIN_EMAIL;
const ADMIN_PASSWORD = Constants.expoConfig.extra.ADMIN_PASSWORD;

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    setSubmitting(true);
    try {
      // Vérification pour l'admin
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        navigation.navigate('Admin');
        return;
      }

      // Connexion classique via Firebase
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      const userDoc = await db.collection('users').doc(user.uid).get();

      if (userDoc.exists) {
        const userType = userDoc.data().type;
        const isVerified = userDoc.data().verified;

        if (isVerified) {
          if (userType === 'deal') {
            navigation.navigate('Deal');
          } else if (userType === 'donor') {
            navigation.navigate('Donor');
          } else if (userType === 'beneficiary') {
            navigation.navigate('BeneficiaryTabs', { screen: 'Explore' });
          } else {
            navigation.navigate('Home');
          }
        } else {
          setError('Votre compte est en attente de vérification. Veuillez patienter.');
          await auth.signOut();
        }
      } else {
        setError('Utilisateur non trouvé');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.innerContainer}>
          <Image
            source={images.logo} 
            resizeMode="contain"
            style={styles.logo}
          />
          <Text style={styles.title}>Connexion</Text>

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
            title="Se connecter"
            handlePress={handleLogin}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
          </TouchableOpacity>
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
  forgotPassword: {
    color: '#00BFFF',
    marginTop: 20,
    textAlign: 'center',
  },
});
