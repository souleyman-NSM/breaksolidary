// screens/Donor/CreateScreen.jsx
       
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Button, Alert, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db, auth } from '../../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';

export default function CreateBasketScreen({ navigation }) {
  const [category, setCategory] = useState('Nourriture');
  const [description, setDescription] = useState('');
  const [reservationDate, setReservationDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [image, setImage] = useState(null);

  // Fonction pour choisir une image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const createBasket = async () => {
    if (!category || !description || !reservationDate || !startTime || !endTime || !image) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires, y compris l\'image.');
      return;
    }

    const donorId = auth.currentUser ? auth.currentUser.uid : null;
    if (donorId) {
      try {
        await db.collection('baskets').add({
          donorId, // C'est bien ce champ que tu utilises pour identifier le donateur
          category,
          description,
          reservationDate,
          startTime,
          endTime,
          image,
          status: 'available',
          createdAt: new Date(),
        });
        
        Alert.alert('Succès', 'Panier créé avec succès.');
        navigation.goBack();
      } catch (error) {
        console.error('Erreur lors de la création du panier:', error);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Créer un Panier</Text>

        <Text style={styles.label}>Catégorie</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            style={styles.picker}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            <Picker.Item label="Nourriture" value="Nourriture" />
            <Picker.Item label="Habit" value="Habit" />
            <Picker.Item label="Hygiène" value="Hygiène" />
          </Picker>
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textInput}
          value={description}
          onChangeText={setDescription}
          placeholder="Décrivez votre panier"
          multiline
        />

        {/* Choix de la date */}
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
          <Text style={styles.pickerText}>
            Date de disponibilité: {reservationDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={reservationDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setReservationDate(selectedDate);
            }}
          />
        )}

        {/* Choix des horaires */}
        <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.timePicker}>
          <Text style={styles.pickerText}>
            Heure de début: {startTime.toLocaleTimeString()}
          </Text>
        </TouchableOpacity>
        {showStartTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(event, selectedTime) => {
              setShowStartTimePicker(false);
              if (selectedTime) setStartTime(selectedTime);
            }}
          />
        )}

        <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.timePicker}>
          <Text style={styles.pickerText}>
            Heure de fin: {endTime.toLocaleTimeString()}
          </Text>
        </TouchableOpacity>
        {showEndTimePicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(event, selectedTime) => {
              setShowEndTimePicker(false);
              if (selectedTime) setEndTime(selectedTime);
            }}
          />
        )}

        {/* Sélection de l'image */}
        <Button title="Choisir une image" onPress={pickImage} color="#FFA001" />
        {image && <Image source={{ uri: image }} style={styles.previewImage} />}

        <Button title="Créer Panier" onPress={createBasket} color="#FFA001" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flexGrow: 1,
    backgroundColor: '#1E1E2D',
    padding: 20,
  },
  container: {
    backgroundColor: '#1E1E2D',
    marginTop: 60,
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
  },
  pickerContainer: {
    backgroundColor: '#282828',
    borderRadius: 10,
    marginBottom: 20,
  },
  picker: {
    color: '#FFFFFF',
    paddingHorizontal: 20,
  },
  textInput: {
    height: 100,
    color: '#FFFFFF',
    backgroundColor: '#282828',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  datePicker: {
    backgroundColor: '#282828',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  timePicker: {
    backgroundColor: '#282828',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerText: {
    color: '#FFFFFF',
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
});
