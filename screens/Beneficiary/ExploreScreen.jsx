// screens/Beneficiary/ExploreScreen.jsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { db } from '../../firebaseConfig';
import { images } from '../../constants';

export default function ExploreScreen({ navigation }) {
  const [basketsByRestaurant, setBasketsByRestaurant] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBaskets = async () => {
      try {
        const basketsSnapshot = await db.collection('baskets')
          .where('status', 'not-in', ['confirmed', 'pickedUp', 'validated']) // Exclude specific statuses
          .get();
        const basketsData = basketsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const groupedBaskets = basketsData.reduce((acc, basket) => {
          const restaurant = basket.restaurant || 'Autres';
          if (!acc[restaurant]) {
            acc[restaurant] = [];
          }
          acc[restaurant].push(basket);
          return acc;
        }, {});

        setBasketsByRestaurant(groupedBaskets);
      } catch (error) {
        console.error('Error fetching baskets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBaskets();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#FFA001" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explorez les paniers disponibles</Text>
        
      </View>
      <FlatList
        data={Object.keys(basketsByRestaurant)}
        keyExtractor={(item) => item}
        renderItem={({ item: restaurant }) => (
          <View style={styles.restaurantSection}>
            <Text style={styles.restaurantTitle}>{restaurant}</Text>
            <FlatList
              data={basketsByRestaurant[restaurant]}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.basketItem}
                  onPress={() => navigation.navigate('BeneficiaryBasketDetails', { basketId: item.id })}
                >
                  <Text style={styles.basketTitle}>{item.category}</Text>
                  <Text style={styles.basketDetails}>{item.description}</Text>
                  {item.status === 'reserved' ? (
                    <Text style={styles.reservedMessage}>Réservé et en attente</Text>
                  ) : (
                    <Text style={styles.basketTime}>
                      {`Réservation : ${new Date(item.reservationDate.seconds * 1000).toLocaleDateString()} ${new Date(item.startTime.seconds * 1000).toLocaleTimeString()} - ${new Date(item.endTime.seconds * 1000).toLocaleTimeString()}`}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        )}
        contentContainerStyle={styles.basketList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 15,
  },
  restaurantSection: {
    marginBottom: 20,
  },
  restaurantTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  basketItem: {
    backgroundColor: '#1E1E2D',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    width: 200,
  },
  basketTitle: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  basketDetails: {
    color: '#CCCCCC',
    marginBottom: 5,
  },
  basketTime: {
    color: '#FFA001',
  },
  reservedMessage: {
    color: '#FF0000', // Red color for reserved status
    fontSize: 14,
    marginTop: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});