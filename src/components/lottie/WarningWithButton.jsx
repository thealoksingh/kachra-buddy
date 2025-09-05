import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import { Colors } from "../../styles/commonStyles";

export const WarningWithButton = ({ 
  message, 
  onYes, 
  onClose, 
  yesText = "Yes", 
  noText = "No",
  loop = true
}) => {
  return (
    <View
      style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
        zIndex: 1000,
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 12,
          alignItems: "center",
          width: "80%",
          elevation: 5,
        }}
      >
         <TouchableOpacity
          onPress={onClose}
          style={{ position: "absolute", top: 8, right: 8 }}
        >
          <Text style={{ fontSize: 30, fontWeight: "500", marginRight: 6 }}>×</Text>
        </TouchableOpacity>

         <LottieView
          source={require("./warning.json")}
          autoPlay
          loop={loop}
          style={{ width: 100, height: 100 }}
        />

         <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "600", textAlign: "center" }}>
          {message}
        </Text>

         <View style={{ flexDirection: "row", marginTop: 20 }}>
          <TouchableOpacity
            onPress={onYes}
            style={{
              flex: 1,
              backgroundColor: Colors.secondary,
              paddingVertical: 10,
              marginRight: 10,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>{yesText}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            style={{
              flex: 1,
              backgroundColor: "#e0e0e0",
              paddingVertical: 10,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#333", fontWeight: "600" }}>{noText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
