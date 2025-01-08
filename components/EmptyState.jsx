// components/EmptyState.jsx

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import CustomButton from "./CustomButton";

const EmptyState = ({ title, subtitle }) => {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/empty.png")} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <CustomButton
        title="Back to Explore"
        handlePress={() => router.push("/home")}
        containerStyles={styles.buttonContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#000000", // Optionnel : si fond requis
  },
  image: {
    width: 270,
    height: 216,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
});

export default EmptyState;
