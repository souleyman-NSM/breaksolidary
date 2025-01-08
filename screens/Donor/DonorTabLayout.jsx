// screens/Donor/DonorTabLayout.jsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Text, View, StyleSheet } from 'react-native';
import { icons } from '../../constants';
import ParcourirScreen from './ParcourirScreen';
import CreateScreen from './CreateScreen';
import DonorReservationScreen from './DonorReservationScreen';
import ProfileScreen from './ProfileScreen';

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

export default function DonorTabLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let icon;
          let label;

          switch (route.name) {
            case 'Parcourir':
              icon = icons.home;
              label = 'Parcourir';
              break;
            case 'Create':
              icon = icons.plus;
              label = 'Créer';
              break;
            case 'Reservations':
              icon = icons.reservation;
              label = 'Réservations';
              break;
            case 'Profile':
              icon = icons.profile;
              label = 'Profil';
              break;
            default:
              break;
          }
          return <TabIcon icon={icon} color={color} name={label} />;
        },
        headerShown: false,
        tabBarActiveTintColor: '#FFA001',
        tabBarInactiveTintColor: '#CDCDE0',
        tabBarStyle: styles.tabBarStyle,
        tabBarLabel: () => null, // Hide default label
      })}
    >
      <Tab.Screen name="Parcourir" component={ParcourirScreen} />
      <Tab.Screen name="Create" component={CreateScreen} />
      <Tab.Screen name="Reservations" component={DonorReservationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
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