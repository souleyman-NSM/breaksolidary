
// components/InfoBox.jsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InfoBox = ({ title, subtitle, containerStyles, titleStyles }) => {
  return (
    <View style={[styles.container, containerStyles]}>
      <Text style={[styles.title, titleStyles]}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Vous pouvez ajouter des styles par défaut ici si nécessaire
  },
  title: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600', // Correspond à font-psemibold
  },
  subtitle: {
    fontSize: 12, // Correspond à text-sm
    color: '#D1D5DB', // Correspond à text-gray-100
    textAlign: 'center',
    fontWeight: '400', // Correspond à font-pregular
  },
});

export default InfoBox;

