import { useState } from 'react';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Colors, textStyles, commonStyles } from '../../styles/commonStyles';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCart,
  selectUser,
  selectIsItemInCart,
} from '../../store/selector';
import {
  addItemToCart,
  removeItemFromCart,
} from '../../store/thunks/userThunk';
import { showSnackbar } from '../../store/slices/snackbarSlice';
import Key from '../../constants/key';

const MiniProductCard = ({ title, price, image, isCountable, itemId }) => {
  const { API_BASE_URL } = Key;
  const user = useSelector(selectUser);
  const cart = useSelector(selectCart);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  // Check if current item is in cart using memoized selector
  const isItemInCart = useSelector(state => selectIsItemInCart(state, itemId));

  // Function to handle add to cart
  const handleAddToCart = async () => {
     setIsLoading(true);
    try {
     
      const data = {
        itemId: itemId,
        quantity: 1,
        unit: isCountable ? 'PIECE' : 'KG',
      };

      const response = await dispatch(addItemToCart(data));

      if (addItemToCart.fulfilled.match(response)) {
        await dispatch(
          showSnackbar({
            message: 'Item added to cart successfully!',
            type: 'success',
            time: 3000,
          }),
        );
        } else {
        await dispatch(
          showSnackbar({
            message: response?.payload?.message || 'Failed to add item to cart',
            type: 'error',
            time: 5000,
          }),
        );
        }
    } catch (error) {
      await dispatch(
        showSnackbar({
          message: 'Error adding item to cart',
          type: 'error',
          time: 3000,
        }),
      );
     
       }
    finally{
         setIsLoading(false);
      }
  };

  // Function to handle remove from cart
  const handleRemoveFromCart = async () => {
    setIsLoading(true);
    try {
      
      const response = await dispatch(removeItemFromCart(itemId));

      if (removeItemFromCart.fulfilled.match(response)) {
        await dispatch(
          showSnackbar({
            message: 'Item removed from cart successfully!',
            type: 'success',
            time: 3000,
          }),
        );
        } else {
        await dispatch(
          showSnackbar({
            message:
              response?.payload?.message || 'Failed to remove item from cart',
            type: 'error',
            time: 5000,
          }),
        );
         }
    } catch (error) {
      await dispatch(
        showSnackbar({
          message: 'Error removing item from cart',
          type: 'error',
          time: 3000,
        }),
      );
      
    }finally{
         setIsLoading(false);
      }
  };
  // console.log('User in mini product card', user);
  // console.log('Cart in mini product card', cart);
  // console.log('Product in mini product card', title, price, image, isCountable);
  // console.log('Is item in cart:', isItemInCart);
  return (
    <View style={styles.card}>
      <Image
        source={
          image
            ? {
                uri: API_BASE_URL + image,
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
        {title || 'Product Title'}
      </Text>

      <Text style={styles.price}>
        {isCountable ? `₹ ${price} / piece` : `₹ ${price} / kg`}
      </Text>

      {/* Show different button based on whether item is in cart */}
      {isItemInCart ? (
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.cartButton, { backgroundColor: Colors.secondary }]}
          onPress={handleRemoveFromCart}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator
                size="small"
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.cartButtonText}>Loading</Text>
            </View>
          ) : (
            <Text style={styles.cartButtonText}>Remove Item</Text>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.cartButton, { backgroundColor: Colors.primary }]}
          onPress={handleAddToCart}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator
                size={15}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.cartButtonText}>Loading</Text>
            </View>
          ) : (
            <Text style={styles.cartButtonText}>Add to Cart</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MiniProductCard;

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
