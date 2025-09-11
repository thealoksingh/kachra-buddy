import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerFCMTokenAPI } from '../utils/api/notificationApi';

export const initializeFCM = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permission enabled');
      await registerFCMToken();
    }
  } catch (error) {
    console.error('FCM initialization failed:', error);
  }
};

export const registerFCMToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    
    const storedToken = await AsyncStorage.getItem('fcm_token');
    if (storedToken === token) {
      console.log('Token already registered');
      return;
    }

    const response = await registerFCMTokenAPI(token);
    if (response?.status === 200) {
      await AsyncStorage.setItem('fcm_token', token);
      console.log('FCM token registered successfully');
    }
  } catch (error) {
    console.error('FCM token registration failed:', error);
  }
};

export const setupForegroundListener = () => {
  return messaging().onMessage(async remoteMessage => {
    console.log('Foreground message:', remoteMessage);
    return remoteMessage;
  });
};