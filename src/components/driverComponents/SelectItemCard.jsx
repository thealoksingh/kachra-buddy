import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import {
  Colors,
  textStyles,
  commonStyles,
  screenWidth,
} from '../../styles/commonStyles';
import Key from '../../constants/key';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/selector';
const SelectItemCard = ({ product, selected }) => {
  const { API_BASE_URL } = Key;
  const user = useSelector(selectUser);
//   console.log('image url', product?.imageUrl);
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: selected
            ? Colors.lightGreenColor
            : Colors.whiteColor,
        },
      ]}
    >
      <Image
        source={
          product?.imageUrl
            ? {
                uri: API_BASE_URL + product?.imageUrl,
                headers: {
                  Authorization: `Bearer ${user?.accessToken}`,
                },
              }
            : {
                uri: 'https://t3.ftcdn.net/jpg/03/76/97/16/360_F_376971659_OSsR8oqHDuyoovcqqi2KNcHRKKVA9QqO.jpg',
              }
        }
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.title} numberOfLines={1}>
        {product?.name || 'Product Title'}
      </Text>

      <Text style={styles.price}>
        {product?.isCountable
          ? `₹ ${product?.pricePerUnit} / piece`
          : `₹ ${product?.pricePerUnit} / kg`}
      </Text>
    </View>
  );
};

export default SelectItemCard;

const styles = StyleSheet.create({
  card: {
    width: screenWidth * 0.45,

    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    borderRadius: 10,
    padding: 8,
    margin: 5,
    alignItems: 'center',
    ...commonStyles.shadow,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 6,
  },
  title: {
    ...textStyles.subHeading,
    color: Colors.blackColor,
    textAlign: 'center',
  },
  description: {
    ...textStyles.extraSmall,
    color: Colors.blackColor,
    textAlign: 'center',
    marginTop: 2,
  },
  price: {
    ...textStyles.small,
    color: Colors.blackColor,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 8,
  },
});
