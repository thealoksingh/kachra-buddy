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
import LocationPickerScreen from '../screens/map/LocationPickerScreen';
import EditProfileScreen from "../screens/user/EditProfileScreen"
import ErrorScreen from '../screens/ErrorScreen';
const Stack = createNativeStackNavigator();

function ActiveStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="checkoutScreen" component={CheckoutScreen} />
      <Stack.Screen name="userBottomNavBar" component={UserBottomNavBar} />
      <Stack.Screen name="homeScreen" component={HomeScreen} />
      <Stack.Screen name="cart" component={Cart} />
      <Stack.Screen name="scrapVehicleScreen" component={ScrapVehicleScreen} />
      <Stack.Screen name="bookingScreen" component={BookingScreen} />
      <Stack.Screen name="bookingDetailScreen" component={BookingDetailScreen} />
      <Stack.Screen name="profileScreen" component={ProfileScreen} />
      <Stack.Screen name="searchScreen" component={SearchScreen} />  
      <Stack.Screen name="locationPickerScreen" component={LocationPickerScreen} />
      <Stack.Screen name="editProfileScreen" component={EditProfileScreen} />
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

export function UserStack({ route }) {
  const { user } = route.params;
  return user?.status === 'Active' ? <ActiveStack /> : <InactiveStack />;
}
