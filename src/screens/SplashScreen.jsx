import React, { useEffect } from "react";
import { View, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { selectUser } from "../store/selector";

export default function SplashScreen({ navigation }) {

  const user = useSelector(selectUser);
  console.log("User in splash screen", user);
  useEffect(() => {
    const timer = setTimeout(() => {

      if(user && user?.role === "USER" && user?.status === "ACTIVE") {
      // if(true){
      // For now,
      console.log("navigating to user");
        navigation.replace("driver");
      } else if(user && user?.role === "ADMIN" && user?.status === "ACTIVE") {
        console.log("navigating to admin");
        navigation.replace("admin");
      } else if(user && user?.role === "DRIVER" && user?.status === "ACTIVE") {
        console.log("navigating to driver");
        navigation.replace("driver");
      } else {
        navigation.replace("auth");
      }

    }, 2000); // 2 seconds delay for splash screen

    return () => clearTimeout(timer);
  }, [user, navigation]);

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
