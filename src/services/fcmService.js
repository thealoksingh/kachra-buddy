import messaging, { AuthorizationStatus } from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerFCMTokenAPI } from '../utils/api/notificationApi';
import { PermissionsAndroid, Platform } from 'react-native';
import notifee, { AndroidImportance, AuthorizationStatus as NotifeeAuthStatus } from '@notifee/react-native';

export const createDefaultChannel = async () => {
  await notifee.createChannel({
    id: 'default',
    name: 'KachraBuddy Notifications',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });
};

export const requestNotificationPermission = async () => {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission denied');
        return false;
      }
    }
    
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus === NotifeeAuthStatus.AUTHORIZED;
  }
  return true;
};


// Background message handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message:', remoteMessage);
});

export const initializeFCM = async () => {
  try {
    // Request notification permissions
    const notifeePermission = await requestNotificationPermission();
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled && notifeePermission) {
      console.log('Notification permissions enabled');
      await createDefaultChannel();
      await registerFCMToken();
    } else {
      console.log('Notification permissions denied');
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
    console.log('FCM token registration response:', response);

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
    console.log('Foreground message received:', remoteMessage.notification?.title);

    try {
      await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'KachraBuddy',
        body: remoteMessage.notification?.body || 'You have a new message',
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
          showTimestamp: true,
        },
        ios: {
          sound: 'default',
        },
      });
      console.log('Notification displayed successfully');
    } catch (error) {
      console.error('Error displaying notification:', error);
    }
  });
};
