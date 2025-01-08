// screens/Deal/DealSignUpScreen.jsx

import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { CustomButton, FormField } from '../../components';
import { images } from '../../constants';
import { auth, db } from '../../firebaseConfig';

export default function DealSignUpScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const handleSignUp = async () => {
    setSubmitting(true);
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Envoi du lien de vérification d'email
      await user.sendEmailVerification({
        url: 'https://breaksolidaire.com', // Remplacez par l'URL de votre application
        handleCodeInApp: true, // Assurez-vous que le lien redirige vers l'application
      });

      await db.collection('users').doc(user.uid).set({
        email: user.email,
        type: 'deal',
        pseudo,
      });

      // Rediriger vers un écran de confirmation
      navigation.navigate('ConfirmationScreen'); // Assurez-vous que cet écran existe
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
          <Text style={styles.title}>
            Inscrivez-vous en tant que partenaire
          </Text>

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
});
