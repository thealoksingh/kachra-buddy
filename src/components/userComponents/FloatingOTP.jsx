import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
  Image,
} from 'react-native';
import { Colors } from '../../styles/commonStyles';
import { useNavigation } from '@react-navigation/native';

export const FloatingOTP = ({
  title,
  message,
  visible,
  onClose,
  expiryTime,
}) => {
  const slideAnim = useRef(new Animated.Value(150)).current;
  const navigation = useNavigation();
  const [timeLeft, setTimeLeft] = useState('');

  // Animate slide in/out
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 150,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // Countdown logic
  useEffect(() => {
    if (!expiryTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const expiry = new Date(expiryTime);
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else if (minutes > 0) {
          setTimeLeft(`${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${seconds}s`);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: Platform.OS === 'android' ? 20 : 30,
        left: 0,
        right: 0,
        zIndex: 9999,
        elevation: 9999,
        transform: [{ translateY: slideAnim }],
        paddingHorizontal: 20,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.whiteColor,
          borderRadius: 16,
          padding: 16,
          alignItems: 'center',
          elevation: 6,
          shadowColor: '#464646ff',
          borderWidth: 1,
          borderColor: '#cbcbcbff',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 6,
        }}
      >
        <Image
          source={require('../../../assets/images/logo.png')}
          style={{ width: 50, height: 50, marginRight: 12 }}
          resizeMode="contain"
        />

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', marginBottom: 4 }}>
            {title || 'NA'}
          </Text>

          <Text
            style={{ fontSize: 13, color: Colors.grayColor, marginBottom: 4 }}
          >
            {message || 'Please Share the OTP with the collector.'}
          </Text>

          <Text
            style={{ fontSize: 10, color: Colors.grayColor, marginBottom: 8 }}
          >
            {timeLeft === 'Expired' ? 'OTP Expired' : `Valid for ${timeLeft}`}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onClose}
          style={{ marginLeft: 8, position: 'absolute', right: 20, top: 3 }}
        >
          <Text style={{ fontSize: 30, fontWeight: '400' }}>×</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};
