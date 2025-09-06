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
import { useNavigation } from '@react-navigation/native';
import { WarningWithButton } from '../../components/lottie/WarningWithButton';
import { DottedBlackLoader } from '../../components/lottie/loaderView';
import { LottieAlert } from '../../components/lottie/LottieAlert';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { openGoogleMaps, callUser } from '../../utils/CommonMethods';
import MyStatusBar from '../../components/MyStatusBar';
const { width } = Dimensions.get('window');
const PickupRequestDetail = () => {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [warningVisible, setWarningVisible] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);
  const [succesAlertVisible, setSuccessAlertVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const flatListRef = useRef();

  const images = [
    'https://plus.unsplash.com/premium_photo-1664283229534-194c0cb5b7da?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1664283229534-194c0cb5b7da?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ];

  const items = [
    {
      id: 1,
      image:
        'https://plus.unsplash.com/premium_photo-1664283229534-194c0cb5b7da?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Wooden Chair',
      desc: 'Premium oak chair',
      qty: 2,
      weight: '15kg',
    },
    {
      id: 2,
      image:
        'https://plus.unsplash.com/premium_photo-1664283229534-194c0cb5b7da?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Table Lamp',
      desc: 'White desk lamp',
      qty: 1,
      weight: '3kg',
    },
    {
      id: 3,
      image:
        'https://plus.unsplash.com/premium_photo-1664283229534-194c0cb5b7da?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Cardboard Boxes',
      desc: 'Set of 10 packing boxes',
      qty: 10,
      weight: '20kg',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar/>
      <CommonAppBar navigation={navigation} label="Pickup Request Detail" />

      <ScrollView showsVerticalScrollIndicator={false}>
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
              <Image source={{ uri: item }} style={styles.image} />
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
        {true && (
          <>
            <View style={styles.headingSection}>
              <Text style={styles.sectionTitle}>User Detail</Text>
            </View>
            <View style={styles.userCard}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1519456264917-42d0aa2e0625?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                }}
                style={styles.userImage}
              />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.userName}>User name</Text>
                <Text style={styles.userPhone}>+91 98765 43210</Text>
              </View>
            </View>
          </>
        )}
        <View style={styles.headingSection}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
        </View>

        <View style={styles.itemsSection}>
          <View style={commonStyles.rowSpaceBetween}>
            <Text style={textStyles.smallBold}>Items</Text>
            <Text style={textStyles.small}>7</Text>
          </View>
          <View style={commonStyles.rowSpaceBetween}>
            <Text style={textStyles.smallBold}>Pickup Date Time</Text>
            <Text style={textStyles.small}>7/10/25 10AM</Text>
          </View>
          <View style={commonStyles.rowSpaceBetween}>
            <Text style={textStyles.smallBold}>Pickup Status</Text>
            <Text style={textStyles.small}>Pending</Text>
          </View>

          <View style={commonStyles.rowSpaceBetween}>
            <Text style={textStyles.smallBold}>Expected Price</Text>
            <Text style={textStyles.small}>₹120</Text>
          </View>
        </View>
        <View style={styles.headingSection}>
          <Text style={styles.sectionTitle}>Customer Detail</Text>
        </View>
        <View style={{ padding: 10 }}>
          <View style={commonStyles.rowSpaceBetween}>
            <Text style={textStyles.smallBold}>Customer Name</Text>
            <Text style={textStyles.small}> Ravi KUmar</Text>
          </View>
          <View style={commonStyles.rowSpaceBetween}>
            <Text style={textStyles.smallBold}>Customer Mobile Number</Text>
            <Text style={textStyles.small}>+91 9708571269</Text>
          </View>

          <Text
            style={[
              textStyles.small,
              { flex: 1, textAlign: 'right', textAlign: 'justify' },
            ]}
          >
            <Text style={textStyles.smallBold}>Landmark: </Text>
            221B Baker Street, London 221B Baker Street,
          </Text>
          <Text
            style={[
              textStyles.small,
              { flex: 1, textAlign: 'right', textAlign: 'justify' },
            ]}
          >
            <Text style={textStyles.smallBold}>Address: </Text>
            221B Baker Street, London 221B Baker Street, London 221B Baker
            Street, London 221B Baker Street, London 221B Baker Street, London
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
              onPress={() => openGoogleMaps(28.6139, 77.209)} // pass dynamic coords here
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
              onPress={() => callUser('9876543210')}
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

        <View style={styles.headingSection}>
          <Text style={styles.sectionTitle}>Item In this Booking</Text>
        </View>
        <View style={styles.itemsSection}>
          {items.map(item => (
            <View key={item.id} style={styles.itemCard}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDesc}>{item.desc}</Text>
                <Text style={styles.itemInfo}>
                  Qty: {item.qty} | {item.weight}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('finalPickupScreen')}
          style={[styles.outlinedBtn, { borderColor: Colors.primary }]}
        >
          <Text style={[styles.outlinedBtnText, { color: Colors.primary }]}>
            Pickup Order
          </Text>
        </TouchableOpacity>

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
  userName: {
    fontSize: 15,
    fontWeight: '600',
  },
  userPhone: {
    fontSize: 13,
    color: '#777',
  },
});
