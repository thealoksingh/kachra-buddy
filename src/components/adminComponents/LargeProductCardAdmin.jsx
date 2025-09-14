import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Colors, textStyles, commonStyles, screenWidth } from '../../styles/commonStyles';
import Key from '../../constants/key';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/selector';

const LargeProductCardAdmin = ({ product, isInCart = false, onToggleCart }) => {
    const navigation= useNavigation()
    console.log("product in large product card admin", product);
  const user = useSelector(selectUser);
    const {API_BASE_URL}= Key;

  return (
    <TouchableOpacity onPress={()=>navigation.navigate("updateProductScreen", { item: product })} style={styles.card}>
        <Image
        source={
          product?.imageUrl
            ? { uri: API_BASE_URL+product?.imageUrl,
              headers: { Authorization: `Bearer ${user?.accessToken}` }
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

       {/* <Text style={styles.description} numberOfLines={2}>
        Material : {product?.tags || 'N/A'}
      </Text> */}

       <Text style={styles.price}>
          ₹ {product?.pricePerUnit} / {product?.unit}
      </Text>

    </TouchableOpacity>
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
