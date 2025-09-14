import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';

const NotificationTest = () => {
  const testNotification = async () => {
    try {
      // Check permission first
      const settings = await notifee.getNotificationSettings();
      console.log('Notification settings:', settings);
      
      if (settings.authorizationStatus !== 1) {
        Alert.alert('Permission Required', 'Please enable notifications in settings');
        return;
      }

      // Display test notification
      await notifee.displayNotification({
        title: 'Test Notification',
        body: 'This is a test notification from KachraBuddy!',
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
      
      Alert.alert('Success', 'Test notification sent!');
    } catch (error) {
      console.error('Test notification error:', error);
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={testNotification}>
        <Text style={styles.buttonText}>Test Notification</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007997ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NotificationTest;