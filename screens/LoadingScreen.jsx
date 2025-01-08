// screens/LoadingScreen.jsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LoadingScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Chargement...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#161622',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 20,
  },
});

export default LoadingScreen;
