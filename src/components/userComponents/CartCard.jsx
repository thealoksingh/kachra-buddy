import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Colors, screenWidth, textStyles } from '../../styles/commonStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Key from '../../constants/key';
import { useDispatch } from 'react-redux';
import { removeItemFromCart } from '../../store/thunks/userThunk';
import { showSnackbar } from '../../store/slices/snackbarSlice';

const CartCard = ({ cartItem, user }) => {
  const [quantity, setQuantity] = useState(cartItem?.quantity?.toString() || '');
  const {API_BASE_URL} = Key;
  const dispatch = useDispatch();
  
  const handleRemoveItem = async () => {
    try {
      const response = await dispatch(removeItemFromCart(cartItem?.item?.id));
      
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
            message: response?.payload?.message || 'Failed to remove item from cart',
            type: 'error',
            time: 5000,
          }),
        );
      }
    } catch (error) {
      await dispatch(
        showSnackbar({ message: 'Error removing item from cart', type: 'error', time: 3000 }),
      );
    }
  };

  return (
    <View style={styles.card}>
       <TouchableOpacity style={styles.deleteBtn} onPress={handleRemoveItem}>
        <MaterialIcons name="delete" size={20} color={Colors.secondary} />
      </TouchableOpacity>

      <Image
        source={{
          uri: API_BASE_URL+cartItem?.item?.imageUrl || 'https://images.unsplash.com/photo-1722695510527-cc033e43be1b?q=80&w=1170&auto=format&fit=crop',
          headers: { Authorization: `Bearer ${user?.accessToken}` },
        }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Details Section */}
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <Text style={styles.title} numberOfLines={1}>
          {cartItem?.item?.name || 'Product Title'}
        </Text>
        <Text style={styles.rate}>
          ₹{cartItem?.item?.pricePerUnit} / {cartItem?.item?.unit?.toLowerCase()}
        </Text>

        <Text style={styles.price}>
          Total: ₹{cartItem?.price}
        </Text>

        {/* Input for quantity */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>
            {cartItem?.item?.countable ? 'Qty:' : 'Weight (Kg):'}
          </Text>
          <TextInput
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            placeholder="0"
            style={styles.input}
          />
          <Text style={styles.unit}>{cartItem?.unit}</Text>
        </View>
      </View>
    </View>
  );
};

export default CartCard;

const styles = StyleSheet.create({
  card: {
    padding: 12,
    flexDirection: 'row',
    gap: 10,
    width: screenWidth - 20,
    height: 150,
    backgroundColor:Colors.whiteColor,
    borderRadius: 8,
    marginTop: 10,
    position: 'relative',
    shadowColor: '#424141ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  deleteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    padding: 4,
  },
  image: {
    height: '100%',
    width: 120,
    borderRadius: 8,
  },
  title: {
    ...textStyles.smallBold,
    color: '#222',
  },

  rate: {
    fontSize: 12,
    color: Colors.primaryColor,
    marginVertical: 1,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  label: {
    fontSize: 12,
    marginRight: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 10,
    height: 38,
    flex: 1,
    backgroundColor: '#fafafa',
  },
  price: {
    fontSize: 14,
    color: Colors.blackColor,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  unit: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
});
