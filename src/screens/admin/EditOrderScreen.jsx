import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import MyStatusBar from '../../components/MyStatusBar';
import { Colors } from '../../styles/commonStyles';
import { useNavigation, useRoute } from '@react-navigation/native';
import EditableOrderCardAdmin from '../../components/adminComponents/EditableOrderCardAdmin';
import {
  ButtonWithLoader,
  CommonAppBar,
  FaddedIcon,
} from '../../components/commonComponents';
import { showSnackbar } from '../../store/slices/snackbarSlice';
import { useDispatch } from 'react-redux';
import AdditionalItemCard from '../../components/driverComponents/AdditionalItemCard';
import { updateOrder } from '../../store/thunks/adminThunk';
import { showLottieAlert } from '../../store/slices/lottieAlertSlice';

const EditOrderScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const booking = route.params?.booking || {};
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [updatedQuantities, setUpdatedQuantities] = useState({});
  const [existingItems, setExistingItems] = useState(booking?.orderItems || []);
  const [additionalItems, setAdditionalItems] = useState([]);

  const submitOrder = async () => {
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    setLoading(true);

    // Prepare updated order items with new quantities
    const updatedOrderItems = existingItems.map(orderItem => ({
      id: orderItem.id,
      itemId: orderItem.item.id,
      quantity: updatedQuantities[orderItem.id] ?? orderItem.quantity,
      price:
        (updatedQuantities[orderItem.id] ?? orderItem.quantity) *
        orderItem.item.pricePerUnit,
      unit: orderItem.unit,
    }));

    //   console.log('Updated Order Items:', updatedOrderItems);
    //   console.log('Raw Additional Items:', additionalItems);

    // Prepare additional items i    // Prepare additional items in correct format
    let formattedAdditionalItems = [];
    //   console.log('Additionalitems before formattedAdditionalItems :',JSON.stringify( additionalItems,null,2));
    try {
      formattedAdditionalItems = additionalItems.map(item => ({
        itemId: item.id,
        quantity: item.quantity,
        price: item.price,
        unit: item.unit,
      }));
      // console.log('formattedAdditionalItems ==>:',JSON.stringify( formattedAdditionalItems,null,2));
    } catch (error) {
      //   console.log('ERROR formatting additional items:', error);
      //   console.log('Additional items causing error:', additionalItems);
      // Fallback: use empty array if formatting fails
      formattedAdditionalItems = [];
    }

    // Prepare order DTO matching API structure (without images, otp, postedBy)
    const orderDto = {
      id: booking.id,
      orderItems: [...updatedOrderItems, ...formattedAdditionalItems],
      finalPrice: calculateTotalPrice(),
      givenAmount: 0,
      remark: '',
    };

    // Prepare API payload matching multipart/form-data structure
    const apiPayload = {
      orderId: booking.id,
      orderJson: orderDto,
      postedBy: 'ADMIN',
      otp: null,
      images: [], // No images in this case
    };

    console.log('=== DEBUGGING ORDER SUBMISSION ===');
    console.log('Order DTO:', JSON.stringify(orderDto, null, 2));
    console.log('API Payload:', apiPayload);
    console.log('Total Items Count:', orderDto.orderItems.length);
    console.log('=== END DEBUG ===');

    try {
      const result = await dispatch(updateOrder(apiPayload));

      if (updateOrder.fulfilled.match(result)) {
        dispatch(
          showSnackbar({
            message: 'Order Updated Successfully',
            type: 'success',
          }),
        );
        setTimeout(() => {
          navigation.pop(1);
        }, 500);
      } else {
        dispatch(
          showSnackbar({
            message: result?.payload?.message || 'Operation Failed, Try Again',
            type: 'error',
          }),
        );
      }
    } finally {
      setLoading(false); // ✅ Always close loader
    }
  };

  const validateForm = () => {
    // Validate quantities in original order items
    for (const orderItem of booking?.orderItems || []) {
      const quantity = updatedQuantities[orderItem.id] ?? orderItem.quantity;
      const numQuantity = parseFloat(quantity);
      if (isNaN(numQuantity) || numQuantity < 0) {
        dispatch(
          showSnackbar({
            message: `Invalid quantity for ${orderItem.item.name}`,
            type: 'error',
          }),
        );
        return false;
      }
    }

    // Validate additional items quantities
    for (const item of additionalItems) {
      const numQuantity = parseFloat(item.quantity);
      if (isNaN(numQuantity) || numQuantity <= 0) {
        dispatch(
          showSnackbar({
            message: `Invalid quantity for additional item ${
              item.item?.name || item.name
            }`,
            type: 'error',
          }),
        );
        return false;
      }
    }

    return true;
  };
  const handleQuantityChange = (orderItemId, newQuantity) => {
    const quantity = parseFloat(newQuantity);
    if (isNaN(quantity) || quantity < 0) {
      dispatch(
        showSnackbar({
          message: 'Please enter a valid positive number',
          type: 'error',
        }),
      );
      return;
    }
    setUpdatedQuantities(prev => ({
      ...prev,
      [orderItemId]: quantity,
    }));
  };

  const calculateTotalPrice = () => {
    const originalTotal =
      existingItems?.reduce((total, orderItem) => {
        const quantity = updatedQuantities[orderItem.id] ?? orderItem.quantity;
        const price =
          (parseFloat(quantity) || 0) *
          (parseFloat(orderItem.item.pricePerUnit) || 0);
        return total + price;
      }, 0) || 0;

    const additionalTotal = additionalItems.reduce((total, item) => {
      const itemPrice = parseFloat(item.price) || 0;
      return total + itemPrice;
    }, 0);

    return originalTotal + additionalTotal;
  };

  const removeAdditionalItem = index => {
    setAdditionalItems(prev => prev.filter((_, i) => i !== index));
  };
  const removeExistingItem = index => {
    setExistingItems(prev => prev.filter((_, i) => i !== index));
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <CommonAppBar navigation={navigation} label="Edit Order" />
      <View style={{ flex: 1, marginBottom: 20, marginHorizontal: 10 }}>
        <View style={{ padding: 0, margin: 12 }}>
          {existingItems?.map((orderItem, idx) => (
            <EditableOrderCardAdmin
              key={orderItem.id || idx}
              price={orderItem.price}
              itemName={orderItem.item.name}
              quantity={orderItem.quantity}
              unit={orderItem.unit}
              orderItem={orderItem}
              onQuantityChange={newQuantity =>
                handleQuantityChange(orderItem.id, newQuantity)
              }
              onRemove={() => removeExistingItem(idx)}
            />
          ))}
        </View>
        <View style={styles.formCard}>
          <Text style={styles.sectionLabel}>Additional Items (Optional)</Text>

          {additionalItems.map((item, index) => (
            <AdditionalItemCard
              key={index}
              item={item}
              onQuantityChange={(itemId, quantity) => {
                const newQuantity = parseFloat(quantity);
                if (isNaN(newQuantity) || newQuantity < 0) {
                  dispatch(
                    showSnackbar({
                      message: 'Please enter a valid positive number',
                      type: 'error',
                    }),
                  );
                  return;
                }
                const updatedItems = [...additionalItems];
                const pricePerUnit =
                  parseFloat(
                    updatedItems[index].item?.pricePerUnit ||
                      updatedItems[index].pricePerUnit,
                  ) || 0;
                updatedItems[index] = {
                  ...updatedItems[index],
                  quantity: newQuantity,
                  price: newQuantity * pricePerUnit,
                };
                setAdditionalItems(updatedItems);
              }}
              onRemove={() => removeAdditionalItem(index)}
            />
          ))}
          <TouchableOpacity
            style={styles.addItemBtn}
            onPress={() =>
              navigation.navigate('selectAdditionalItemScreen', {
                currentOrderItems: booking?.orderItems,
                onItemSelect: items => setAdditionalItems(items),
              })
            }
          >
            <Text style={styles.addItemText}>+ Add Items</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>
            Total Price: ₹{(calculateTotalPrice() || 0).toFixed(2)}
          </Text>
        </View>
        <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
          <ButtonWithLoader
            name="Submit"
            loadingName="Submitting..."
            isLoading={loading}
            method={submitOrder}
          />
        </View>
      </View>
      <FaddedIcon />
    </ScrollView>
  );
};

export default EditOrderScreen;

const styles = StyleSheet.create({
  formCard: {
    margin: 12,
    padding: 16,
    backgroundColor: Colors.whiteColor,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
    color: Colors.primary,
  },
  addItemBtn: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  addItemText: {
    color: Colors.whiteColor,
    fontWeight: '600',
  },
  additionalItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: Colors.extraLightGrayColor,
    borderRadius: 8,
    marginBottom: 5,
  },
  priceCard: {
    margin: 12,
    padding: 16,
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.blackColor,
  },
});
