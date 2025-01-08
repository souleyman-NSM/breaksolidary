// components/RestaurantCard.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RestaurantCard = ({ name, basketCount, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.name}>{name}</Text>
    <Text style={styles.basketCount}>Paniers disponibles: {basketCount}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#282828',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  basketCount: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default RestaurantCard;