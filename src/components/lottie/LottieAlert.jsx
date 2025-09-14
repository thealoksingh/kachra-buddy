import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import LottieView from "lottie-react-native";
import { useSelector, useDispatch } from 'react-redux';
import { hideLottieAlert } from '../../store/slices/lottieAlertSlice';

export const LottieAlert = ({ type, message, onClose, autoClose = true, loop, visible }) => {
  const dispatch = useDispatch();
  const lottieAlert = useSelector(state => state.lottieAlert);
  
  // Use Redux state if no props provided
  const alertType = type || lottieAlert.type;
  const alertMessage = message || lottieAlert.message;
  const alertVisible = visible !== undefined ? visible : lottieAlert.visible;
  const alertAutoClose = autoClose !== undefined ? autoClose : lottieAlert.autoClose;
  
  // Auto loop logic: success = false, failure/warning = true
  const alertLoop = loop !== undefined ? loop : (alertType === 'success' ? false : true);
  
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      dispatch(hideLottieAlert());
    }
  };
  const getSource = () => {
    switch (alertType) {
      case "success": return require("./success.json");
      case "failure": return require("./failure.json");
      case "warning": return require("./warning.json");
      default: return null;
    }
  };

  useEffect(() => {
    if (alertAutoClose && alertVisible) {
      const timer = setTimeout(() => handleClose(), 2000);
      return () => clearTimeout(timer);
    }
  }, [alertVisible, alertAutoClose]);

  if (!alertVisible) return null;
  
  return (
    <Modal transparent animationType="fade" visible={alertVisible}>
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
            onPress={handleClose}
            style={{ position: "absolute", top: 8, right: 8 }}
          >
            <Text style={{ fontSize: 30, fontWeight: "500", marginRight: 6 }}>×</Text>
          </TouchableOpacity>

          <LottieView
            source={getSource()}
            autoPlay
            loop={alertLoop}
            style={{ width: 100, height: 100 }}
          />

          <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "600", textAlign: "center" }}>
            {alertMessage}
          </Text>
        </View>
      </View>
    </Modal>
  );
};
