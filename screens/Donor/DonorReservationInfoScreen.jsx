//screens/Donor/DonorReservationInfoScreen.jsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { db } from '../../firebaseConfig';

export default function DonorReservationInfoScreen({ route }) {
  const [beneficiaryDetails, setBeneficiaryDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { beneficiaryId } = route.params;

  useEffect(() => {
    const fetchBeneficiaryDetails = async () => {
      try {
        const userDoc = await db.collection('users').doc(beneficiaryId).get();
        if (userDoc.exists) {
          setBeneficiaryDetails(userDoc.data());
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des informations du bénéficiaire:', error);
      } finally {
        setLoading(false);
      }
    };

    if (beneficiaryId) {
      fetchBeneficiaryDetails();
    }
  }, [beneficiaryId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#FFA001" style={styles.loading} />;
  }

  if (!beneficiaryDetails) {
    return <Text style={styles.errorText}>Informations du bénéficiaire non trouvées</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Informations du Bénéficiaire</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nom: {beneficiaryDetails.firstName} {beneficiaryDetails.lastName}</Text>
        <Text style={styles.label}>Email: {beneficiaryDetails.email}</Text>
        <Text style={styles.label}>Téléphone: {beneficiaryDetails.phone || 'Non fourni'}</Text>
        <Text style={styles.label}>Adresse: {beneficiaryDetails.address || 'Non fournie'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 18,
    color: '#555',
    marginBottom: 15,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  errorText: {
    fontSize: 20,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});
