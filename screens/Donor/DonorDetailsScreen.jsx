// screens/Donor/DonorDetailsScreen.jsx
// screens/Donor/DonorDetailsScreen.jsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { db } from '../../firebaseConfig';

export default function DonorDetailsScreen({ route, navigation }) {
  const donorId = route.params?.donorId;
  const [donor, setDonor] = useState(null);
  const [baskets, setBaskets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!donorId) {
      setError('No donor ID provided.');
      setLoading(false);
      return;
    }

    const fetchDonorDetails = async () => {
      try {
        const donorDoc = await db.collection('users').doc(donorId).get();
        if (!donorDoc.exists) {
          throw new Error('Donor not found');
        }
        const donorData = donorDoc.data();
        setDonor(donorData);

        const basketsSnapshot = await db.collection('baskets')
          .where('donorId', '==', donorId)
          .get();

        if (basketsSnapshot.empty) {
          setBaskets([]);
        } else {
          const basketsData = basketsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })).filter(basket => basket.status !== 'confirmed'); // Exclude confirmed baskets
          setBaskets(basketsData);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonorDetails();
  }, [donorId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#FFA001" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.error}>Erreur : {error}</Text>;
  }

  if (!donor) {
    return <Text style={styles.error}>Erreur lors de la récupération des informations du donateur.</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: donor.imageUrl || 'https://via.placeholder.com/150' }}
          style={styles.headerImage}
        />
        <Text style={styles.headerTitle}>{donor.restaurantName}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.address}>{donor.address}</Text>
        <Text style={styles.availableBaskets}>Paniers crées: {baskets.length}</Text>
        <FlatList
          data={baskets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('BeneficiaryBasketDetails', { basketId: item.id })}>
              <View style={styles.basketItem}>
                <Text style={styles.basketTitle}>{item.category}</Text>
                <Text style={styles.basketDetails}>{item.description}</Text>
                <Text style={styles.basketTime}>
                  Réservation : {new Date(item.reservationDate.seconds * 1000).toLocaleDateString()} 
                  {new Date(item.startTime.seconds * 1000).toLocaleTimeString()} - 
                  {new Date(item.endTime.seconds * 1000).toLocaleTimeString()}
                </Text>
                <Text style={styles.basketStatus}>
                  {item.status === 'reserved' ? 'Ce panier est déjà réservé' : 'Disponible'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Aucun panier créé.</Text>
            </View>
          )}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Retour" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
  },
  header: {
    height: '20%',
    backgroundColor: '#1E1E2D',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    resizeMode: 'cover',
  },
  headerTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    position: 'absolute',
    bottom: 10,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
  },
  address: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  availableBaskets: {
    fontSize: 16,
    color: '#FFA001',
    marginBottom: 20,
  },
  basketItem: {
    backgroundColor: '#d6b2ff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  basketTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  basketDetails: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
    color: '#FFFFFF',
  },
  basketTime: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  basketStatus: {
    fontSize: 14,
    color: '#FFA001',
    marginTop: 5,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptyStateText: {
    color: '#B0B0B0',
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#161622',
  },
  error: {
    color: '#FF0000',
    textAlign: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
});
