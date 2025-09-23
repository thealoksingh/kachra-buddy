import * as React from 'react';
import { StyleSheet, Alert, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import SplashScreen from './src/screens/SplashScreen';
import { AuthStack } from './src/roleStack/AuthStack';
import { UserStack } from './src/roleStack/UserStack';
import { DriverStack } from './src/roleStack/DriverStack';
import { AdminStack } from './src/roleStack/AdminStack';
import { Colors } from './src/styles/commonStyles';
import store from './src/store/store';
import { Snackbar } from './src/components/Snackbar';
import { LottieAlert } from './src/components/lottie/LottieAlert';
import RoleBasedNavigator from './src/components/RoleBasedNavigator';
import NotificationManager from './src/components/NotificationManager';
import NoInternetScreen from './src/screens/NoInternetScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  createDefaultChannel,
  initializeFCM,
  setupForegroundListener,
} from './src/services/fcmService';
// import ErrorScreen from './src/screens/ErrorScreen'; // you can add later if needed

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" component={SplashScreen} />
      <Stack.Screen name="auth" component={AuthStack} />
      <Stack.Screen name="user">
        {props => (
          <>
            <RoleBasedNavigator {...props} />
            <NotificationManager />
            <UserStack {...props} />
          </>
        )}
      </Stack.Screen>
      <Stack.Screen name="driver">
        {props => (
          <>
            <RoleBasedNavigator {...props} />
            <NotificationManager />
            <DriverStack {...props} />
          </>
        )}
      </Stack.Screen>
      <Stack.Screen name="admin">
        {props => (
          <>
            <RoleBasedNavigator {...props} />
            <NotificationManager />
            <AdminStack {...props} />
          </>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function App() {
  const [isConnected, setIsConnected] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected && state.isInternetReachable !== false);
    });

    let unsubscribeMessage;

    (async () => {
      try {
        await initializeFCM();
        unsubscribeMessage = setupForegroundListener();
        console.log('Notification setup completed');
      } catch (error) {
        console.error('Notification setup failed:', error);
      }
    })();

    return () => {
      unsubscribe();
      if (unsubscribeMessage) {
        unsubscribeMessage();
      }
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SafeAreaView style={styles.safeArea}>
          <NavigationContainer>
            <Snackbar />
            <LottieAlert />
            {isConnected ? (
              <RootStack />
            ) : (
              <NoInternetScreen
                onRetry={() =>
                  NetInfo.fetch().then(state =>
                    setIsConnected(state.isConnected),
                  )
                }
              />
            )}
          </NavigationContainer>
        </SafeAreaView>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
});
