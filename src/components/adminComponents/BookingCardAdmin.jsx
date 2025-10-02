import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  Colors,
  commonStyles,
  Sizes,
  textStyles,
} from '../../styles/commonStyles';
import { selectUser } from '../../store/selector';
import Key from '../../constants/key';
import { getStatusColor } from '../../utils/CommonMethods';

const BookingCardAdmin = ({ booking }) => {
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const { API_BASE_URL } = Key;
  
  const address = booking?.pickupAddress || booking?.orderPickupAddress || 'N/A';
  const status = booking?.status || 'N/A';
  const pickupDate = booking?.pickupDate ? new Date(booking.pickupDate).toLocaleDateString() : 'N/A';
  const driverName = booking?.driver?.fullName || 'Not Assigned';
  const userName = booking?.user?.fullName || 'N/A';
  const finalPrice = booking?.finalPrice || 0;
  const orderItems = booking?.orderItems || [];
  const images = booking?.orderImages?.map(img => API_BASE_URL + img.imageUrl) || [];
  const itemsCount = orderItems.length;

  const maxVisible = 3;
  const visibleImages = images?.slice(0, maxVisible);
  const extraCount = images?.length - maxVisible;

  const renderImages = () => {
    if (!images || images.length === 0) return null;
    
    if (images.length === 1) {
      return (
        <Image 
          source={{ 
            uri: images[0],
            headers: { Authorization: `Bearer ${user?.accessToken}` }
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
                headers: { Authorization: `Bearer ${user?.accessToken}` }
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
                headers: { Authorization: `Bearer ${user?.accessToken}` }
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
      onPress={() => navigation.navigate('bookingDetailAdmin', { bookingId:booking?.id })}
      activeOpacity={0.9}
      style={[styles.card,{ borderLeftColor: getStatusColor(booking?.status) }]}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={textStyles.subHeading}>Order #{booking?.id}</Text>
        <Text style={[textStyles.subHeading, { color: Colors.secondaryLight }]}>
          {userName}
        </Text>
      </View>
      <Text
        style={[textStyles.small, { color: Colors.grayColor, marginTop: 2 }]}
      >
        {address}
      </Text>

      {renderImages()}

      <View style={styles.divider} />

      <View style={commonStyles.rowSpaceBetween}>
        <Text style={textStyles.smallBold}>Status</Text>
        <Text
          style={[
            textStyles.small,
            {
              color:
                status === 'DELIVERED'
                  ? Colors.greenColor
                  : status === 'CANCELLED'
                  ? Colors.secondary
                  : Colors.yellowColor,
            },
          ]}
        >
          {status}
        </Text>
      </View>

      <View style={commonStyles.rowSpaceBetween}>
        <Text style={textStyles.smallBold}>Driver</Text>
        <Text style={[textStyles.small, { color: Colors.primary }]}>
          {driverName}
        </Text>
      </View>

      <View style={commonStyles.rowSpaceBetween}>
        <Text style={textStyles.smallBold}>Pickup Date</Text>
        <Text style={textStyles.small}>{pickupDate}</Text>
      </View>

      <View style={commonStyles.rowSpaceBetween}>
        <Text style={textStyles.smallBold}>Items</Text>
        <Text style={textStyles.small}>{itemsCount} items</Text>
      </View>

      <View
        style={[commonStyles.rowSpaceBetween, { marginTop: Sizes.fixPadding }]}
      >
        <Text style={textStyles.smallBold}>Final Price</Text>
        <Text style={[textStyles.smallBold, { color: Colors.greenColor }]}>
          ₹{finalPrice}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default BookingCardAdmin;

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
