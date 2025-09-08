import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Colors, textStyles, commonStyles, screenWidth } from '../../styles/commonStyles';

const LargeProductCardAdmin = ({ product, isInCart = false, onToggleCart }) => {
  return (
    <View style={styles.card}>
        <Image
        source={
          product?.image
            ? { uri: product.image }
            : {
                uri: 'https://t3.ftcdn.net/jpg/03/76/97/16/360_F_376971659_OSsR8oqHDuyoovcqqi2KNcHRKKVA9QqO.jpg',
              }
        }
        style={styles.image}
        resizeMode="cover"
      />

        <Text style={styles.title} numberOfLines={1}>
        {product?.title || 'Product Title'}
      </Text>

       <Text style={styles.description} numberOfLines={2}>
        Material : {product?.material}
      </Text>

       <Text style={styles.price}>
        {product?.type === 'countable'
          ? `₹ ${product?.price} / piece`
          : `₹ ${product?.price} / kg`}
      </Text>

    </View>
  );
};

export default LargeProductCardAdmin;

const styles = StyleSheet.create({
  card: {
    width: screenWidth * 0.45,
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
  cartButton: {
    backgroundColor: Colors.primary,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  cartButtonText: {
    color: Colors.whiteColor,
    fontSize: 13,
    fontWeight: 'bold',
  },
});
