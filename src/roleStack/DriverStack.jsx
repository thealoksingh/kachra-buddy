import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/selector';
import ErrorScreen from '../screens/ErrorScreen';
import PickupRequests from '../screens/driver/PickupRequests';
import PickupRequestDetail from '../screens/driver/PickupRequestDetail';
import DriverProfileScreen from '../screens/driver/DriverProfileScreen';
import DriverEditProfileScreen from '../screens/driver/DriverEditProfileScreen';
import DriverHome from '../screens/driver/DriverHome';
import FinalPickupScreen from '../screens/driver/FinalPickupScreen';
import SelectAdditionalItemScreen from '../screens/driver/SelectAdditionalItemScreen';
import HelpScreen from '../screens/HelpScreen';
import RaisedTickets from "../screens/RaisedTickets"
import NotificationScreen from "../screens/NotificationScreen";
const Stack = createNativeStackNavigator();

function ActiveStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
       <Stack.Screen name="driverHome" component={DriverHome} />
         <Stack.Screen name="selectAdditionalItemScreen" component={SelectAdditionalItemScreen} />
    
      <Stack.Screen name="pickupRequests" component={PickupRequests} />
       <Stack.Screen name="pickupRequestDetail" component={PickupRequestDetail} />
      <Stack.Screen name="driverProfileScreen" component={DriverProfileScreen} />
      <Stack.Screen name="driverEditProfileScreen" component={DriverEditProfileScreen} />
        <Stack.Screen name="finalPickupScreen" component={FinalPickupScreen} />
      <Stack.Screen name="helpScreen" component={HelpScreen} />
      <Stack.Screen name="raisedTickets" component={RaisedTickets} />
     <Stack.Screen name="notificationScreen" component={NotificationScreen} />

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

export function DriverStack() {
  const user = useSelector(selectUser);
  return user?.status === 'ACTIVE' ? <ActiveStack /> : <InactiveStack />;
}
