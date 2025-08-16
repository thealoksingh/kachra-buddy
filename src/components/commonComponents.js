import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Colors, Fonts, Sizes, commonStyles, screenWidth } from "../styles/commonStyles";
import OTPTextView from "react-native-otp-textinput";
export function AuthInput({ label, value, setter, placeholder, type }) {
  const keyboardType =
    type === "number"
      ? "numeric"
      : type === "email"
      ? "email-address"
      : "default";

  const handleChangeText = (text) => {
    if (type === "email") {
      setter(text.toLowerCase());
    } else {
      setter(text);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}:</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType={keyboardType}
        value={value}
        onChangeText={handleChangeText}
        maxLength={type === "number" ? 10 : 50}
      />
    </View>
  );
}

export function ButtonWithLoader({ name, loadingName, isLoading, method }) {
  return isLoading ? (
    <View style={{ ...commonStyles.button, flexDirection: "row", gap: 10 }}>
      <ActivityIndicator size="small" color={Colors.whiteColor} />
      <Text style={{ ...commonStyles.buttonText }}>{loadingName}</Text>
    </View>
  ) : (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{ ...commonStyles.button }}
      onPress={method}
    >
      <Text style={{ ...commonStyles.buttonText }}>{name}</Text>
    </TouchableOpacity>
  );
}
export function OtpFields({otpInput, setOtpInput}) {
  return (
    <OTPTextView
      containerStyle={{
        margin: Sizes.fixPadding * 2.0,
        marginVertical: Sizes.fixPadding * 2.0,
      }}
      handleTextChange={setOtpInput}
      inputCount={4}
      keyboardType="numeric"
      tintColor={Colors.primary}
      offTintColor={Colors.extraLightGrayColor}
      textInputStyle={styles.textFieldStyle}
    />
  );
}
const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.extraLightGrayColor,
  },
  inputLabel: {
    ...Fonts.blackColor14SemiBold,
    fontWeight: "700",
  },
  input: {
    paddingVertical: 10,
    ...Fonts.blackColor12Medium,
  },
   textFieldStyle: {
    width: screenWidth / 9,
    height: 45,
    textAlign: "center",
    borderRadius: Sizes.fixPadding - 5.0,
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.primaryColor,
    borderWidth: 1.5,
    ...Fonts.blackColor16SemiBold,
    ...commonStyles.shadow,
    marginHorizontal: Sizes.fixPadding / 2,
  },
});
