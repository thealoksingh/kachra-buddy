import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminBottomNavBar from '../components/adminComponents/AdminBottomNavBar';
import ErrorScreen from '../screens/ErrorScreen';
import AdminHome from '../screens/admin/AdminHome';
import HelpScreen from '../screens/HelpScreen';
import NotificationScreen from '../screens/NotificationScreen';
import AdminProfile from '../screens/admin/AdminProfile';
import EditAdminProfile from '../screens/admin/EditAdminProfile';
import AllBookingsScreen from '../screens/admin/AllBookingsScreen';
import CreateUserScreen from '../screens/admin/CreateUserScreen';
import BookingDetailAdmin from '../screens/admin/BookingDetailAdmin';
import PostProductsScreen from '../screens/admin/PostProductsScreen';
import AllProductsScreen from '../screens/admin/AllProductsScreen';
import UpdateProductScreen from '../screens/admin/UpdateProductScreen';
import UpdateUserScreen from '../screens/admin/UpdateUserScreen';
const Stack = createNativeStackNavigator();

function ActiveStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="adminBottomNavBar" component={AdminBottomNavBar} />
      <Stack.Screen name="updateUserScreen" component={UpdateUserScreen} />
      <Stack.Screen name="updateProductScreen" component={UpdateProductScreen} />
      <Stack.Screen name="allProductsScreen" component={AllProductsScreen} />
      <Stack.Screen name="postProductsScreen" component={PostProductsScreen} />
      <Stack.Screen name="createUserScreen" component={CreateUserScreen} />
      <Stack.Screen name="adminHome" component={AdminHome} />
      <Stack.Screen name="helpScreen" component={HelpScreen} />
      <Stack.Screen name="notificationScreen" component={NotificationScreen} />
      <Stack.Screen name="adminProfile" component={AdminProfile} />
      <Stack.Screen name="editAdminProfile" component={EditAdminProfile} />
      <Stack.Screen name="allBookingsScreen" component={AllBookingsScreen} />
      <Stack.Screen name="bookingDetailAdmin" component={BookingDetailAdmin} />
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

export function AdminStack({ route }) {
  const { user } = route.params;
  return user?.status === 'Active' ? <ActiveStack /> : <InactiveStack />;
}
