import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Colors, textStyles, commonStyles } from '../../styles/commonStyles';

const LargeProductCard = ({ title, price, image, type }) => {
  return (
    <View style={styles.card}>
      <Image
        source={
          image
            ? { uri: image }
            : {
                uri: 'https://t3.ftcdn.net/jpg/03/76/97/16/360_F_376971659_OSsR8oqHDuyoovcqqi2KNcHRKKVA9QqO.jpg',
              }
        }
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.title} numberOfLines={1}>
        {title || 'Product Title'}
      </Text>

      <Text style={styles.price}>
        {type === 'countable' ? `₹ ${price} / piece` : `₹ ${price} / kg`}
      </Text>

      <TouchableOpacity activeOpacity={0.7} style={styles.cartButton}>
        <Text style={styles.cartButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LargeProductCard;

const styles = StyleSheet.create({
  card: {
    width: 120,
    backgroundColor: Colors.whiteColor,
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    borderRadius: 10,
    padding: 8,
    margin: 5,
    alignItems: 'center',
    ...commonStyles.shadow,
  },
  image: {
    width: 100,
    height: 80,
    borderRadius: 8,
    marginBottom: 1,
  },
  title: {
    ...textStyles.smallBold,
    color: Colors.blackColor,
    textAlign: 'center',
  },
  price: {
    ...textStyles.small,
    color: Colors.blackColor,
    fontWeight: 'bold',
    marginTop: 2,
    marginBottom: 5,
  },
  cartButton: {
    backgroundColor: Colors.primary,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  cartButtonText: {
    color: Colors.whiteColor,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
