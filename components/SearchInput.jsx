// components/SearchInput.jsx

import React, { useState } from 'react';
import { View, TouchableOpacity, Image, TextInput, Alert, StyleSheet } from 'react-native';
import { router, usePathname } from 'expo-router';
import { icons } from '../constants';

const SearchInput = ({ initialQuery }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        placeholder="Rechercher un restaurant"
        placeholderTextColor="#CDCDE0"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (query === "")
            return Alert.alert(
              "Missing Query",
              "Please input something to search results across database"
            );

          if (pathname.startsWith("/search")) router.setParams({ query });
          else router.push(`/search/${query}`);
        }}
      >
        <Image source={icons.search} style={styles.icon} resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 64,
    paddingHorizontal: 16,
    backgroundColor: '#1C1C1E',  // bg-black-100
    borderRadius: 16,             // rounded-2xl
    borderWidth: 2,
    borderColor: '#232533',      // border-black-200
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginTop: 2,                // mt-0.5
    color: '#fff',
    fontFamily: 'Poppins-Regular', // font-pregular
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default SearchInput;