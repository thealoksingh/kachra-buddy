import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/selector';
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
import NotificationScreen from '../screens/NotificationScreen';
import HelpScreen from '../screens/HelpScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsConditionsScreen from '../screens/TermsConditionsScreen';
const Stack = createNativeStackNavigator();

function ActiveStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="userBottomNavBar" component={UserBottomNavBar} />
      <Stack.Screen name="checkoutScreen" component={CheckoutScreen} />
      <Stack.Screen name="homeScreen" component={HomeScreen} />
      <Stack.Screen name="cart" component={Cart} />
      <Stack.Screen name="scrapVehicleScreen" component={ScrapVehicleScreen} />
      <Stack.Screen name="bookingScreen" component={BookingScreen} />
       <Stack.Screen name="notificationScreen" component={NotificationScreen} />
      <Stack.Screen name="bookingDetailScreen" component={BookingDetailScreen} />
      <Stack.Screen name="profileScreen" component={ProfileScreen} />
      <Stack.Screen name="searchScreen" component={SearchScreen} />  
      <Stack.Screen name="locationPickerScreen" component={LocationPickerScreen} />
      <Stack.Screen name="editProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="helpScreen" component={HelpScreen} />
      <Stack.Screen name="privacyPolicyScreen" component={PrivacyPolicyScreen} />
      <Stack.Screen name="termsConditionsScreen" component={TermsConditionsScreen} />
    </Stack.Navigator>
  );
}

function InactiveStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="errorScreen" component={ErrorScreen} />
      <Stack.Screen name="helpScreen" component={HelpScreen} />
    </Stack.Navigator>
  );
}

export function UserStack() {
  const user = useSelector(selectUser);
  return user?.status === 'ACTIVE' ? <ActiveStack /> : <InactiveStack />;
}
