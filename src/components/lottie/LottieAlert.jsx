import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import LottieView from "lottie-react-native";

export const LottieAlert = ({ type, message, onClose, autoClose = true, loop = true, visible }) => {
  const getSource = () => {
    switch (type) {
      case "success": return require("./success.json");
      case "failure": return require("./failure.json");
      case "warning": return require("./warning.json");
      default: return null;
    }
  };

  useEffect(() => {
    if (autoClose && visible) {
      const timer = setTimeout(() => onClose?.(), 2000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.4)",
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
            source={getSource()}
            autoPlay
            loop={loop}
            style={{ width: 100, height: 100 }}
          />

          <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "600", textAlign: "center" }}>
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
};
