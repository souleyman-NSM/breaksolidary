// screens/Beneficiary/BeneficiaryTabLayout.jsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Text, View, StyleSheet } from 'react-native';
import { icons } from '../../constants';
import BeneficiaryParcourirScreen from './BeneficiaryParcourirScreen';
import BeneficiaryProfileScreen from './BeneficiaryProfileScreen';
import BeneficiaryReservationScreen from './BeneficiaryReservationScreen';
import ExploreScreen from './ExploreScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({ icon, color, name }) => (
  <View style={styles.iconContainer}>
    <Image source={icon} style={[styles.icon, { tintColor: color }]} />
    <Text
      style={[styles.iconLabel, { color: color }]}
      numberOfLines={1} // Ensure text is only one line
      ellipsizeMode="tail" // Truncate the text if it overflows
    >
      {name}
    </Text>
  </View>
);

export default function BeneficiaryTabLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          let icon;
          let label;

          switch (route.name) {
            case 'Explore':
              icon = icons.explore;
              label = 'Découvrir';
              break;
            case 'Parcourir':
              icon = icons.home;
              label = 'Parcourir';
              break;
            case 'Reservation':
              icon = icons.reservation;
              label = 'Réservation';
              break;
            case 'Profile':
              icon = icons.profile;
              label = 'Profil';
              break;
          }
          return <TabIcon icon={icon} color={color} name={label} />;
        },
        headerShown: false,
        tabBarActiveTintColor: '#FFA001',
        tabBarInactiveTintColor: '#CDCDE0',
        tabBarStyle: styles.tabBarStyle,
        tabBarLabel: () => null, // Masque le label par défaut
      })}
    >
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Parcourir" component={BeneficiaryParcourirScreen} />
      <Tab.Screen name="Profile" component={BeneficiaryProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginTop: 20,
  },
  iconLabel: {
    fontSize: 12,
    textAlign: 'center', // Center the label horizontally
    marginTop: 4, // Space between the icon and label
    width: 100, // Set a fixed width to ensure long text stays on one line
  },
  tabBarStyle: {
    backgroundColor: '#161622',
    borderTopWidth: 1,
    borderTopColor: '#232533',
    height: 84,
  },
});
