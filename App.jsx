import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/user/HomeScreen';
import LoginScreen from './src/screens/authentication/LoginScreen';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/onboarding/OnboardingScreen';
import SignupScreen from './src/screens/authentication/SignupScreen';
import UserBottomNavBar from './src/components/UserBottomNavBar';

// Importing screens
import Cart from './src/screens/user/Cart';
import BookingScreen from './src/screens/user/BookingScreen';
import ProfileScreen from './src/screens/user/ProfileScreen';

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" component={SplashScreen} />
      <Stack.Screen name="userBottomNavBar" component={UserBottomNavBar} />
      <Stack.Screen name="onboarding" component={OnboardingScreen} />
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="signup" component={SignupScreen} />
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="cart" component={Cart} />
      <Stack.Screen name="booking" component={BookingScreen} />
      <Stack.Screen name="profile" component={ProfileScreen} />
      

    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
