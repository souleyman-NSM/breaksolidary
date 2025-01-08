// components/PickerScreen.jsx

import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PickerScreen() {
  const navigation = useNavigation();

  const handleNavigateToSignUp = (role) => {
    navigation.navigate(`${role}SignUp`);
  };

  return (
    <View style={styles.container}>
      <Button title="Sign Up as Donor" onPress={() => handleNavigateToSignUp('Donor')} />
      <Button title="Sign Up as Beneficiary" onPress={() => handleNavigateToSignUp('Beneficiary')} />
      <Button title="Sign Up for Deal" onPress={() => handleNavigateToSignUp('Deal')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
