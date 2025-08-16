import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyStatusBar from '../../components/MyStatusBar';
import {
  AuthInput,
  ButtonWithLoader,
  OtpFields,
} from '../../components/commonComponents';
import { Colors, Fonts } from '../../styles/commonStyles';

const SignupScreen = () => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [role, setRole] = useState('user'); // ✅ default selected role

  const handleSignUp = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const handleOtpSend = () => {
    setLoading(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar />

      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/images/logo.png')}
          style={[styles.logo, { tintColor: 'white' }]}
          resizeMode="contain"
        />
      </View>

      {/* Form Section */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>{otpSent ? 'Enter OTP' : 'Sign UP'}</Text>

        {otpSent ? (
          <OtpFields otpInput={otpInput} setOtpInput={setOtpInput} />
        ) : (
          <>
            <Text style={styles.inputLabel}>Role :</Text>
            <View style={styles.roleContainer}>
              {['user', 'driver'].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.roleButton,
                    role === item && styles.roleButtonSelected,
                  ]}
                  onPress={() => setRole(item)}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      role === item && styles.radioCircleSelected,
                    ]}
                  />
                  <Text
                    style={[
                      styles.roleButtonText,
                      role === item && styles.roleButtonTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <AuthInput
              label="Full Name"
              type="default"
              value={name}
              setter={setName}
              placeholder="Enter Your Full Name"
            />
            <AuthInput
              label="Phone"
              type="number"
              value={phone}
              setter={setPhone}
              placeholder="Enter Mobile Number"
            />
          </>
        )}
        {otpSent ? (
          <ButtonWithLoader
            name="Sign Up"
            loadingName="Processing..."
            isLoading={loading}
            method={handleSignUp}
          />
        ) : (
          <ButtonWithLoader
            name="Send OTP"
            loadingName="Processing..."
            isLoading={loading}
            method={handleOtpSend}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  logoContainer: {
    backgroundColor: Colors.primary,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logo: {
    width: 200,
    height: 200,
  },
  formContainer: {
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.blackColor,
    marginBottom: 20,
  },
  inputLabel: {
    ...Fonts.blackColor14SemiBold,
    fontWeight: '700',
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 20,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
  },
  roleButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10', // light tint
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginRight: 8,
  },
  radioCircleSelected: {
    backgroundColor: Colors.primary,
  },
  roleButtonText: {
    ...Fonts.blackColor14SemiBold,
    color: Colors.blackColor,
  },
  roleButtonTextSelected: {
    color: Colors.primary,
  },
});
