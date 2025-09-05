import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserBottomNavBar from '../components/userComponents/UserBottomNavBar';
import HomeScreen from '../screens/user/HomeScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import Cart from '../screens/user/Cart';
import ScrapVehicleScreen from '../screens/user/ScrapVehicleScreen';
import BookingScreen from '../screens/user/BookingScreen';
import BookingDetailScreen from '../screens/user/BookingDetailScreen';
import SearchScreen from '../screens/user/SearchScreen';
import CheckoutScreen from '../screens/user/CheckoutScreen';

const Stack = createNativeStackNavigator();

function ActiveStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserBottomNavBar" component={UserBottomNavBar} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="ScrapVehicle" component={ScrapVehicleScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="searchScreen" component={SearchScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
}

function InactiveStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export function UserStack({ route }) {
  const { user } = route.params;
  return user?.status === 'Active' ? <ActiveStack /> : <InactiveStack />;
}
