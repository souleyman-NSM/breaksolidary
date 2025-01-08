// App.js

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { auth, db } from './firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import AdminScreen from './screens/Admin/AdminScreen';
import BeneficiarySignUpScreen from './screens/Beneficiary/BeneficiarySignUpScreen';
import DealScreen from './screens/Deal/DealScreen';
import DealSignUpScreen from './screens/Deal/DealSignUpScreen';
import DonorTabLayout from './screens/Donor/DonorTabLayout';
import DonorSignUpScreen from './screens/Donor/DonorSignUpScreen';
import LoginScreen from './screens/Auth/LoginScreen';
import SignupScreen from './screens/Auth/SignupScreen';
import ConfirmationScreen from './screens/Auth/ConfirmationScreen';
import ForgotPasswordScreen from './screens/Auth/ForgotPasswordScreen';
import HomeScreen from './screens/HomeScreen';
import WaitingScreen from './screens/WaitingScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import ParcourirScreen from './screens/Donor/ParcourirScreen';
import DonorDetailsScreen from './screens/Donor/DonorDetailsScreen';
import BeneficiaryTabLayout from './screens/Beneficiary/BeneficiaryTabLayout';
import ExploreScreen from './screens/Beneficiary/ExploreScreen'; // Assure-toi que cet import est correct
import PanierDetailsScreen from './screens/Beneficiary/PanierDetailsScreen'; // Assure-toi que cet import est correct
import BeneficiaryBasketDetailsScreen from './screens/Beneficiary/BeneficiaryBasketDetailsScreen'; // Assure-toi que cet import est correct
import UserDetailScreen from './screens/Donor/UserDetailScreen'; // Assure-toi que cet import est correct
import DonorReservationInfoScreen from './screens/Donor/DonorReservationInfoScreen'; // Assurez-vous d'importer ce screen


const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState('Welcome');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUserType = await AsyncStorage.getItem('userType');
        
        if (storedUserType) {
          setInitialRoute(
            storedUserType === 'deal'
              ? 'Deal'
              : storedUserType === 'donor'
              ? 'Donor'
              : storedUserType === 'beneficiary'
              ? 'Beneficiary'
              : 'Home'
          );
        }

        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (user) {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
              const userType = userDoc.data().type;
              await AsyncStorage.setItem('userType', userType); // Store user type
              setInitialRoute(
                userType === 'deal'
                  ? 'Deal'
                  : userType === 'donor'
                  ? 'Donor'
                  : userType === 'beneficiary'
                  ? 'Beneficiary'
                  : 'Home'
              );
            } else {
              setInitialRoute('Welcome');
            }
          } else {
            setInitialRoute('Welcome');
            await AsyncStorage.removeItem('userType'); // Clear user type on sign-out
          }
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error checking user session:', error);
        setInitialRoute('Welcome');
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) {
    return null; // Display a loading screen here if you prefer
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="BeneficiarySignUp" component={BeneficiarySignUpScreen} />
        <Stack.Screen name="Deal" component={DealScreen} />
        <Stack.Screen name="DealSignUp" component={DealSignUpScreen} />
        <Stack.Screen name="Donor" component={DonorTabLayout} />
        <Stack.Screen name="DonorSignUp" component={DonorSignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Waiting" component={WaitingScreen} />
        <Stack.Screen name="ConfirmationScreen" component={ConfirmationScreen} />
        <Stack.Screen name="Parcourir" component={ParcourirScreen} />
        <Stack.Screen name="DonorDetails" component={DonorDetailsScreen} />
        <Stack.Screen name="BeneficiaryTabs" component={BeneficiaryTabLayout} />
        <Stack.Screen name="Explore" component={ExploreScreen} />
        <Stack.Screen name="PanierDetails" component={PanierDetailsScreen} />
        <Stack.Screen name="BeneficiaryBasketDetails" component={BeneficiaryBasketDetailsScreen} />
        <Stack.Screen name="UserDetail" component={UserDetailScreen} options={{ title: 'Détails de l\'Utilisateur' }} />
        <Stack.Screen name="DonorReservationInfo" component={DonorReservationInfoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}