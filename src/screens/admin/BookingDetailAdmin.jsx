import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { CommonAppBar, FaddedIcon } from '../../components/commonComponents';
import ImagePreviewModal from '../../components/ImagePreviewModal';
import { Colors, commonStyles, textStyles } from '../../styles/commonStyles';
import { useSelector, useDispatch } from 'react-redux';
import { selectAdminOrders, selectUser } from '../../store/selector';
import { assignDriver } from '../../store/thunks/adminThunk';
import { showLottieAlert } from '../../store/slices/lottieAlertSlice';
import Key from '../../constants/key';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WarningWithButton } from '../../components/lottie/WarningWithButton';
import { DottedBlackLoader } from '../../components/lottie/loaderView';
import { LottieAlert } from '../../components/lottie/LottieAlert';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { openGoogleMaps, callUser } from '../../utils/CommonMethods';
import MyStatusBar from '../../components/MyStatusBar';
import OrderStatusCard from '../../components/userComponents/OrderStatusCard';
const { width } = Dimensions.get('window');
const BookingDetailAdmin = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { API_BASE_URL } = Key;
  const bookingId = route.params?.bookingId || null;
  const booking =
    useSelector(selectAdminOrders).find(o => o.id === bookingId) ||
    route.params?.booking ||
    null;

  const [selectedDriver, setSelectedDriver] = useState(booking?.driver || null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [warningVisible, setWarningVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const flatListRef = useRef();
  // console.log("this is booking at admin =>",booking);
  const images =
    booking?.orderImages
      ?.filter(img => img.postedBy === 'USER')
      .map(img => API_BASE_URL + img.imageUrl) || [];

  const items = booking?.orderItems || [];

 
  // Pickup images from driver
  const pickupImages =
    booking?.orderImages
      ?.filter(img => img.postedBy === 'DRIVER')
      .map(img => ({
        id: img.id,
        uri: API_BASE_URL + img.imageUrl,
      })) || [];




  const handleDriverSelect = async driver => {
    setSelectedDriver(driver);
    setIsLoading(true);
    try {
      const result = await dispatch(
        assignDriver({ orderId: booking.id, driverId: driver.id }),
      );
      if (assignDriver.fulfilled.match(result)) {
        dispatch(
          showLottieAlert({
            type: 'success',
            message: 'Driver assigned successfully',
            autoClose: true,
          }),
        );
      } else {
        dispatch(
          showLottieAlert({
            type: 'failure',
            message: 'Failed to assign driver',
            autoClose: true,
          }),
        );
      }
    } catch (error) {
      dispatch(
        showLottieAlert({
          type: 'failure',
          message: 'Failed to assign driver',
          autoClose: true,
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <CommonAppBar navigation={navigation} label="Booking Detail" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {images.length > 0 && (
          <>
            <FlatList
              ref={flatListRef}
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, i) => i.toString()}
              onMomentumScrollEnd={e => {
                const index = Math.round(e.nativeEvent.contentOffset.x / width);
                setActiveIndex(index);
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    setPreviewImage(item);
                    setPreviewVisible(true);
                  }}
                >
                  <Image
                    source={{
                      uri: item,
                      headers: {
                        Authorization: `Bearer ${user?.accessToken}`,
                      },
                    }}
                    style={styles.image}
                  />
                </TouchableOpacity>
              )}
            />

            <View style={styles.dotsContainer}>
              {images.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, activeIndex === i && styles.activeDot]}
                />
              ))}
            </View>
          </>
        )}
        <OrderStatusCard bookingData={booking} />
        <View style={styles.headingSection}>
          <Text style={styles.sectionTitle}>User Detail</Text>
        </View>
        <View style={styles.userCard}>
          {booking?.user?.avatarUrl ? (
            <Image
              source={{
                uri: API_BASE_URL + booking?.user?.avatarUrl,
                headers: {
                  Authorization: `Bearer ${booking?.user?.accessToken}`,
                },
              }}
              style={styles.userImage}
            />
          ) : (
            <View style={[styles.userImage, styles.iconContainer]}>
              <MaterialIcons name="account-circle" size={40} color="#999" />
            </View>
          )}
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.userName}>
              {booking?.user?.fullName || 'N/A'}
            </Text>
            <Text style={styles.userPhone}>
              {booking?.user?.contactNumber || 'N/A'}
            </Text>
          </View>
        </View>
        {selectedDriver && (
          <>
            <View style={styles.headingSection}>
              <Text style={styles.sectionTitle}>Driver Detail</Text>
            </View>
            <View style={styles.userCard}>
              {selectedDriver?.avatarUrl ? (
                <Image
                  source={{
                    uri: API_BASE_URL + selectedDriver.avatarUrl,
                    headers: { Authorization: `Bearer ${user?.accessToken}` },
                  }}
                  style={styles.userImage}
                />
              ) : (
                <View style={[styles.userImage, styles.iconContainer]}>
                  <MaterialIcons name="account-circle" size={60} color="#999" />
                </View>
              )}
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.userName}>{selectedDriver?.fullName}</Text>
                <Text style={styles.userPhone}>
                  {selectedDriver?.contactNumber}
                </Text>
              </View>
            </View>
          </>
        )}

        <View style={styles.headingSection}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
        </View>

        <View style={styles.itemsSection}>
          <View style={commonStyles.rowSpaceBetween}>
            <Text style={textStyles.smallBold}>Pickup Date Time</Text>
            <Text style={textStyles.small}>
              {booking?.pickupDate
                ? new Date(booking.pickupDate).toLocaleString()
                : 'N/A'}
            </Text>
          </View>
          <View style={commonStyles.rowSpaceBetween}>
            <Text style={textStyles.smallBold}>Status</Text>
            <Text style={textStyles.small}>{booking?.status || 'N/A'}</Text>
          </View>
          {booking?.orderType === 'GENERAL' && (
            <>
              <View style={commonStyles.rowSpaceBetween}>
                <Text style={textStyles.smallBold}>Items</Text>
                <Text style={textStyles.small}>{items.length}</Text>
              </View>
              <View style={commonStyles.rowSpaceBetween}>
                <Text style={textStyles.smallBold}>Expected Amount</Text>
                <Text style={[textStyles.small, { color: Colors.primary }]}>
                  ₹{booking?.finalPrice || 0}
                </Text>
              </View>
            </>
          )}
        </View>
        <View style={styles.headingSection}>
          <Text style={styles.sectionTitle}>Customer Detail</Text>
        </View>
        <View style={{ padding: 10 }}>
          <View style={commonStyles.rowSpaceBetween}>
            <Text style={textStyles.smallBold}>Customer Name</Text>
            <Text style={textStyles.small}>
              {booking?.sellerName || booking?.user?.fullName || 'N/A'}
            </Text>
          </View>
          <View style={commonStyles.rowSpaceBetween}>
            <Text style={textStyles.smallBold}>Customer Mobile Number</Text>
            <Text style={textStyles.small}>
              {booking?.sellerContactNo ||
                booking?.user?.contactNumber ||
                'N/A'}
            </Text>
          </View>

          <Text
            style={[
              textStyles.small,
              { flex: 1, textAlign: 'right', textAlign: 'justify' },
            ]}
          >
            <Text style={textStyles.smallBold}>Address: </Text>
            {booking?.pickupAddress || booking?.orderPickupAddress || 'N/A'}
          </Text>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.outlinedBtn,
                {
                  borderColor: Colors.secondary,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                },
              ]}
              onPress={() =>
                openGoogleMaps(
                  booking?.orderPickupLatitude,
                  booking?.orderPickupLongitude,
                  booking?.sellerName,
                )
              }
            >
              <Ionicons name="map-outline" size={18} color={Colors.secondary} />
              <Text
                style={[styles.outlinedBtnText, { color: Colors.secondary }]}
              >
                Get Direction
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.outlinedBtn,
                {
                  borderColor: Colors.darkBlue,
                  backgroundColor: Colors.darkBlue,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                },
              ]}
              onPress={() => callUser(booking?.sellerContactNo)}
            >
              <Ionicons
                name="call-outline"
                size={18}
                color={Colors.whiteColor}
              />
              <Text
                style={[styles.outlinedBtnText, { color: Colors.whiteColor }]}
              >
                Call Customer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {booking.status==="COMPLETED"&&(<>
          <View style={styles.headingSection}>
            <Text style={styles.sectionTitle}>Pickup Details</Text>
          </View>
          <View style={{ padding: 10 }}>
            {booking?.givenAmount && (
              <View style={commonStyles.rowSpaceBetween}>
                <Text style={textStyles.smallBold}>Given Amount</Text>
                <Text style={[textStyles.small, { color: Colors.primary }]}>
                  ₹{booking?.givenAmount || 0}
                </Text>
              </View>
            )}

            {booking?.remark && (
              <Text
                style={[
                  textStyles.small,
                  { flex: 1, textAlign: 'right', textAlign: 'justify' },
                ]}
              >
                <Text style={textStyles.smallBold}>Remark By Driver : </Text>
                {booking?.remark || 'NA'}
              </Text>
            )}
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 10,
                // justifyContent: 'space-evenly',
              }}
            >
              {pickupImages.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => {
                    setPreviewImage(image.uri);
                    setPreviewVisible(true);
                  }}
                >
                  <Image
                    source={{
                      uri: image.uri,
                      headers: { Authorization: `Bearer ${user?.accessToken}` },
                    }}
                    style={styles.pickupImage}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>)}
        {booking?.orderType === 'VEHICLE' && (
          <>
            <View style={styles.headingSection}>
              <Text style={styles.sectionTitle}>Vehicle Details</Text>
            </View>
            <View style={styles.itemsSection}>
              <View style={commonStyles.rowSpaceBetween}>
                <Text style={textStyles.smallBold}>Vehicle Type</Text>
                <Text style={textStyles.small}>Cargo Vehicle</Text>
              </View>
              <View style={commonStyles.rowSpaceBetween}>
                <Text style={textStyles.smallBold}>Vehicle Brand</Text>
                <Text style={textStyles.small}>TATA</Text>
              </View>
              <View style={commonStyles.rowSpaceBetween}>
                <Text style={textStyles.smallBold}>Vehicle Number</Text>
                <Text style={textStyles.small}>MH14FE4940</Text>
              </View>
              {/* <View style={commonStyles.rowSpaceBetween}>
                <Text style={textStyles.smallBold}>Final Price</Text>
                <Text style={[textStyles.small, { color: Colors.primary }]}>₹{booking?.finalPrice || 0}</Text>
              </View> */}
              {booking?.status === 'COMPLETED' && (
                <View style={commonStyles.rowSpaceBetween}>
                  <Text style={textStyles.smallBold}>Given Amount</Text>
                  <Text style={[textStyles.small, { color: Colors.primary }]}>
                    ₹{booking?.givenAmount || 0}
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
        {booking?.orderType === 'GENERAL' && (
          <>
            <View style={styles.itemHeadingSection}>
              <View></View>
              <Text style={styles.sectionTitle}>Item In this Booking</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('editOrderScreen', { booking })
                }
              >
                <Ionicons
                  name="create-outline"
                  size={20}
                  color={Colors.primary}
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.itemsSection}>
              {items.map(item => (
                <View key={item.id} style={styles.itemCard}>
                  <Image
                    source={{
                      uri: item.item?.imageUrl
                        ? API_BASE_URL + item.item.imageUrl
                        : 'https://via.placeholder.com/60',
                      headers: item.item?.imageUrl
                        ? { Authorization: `Bearer ${user?.accessToken}` }
                        : undefined,
                    }}
                    style={styles.itemImage}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.itemTitle}>
                      {item.item?.name || 'N/A'}
                    </Text>
                    <Text style={styles.itemInfo}>
                      Quantity: {item.quantity} {item.unit}
                    </Text>
                    <Text style={styles.itemInfo}>Price: ₹{item.price}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
       {booking?.status !== 'COMPLETED' && !(booking?.status.includes('CANCELLED')) && ( <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('allUsersScreen', {
                fromSelectUser: 'driver',
                onUserSelect: handleDriverSelect,
              })
            }
            style={[styles.outlinedBtn, { borderColor: Colors.primary }]}
          >
            <Text style={[styles.outlinedBtnText, { color: Colors.primary }]}>
              {selectedDriver ? 'Change Driver' : 'Assign Driver'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setWarningVisible(true)}
            style={[styles.outlinedBtn, { borderColor: Colors.redColor }]}
          >
            <Text style={[styles.outlinedBtnText, { color: Colors.redColor }]}>
              Cancel Order
            </Text>
          </TouchableOpacity>
        </View>)}

        <FaddedIcon />
        <View style={{ height: 80 }} />
        <ImagePreviewModal
          image={previewImage}
          visibility={previewVisible}
          setVisibility={setPreviewVisible}
        />
      </ScrollView>
      <ImagePreviewModal
        image={previewImage}
        visibility={previewVisible}
        setVisibility={setPreviewVisible}
      />
      {warningVisible && (
        <WarningWithButton
          message="Are you sure you want to Cancel this Order?"
          onYes={() => {
            setWarningVisible(false);
          }}
          onClose={() => setWarningVisible(false)}
        />
      )}

      {isLoading && <DottedBlackLoader />}

    </View>
  );
};

export default BookingDetailAdmin;

const styles = StyleSheet.create({
  image: {
    width: width,
    height: 240,
    resizeMode: 'cover',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 50,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    borderRadius: 50,
    backgroundColor: Colors.primary,
  },

  itemsSection: {
    marginHorizontal: 12,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: Colors.whiteColor,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  itemDesc: {
    fontSize: 13,
    color: '#777',
    marginVertical: 2,
  },
  itemInfo: {
    fontSize: 12,
    color: Colors.darkBlue,
  },
  footer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.whiteColor,
    padding: 12,
    elevation: 10,
  },
  rateNowbtn: {
    padding: 12,
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
  },
  outlinedBtn: {
    padding: 12,
    flex: 1,
    borderRadius: 10,
    marginHorizontal: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  rateNowBtnText: {
    fontWeight: '600',
    fontSize: 15,
  },
  outlinedBtnText: {
    color: Colors.secondary,
    fontWeight: '600',
    fontSize: 15,
  },

  previewContainer: {
    flex: 1,
    backgroundColor: 'rgba(23, 22, 22, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headingSection: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    marginVertical: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  itemHeadingSection: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    marginVertical: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 4,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: Colors.whiteColor,
    alignItems: 'center',
    // justifyContent:"center",
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 10,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
  },
  userPhone: {
    fontSize: 13,
    color: '#777',
  },
  pickupImage: {
    height: 100,
    width: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    marginTop: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
});
