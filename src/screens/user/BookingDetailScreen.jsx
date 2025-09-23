import React, { useState, useRef, useEffect } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../store/selector';
import { getOrderById, cancelOrder } from '../../store/thunks/userThunk';
import { showLottieAlert } from '../../store/slices/lottieAlertSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Key from '../../constants/key';
import { WarningWithButton } from '../../components/lottie/WarningWithButton';
import { DottedBlackLoader } from '../../components/lottie/loaderView';
import { LottieAlert } from '../../components/lottie/LottieAlert';
import { FloatingOTP } from '../../components/userComponents/FloatingOTP';
import { getStatusColor } from '../../utils/CommonMethods';
import OrderStatusCard from '../../components/userComponents/OrderStatusCard';
const { width } = Dimensions.get('window');


const BookingDetailScreen = () => {
  // console.log('Rendering BookingDetailScreen');
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { API_BASE_URL } = Key;

  const [activeIndex, setActiveIndex] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [cancelWarningVisible, setCancelWarningVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [otpAlertVisible, setOtpAlertVisible] = useState(true);
  const flatListRef = useRef();

  // Get order ID from route params
  const { orderId } = route?.params || {};

  // Fetch order by ID when component renders
  useEffect(() => {
    if (orderId) {
      const fetchOrderData = async () => {
        setIsLoading(true);
        try {
          const response = await dispatch(getOrderById(orderId));
          if (getOrderById.fulfilled.match(response)) {
            console.log('Fetched order data:', response?.payload?.data);
            setOrderData(response?.payload?.data || response?.payload);
          }
        } catch (error) {
          console.log('Error fetching order:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrderData();
    }
  }, [orderId, dispatch]);

  // Extract order images (USER posted only)
  const allOrderImages = orderData?.orderImages || [];
  const images = allOrderImages
    .filter(image => image?.postedBy === 'USER')
    .map(image => API_BASE_URL + image?.imageUrl);

  // Extract order items
  const items = orderData?.orderItems || [];

  const CancelOrder = async () => {
    setIsCancelling(true);
    setCancelWarningVisible(false);

    try {
      const result = await dispatch(cancelOrder(orderId));
      console.log('Cancel order result:', result);
      console.log('Result type:', result.type);

      if (result.type === 'user/cancelOrder/fulfilled') {
        dispatch(
          showLottieAlert({
            type: 'success',
            message: 'Order Cancelled Successfully',
            autoClose: true,
          }),
        );
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      } else {
        console.log('Failure payload:', result.payload);
        dispatch(
          showLottieAlert({
            type: 'failure',
            message:
              result?.payload?.message ||
              'Order Cancellation Failed, Try Again',
            autoClose: true,
          }),
        );
      }
    } catch (error) {
      console.log('Cancel error:', error);
      dispatch(
        showLottieAlert({
          type: 'failure',
          message: 'Network error. Please try again.',
          autoClose: true,
        }),
      );
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <CommonAppBar navigation={navigation} label="Booking Details" />

      <ScrollView showsVerticalScrollIndicator={false}>
         {images.length> 0 &&(<>
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
         </>)}
         
        <OrderStatusCard/>

        {orderData?.driver && (
          <>
            <View style={styles.headingSection}>
              <Text style={styles.sectionTitle}>Driver Details</Text>
            </View>
            <View style={styles.driverCard}>
              {orderData?.driver?.avatarUrl ? (
                <Image
                  source={{
                    uri: API_BASE_URL + orderData.driver.avatarUrl,
                    headers: {
                      Authorization: `Bearer ${user?.accessToken}`,
                    },
                  }}
                  style={styles.driverImage}
                />
              ) : (
                <View style={[styles.driverImage, styles.driverIconContainer]}>
                  <Ionicons name="person" size={30} color={Colors.grayColor} />
                </View>
              )}

              
              <View style={{  marginLeft: 12 }}>
                <Text style={styles.driverName}>
                  {orderData?.driver?.fullName || 'Driver name'}
                </Text>
                <Text style={styles.driverPhone}>
                  {orderData?.driver?.contactNumber || '+91 98765 43210'}
                </Text>
                {/* <View style={{ flexDirection: 'row', marginTop: 4 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Text
                      key={i}
                      style={{
                        color: i < 4 ? '#FFD700' : '#ccc',
                        fontSize: 16,
                      }}
                    >
                      ★
                    </Text>
                  ))}
                </View> */}
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
              {orderData?.pickupDate
                ? new Date(orderData.pickupDate).toLocaleDateString()
                : 'N/A'}
            </Text>
          </View>
          <View style={commonStyles.rowSpaceBetween}>
            <Text style={textStyles.smallBold}>Order Status</Text>
            <Text
              style={[
                textStyles.small,
                { color: getStatusColor(orderData?.status) },
              ]}
            >
              {orderData?.status || 'N/A'}
            </Text>
          </View>
          <View style={commonStyles.rowSpaceBetween}>
            <Text style={textStyles.smallBold}>Driver Allocation</Text>
            <Text style={textStyles.small}>
              {orderData?.driver ? 'Allocated' : 'Not Allocated'}
            </Text>
          </View>
          {orderData?.orderType == 'GENERAL' && (
            <>
              <View style={commonStyles.rowSpaceBetween}>
                <Text style={textStyles.smallBold}>Items</Text>
                <Text style={textStyles.small}>{items.length}</Text>
              </View>
              <View style={commonStyles.rowSpaceBetween}>
                <Text style={textStyles.smallBold}>Final Price</Text>
                <Text style={[textStyles.small, { color: Colors.primary }]}>
                  ₹{orderData?.finalPrice || 0}
                </Text>
              </View>
            </>
          )}
          <View style={commonStyles.rowSpaceBetween}>
            <Text
              style={[
                textStyles.small,
                { flex: 1, textAlign: 'justify', marginTop: 8 },
              ]}
            >
              <Text style={textStyles.smallBold}>Address: </Text>
              {orderData?.orderPickupAddress ||
                orderData?.pickupAddress ||
                'N/A'}
            </Text>
          </View>
        </View>
        {orderData?.orderType == 'VEHICLE' && (
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
              <View style={commonStyles.rowSpaceBetween}>
                <Text style={textStyles.smallBold}>Final Price</Text>
                <Text style={textStyles.small}>
                  ₹{orderData?.finalPrice || 0}
                </Text>
              </View>
            </View>
          </>
        )}
        {orderData?.orderType == 'GENERAL' && (
          <>
            <View style={styles.headingSection}>
              <Text style={styles.sectionTitle}>Item In this Booking</Text>
            </View>
            <View style={styles.itemsSection}>
              {items.map(item => (
                <View key={item.id} style={styles.itemCard}>
                  <Image
                    source={{
                      uri: API_BASE_URL + item?.item?.imageUrl,
                      headers: {
                        Authorization: `Bearer ${user?.accessToken}`,
                      },
                    }}
                    style={styles.itemImage}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.itemTitle}>
                      {item?.item?.name || 'Item'}
                    </Text>
                    <Text style={styles.itemDesc}>
                      ₹{item?.item?.pricePerUnit} /{' '}
                      {item?.item?.unit?.toLowerCase()}
                    </Text>
                    <Text style={styles.itemInfo}>
                      Qty: {item?.quantity} | {item?.unit} | ₹{item?.price}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
        <View
          style={{ flexDirection: 'row', justifyContent: 'center', gap: 2 }}
        >
          {/* Pending Order → show Complete + Cancel */}
          {orderData?.status === 'INCOMPLETE' && (
            <>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('checkoutScreen', { orderData })
                }
                style={[styles.cancelBtn, { borderColor: Colors.primary }]}
              >
                <Text style={[styles.cancelBtnText, { color: Colors.primary }]}>
                  Complete Booking
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setCancelWarningVisible(true)}
                style={[styles.cancelBtn, { borderColor: Colors.secondary }]}
              >
                <Text
                  style={[styles.cancelBtnText, { color: Colors.secondary }]}
                >
                  Cancel Booking
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* New Order → only Cancel */}
          {orderData?.status === 'ACTIVE' && (
            <TouchableOpacity
              onPress={() => setCancelWarningVisible(true)}
              style={[styles.cancelBtn, { borderColor: Colors.secondary }]}
            >
              <Text style={[styles.cancelBtnText, { color: Colors.secondary }]}>
                Cancel Booking
              </Text>
            </TouchableOpacity>
          )}

          {/* Completed Order → Rate Now */}
          {/* {orderData?.status === 'COMPLETED' && (
            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: Colors.primary }]}
            >
              <Text style={[styles.cancelBtnText, { color: Colors.primary }]}>
                Rate Now
              </Text>
            </TouchableOpacity>
          )} */}
        </View>

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
      {cancelWarningVisible && (
        <WarningWithButton
          message="Are you sure you want to cancel this Booking?"
          onYes={CancelOrder}
          onClose={() => setCancelWarningVisible(false)}
        />
      )}
      {(isLoading || isCancelling) && <DottedBlackLoader />}

      <FloatingOTP
        visible={otpAlertVisible}
        title={'087654'}
        message={'Please Share the OTP with the collector.'}
        onClose={() => setOtpAlertVisible(false)}
        expiryTime={new Date('2025-09-28T14:30:00Z')}
      />
    </View>
  );
};

export default BookingDetailScreen;

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
    color: Colors.primary,
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
  cancelBtn: {
    padding: 12,
    flex: 1,
    borderRadius: 10,
    marginHorizontal: 12,
    marginVertical: 15,
    borderWidth: 1,
    alignItems: 'center',
  },
  rateNowBtnText: {
    fontWeight: '600',
    fontSize: 15,
  },
  cancelBtnText: {
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
  driverCard: {
    flexDirection: 'row',
      alignItems: 'center',
    backgroundColor: Colors.whiteColor,
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 10,
  },
  driverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  driverIconContainer: {
    backgroundColor: Colors.extraLightGrayColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverName: {
    fontSize: 15,
    fontWeight: '600',
  },
  driverPhone: {
    fontSize: 13,
    color: '#777',
  },
});
