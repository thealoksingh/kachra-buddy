import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { CommonAppBar } from '../../components/commonComponents';
import CartCard from "../../components/userComponents/CartCard";
import { Colors, Fonts } from '../../styles/commonStyles';
import { ButtonWithLoader } from '../../components/commonComponents';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { selectCart, selectUser } from '../../store/selector';
import { checkoutCart } from '../../store/thunks/userThunk';
import { showSnackbar } from '../../store/slices/snackbarSlice';

const Cart = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectUser);
  const cart = useSelector(selectCart);
  const dispatch = useDispatch();

  // Calculate totals dynamically based on current quantities
  const [cartQuantities, setCartQuantities] = useState({});
  
  const calculateItemPrice = (item) => {
    const currentQuantity = cartQuantities[item.item.id] || item.quantity;
    return currentQuantity * item.item.pricePerUnit;
  };
  
  const subtotal = cart?.cartItems?.reduce((sum, item) => sum + calculateItemPrice(item), 0) || 0;
  const gstRate = 0.18; // 18% GST
  const gstAmount = subtotal * gstRate;
  const total = subtotal + gstAmount;
  
  const handleQuantityChange = (itemId, newQuantity) => {
    setCartQuantities(prev => ({
      ...prev,
      [itemId]: parseFloat(newQuantity) || 0
    }));
  };

  // Handle checkout method
  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await dispatch(checkoutCart());
      
      if (checkoutCart.fulfilled.match(response)) {
        await dispatch(
          showSnackbar({
            message: 'Order created successfully!',
            type: 'success',
            time: 3000,
          }),
        );
        // Navigate with order data
        navigation.navigate('checkoutScreen', { orderData: response?.payload?.data });
        console.log("Order Data at card sending to:", response?.payload?.data);
      } else {
        await dispatch(
          showSnackbar({
            message: response?.payload?.message || 'Failed to create order',
            type: 'error',
            time: 5000,
          }),
        );
      }
    } catch (error) {
      await dispatch(
        showSnackbar({ message: 'Error creating order', type: 'error', time: 3000 }),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CommonAppBar navigation={navigation} label={'Cart'} />

      {/* Cart Items */}
      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        <View style={styles.itemsContainer}>
          {cart?.cartItems?.map((item, index) => (
            <CartCard 
              key={index} 
              cartItem={item} 
              user={user}
              onQuantityChange={handleQuantityChange}
              currentQuantity={cartQuantities[item.item.id] || item.quantity}
            />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        <View style={styles.calculationContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>₹{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>GST (18%)</Text>
            <Text style={styles.value}>₹{gstAmount.toFixed(2)}</Text>
          </View>
          <View style={[styles.row, { marginTop: 8 }]}>
            <Text style={[styles.label, { fontFamily: Fonts.bold }]}>Total</Text>
            <Text style={[styles.value, { fontFamily: Fonts.bold }]}>₹{total.toFixed(2)}</Text>
          </View>
        </View>

        <ButtonWithLoader
          name="Continue"
          loadingName="Processing..."
          isLoading={loading}
          method={handleCheckout}
        />
      </View>
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  itemsContainer: {
    flexDirection: "column",
    alignItems: "center",
    paddingBottom:10,
    justifyContent: "center",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.whiteColor,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  calculationContainer: {
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  label: {
    fontSize: 12,
    color: "#555",
  },
  value: {
    fontSize: 12,
    color: "#111",
  },
});
