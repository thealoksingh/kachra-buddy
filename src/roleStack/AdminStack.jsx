import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import AdminBottomNavBar from '../components/adminComponents/AdminBottomNavBar';
import ErrorScreen from '../screens/ErrorScreen';
import HelpScreen from '../screens/HelpScreen';
import NotificationScreen from '../screens/NotificationScreen';
import AdminHome from '../screens/admin/AdminHome';
import AdvertisementDetailScreen from '../screens/admin/AdvertisementDetailScreen';
import AllAdvertisementsScreen from '../screens/admin/AllAdvertisementsScreen';
import AllBestDealProducts from '../screens/admin/AllBestDealProducts';
import AllBookingsScreen from '../screens/admin/AllBookingsScreen';
import AllProductsScreen from '../screens/admin/AllProductsScreen';
import AllSupportIssues from '../screens/admin/AllSupportIssues';
import AllUsersScreen from '../screens/admin/AllUsersScreen';
import BookingDetailAdmin from '../screens/admin/BookingDetailAdmin';
import CreateUserScreen from '../screens/admin/CreateUserScreen';
import PostAd from '../screens/admin/PostAd';
import PostProductsScreen from '../screens/admin/PostProductsScreen';
import SendNotificationScreen from '../screens/admin/SendNotificationScreen';
import SupportIssueDetail from '../screens/admin/SupportIssueDetail';
import UpdateProductScreen from '../screens/admin/UpdateProductScreen';
import UpdateUserScreen from '../screens/admin/UpdateUserScreen';
import { selectUser } from '../store/selector';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsConditionsScreen from '../screens/TermsConditionsScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import EditOrderScreen from '../screens/admin/EditOrderScreen';
import SelectAdditionalItemScreen from '../screens/admin/SelectAdditionalItemScreen';
const Stack = createNativeStackNavigator();

function ActiveStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      <Stack.Screen name="adminBottomNavBar" component={AdminBottomNavBar} />
      <Stack.Screen name="allSupportIssues" component={AllSupportIssues} />
      <Stack.Screen name="supportIssueDetail" component={SupportIssueDetail} />
      <Stack.Screen name="allBestDealProducts" component={AllBestDealProducts} />
      <Stack.Screen name="allAdvertisementsScreen" component={AllAdvertisementsScreen} />
      <Stack.Screen name="advertisementDetail" component={AdvertisementDetailScreen} />
      <Stack.Screen name="postAd" component={PostAd} />
      <Stack.Screen name="sendNotificationScreen" component={SendNotificationScreen} />
      <Stack.Screen name="updateUserScreen" component={UpdateUserScreen} />
      <Stack.Screen name="updateProductScreen" component={UpdateProductScreen} />
      <Stack.Screen name="allProductsScreen" component={AllProductsScreen} />
      <Stack.Screen name="allUsersScreen" component={AllUsersScreen} />
      <Stack.Screen name="postProductsScreen" component={PostProductsScreen} />
      <Stack.Screen name="createUserScreen" component={CreateUserScreen} />
      <Stack.Screen name="adminHome" component={AdminHome} />
      <Stack.Screen name="helpScreen" component={HelpScreen} />
      <Stack.Screen name="editOrderScreen" component={EditOrderScreen} />
      <Stack.Screen name="selectAdditionalItemScreen" component={SelectAdditionalItemScreen} />
      <Stack.Screen name="notificationScreen" component={NotificationScreen} />
      <Stack.Screen name="adminProfile" component={ProfileScreen} />
      <Stack.Screen name="allBookingsScreen" component={AllBookingsScreen} />
      <Stack.Screen name="bookingDetailAdmin" component={BookingDetailAdmin} />
      <Stack.Screen name="privacyPolicyScreen" component={PrivacyPolicyScreen} />
      <Stack.Screen name="termsConditionsScreen" component={TermsConditionsScreen} />

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

export function AdminStack() {
  const user = useSelector(selectUser);
  return user?.status === 'ACTIVE' ? <ActiveStack /> : <InactiveStack />;
}
