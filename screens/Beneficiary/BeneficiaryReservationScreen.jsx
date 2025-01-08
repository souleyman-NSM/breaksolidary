// screens/Beneficiary/BeneficiaryReservationScreen.jsx

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Alert } from 'react-native';
import { db, auth } from '../../firebaseConfig';

export default function BeneficiaryReservationScreen({ navigation }) {
    const [reservations, setReservations] = useState([]);
    const currentUserId = auth.currentUser ? auth.currentUser.uid : null;

    useEffect(() => {
        if (!currentUserId) {
            Alert.alert('Erreur', 'Utilisateur non connecté.');
            return;
        }

        const fetchReservations = async () => {
            try {
                const reservationSnapshot = await db
                    .collection('users')
                    .doc(currentUserId)
                    .collection('reservations')
                    .get();

                const reservationList = reservationSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setReservations(reservationList);
            } catch (error) {
                console.error('Erreur lors de la récupération des réservations:', error);
                Alert.alert('Erreur', 'Impossible de récupérer les réservations.');
            }
        };

        fetchReservations();
    }, [currentUserId]);

    const renderReservationItem = ({ item }) => (
        <View style={styles.basketItem}>
            <Text style={styles.basketTitle}>{item.category}</Text>
            <Text style={styles.basketDescription}>{item.description}</Text>
        </View>
    );

    if (!reservations.length) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Aucune réservation trouvée</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={reservations}
                keyExtractor={item => item.id}
                renderItem={renderReservationItem}
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
    title: {
        fontSize: 24,
        color: '#FFFFFF',
        marginBottom: 15,
        marginTop: 30,
    },
    basketItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#232533',
    },
    basketTitle: {
        fontSize: 20,
        color: '#FFA001',
        marginBottom: 5,
    },
    basketDescription: {
        fontSize: 16,
        color: '#CCCCCC',
    },
});

