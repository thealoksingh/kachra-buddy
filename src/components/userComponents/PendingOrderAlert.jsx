import LottieView from "lottie-react-native";
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { Colors } from "../../styles/commonStyles";
import { useNavigation } from "@react-navigation/native";

export const PendingOrderAlert = ({ title, message, visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(150)).current; 
  const navigation=useNavigation();
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 150,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom: Platform.OS === "android" ? 20 : 30,
        left: 0,
        right: 0,
        zIndex: 9999,
        elevation: 9999,
        transform: [{ translateY: slideAnim }],
        paddingHorizontal: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          backgroundColor:Colors.whiteColor,
          borderRadius: 16,
          padding: 16,
          alignItems: "center",
          elevation: 6,
          shadowColor: "#000",
          shadowOpacity: 0.5,
          shadowRadius: 6,
        }}
      >
         <LottieView
          source={require("../lottie/warning.json")}
          autoPlay
          loop
          style={{ width: 50, height: 50, marginRight: 12 }}
        />

         <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: "700", marginBottom: 4 }}>
            {title || "Pending Order"}
          </Text>
          <Text style={{ fontSize: 13, color: "gray", marginBottom: 8 }}>
            {message || "Please complete your order to continue."}
          </Text>

          <TouchableOpacity
            onPress={()=>navigation.navigate("bookingScreen")}
            style={{
              alignSelf: "flex-start",
              backgroundColor: Colors.secondary,
              paddingVertical: 6,
              paddingHorizontal: 16,
              borderRadius: 6,
            }}
          >
            <Text style={{ color: "white", fontSize: 13, fontWeight: "600" }}>
              Complete
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onClose} style={{ marginLeft: 8,position:"absolute",right:20,top:10 }}>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>×</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};
