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
  RefreshControl,
} from 'react-native';
import { CommonAppBar, FaddedIcon } from '../../components/commonComponents';
import ImagePreviewModal from '../../components/ImagePreviewModal';
import { Colors, commonStyles, textStyles } from '../../styles/commonStyles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WarningWithButton } from '../../components/lottie/WarningWithButton';
import { DottedBlackLoader } from '../../components/lottie/loaderView';
import { LottieAlert } from '../../components/lottie/LottieAlert';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { openGoogleMaps, callUser } from '../../utils/CommonMethods';
import MyStatusBar from '../../components/MyStatusBar';
import { getOrderByIdAPI } from '../../utils/api/driverApi';
import Key from '../../constants/key';
import OrderStatusCard from '../../components/userComponents/OrderStatusCard';
const { width } = Dimensions.get('window');
const PickupRequestDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params || {};
  
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [warningVisible, setWarningVisible] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);
  const [succesAlertVisible, setSuccessAlertVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const flatListRef = useRef();

  
  
  const fetchOrderDetails = async (isRefresh = false) => {
    if (!orderId) return;
    
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const response = await getOrderByIdAPI(orderId);
      setCurrentOrder(response?.data?.data || response?.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const onRefresh = () => {
    fetchOrderDetails(true);
  };

  
  useEffect(() => {
    fetchOrderDetails();

  }, [orderId]);

  const images =
    currentOrder?.orderImages
      ?.filter(img => img.postedBy === 'USER')
      .map(img => ({
        id: img.id,
        uri: Key.API_BASE_URL+ img.imageUrl,
      })) || [];


  // const images = currentOrder?.orderImages?.map(img => `${Key.API_BASE_URL}${img.imageUrl}`) || [];
  const orderItems = currentOrder?.orderItems || [];
  const user = currentOrder?.user;
  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar/>
      <CommonAppBar navigation={navigation} label="Pickup Request Detail" />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {images.length > 0 ? (
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
                  setPreviewImage(item.uri);
                  setPreviewVisible(true);
                }}
              >
                <Image 
                  source={{ 
                    uri: item.uri,
                    headers: { Authorization: `Bearer ${Key.ACCESS_TOKEN}` }
                  }} 
                  style={styles.image} 
                />
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={[styles.image, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }]}>
            <Text style={{ color: '#666' }}>No images available</Text>
          </View>
        )}

        {images.length > 1 && (
          <View style={styles.dotsContainer}>
            {images.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, activeIndex === i && styles.activeDot]}
              />
            ))}
          </View>
        )}

         <OrderStatusCard bookingData={currentOrder}/>
         {user && (
          <>
            <View style={styles.headingSection}>
              <Text style={styles.sectionTitle}>User Detail</Text>
            </View>
            <View style={styles.userCard}>
              {user?.avatarUrl ? (
                <Image
                  source={{
                    uri: `${Key.API_BASE_URL}${user.avatarUrl}`,
                    headers: { Authorization: `Bearer ${user?.accessToken}` }
                  }}
                  style={styles.userImage}
                />
              ) : (
                <View style={[styles.userImage, styles.userIconContainer]}>
                  <Ionicons name="person" size={30} color={Colors.grayColor} />
                </View>
              )}
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.userName}>{user.fullName || 'N/A'}</Text>
                <Text style={styles.userPhone}>{user.contactNumber || 'N/A'}</Text>
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
            <Text style={textStyles.small}>{formatDate(currentOrder?.pickupDate)}</Text>
          </View>
          <View style={commonStyles.rowSpaceBetween}>
            <Text style={textStyles.smallBold}>Pickup Status</Text>
            <Text style={textStyles.small}>{currentOrder?.status || 'N/A'}</Text>
          </View>
          {currentOrder?.orderType === 'GENERAL' && (
            <>
              <View style={commonStyles.rowSpaceBetween}>
                <Text style={textStyles.smallBold}>Items</Text>
                <Text style={textStyles.small}>{totalItems}</Text>
              </View>
              <View style={commonStyles.rowSpaceBetween}>
                <Text style={textStyles.smallBold}>Expected Price</Text>
                <Text style={[textStyles.small,{fontWeight:"700",color:Colors.darkBlue}]}>₹{currentOrder?.finalPrice || 0}</Text>
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
            <Text style={textStyles.small}>{currentOrder?.sellerName || 'N/A'}</Text>
          </View>
          <View style={commonStyles.rowSpaceBetween}>
            <Text style={textStyles.smallBold}>Customer Mobile Number</Text>
            <Text style={textStyles.small}>{currentOrder?.sellerContactNo || 'N/A'}</Text>
          </View>
          <Text
            style={[
              textStyles.small,
              { flex: 1, textAlign: 'justify', marginTop: 8 },
            ]}
          >
            <Text style={textStyles.smallBold}>Address: </Text>
            {currentOrder?.orderPickupAddress || currentOrder?.pickupAddress || 'N/A'}
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
              onPress={() => openGoogleMaps(
                currentOrder?.orderPickupLatitude , 
                currentOrder?.orderPickupLongitude ,
                currentOrder?.sellerName || "Seller Location"
              )}
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
              onPress={() => callUser(currentOrder?.sellerContactNo?.replace(/[^0-9]/g, ''))}
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

        {currentOrder?.orderType === 'VEHICLE' && (
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
             
              {currentOrder?.givenAmount && (
                <View style={commonStyles.rowSpaceBetween}>
                  <Text style={textStyles.smallBold}>Given Amount</Text>
                  <Text style={[textStyles.small,{fontWeight:"700",color:Colors.primary}]}>₹{currentOrder?.givenAmount || 0}</Text>
                </View>
              )}
            </View>
          </>
        )}
          {currentOrder?.status === 'COMPLETED' && (
          <>
            <View style={styles.headingSection}>
              <Text style={styles.sectionTitle}>Pickup Details</Text>
            </View>
            <View style={{ padding: 10 }}>
              {currentOrder?.givenAmount && (
                <View style={commonStyles.rowSpaceBetween}>
                  <Text style={textStyles.smallBold}>Given Amount</Text>
                  <Text style={[textStyles.small,{fontWeight:"700",color:Colors.primary}]}>₹{currentOrder?.givenAmount || 0}</Text>
                </View>
              )}

              {currentOrder?.remark && (
                <Text
                  style={[
                    textStyles.small,
                    { flex: 1, textAlign: 'justify', marginTop: 8 },
                  ]}
                >
                  <Text style={textStyles.smallBold}>Remark By Driver : </Text>
                  {currentOrder?.remark || 'NA'}
                </Text>
              )}
              
              {currentOrder?.orderImages?.filter(img => img.postedBy === 'DRIVER').length > 0 && (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 10,
                    marginTop: 10,
                  }}
                >
                  {currentOrder?.orderImages
                    ?.filter(img => img.postedBy === 'DRIVER')
                    .map((image, index) => (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={0.8}
                        onPress={() => {
                          setPreviewImage(`${Key.API_BASE_URL}${image.imageUrl}`);
                          setPreviewVisible(true);
                        }}
                      >
                        <Image
                          source={{
                            uri: `${Key.API_BASE_URL}${image.imageUrl}`,
                            headers: { Authorization: `Bearer ${Key.ACCESS_TOKEN}` },
                          }}
                          style={styles.pickupImage}
                        />
                      </TouchableOpacity>
                    ))}
                </View>
              )}
            </View>
          </>
        )}
        {currentOrder?.orderType === 'GENERAL' && (
          <>
            <View style={styles.headingSection}>
              <Text style={styles.sectionTitle}>Item In this Booking</Text>
            </View>
            <View style={styles.itemsSection}>
              {orderItems.map(orderItem => (
                <View key={orderItem.id} style={styles.itemCard}>
                  <Image 
                    source={{ 
                      uri: orderItem.item.imageUrl ? `${Key.API_BASE_URL}${orderItem.item.imageUrl}` : 'https://plus.unsplash.com/premium_photo-1664283229534-194c0cb5b7da?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                      headers: orderItem.item.imageUrl ? { Authorization: `Bearer ${Key.ACCESS_TOKEN}` } : undefined
                    }} 
                    style={styles.itemImage} 
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.itemTitle}>{orderItem.item.name}</Text>
                    <Text style={styles.itemDesc}>₹{orderItem.item.pricePerUnit} per {orderItem.item.unit}</Text>
                    <Text style={styles.itemInfo}>
                      Qty: {orderItem.quantity} {orderItem.unit} | ₹{orderItem.price}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

      

        {(currentOrder?.status !== 'COMPLETED' && currentOrder?.status === 'OUT_FOR_PICKUP') && <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('finalPickupScreen', { currentOrder })}
          style={[styles.outlinedBtn, { borderColor: Colors.primary }]}
        >
          <Text style={[styles.outlinedBtnText, { color: Colors.primary }]}>
            Pickup Order
          </Text>
        </TouchableOpacity> }

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
      {loading && <DottedBlackLoader />}
      {succesAlertVisible && (
        <LottieAlert
          type="success"
          message="Order Cancelled Successfuly"
          loop={false}
          onClose={() => {
            setSuccessAlertVisible(false);
          }}
          autoClose={true}
        />
      )}
      {failureAlertVisible && (
        <LottieAlert
          type="failure"
          message="Order Cancellation Failed ,Try Again "
          loop={false}
          onClose={() => {
            setFailureAlertVisible(false);
          }}
          autoClose={true}
        />
      )}
    </View>
  );
};

export default PickupRequestDetail;

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
  userIconContainer: {
    backgroundColor: Colors.extraLightGrayColor,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
});
