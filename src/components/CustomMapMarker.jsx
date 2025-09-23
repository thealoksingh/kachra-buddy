import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../styles/commonStyles';

const CustomMapMarker = ({ avatarUrl, size = 40 }) => {
  return (
    <View style={[styles.markerContainer, { width: size + 8, height: size + 16 }]}>
      <View style={[styles.markerCircle, { width: size, height: size, borderRadius: size / 2 }]}>
        {avatarUrl ? (
          <Image 
            source={{ uri: avatarUrl }} 
            style={[styles.avatar, { width: size - 4, height: size - 4, borderRadius: (size - 4) / 2 }]} 
          />
        ) : (
          <Ionicons 
            name="person" 
            size={size * 0.6} 
            color={Colors.grayColor} 
          />
        )}
      </View>
      <View style={styles.markerPin} />
    </View>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  markerCircle: {
    backgroundColor: Colors.whiteColor,
    borderWidth: 3,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  avatar: {
    resizeMode: 'cover',
  },
  markerPin: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.primary,
    marginTop: -2,
  },
});

export default CustomMapMarker;