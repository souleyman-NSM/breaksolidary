// screens/Donor/DonorReservationScreen.jsx

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, ScrollView, Button } from 'react-native';
import { db, auth } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function DonorReservationScreen() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const donorId = auth.currentUser ? auth.currentUser.uid : null;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchReservations = async () => {
      if (!donorId) return;

      try {
        const basketsSnapshot = await db.collection('baskets')
          .where('donorId', '==', donorId)
          .where('status', '==', 'reserved')
          .get();

        const basketsData = basketsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          beneficiaryName: doc.data().reservedByName || 'Nom inconnu',
          pickupTime: `${doc.data().startTime?.toDate().toLocaleTimeString() || 'Heure inconnue'} - ${doc.data().endTime?.toDate().toLocaleTimeString() || 'Heure inconnue'}`,
          description: doc.data().description || 'Pas de description',  // Description du panier
        }));

        setReservations(basketsData);
      } catch (error) {
        console.error('Erreur lors de la récupération des réservations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [donorId]);

  const confirmPickup = async (basketId) => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir confirmer la récupération de ce panier?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Confirmer',
          onPress: async () => {
            try {
              // Déplacer le panier vers l'historique de l'admin
              const basketSnapshot = await db.collection('baskets').doc(basketId).get();
              const basketData = basketSnapshot.data();

              if (basketData) {
                const historyRef = db.collection('history'); // Collection où les paniers récupérés sont enregistrés

                await historyRef.add({
                  ...basketData, // Conserver toutes les informations du panier
                  status: 'pickedUp', // Modifier le statut en "récupéré"
                  pickupDate: new Date(), // Ajouter la date de récupération
                });

                // Marquer le panier comme récupéré et non disponible
                await db.collection('baskets').doc(basketId).update({
                  status: 'pickedUp',
                  reservedById: null, // Retirer l'ID du bénéficiaire
                  reservedByName: null, // Retirer le nom du bénéficiaire
                  available: false, // Le panier n'est plus disponible
                });

                // Supprimer le panier de la liste des réservations
                setReservations(reservations.filter(item => item.id !== basketId));

                Alert.alert('Succès', 'Panier récupéré avec succès!');
              }
            } catch (error) {
              console.error('Erreur lors de la confirmation de récupération:', error);
              Alert.alert('Erreur', 'Une erreur est survenue.');
            }
          },
        },
        {
          text: 'Annuler la réservation',
          onPress: () => cancelReservation(basketId),
        },
      ],
      { cancelable: false }
    );
  };

  const cancelReservation = async (basketId) => {
    try {
      await db.collection('baskets').doc(basketId).update({
        status: 'available',
        reservedById: null,
        reservedByName: null,
      });
      const updatedReservations = reservations.filter(item => item.id !== basketId);
      setReservations(updatedReservations);
      Alert.alert('Succès', 'La réservation a été annulée, le panier est à nouveau disponible.');
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la réservation:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'annulation de la réservation.');
    }
  };

  if (loading) {
    return <Text style={styles.loadingText}>Chargement...</Text>;
  }

  if (donorId === null) {
    return <Text style={styles.errorText}>Utilisateur non authentifié</Text>;
  }

  if (reservations.length === 0) {
    return <Text style={styles.noReservationsText}>Aucune réservation</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reservations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.reservationItem}>
            <Text style={styles.title}>Panier: {item.category}</Text>

            {/* Détails du panier */}
            <View style={styles.basketDetails}>
              <Text style={styles.label}>Description:</Text>
              <Text style={styles.value}>{item.description}</Text>

              <Text style={styles.label}>Heure de récupération:</Text>
              <Text style={styles.value}>{item.pickupTime}</Text>
            </View>

            {/* Détails du donateur */}
            <View style={styles.donorDetails}>
              <Text style={styles.sectionTitle}>Détails du donateur</Text>
              <Text style={styles.label}>Nom:</Text>
              <Text style={styles.value}>{item.beneficiaryName}</Text>
            </View>

            <TouchableOpacity 
              style={styles.button} 
              onPress={() => navigation.navigate('DonorReservationInfo', { beneficiaryId: item.reservedById })}
            >
              <Text style={styles.buttonText}>Voir Détails</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.button} 
              onPress={() => confirmPickup(item.id)}
            >
              <Text style={styles.buttonText}>Confirmer récupération</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, { backgroundColor: 'red' }]} 
              onPress={() => cancelReservation(item.id)}
            >
              <Text style={styles.buttonText}>Annuler la réservation</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  reservationItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  basketDetails: {
    marginTop: 10,
  },
  donorDetails: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FFA001',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
  },
  noReservationsText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
  },
});
