import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../styles/commonStyles";
import MyStatusBar from "../components/MyStatusBar";

const NoInternetScreen = ({ onRetry }) => {
  return (
    <View style={styles.container}>
     <MyStatusBar/>
      <Image
        source={require("../../assets/images/NoInternet.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>No Internet Connection</Text>

        <Text style={styles.message}>
        Please check your network settings and try again.
      </Text>

      <TouchableOpacity style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoInternetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: "70%",
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.primaryColor,
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: Colors.grayColor,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  button: {
    backgroundColor: Colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: Colors.whiteColor,
    fontWeight: "600",
    fontSize: 16,
  },
});
