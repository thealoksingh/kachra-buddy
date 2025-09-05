import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image

} from 'react-native';
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from '../styles/commonStyles';
import OTPTextView from 'react-native-otp-textinput';
import Ionicons from 'react-native-vector-icons/Ionicons';
// ...existing code...
export function AuthInput({ label, value, setter, placeholder, type }) {
  const keyboardType =
    type === 'number'
      ? 'numeric'
      : type === 'email'
      ? 'email-address'
      : 'default';

  const handleChangeText = text => {
    if (type === 'email') {
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
        maxLength={type === 'number' ? 10 : 50}
      />
    </View>
  );
}

export function ButtonWithLoader({ name, loadingName, isLoading, method }) {
  return isLoading ? (
    <View style={{ ...commonStyles.button, flexDirection: 'row', gap: 10 }}>
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
export function OtpFields({ otpInput, setOtpInput }) {
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

export function CommonAppBar({ label, navigation }) {
  return (
    <View style={styles.appBar}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation?.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>{label}</Text>
      <View style={{ width: 20 }} />
    </View>
  );
}
export function commonLabel(label, optional) {
  return (
    <Text style={styles.sectionLabel}>
      {label}
      {optional ? (
        <Text style={styles.optional}> (Optional)</Text>
      ) : (
        <Text style={styles.label}>*</Text>
      )}
    </Text>
  );

}

export function InputBox({value, setter, placeholder, label, optional, type}) {
  return (
    <>
      {commonLabel(label, optional)}
      <TextInput
        style={styles.boxInput}
        placeholder={placeholder}
        placeholderTextColor="gray"
        value={value}
        onChangeText={(text) => {
          setter(text);
        }}
        keyboardType={type}
      />
    </>
  );
}
export function TextArea({ value, setter, placeholder, label, optional }) {
  return (
    <>
      {commonLabel(label, optional)}
      <TextInput
        style={styles.textAreaInput}
        placeholder={placeholder}
        placeholderTextColor="gray"
        value={value}
        onChangeText={setter}
        multiline={true} 
        textAlignVertical="top" 
      />
    </>
  );
}
export function FaddedIcon({}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
      }}
    >
      <Image
        source={require('../../assets/images/logo.png')}
        style={{
          width: 120,
          height: 120,
          resizeMode: 'contain',
          marginLeft: 10,
          opacity: 0.2,
        }}
      />
    </View>
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
    fontWeight: '700',
  },
  input: {
    paddingVertical: 10,
    ...Fonts.blackColor12Medium,
  },
  textFieldStyle: {
    width: screenWidth / 9,
    height: 45,
    textAlign: 'center',
    borderRadius: Sizes.fixPadding - 5.0,
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.primaryColor,
    borderWidth: 1.5,
    ...Fonts.blackColor16SemiBold,
    ...commonStyles.shadow,
    marginHorizontal: Sizes.fixPadding / 2,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bodyBackColor,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0eb',
  }, sectionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    color: "#F4721E",
    marginBottom: 5,
  },
  optional: {
    fontSize: 12,
    fontWeight: "normal",
    color: "#888",
  },boxInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
    backgroundColor: "#f5f5f5",
    marginBottom: 15,
    height: 45,
  },  textAreaInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
    backgroundColor: "#f5f5f5",
    marginBottom: 15,
    height: 100, 
  },
});
