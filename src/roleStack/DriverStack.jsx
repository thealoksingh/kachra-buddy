import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ErrorScreen from '../screens/ErrorScreen';
import DriverBottomNavBar from '../components/driverComponents/DriverBottomNavBar';
import PickupRequests from '../screens/driver/PickupRequests';
import PickupRequestDetail from '../screens/driver/PickupRequestDetail';
import DriverProfileScreen from '../screens/driver/DriverProfileScreen';
import DriverEditProfileScreen from '../screens/driver/DriverEditProfileScreen';
import DriverHome from '../screens/driver/DriverHome';
import FinalPickupScreen from '../screens/driver/FinalPickupScreen';
import HelpScreen from '../screens/HelpScreen';
const Stack = createNativeStackNavigator();

function ActiveStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="driverHome" component={DriverHome} />
      <Stack.Screen name="pickupRequests" component={PickupRequests} />
      <Stack.Screen name="pickupRequestDetail" component={PickupRequestDetail} />
      <Stack.Screen name="driverProfileScreen" component={DriverProfileScreen} />
      <Stack.Screen name="driverEditProfileScreen" component={DriverEditProfileScreen} />
       <Stack.Screen name="finalPickupScreen" component={FinalPickupScreen} />
      <Stack.Screen name="helpScreen" component={HelpScreen} />

    </Stack.Navigator>
  );
}

function InactiveStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="errorScreen" component={ErrorScreen} />
    </Stack.Navigator>
  );
}

export function DriverStack({ route }) {
  const { user } = route.params;
  return user?.status === 'Active' ? <ActiveStack /> : <InactiveStack />;
}
