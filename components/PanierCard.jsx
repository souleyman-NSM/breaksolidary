// components/PanierCard.jsx

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const PanierCard = ({ title, description, image, expirationDate, small }) => (
  <View style={[styles.card, small && styles.smallCard]}>
    <Image source={{ uri: image }} style={styles.image} />
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.expirationDate}>{expirationDate}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  smallCard: {
    width: 150,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  textContainer: {
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  expirationDate: {
    fontSize: 12,
    color: '#888',
  },
});

export default PanierCard;