// screens/Beneficiary/BeneficiaryDetailsScreen.jsx

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Alert, Button, Image, ScrollView } from 'react-native';
import { db, auth } from '../../firebaseConfig';

export default function BeneficiaryBasketDetailsScreen({ route, navigation }) {
  const [basket, setBasket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donorDetails, setDonorDetails] = useState(null);
  const { basketId } = route.params;
  const beneficiaryId = auth.currentUser ? auth.currentUser.uid : null;

  // Charger les détails du panier et du donateur
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const basketDoc = await db.collection('baskets').doc(basketId).get();
        const basketData = basketDoc.data();
        setBasket(basketData);

        if (basketData && basketData.donorId) {
          const donorDoc = await db.collection('users').doc(basketData.donorId).get();
          if (donorDoc.exists) {
            setDonorDetails(donorDoc.data());
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des détails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [basketId]);

  const handleReserve = async () => {
    if (!beneficiaryId) {
      Alert.alert('Erreur', 'Bénéficiaire non authentifié.');
      return;
    }

    try {
      if (basket && basket.status === 'available') {
        await db.collection('baskets').doc(basketId).update({
          status: 'reserved',
          reservedById: beneficiaryId,
          reservedByName: `${auth.currentUser.displayName || 'Nom inconnu'}`,
        });

        Alert.alert('Succès', 'Votre réservation a été enregistrée.');
        navigation.navigate('Explore');
      } else {
        Alert.alert('Erreur', 'Ce panier a déjà été réservé ou récupéré.');
      }
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la réservation.');
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!basket) {
    return <Text>Panier introuvable</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Catégorie:</Text>
      <Text style={styles.value}>{basket.category}</Text>

      <Text style={styles.label}>Description:</Text>
      <Text style={styles.value}>{basket.description}</Text>

      <Text style={styles.label}>Date de réservation:</Text>
      <Text style={styles.value}>
        {basket.reservationDate?.toDate().toLocaleDateString()}
      </Text>

      <Text style={styles.label}>De:</Text>
      <Text style={styles.value}>{basket.startTime?.toDate().toLocaleTimeString()}</Text>

      <Text style={styles.label}>À:</Text>
      <Text style={styles.value}>{basket.endTime?.toDate().toLocaleTimeString()}</Text>

      {basket.image && <Image source={{ uri: basket.image }} style={styles.basketImage} />}

      {/* Détails du donateur */}
      <View style={styles.donorDetails}>
        <Text style={styles.sectionTitle}>Détails du donateur</Text>
        {donorDetails ? (
          <>
            <Text style={styles.label}>Nom:</Text>
            <Text style={styles.value}>{donorDetails.firstName} {donorDetails.lastName}</Text>

            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{donorDetails.email}</Text>

            <Text style={styles.label}>Téléphone:</Text>
            <Text style={styles.value}>{donorDetails.phone || 'Non fourni'}</Text>

            <Text style={styles.label}>Adresse:</Text>
            <Text style={styles.value}>{donorDetails.address || 'Non fournie'}</Text>
          </>
        ) : (
          <Text style={styles.errorText}>Informations du donateur indisponibles.</Text>
        )}
      </View>

      {basket.status === 'available' && (
        <Button title="Réserver" onPress={handleReserve} color="#FFA001" />
      )}
      {basket.status === 'pickedUp' && (
        <Text style={styles.errorText}>Ce panier a déjà été récupéré.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2D',
    padding: 20,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 10,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
  },
  basketImage: {
    width: '100%',
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
  donorDetails: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 10,
  },
  sectionTitle: {
    color: '#FFA001',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
