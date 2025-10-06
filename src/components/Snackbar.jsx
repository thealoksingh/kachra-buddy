import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  Animated,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { clearSnackbar } from '../store/slices/snackbarSlice';

export const Snackbar = () => {
  const dispatch = useDispatch();
  const { message, type, time } = useSelector(state => state.snackbar);
  const [containerWidth] = useState(new Animated.Value(45));
  const [containerHeight] = useState(new Animated.Value(45));
  const [textOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (message) {
      // Reset animations
      containerWidth.setValue(40);
      containerHeight.setValue(45);
      textOpacity.setValue(0);
      
      // Grow container after 300ms
      const growTimer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(containerWidth, {
            toValue: 300,
            duration: 400,
            useNativeDriver: false,
          }),
          Animated.timing(containerHeight, {
            toValue: 45,
            duration: 400,
            useNativeDriver: false,
          }),
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start();
      }, 300);

      const clearTimer = setTimeout(() => {
        dispatch(clearSnackbar());
      }, time || 3000);
      
      return () => {
        clearTimeout(growTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [message, dispatch, time, containerWidth, textOpacity]);

  if (!message) return null;
 
  const bgColor = type === 'error' ? '#FF5722' : '#4f4f4fff';
  // const bgColor = type === 'error' ? '' : '#d1593bff';
  const imoji = type === 'error' ? '⚠️' : '✅';

  return (
    <View
      style={[
        styles.snackbarContainer,
        { top: Platform.OS === 'android' ? 40 : 60 },
      ]}
    >
      <Animated.View
        style={[styles.snackbarInnerContainer, { backgroundColor: bgColor, width: containerWidth, height: containerHeight }]}
      >
        <Image
          source={require('../../assets/images/logo.png')}
          style={{ width: 25, height: 25 , borderRadius: 15 ,backgroundColor:"white"}}
          resizeMode="contain"
        />
        <Animated.Text style={[styles.snackbarMessage, { opacity: textOpacity }]}>
         {message}{' '}{imoji}
        </Animated.Text>
        {/* <TouchableOpacity style={styles.icon} onPress={() => dispatch(clearSnackbar())}>
          <Ionicons name="close" size={16} color="white" />
        </TouchableOpacity> */}
        
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  snackbarContainer: {
    position: 'absolute',
    width: '100%',
    zIndex: 9999,
    paddingHorizontal: '10%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  snackbarInnerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderRadius: 22.5,
    alignItems: 'center',
    // justifyContent: 'space-between',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    maxWidth: '100%',
  },
  snackbarMessage: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    flexShrink: 1,
    marginHorizontal: 10,
    // flex: 1,
  },
  icon: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 4,
  },
});

export default Snackbar;
