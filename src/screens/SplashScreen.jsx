import React, { useEffect } from "react";
import { View, StyleSheet, Image, ActivityIndicator } from "react-native";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      // For now,
      navigation.replace("user");

      // Later:
      // if (token && role === "user") navigation.replace("user");
      // else if (token && role === "admin") navigation.replace("admin");
      // else if (token && role === "driver") navigation.replace("driver");
      // else navigation.replace("auth");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 100,
  },
});
