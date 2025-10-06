import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../styles/commonStyles';
import MyStatusBar from '../components/MyStatusBar';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../store/selector';
import { WarningWithButton } from '../components/lottie/WarningWithButton';
import { performLogout } from '../store/thunks/logoutThunk';

const ErrorScreen = () => {
  const navigation = useNavigation();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

    const handleLogout = async () => {
    try {
      await dispatch(performLogout());
      setShowLogoutAlert(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'auth' }],
      });
      console.log('User logged out successfully');
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };
  return (
    <View style={styles.container}>
      <MyStatusBar />
      <Image
        source={require('../../assets/images/notActive.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>Your Account is Not Active</Text>

      <Text style={styles.message}>
        Hey, there might be a problem with your account. It has either been
        blocked or restricted. Please contact the admin.
      </Text>

      <TouchableOpacity onPress={() => navigation.navigate("helpScreen")} style={styles.button}>
        <Text style={styles.buttonText}>Get Support</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowLogoutAlert(true)} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
       {showLogoutAlert && (
        <WarningWithButton
          onYes={handleLogout}
          message="Are you sure you want to logout?"
          buttonText="Logout"
          onClose={() => setShowLogoutAlert(false)}
        />
      )}
    </View>
  );
};

export default ErrorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: '70%',
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primaryColor,
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: Colors.grayColor,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  button: {
    backgroundColor: Colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: Colors.whiteColor,
    fontWeight: '600',
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 40,
    // backgroundColor: 'transparent',
    // paddingVertical: 10,
    // paddingHorizontal: 24,
    // borderRadius: 8,
    // borderWidth: 1,
    // borderColor: '#FF4444',
  },
  logoutButtonText: {
    color: '#FF4444',
    fontWeight: '600',
    fontSize: 16,
  },
});
