import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import {Colors  } from '../styles/commonStyles';
export default function SplashScreen({ navigation }) {
  useEffect(() => {
    // Show splash for 2 seconds, then navigate to Login
    const timer = setTimeout(() => {
      navigation.replace('login'); // replace prevents going back to splash
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/logo.png')}
        style={styles.logo} 
      />
      {/* <Text style={styles.text}>Kachra Buddy</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor, // splash bg color
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,

  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
