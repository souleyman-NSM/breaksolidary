// /components/CustomButton.jsx

import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const CustomButton = ({
  title,
  handlePress,
  containerStyles = {},
  textStyles = {},
  isLoading = false,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.button,
        containerStyles,
        isLoading && styles.buttonDisabled,
      ]}
      disabled={isLoading}
    >
      <Text style={[styles.text, textStyles]}>{title}</Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          style={styles.loader}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#fc7d3a", // Replace with your secondary color
    borderRadius: 10,
    minHeight: 62,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    color: "#FFFFFF", // Replace with your primary color
    fontWeight: "600",
    fontSize: 18,
  },
  loader: {
    marginLeft: 8,
  },
});

export default CustomButton;
