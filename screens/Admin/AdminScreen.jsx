// screens/AdminScreen.jsx

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { db } from '../../firebaseConfig'; // Assure-toi que db est correctement importé depuis ta configuration Firebase

export default function AdminScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null); // Réinitialiser l'erreur
        console.log("Tentative de récupération des utilisateurs...");

        const usersRef = db.collection('users').where('verified', '==', false);
        const snapshot = await usersRef.get();

        if (!snapshot.empty) {
          const usersList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUsers(usersList);
          console.log("Utilisateurs récupérés avec succès:", usersList);
        } else {
          console.log('Aucun utilisateur en attente de vérification.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        setError('Impossible de récupérer les utilisateurs. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleVerifyUser = async (userId) => {
    try {
      await db.collection('users').doc(userId).update({
        verified: true,
      });
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      Alert.alert('Succès', `Utilisateur ${userId} vérifié avec succès.`);
    } catch (error) {
      console.error(`Erreur lors de la vérification de l'utilisateur ${userId}:`, error);
      Alert.alert('Erreur', `Impossible de vérifier l'utilisateur ${userId}.`);
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      await db.collection('users').doc(userId).delete();
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      Alert.alert('Succès', `Utilisateur ${userId} rejeté.`);
    } catch (error) {
      console.error(`Erreur lors du rejet de l'utilisateur ${userId}:`, error);
      Alert.alert('Erreur', `Impossible de rejeter l'utilisateur ${userId}.`);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFA001" />
        <Text style={styles.loadingText}>Chargement des utilisateurs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard Administrateur</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userContainer}>
            <Text style={styles.userInfo}>Email: {item.email}</Text>
            <Text style={styles.userInfo}>Type: {item.type}</Text>
            {item.type === 'donor' && (
              <>
                <Text style={styles.userInfo}>Nom du Restaurant: {item.restaurantName}</Text>
                <Text style={styles.userInfo}>Adresse du Restaurant: {item.restaurantAddress}</Text>
              </>
            )}
            <Text style={styles.userInfo}>Prénom: {item.firstName}</Text>
            <Text style={styles.userInfo}>Nom: {item.lastName}</Text>
            <Text style={styles.userInfo}>Numéro de téléphone: {item.phoneNumber}</Text>

            <View style={styles.buttonContainer}>
              <Button title="Vérifier" onPress={() => handleVerifyUser(item.id)} color="#4CAF50" />
              <Button title="Rejeter" onPress={() => handleRejectUser(item.id)} color="#F44336" />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFA001',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FF0000',
    textAlign: 'center',
    marginTop: 20,
  },
  userContainer: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  userInfo: {
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
});
