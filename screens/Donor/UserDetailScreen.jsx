// screens/Donor/UserDetailScreen.jsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from '../../firebaseConfig';

export default function UserDetailScreen({ route }) {
  const { reservedById } = route.params;  // Get the beneficiary ID passed via navigation
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!reservedById) {
        setError('ID du bénéficiaire non disponible.');
        setLoading(false);
        return;
      }

      try {
        const userDoc = await db.collection('users').doc(reservedById).get();
        if (userDoc.exists) {
          setUser(userDoc.data());
        } else {
          setError('Utilisateur non trouvé');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur:', error);
        setError('Erreur lors de la récupération des informations utilisateur');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [reservedById]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Aucune information disponible pour cet utilisateur.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détails de l'utilisateur</Text>
      <Text style={styles.info}>Nom: {user.firstName} {user.lastName}</Text>
      <Text style={styles.info}>Téléphone: {user.phoneNumber}</Text>
      <Text style={styles.info}>Email: {user.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
});