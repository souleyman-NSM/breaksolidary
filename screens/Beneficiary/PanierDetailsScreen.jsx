// screens/Beneficiary/PanierDetailsScreen.jsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PanierDetailsScreen() {
  return (
    <View style={styles.container}>
      <Text>Panier Details Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
