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
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/selector';
import Key from '../../constants/key';
import { getStatusColor } from '../../utils/CommonMethods';

const BookingCard = ({ booking }) => {
  const navigation = useNavigation();
  console.log('booking data', booking);
  const user = useSelector(selectUser);
  const { API_BASE_URL } = Key;

  // Extract data from order entity
  const allOrderImages = booking?.orderImages || [];
  const orderImages = allOrderImages.filter(
    image => image?.postedBy === 'USER',
  );
  const orderItems = booking?.orderItems || [];
  const itemCount = orderItems?.length;
  const pickupDate = booking?.pickupDate
    ? new Date(booking?.pickupDate).toLocaleDateString()
    : 'N/A';
  const driverName = booking?.driver?.fullName || 'Not Assigned';

  const maxVisible = 3;
  const visibleImages = orderImages.slice(0, maxVisible);
  const extraCount = orderImages.length - maxVisible;

  const renderImages = () => {
    if (orderImages.length === 1) {
      return (
        <Image
          source={{
            uri: API_BASE_URL + orderImages[0]?.imageUrl,
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          }}
          style={styles.singleImage}
        />
      );
    } else if (orderImages.length === 2) {
      return (
        <View style={styles.twoImageRow}>
          {orderImages.map((image, index) => (
            <Image
              key={index}
              source={{
                uri: API_BASE_URL + image?.imageUrl,
                headers: {
                  Authorization: `Bearer ${user?.accessToken}`,
                },
              }}
              style={styles.twoImage}
            />
          ))}
        </View>
      );
    } else if (orderImages.length >= 3) {
      return (
        <View style={styles.imageRow}>
          {visibleImages.map((image, index) => (
            <Image
              key={index}
              source={{
                uri: API_BASE_URL + image?.imageUrl,
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
    return null;
  };

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('bookingDetailScreen', { orderId: booking?.id })
      }
      activeOpacity={0.9}
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

      {renderImages()}

      <View style={styles.divider} />

      <View style={commonStyles.rowSpaceBetween}>
        <Text style={textStyles.smallBold}>Order Status</Text>
        <Text
          style={[
            textStyles.small,
            {
              color: getStatusColor (booking?.status),
            },
          ]}
        >
          {booking?.status || 'N/A'}
        </Text>
      </View>

      <View style={commonStyles.rowSpaceBetween}>
        <Text style={textStyles.smallBold}>Driver</Text>
        <Text style={[textStyles.small, { color: Colors.blackColor }]}>
          {driverName}
        </Text>
      </View>

      <View style={commonStyles.rowSpaceBetween}>
        <Text style={textStyles.smallBold}>Pickup Date</Text>
        <Text style={textStyles.small}>{pickupDate}</Text>
      </View>

      {booking?.type == 'general' && (
        <View style={commonStyles.rowSpaceBetween}>
          <Text style={textStyles.smallBold}>Items</Text>
          <Text style={textStyles.small}>{itemCount}</Text>
        </View>
      )}

      <View
        style={[commonStyles.rowSpaceBetween, { marginTop: Sizes.fixPadding }]}
      >
        <Text style={textStyles.smallBold}>Final Price</Text>
        <Text style={[textStyles.smallBold, { color: Colors.greenColor }]}>
          ₹{booking?.finalPrice || 0}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default BookingCard;

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
});
