import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyStatusBar from '../../components/MyStatusBar';
import {
  AuthInput,
  ButtonWithLoader,
  OtpFields,
} from '../../components/commonComponents';
import { Colors } from '../../styles/commonStyles';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // step 1: send otp
  const handleOtpSend = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 1500);
  };

  // step 2: verify otp
  const handleVerifyOtp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsVerified(true);

      const userActive = false;
      setIsActive(userActive);

      if (userActive) {
        navigation.replace('home'); // directly go to home
      }
    }, 1500);
  };

  // step 3: signup new user
  const handleSignup = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('home'); // after signup success
    }, 1500);
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
        <Text style={styles.title}>
          {!otpSent
            ? 'Sign In'
            : !isVerified
            ? 'Enter OTP'
            : !isActive
            ? 'Sign Up'
            : ''}
        </Text>

        {/* Phone Input */}
        {!otpSent && (
          <AuthInput
            label="Phone"
            type="number"
            value={phone}
            setter={setPhone}
            placeholder="Enter Mobile Number"
          />
        )}

        {/* OTP Input */}
        {otpSent && !isVerified && (
          <OtpFields otpInput={otpInput} setOtpInput={setOtpInput} />
        )}

        {/* Name Input for new users */}
        {isVerified && !isActive && (
          <AuthInput
            label="Full Name"
            type="default"
            value={name}
            setter={setName}
            placeholder="Enter Your Full Name"
          />
        )}

        {/* Buttons */}
        {!otpSent ? (
          <ButtonWithLoader
            name="Send OTP"
            loadingName="Processing..."
            isLoading={loading}
            method={handleOtpSend}
          />
        ) : !isVerified ? (
          <ButtonWithLoader
            name="Verify OTP"
            loadingName="Verifying..."
            isLoading={loading}
            method={handleVerifyOtp}
          />
        ) : !isActive ? (
          <ButtonWithLoader
            name="Sign Up"
            loadingName="Signing Up..."
            isLoading={loading}
            method={handleSignup}
          />
        ) : null}

        <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
          <Text style={{ textAlign: 'center', fontSize: 14, color: '#444' }}>
            By continuing, you agree to our{' '}
          </Text>
          <Text
            style={{ color: '#1E90FF', fontWeight: 'bold' ,textAlign: 'center'}}
            onPress={() =>
              Linking.openURL('https://www.termsandconditionsgenerator.com/')
            }
          >
            Terms & Conditions
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

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
    fontWeight: '700',
    color: Colors.blackColor,
    marginBottom: 20,
  },
});
