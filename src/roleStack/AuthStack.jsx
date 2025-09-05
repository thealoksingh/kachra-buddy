import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OnboardingScreen from "../screens/onboarding/OnboardingScreen";
import LoginScreen from "../screens/authentication/LoginScreen";
import SignupScreen from "../screens/authentication/SignupScreen";

const Stack = createNativeStackNavigator();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" component={OnboardingScreen} />
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}
