import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import {
  Colors,
  commonStyles,
  Sizes,
  textStyles,
} from '../../styles/commonStyles';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../store/selector';
import { outForPickup, outForDelivery } from '../../store/thunks/driverThunk';
import { showSnackbar } from '../../store/slices/snackbarSlice';
import Key from '../../constants/key';
import { getStatusColor } from '../../utils/CommonMethods';

const PickupRequestCard = ({ booking ,setShowAlert,setBookingId }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { API_BASE_URL } = Key;



  // Extract data from order entity
  const allOrderImages = booking?.orderImages || [];
  const images = allOrderImages
    .filter(image => image?.postedBy === 'USER')
    .map(image => API_BASE_URL + image?.imageUrl);
  const orderItems = booking?.orderItems || [];
  const itemCount = orderItems.length;
  const pickupDate = booking?.pickupDate
    ? new Date(booking.pickupDate).toLocaleDateString()
    : 'N/A';
  const address =
    booking?.orderPickupAddress ||
    booking?.pickupAddress ||
    'Address not provided';
  const sellerName = booking?.sellerName || booking?.user?.fullName || 'N/A';

  const maxVisible = 3;
  const visibleImages = images.slice(0, maxVisible);
  const extraCount = images.length - maxVisible;

  const renderImages = () => {
    if (images.length === 0) {
      return (
        <View style={styles.noImageContainer}>
          <Text style={styles.noImageText}>No images available</Text>
        </View>
      );
    } else if (images.length === 1) {
      return (
        <Image
          source={{
            uri: images[0],
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          }}
          style={styles.singleImage}
        />
      );
    } else if (images.length === 2) {
      return (
        <View style={styles.twoImageRow}>
          {images.map((uri, index) => (
            <Image
              key={index}
              source={{
                uri,
                headers: {
                  Authorization: `Bearer ${user?.accessToken}`,
                },
              }}
              style={styles.twoImage}
            />
          ))}
        </View>
      );
    } else if (images.length >= 3) {
      return (
        <View style={styles.imageRow}>
          {visibleImages.map((uri, index) => (
            <Image
              key={index}
              source={{
                uri,
                headers: {
                  Authorization: `Bearer ${user?.accessToken}`,
                },
              }}
              style={styles.imageThumb}
            />
          ))}
          {extraCount > 0 && (
            <View style={styles.extraImages}>
              <Text style={textStyles.smallBold}>+{extraCount}</Text>
            </View>
          )}
        </View>
      );
    }
  };

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('pickupRequestDetail', { orderId: booking?.id })
      }
      activeOpacity={0.8}
      style={[
        styles.card,
        { borderLeftColor: getStatusColor(booking?.status) },
      ]}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={textStyles.subHeading}>Booking</Text>
        <Text style={[textStyles.subHeading, { color: Colors.secondaryLight }]}>
          #{booking?.id || 'N/A'}
        </Text>
      </View>
      <Text
        style={[textStyles.small, { color: Colors.grayColor, marginTop: 2 }]}
      >
        {address}
      </Text>

      <Text
        style={[textStyles.extraSmall, { color: Colors.primary, marginTop: 2 }]}
      >
        Seller: {sellerName}
      </Text>

      {renderImages()}

      <View style={styles.divider} />

      <View style={commonStyles.rowSpaceBetween}>
        <Text style={textStyles.smallBold}>Order Status</Text>
        <Text
          style={[
            textStyles.small,
            {
              color: getStatusColor(booking?.status),
            },
          ]}
        >
          {booking?.status || 'N/A'}
        </Text>
      </View>

      {/* <View style={commonStyles.rowSpaceBetween}>
        <Text style={textStyles.smallBold}>Seller Contact</Text>
        <Text style={textStyles.small}>
          {booking?.sellerContactNo || booking?.user?.contactNumber || 'N/A'}
        </Text>
      </View> */}

      <View style={commonStyles.rowSpaceBetween}>
        <Text style={textStyles.smallBold}>Pickup Date</Text>
        <Text style={textStyles.small}>{pickupDate}</Text>
      </View>

      <View style={commonStyles.rowSpaceBetween}>
        <Text style={textStyles.smallBold}>Items</Text>
        <Text style={textStyles.small}>{itemCount}</Text>
      </View>

      <View
        style={[commonStyles.rowSpaceBetween, { marginTop: Sizes.fixPadding }]}
      >
        <Text style={textStyles.smallBold}>Expected Price</Text>
        <Text style={[textStyles.bold, { color: Colors.greenColor }]}>
          ₹{booking?.finalPrice || 0}
        </Text>
      </View>

      {booking?.status === 'NEW' && (
        <TouchableOpacity
          onPress={handleOutForPickup}
          style={styles.outForPickupBtn}
        >
          <Text style={styles.outForPickupText}>Out for Pickup</Text>
        </TouchableOpacity>
      )}

      {booking?.status === 'ACTIVE' && (
        <TouchableOpacity
          onPress={()=>{
            setBookingId(booking?.id)
            setShowAlert(true)
          }}
          style={styles.outForPickupBtn}
        >
          <Text style={styles.outForPickupText}>Out for Pickup</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default PickupRequestCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    margin: Sizes.fixPadding,
    padding: Sizes.fixPadding * 1.5,
    elevation: 3,
    shadowColor: Colors.blackColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    borderLeftWidth: 6,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.extraLightGrayColor,
    marginVertical: Sizes.fixPadding,
  },

  singleImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginTop: Sizes.fixPadding,
  },

  twoImageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Sizes.fixPadding,
  },
  twoImage: {
    width: '48%',
    height: 120,
    borderRadius: 10,
  },

  imageRow: {
    flexDirection: 'row',
    marginTop: Sizes.fixPadding,
  },
  imageThumb: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: -10,
    borderWidth: 2,
    borderColor: Colors.whiteColor,
  },
  extraImages: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.extraLightGrayColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  outForPickupBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  outForPickupText: {
    color: Colors.whiteColor,
    fontSize: 14,
    fontWeight: '600',
  },
  noImageContainer: {
    backgroundColor: Colors.extraLightGrayColor,
    height: 80,
    borderRadius: 10,
    marginTop: Sizes.fixPadding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: Colors.grayColor,
    fontSize: 12,
  },
});
