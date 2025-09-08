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

const BookingCardAdmin = ({ booking }) => {
  const navigation = useNavigation();
  const {
    address,
    status,
    pickupStatus,
    driverStatus,
    pickupDateTime,
    items,
    expectedPrice,
    images,
  } = booking;

  const maxVisible = 3;
  const visibleImages = images.slice(0, maxVisible);
  const extraCount = images.length - maxVisible;

  const renderImages = () => {
    if (images.length === 1) {
      return <Image source={{ uri: images[0] }} style={styles.singleImage} />;
    } else if (images.length === 2) {
      return (
        <View style={styles.twoImageRow}>
          {images.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.twoImage} />
          ))}
        </View>
      );
    } else if (images.length >= 3) {
      return (
        <View style={styles.imageRow}>
          {visibleImages.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.imageThumb} />
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
      onPress={() => navigation.navigate('bookingDetailAdmin')}
      activeOpacity={0.7}
      style={[styles.card, commonStyles.shadow]}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={textStyles.subHeading}>Booking</Text>
        <Text style={[textStyles.subHeading, { color: Colors.secondaryLight }]}>
          #GRB45859
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
        <Text style={textStyles.smallBold}>Pickup Status</Text>
        <Text
          style={[
            textStyles.small,
            {
              color:
                pickupStatus === 'Completed'
                  ? Colors.greenColor
                  : Colors.yellowColor,
            },
          ]}
        >
          {pickupStatus}
        </Text>
      </View>
      <View style={commonStyles.rowSpaceBetween}>
        <Text style={textStyles.smallBold}>Booking status</Text>
        <Text
          style={[
            textStyles.small,
            {
              color:
                status === 'cancelled' ? Colors.secondary : Colors.greenColor,
            },
          ]}
        >
          {pickupStatus}
        </Text>
      </View>

      <View style={commonStyles.rowSpaceBetween}>
        <Text style={textStyles.smallBold}>Driver</Text>
        <Text style={[textStyles.small, { color: Colors.primary }]}>
          {driverStatus}
        </Text>
      </View>

      <View style={commonStyles.rowSpaceBetween}>
        <Text style={textStyles.smallBold}>Pickup Date</Text>
        <Text style={textStyles.small}>{pickupDateTime}</Text>
      </View>

      <View style={commonStyles.rowSpaceBetween}>
        <Text style={textStyles.smallBold}>Items</Text>
        <Text style={textStyles.small}>{items}</Text>
      </View>

      <View
        style={[commonStyles.rowSpaceBetween, { marginTop: Sizes.fixPadding }]}
      >
        <Text style={textStyles.smallBold}>Expected Price</Text>
        <Text style={[textStyles.smallBold, { color: Colors.greenColor }]}>
          {expectedPrice}
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
