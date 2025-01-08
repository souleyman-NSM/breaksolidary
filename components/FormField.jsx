// components/FormField.jsx

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, otherStyles]}>
      <Text style={styles.label}>{title}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Mot de Passe" && !showPassword}
          {...props}
        />

        {title === "Mot de Passe" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={require("../assets/icons/eye.png")} // Remplacez par vos icônes
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
    marginBottom: 8,
  },
  inputContainer: {
    width: "100%",
    height: 56,
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#2C2C2E",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default FormField;
