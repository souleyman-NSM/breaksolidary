// screens/Donor/DonorHomeScreen.jsx

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../firebaseConfig'; // Assurez-vous que Firebase est configuré

export default function DonorHomeScreen() {
  const [baskets, setBaskets] = React.useState([]);
  const navigation = useNavigation();

  React.useEffect(() => {
    const unsubscribe = db.collection('baskets')
      .onSnapshot(snapshot => {
        const basketList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBaskets(basketList);
      });

    return () => unsubscribe();
  }, []);

  const handleCreateBasket = () => {
    navigation.navigate('CreateScreen');
  };

  const handleNavigateToTabs = () => {
    navigation.navigate('Tabs');
  };

  const renderItem = ({ item }) => (
    <View style={styles.basketItem}>
      <Text style={styles.basketTitle}>{item.category}</Text>
      <Text style={styles.basketDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bienvenue dans l'application des donateurs!</Text>
      <Text style={styles.explanationText}>
        Vous pouvez créer des paniers pour aider ceux dans le besoin. Consultez l'historique de vos paniers ci-dessous et créez-en de nouveaux en utilisant le bouton ci-dessous.
      </Text>

      <FlatList
        data={baskets}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.basketList}
      />

      <TouchableOpacity style={styles.createButton} onPress={handleCreateBasket}>
        <Text style={styles.createButtonText}>Créer un Panier</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.helpButton} onPress={() => alert('Aide')}>
        <Text style={styles.helpButtonText}>Aide</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navigateButton} onPress={handleNavigateToTabs}>
        <Text style={styles.navigateButtonText}>Voir les Onglets</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#161622',
  },
  welcomeText: {
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  explanationText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  basketList: {
    flex: 1,
    marginBottom: 20,
  },
  basketItem: {
    backgroundColor: '#282828',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  basketTitle: {
    fontSize: 18,
    color: '#FFA001',
    marginBottom: 5,
  },
  basketDescription: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  createButton: {
    backgroundColor: '#FFA001',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  createButtonText: {
    color: '#161622',
    fontWeight: 'bold',
  },
  helpButton: {
    backgroundColor: '#282828',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  helpButtonText: {
    color: '#FFFFFF',
  },
  navigateButton: {
    backgroundColor: '#FFA001',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  navigateButtonText: {
    color: '#161622',
    fontWeight: 'bold',
  },
});
