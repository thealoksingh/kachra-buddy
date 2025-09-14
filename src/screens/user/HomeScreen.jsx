import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  appFonts,
  Colors,
  screenWidth,
  textStyles,
} from '../../styles/commonStyles';
import MyStatusBar from '../../components/MyStatusBar';
import { LottieAlert } from '../../components/lottie/LottieAlert';
import {
  DottedBlackLoader,
  DottedWhiteLoader,
} from '../../components/lottie/loaderView';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import MovingIcons from '../../components/userComponents/MovingIcons';
import AdSlider from '../../components/userComponents/AdSlider';
import MiniProductScrollSection from '../../components/userComponents/MiniProductScrollSection';
import { useNavigation } from '@react-navigation/native';
import { products, addsData } from '../../utils/dummyData';
import { FaddedIcon } from '../../components/commonComponents';
import { useSelector, useDispatch } from 'react-redux';
import { selectCart, selectItems, selectUnreadNotifications, selectOrders, selectUser, selectAdvertisementsByDisplayOrder, selectAdvertisements, selectBestDealItems } from '../../store/selector';
import { fetchItems, fetchCart, fetchOrders, getUserById } from '../../store/thunks/userThunk';
import { fetchNotifications } from '../../store/thunks/notificationThunk';
import Key from '../../constants/key';
import { PendingOrderAlert } from '../../components/userComponents/PendingOrderAlert';
import { getUserLocation } from '../../utils/CommonMethods';
import { fetchAllAdvertisements } from '../../store/thunks/adminThunk';
import NotificationTest from '../../components/NotificationTest';

export const icons = [
  { id: '1', path: require('../../../assets/icons/shoes.png'), label: 'Shoe' },
  {
    id: '2',
    path: require('../../../assets/icons/plastic.png'),
    label: 'Plastic',
  },
  {
    id: '3',
    path: require('../../../assets/icons/metal.png'),
    label: 'Metal',
  },
  { id: '4', path: require('../../../assets/icons/books.png'), label: 'Paper' },
  {
    id: '5',
    path: require('../../../assets/icons/electronic.png'),
    label: 'Electronics',
  },
  {
    id: '6',
    path: require('../../../assets/icons/tank.png'),
    label: 'Water Tank',
  },
  { id: '7', path: require('../../../assets/icons/tyre.png'), label: 'Tyre' },
  {
    id: '8',
    path: require('../../../assets/icons/battery.png'),
    label: 'Battery',
  },
  {
    id: '9',
    path: require('../../../assets/icons/recycle.png'),
    label: 'Garbage',
  },
  { id: '10', path: require('../../../assets/icons/box.png'), label: 'Carton' },
];

function HomeScreen() {
  const { API_BASE_URL } = Key;
  const user = useSelector(selectUser);
  const userId = user?.id;
  const cart = useSelector(selectCart);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const bestDealItems = useSelector(selectBestDealItems);
  const orders = useSelector(selectOrders);
  const advertisement = useSelector(selectAdvertisementsByDisplayOrder);
  const [userAddress, setUserAddress] = useState('Getting location...');
  const [refreshing, setRefreshing] = useState(false);
  const [pendingAlertVisible, setPendingAlertVisible] = useState(true);
  const unreadNotifications = useSelector(selectUnreadNotifications);

  // Memoized computed values to prevent unnecessary re-calculations
  const pendingOrders = useMemo(() => 
    orders?.filter(order => order.status === 'INCOMPLETE') || [], 
    [orders]
  );
  
  const bigSizeAdv = useMemo(() => 
    advertisement?.filter((ad) => ad.adSize === 'BIG') || [], 
    [advertisement]
  );
  
  const smallSizeAdv = useMemo(() => 
    advertisement?.filter((ad) => ad.adSize === 'SMALL') || [], 
    [advertisement]
  );

  useEffect(() => {
    getUserLocation(
      locationData => {
        setUserAddress(locationData.address);
        console.log('Address:', locationData.address);
      },
      error => {
        setUserAddress('Unable to get location');
        console.log('Error:', error);
      },
    );
  }, []);

  const fetchAllData = useCallback(async () => {
    if (user && userId) {
      await Promise.all([
        dispatch(getUserById({ userId })),
        dispatch(fetchItems()),
        dispatch(fetchCart()),
        dispatch(fetchOrders()),
        // dispatch(fetchNotifications(userId))
      ]);
    }
  }, [user, userId, dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  }, [fetchAllData]);

  // Memoized navigation handlers
  const navigateToProfile = useCallback(() => navigation.navigate('profileScreen'), [navigation]);
  const navigateToNotifications = useCallback(() => navigation.navigate('notificationScreen'), [navigation]);
  const navigateToSearch = useCallback(() => navigation.navigate('searchScreen'), [navigation]);
  const navigateToScrapVehicle = useCallback(() => navigation.navigate('scrapVehicleScreen'), [navigation]);
  const navigateToHelp = useCallback(() => navigation.navigate('helpScreen'), [navigation]);

  useEffect(() => {
    if (user && userId) {
      setPendingAlertVisible(pendingOrders.length > 0);
      dispatch(fetchItems());
      dispatch(fetchAllAdvertisements()),
      dispatch(fetchCart());
      dispatch(fetchOrders());
      // dispatch(fetchNotifications(userId));
    }
  }, [user, dispatch, userId]);
  return (
    <LinearGradient
      colors={[Colors.primary, Colors.whiteColor]}
      style={{ flex: 1 }}
    >
      <MyStatusBar />
      <View style={styles.topBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={navigateToProfile}
          style={styles.profileSection}
        >
          {user?.avatarUrl ? (
            <Image
              source={{
                uri: API_BASE_URL + user.avatarUrl,
                headers: {
                  Authorization: `Bearer ${user?.accessToken}`,
                },
              }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.defaultProfileImage}>
              <Ionicons name="person-outline" size={30} color="#666" />
            </View>
          )}
          <View>
            <Text style={styles.userName}>{user?.fullName}</Text>
            <Text style={styles.userAddress}>
              {userAddress}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={navigateToNotifications}
          style={styles.notificationContainer}
        >
          <Ionicons
            name="notifications-outline"
            size={28}
            color={Colors.whiteColor}
          />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadNotifications?.length || 0}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={navigateToSearch}
        style={styles.searchBar}
      >
        <Ionicons name="search-outline" size={20} color="#999" />
        <Text style={styles.searchText}>Search here...</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.mainSection}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <MovingIcons icons={icons} />
        {bigSizeAdv?.length > 0 && <AdSlider data={bigSizeAdv} type={'big'} />}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Best Deals
          </Text>
          <TouchableOpacity onPress={navigateToSearch}>
            <Text style={styles.seeAllText}>
              See All
            </Text>
          </TouchableOpacity>
        </View>

        {bestDealItems?.length > 0 && <MiniProductScrollSection products={bestDealItems} />}
        {smallSizeAdv?.length > 0 && (
          <View style={styles.adContainer}>
            <AdSlider data={smallSizeAdv} type={'small'} />
          </View>
        )}

        <View style={styles.scrapVehicleCard}>
          <View style={styles.scrapVehicleContent}>
            <Text style={styles.scrapVehicleTitle}>
              Sell Old Vehicle
            </Text>
            <Text style={styles.scrapVehicleSubtitle}>
              Turn your old stuff into cash today.
            </Text>
            <TouchableOpacity
              onPress={navigateToScrapVehicle}
              activeOpacity={0.7}
              style={styles.sellnowButton}
            >
              <Text style={styles.sellnowButtonText}>
                Sell Now
              </Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require('../../../assets/images/scrapVehicle.png')}
            style={styles.scrapVehicleImage}
          />
        </View>

        <TouchableOpacity 
          activeOpacity={0.8}  
          onPress={navigateToHelp} 
          style={styles.supportCard}
        >
          <View style={styles.supportIconContainer}>
            <Ionicons
              name="help-circle-outline"
              size={32}
              color={Colors.primary}
            />
          </View>
          <View style={styles.supportTextContainer}>
            <Text style={styles.supportTitle}>Help & Support</Text>
            <Text style={styles.supportSubtitle}>Get assistance anytime</Text>
          </View>
          <Ionicons
            name="chevron-forward-outline"
            size={20}
            color={Colors.grayColor}
          />
        </TouchableOpacity>
        <NotificationTest />
        <FaddedIcon />
      </ScrollView>
      <PendingOrderAlert
        visible={pendingAlertVisible}
        title={'You have a Pending Order'}
        message={'please Complete the order'}
        onClose={() => setPendingAlertVisible(false)}
        />
    </LinearGradient>
  );
}

export default memo(HomeScreen);

const styles = StyleSheet.create({
  topBar: {
    marginTop: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  defaultProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e1e1e1',
  },
  userName: {
    fontSize: 14,
    fontFamily: appFonts.semiBold,
    color: Colors.whiteColor,
  },
  userAddress: {
    ...textStyles.extraSmall,
    color: Colors.whiteColor,
  },
  notificationContainer: {
    position: 'relative',
  },
  searchBar: {
    marginTop: 15,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 10,
  },
  searchText: {
    marginLeft: 8,
    color: '#999',
    fontSize: 14,
  },
  mainSection: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 18,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: Colors.redColor,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    ...textStyles.extraSmall,
    color: Colors.whiteColor,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  sectionTitle: {
    color: Colors.blackColor,
    ...textStyles.subHeading,
  },
  seeAllText: {
    color: Colors.primary,
    ...textStyles.subHeading,
  },
  adContainer: {
    marginVertical: 20,
  },
  scrapVehicleCard: {
    width: screenWidth - 60,
    height: 180,
    backgroundColor: Colors.whiteColor,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  scrapVehicleContent: {
    flex: 1,
    paddingRight: 10,
  },
  scrapVehicleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scrapVehicleSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  scrapVehicleImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  supportCard: {
    width: screenWidth - 60,
    height: 90,
    margin: 10,
    backgroundColor: Colors.whiteColor,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  supportIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  supportTextContainer: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.blackColor,
    marginBottom: 4,
  },
  supportSubtitle: {
    fontSize: 12,
    color: Colors.grayColor,
    fontWeight: '400',
  },
  sellnowButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  sellnowButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
