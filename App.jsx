// App.js
import * as React from 'react';
import {  StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './src/screens/SplashScreen';
import { AuthStack } from './src/roleStack/AuthStack';
import { UserStack } from './src/roleStack/UserStack';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

function RootStack() {
  const user = { name: 'alok', status: 'Active' };
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" component={SplashScreen} />
      <Stack.Screen name="auth" component={AuthStack} />
      <Stack.Screen
        name="user"
        component={UserStack}
        initialParams={{ user }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white', 
  },
});
