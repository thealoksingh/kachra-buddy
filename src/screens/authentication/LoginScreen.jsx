import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  BackHandler,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyStatusBar from '../../components/MyStatusBar';
import {
  AuthInput,
  ButtonWithLoader,
  OtpFields,
} from '../../components/commonComponents';
import { Colors } from '../../styles/commonStyles';
import { useNavigation } from '@react-navigation/native';
import { showSnackbar } from '../../store/slices/snackbarSlice';
import { useDispatch } from 'react-redux';
import { sendOtp, verifyOtp } from '../../store/thunks/authThunk';
import { completeProfile, completeUserProfile } from '../../store/thunks/userThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  // const otpResponse =userRef(null);
  const [loading, setLoading] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const dispatch = useDispatch();

  const resetStates = () => {
    setOtpInput('');
    setOtpSent(false);
    setIsVerified(false);
    setIsActive(false);
  };

  useEffect(() => {
    const backAction = () => {
      resetStates();

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);


  // step 1: send otp

  const validateForm = data => {
    const { contactNumber } = data;
    if (!contactNumber) {
      return 'Phone number is required';
    }
    if (contactNumber.length !== 10) {
      return 'Phone number must be 10 digits';
    }
    return null;
  };

  const handleOtpSend = async () => {
    const data = {
      contactNumber: phone,
    };
    const validationError = validateForm(data);
    console.log('handle otp send called', data);

    if (validationError) {
      console.log('error catched', validationError);
      await dispatch(
        showSnackbar({ message: validationError, type: 'error', time: 5000 }),
      );
      return;
    }
    setLoading(true);
    try {
      console.log('sending data', data);

      const response = await dispatch(sendOtp(data));
      console.log('response ', response?.payload);

      if (sendOtp.fulfilled.match(response)) {
        setOtpSent(true);
        console.log('');
        await dispatch(
          showSnackbar({
            message: response?.payload?.message,
            type: 'success',
            time: 5000,
          }),
        );
      } else {
        await dispatch(
          showSnackbar({
            message: response?.payload?.message,
            type: 'error',
            time: 5000,
          }),
        );
      }
    } catch (e) {
      await dispatch(
        showSnackbar({ message: validationError, type: 'error', time: 3000 }),
      );
    } finally {
      setLoading(false);
    }
  };
  // step 2: verify otp
  const handleVerifyOtp = async () => {
    const data = {
      contactNumber: phone,
      otp: otpInput,
    };
    setLoading(true);
    try {
      const response = await dispatch(verifyOtp(data));

      if (verifyOtp.fulfilled.match(response)) {

        const status = response?.payload?.data?.status;
        const role = response?.payload?.data?.role;
        await AsyncStorage.setItem(
          "user_id",
          String(response?.payload?.data?.id)
        );
        //Saving accessToken in async storage

        const user_id = await AsyncStorage.getItem("user_id");
        console.log("user id after storing in async storage", user_id);
        await AsyncStorage.setItem(
          "access_token",
          String(response?.payload?.data?.accessToken)
        );
        console.log("user id and accessToken stored in async storage");
        if (status.toLowerCase() === 'active') {
          setIsActive(true);
          navigation.replace(role.toLowerCase());
          return;
        } else {
          setIsVerified(true);
          setIsActive(false);
        }
        await dispatch(
          showSnackbar({
            message: response?.payload?.message,
            type: 'success',
            time: 5000,
          }),
        );
      } else {
        await dispatch(
          showSnackbar({
            message: response?.payload?.message,
            type: 'error',
            time: 5000,
          }),
        );
      }
    } catch (e) {
      await dispatch(
        showSnackbar({ message: validationError, type: 'error', time: 3000 }),
      );
    } finally {
      setLoading(false);
    }
  };

  // step 3: signup new user
  const handleSignup = async () => {
    const data = {
      userId: await AsyncStorage.getItem("user_id"),
      fullName: name,
    };
    setLoading(true);
    try {
      const response = await dispatch(completeUserProfile(data));
      console.log("response from completeUserProfile", response?.payload);
      
      if (completeUserProfile.fulfilled.match(response)) {
        const role = response?.payload?.data?.role;
        const status = response?.payload?.data?.status;
        
        await dispatch(
          showSnackbar({
            message: 'Profile completed successfully!',
            type: 'success',
            time: 3000,
          }),
        );
        
        if (status.toLowerCase() === 'active') {
          navigation.replace(role.toLowerCase());
        }
      } else {
        await dispatch(
          showSnackbar({
            message: response?.payload?.message,
            type: 'error',
            time: 5000,
          }),
        );
      }
    } catch (e) {
      await dispatch(
        showSnackbar({ message: 'Failed to complete profile', type: 'error', time: 3000 }),
      );
    } finally {
      setLoading(false);
    }
  };

 return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.whiteColor }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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
              style={{
                color: '#1E90FF',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
              onPress={() =>
                Linking.openURL('https://www.termsandconditionsgenerator.com/')
              }
            >
              Terms & Conditions
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
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