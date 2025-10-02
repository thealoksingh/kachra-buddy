import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../styles/commonStyles';
import {
  ButtonWithLoader,
  CommonAppBar,
  InputBox,
  TextArea,
  OtpFields,
} from '../../components/commonComponents';
import ImagePreviewModal from '../../components/ImagePreviewModal';
import { useImagePicker } from '../../components/useImagePicker';
import ImagePickerSheet from '../../components/ImagePickerSheet';
import { LottieAlert } from '../../components/lottie/LottieAlert';
import MyStatusBar from '../../components/MyStatusBar';
import EditableOrderCard from '../../components/driverComponents/EditableOrderCard';
import ItemSelectionModal from '../../components/driverComponents/ItemSelectionModal';
import AdditionalItemCard from '../../components/driverComponents/AdditionalItemCard';
import { sendPickupOtpAPI } from '../../utils/api/driverApi';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateDriverOrder,
  fetchAllItems,
  addItemsToOrder,
} from '../../store/thunks/driverThunk';
import { selectDriverLoader, selectDriverItems } from '../../store/selector';
import { showSnackbar } from '../../store/slices/snackbarSlice';
import { showLottieAlert } from '../../store/slices/lottieAlertSlice';

const FinalPickupScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { currentOrder } = route.params || {};
  const loading = useSelector(selectDriverLoader);
  const availableItems = useSelector(selectDriverItems);
  const [otpLoading, setOtpLoading] = useState(false);

  const [givenAmount, setGivenAmount] = useState(null);
  const [remark, setRemark] = useState(null);
  const [images, setImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [updatedQuantities, setUpdatedQuantities] = useState({});
  const [additionalItems, setAdditionalItems] = useState([]);
  const [resendTimer, setResendTimer] = useState(0);
  console.log('currentOrder?.orderItems prev ====>', currentOrder?.orderItems);

  //removable in future
  const [fullImageModalVisible, setFullImageModalVisible] = useState(false);
  const [pickerSheetVisible, setPickerSheetVisible] = useState(false);

  const { openCamera, openGallery } = useImagePicker();

  React.useEffect(() => {
    dispatch(fetchAllItems());
  }, [dispatch]);

  // Timer effect for resend OTP
  React.useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(timer => timer - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const addAdditionalItem = (item, quantity) => {
    const newItem = {
      item,
      quantity: parseFloat(quantity),
      price: item.pricePerUnit * parseFloat(quantity),
    };
    setAdditionalItems(prev => [...prev, newItem]);
  };

  const removeAdditionalItem = index => {
    setAdditionalItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (orderItemId, newQuantity) => {
    const quantity = parseFloat(newQuantity);
    if (isNaN(quantity) || quantity < 0) {
      dispatch(showSnackbar({ message: 'Please enter a valid positive number', type: 'error' }));
      return;
    }
    setUpdatedQuantities(prev => ({
      ...prev,
      [orderItemId]: quantity,
    }));
  };

  const calculateTotalPrice = () => {
    const originalTotal =
      currentOrder?.orderItems?.reduce((total, orderItem) => {
        const quantity = updatedQuantities[orderItem.id] ?? orderItem.quantity;
        const price = (parseFloat(quantity) || 0) * (parseFloat(orderItem.item.pricePerUnit) || 0);
        return total + price;
      }, 0) || 0;

    const additionalTotal = additionalItems.reduce((total, item) => {
      const itemPrice = parseFloat(item.price) || 0;
      return total + itemPrice;
    }, 0);

    return originalTotal + additionalTotal;
  };

  const sendOtp = async () => {
    setOtpLoading(true);
    try {
      await sendPickupOtpAPI(currentOrder.id);
      dispatch(showSnackbar({ message: 'OTP sent successfully!', type: 'success' }));
      setOtpSent(true);
      setResendTimer(30); // Start 30-second timer
    } catch (error) {
      console.error('Error sending OTP:', error);
      dispatch(showLottieAlert({ type: 'failure', message: 'Failed to send OTP', autoClose: true }));
    } finally {
      setOtpLoading(false);
    }
  };

  const validateForm = () => {
    // Validate given amount
    if (!givenAmount || givenAmount.trim() === '') {
      dispatch(showSnackbar({ message: 'Please enter given amount', type: 'error' }));
      return false;
    }
    
    const amount = parseFloat(givenAmount);
    if (isNaN(amount) || amount < 0) {
      dispatch(showSnackbar({ message: 'Please enter a valid positive amount', type: 'error' }));
      return false;
    }

    // Validate remark
    if (!remark || remark.trim() === '') {
      dispatch(showSnackbar({ message: 'Please enter a remark', type: 'error' }));
      return false;
    }

    // Validate images
    if (images.length === 0) {
      dispatch(showSnackbar({ message: 'Please upload at least one image', type: 'error' }));
      return false;
    }

    // Validate OTP
    if (!otpInput || otpInput.trim() === '') {
      dispatch(showSnackbar({ message: 'Please enter OTP', type: 'error' }));
      return false;
    }

    // Validate quantities in original order items
    for (const orderItem of currentOrder?.orderItems || []) {
      const quantity = updatedQuantities[orderItem.id] ?? orderItem.quantity;
      const numQuantity = parseFloat(quantity);
      if (isNaN(numQuantity) || numQuantity < 0) {
        dispatch(showSnackbar({ message: `Invalid quantity for ${orderItem.item.name}`, type: 'error' }));
        return false;
      }
    }

    // Validate additional items quantities
    for (const item of additionalItems) {
      const numQuantity = parseFloat(item.quantity);
      if (isNaN(numQuantity) || numQuantity <= 0) {
        dispatch(showSnackbar({ message: `Invalid quantity for additional item ${item.item?.name || item.name}`, type: 'error' }));
        return false;
      }
    }

    return true;
  };

  const submitOrder = async () => {
    // console.log('Submitting order with OTP:', otpInput);
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    // Prepare updated order items with new quantities
    const updatedOrderItems = currentOrder.orderItems.map(orderItem => ({
      id: orderItem.id,
      itemId: orderItem.item.id,
      quantity: updatedQuantities[orderItem.id] ?? orderItem.quantity,
      price: (updatedQuantities[orderItem.id] ?? orderItem.quantity) * orderItem.item.pricePerUnit,
      unit: orderItem.unit
    }));

    console.log('Updated Order Items:', updatedOrderItems);
    console.log('Raw Additional Items:', additionalItems);

    // Prepare additional items in correct format
    let formattedAdditionalItems = [];
    console.log('Additionalitems before formattedAdditionalItems :',JSON.stringify( additionalItems,null,2));
    try {
      formattedAdditionalItems = additionalItems.map(item => ({
        itemId: item.id,
        quantity: item.quantity,
        price: item.price,
        unit: item.unit
      }));
      console.log('formattedAdditionalItems ==>:',JSON.stringify( formattedAdditionalItems,null,2));
    } catch (error) {
      console.log('ERROR formatting additional items:', error);
      console.log('Additional items causing error:', additionalItems);
      // Fallback: use empty array if formatting fails
      formattedAdditionalItems = [];
    }

    // Prepare order DTO matching API structure (without images, otp, postedBy)
    const orderDto = {
      id: currentOrder.id,
      orderItems: [...updatedOrderItems, ...formattedAdditionalItems],
      finalPrice: calculateTotalPrice(),
      givenAmount: parseFloat(givenAmount) || 0,
      remark: remark || '',
      
    };

    // Prepare API payload matching multipart/form-data structure
    const apiPayload = {
      orderId: currentOrder.id,
      orderJson: orderDto,
      postedBy: 'DRIVER',
      otp: otpInput,
      files: images // Array of image URIs
    };

    console.log('=== DEBUGGING ORDER SUBMISSION ===');
    console.log('Order DTO:', JSON.stringify(orderDto, null, 2));
    console.log('API Payload:', apiPayload);
    console.log('Total Items Count:', orderDto.orderItems.length);
    console.log('=== END DEBUG ===');

    const result = await dispatch(updateDriverOrder(apiPayload));

    if (updateDriverOrder.fulfilled.match(result)) {
      dispatch(showLottieAlert({ type: 'success', message:  'Order Picked up Successfully', autoClose: true }));
      setTimeout(() => {
        navigation.pop(2);
      }, 2000);
    } else {
      dispatch(showLottieAlert({ type: 'failure', message: result?.payload?.message || 'Operation Failed, Try Again', autoClose: true }));
    }
  };

  const pickImage = async source => {
    try {
      let result = null;

      if (source === 'camera') {
        result = await openCamera();
      } else {
        result = await openGallery();
      }

      console.log('📸 Picker result:', result);

      if (result?.uri) {
        if (images.length >= 3) return;
        setImages([...images, result.uri]);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    } finally {
      setPickerSheetVisible(false);
    }
  };

  const removeImage = index => {
    try {
      const updated = [...images];
      updated.splice(index, 1);
      setImages(updated);
    } catch (error) {
      console.log('Error removing image:', error);
    } finally {
      setPickerSheetVisible(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <CommonAppBar navigation={navigation} label="Pickup Order" />

      <View style={{ flex: 1, marginBottom: 20, marginHorizontal: 10 }}>
        <View style={{ padding: 0, margin: 12 }}>
          {currentOrder?.orderItems?.map((orderItem, idx) => (
            <EditableOrderCard
              key={orderItem.id || idx}
              price={orderItem.price}
               itemName={orderItem.item.name}
              quantity={orderItem.quantity}
              unit={orderItem.unit}
              orderItem={orderItem}
              onQuantityChange={newQuantity =>
                handleQuantityChange(orderItem.id, newQuantity)
              }
            />
          ))}
        </View>

        {/* dont remove we can use it in future */}
          {/* <View style={styles.formCard}>
          <Text style={styles.sectionLabel}>Additional Items (Optional)</Text>

          {additionalItems.map((item, index) => (
            <AdditionalItemCard
              key={index}
              item={item}
              onQuantityChange={(itemId, quantity) => {
                const newQuantity = parseFloat(quantity);
                if (isNaN(newQuantity) || newQuantity < 0) {
                  dispatch(showSnackbar({ message: 'Please enter a valid positive number', type: 'error' }));
                  return;
                }
                const updatedItems = [...additionalItems];
                const pricePerUnit = parseFloat(updatedItems[index].item?.pricePerUnit || updatedItems[index].pricePerUnit) || 0;
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
                currentOrderItems: currentOrder?.orderItems,
                onItemSelect: items => setAdditionalItems(items),
                })
            }
          >
            <Text style={styles.addItemText}>+ Add Items</Text>
          </TouchableOpacity> 
        </View>*/}

        <View style={styles.formCard}>
          <InputBox
            value={givenAmount}
            setter={setGivenAmount}
            placeholder={'Enter Given Amount'}
            label={'Given Amount'}
            optional={false}
            type={'phone-pad'}
          />

          <TextArea
            value={remark}
            setter={setRemark}
            placeholder={'Enter a Remark'}
            label={'Remark'}
            optional={false}
          />
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionLabel}>
            Upload Images (Max 3){' '}
            <Text style={{ color: Colors.secondary }}>*</Text>
          </Text>
          <View style={styles.imageRow}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageBox}>
                <TouchableOpacity
                  onPress={() => {
                    setPreviewImage(uri);
                    setFullImageModalVisible(true);
                  }}
                >
                  <Image source={{ uri }} style={styles.image} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeImage(index)}
                >
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            {images.length < 3 && (
              <TouchableOpacity
                style={[styles.imageBox, styles.addBox]}
                onPress={() => setPickerSheetVisible(true)}
              >
                <Text style={styles.addText}>＋</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>
            Total Price: ₹{(calculateTotalPrice() || 0).toFixed(2)}
          </Text>
        </View>
        {otpSent && !isVerified && (
          <View style={styles.formCard}>
            <Text style={styles.sectionLabel}>
             Enter the OTP sent from the Customer App (Order Details screen)
              <Text style={{ color: Colors.secondary }}>*</Text>
            </Text>
            <OtpFields otpInput={otpInput} setOtpInput={setOtpInput} />
            <TouchableOpacity 
              style={[styles.resendBtn, (resendTimer > 0 || otpLoading) && styles.disabledBtn]} 
              onPress={sendOtp}
              disabled={resendTimer > 0 || otpLoading}
            >
              <Text style={[styles.resendText, (resendTimer > 0 || otpLoading) && styles.disabledText]}>
                {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : 'Resend OTP'}
              </Text>
            </TouchableOpacity> 
          </View>
        )}
        <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
          {!otpSent && !isVerified && (
            <ButtonWithLoader
              name="Send OTP"
              loadingName="Sending OTP..."
              isLoading={otpLoading}
              method={sendOtp}
              color={Colors.secondary}
            />
          )}
          {otpSent && !isVerified && (
            <ButtonWithLoader
              name="Submit"
              loadingName="Submitting..."
              isLoading={loading}
              method={submitOrder}
            />
          )}
        </View>
      </View>

      {previewImage && (
        <ImagePreviewModal
          image={previewImage}
          visibility={fullImageModalVisible}
          setVisibility={setFullImageModalVisible}
        />
      )}

      <ImagePickerSheet
        visible={pickerSheetVisible}
        onClose={() => setPickerSheetVisible(false)}
        onCamera={() => pickImage('camera')}
        onGallery={() => pickImage('gallery')}
      />
      <LottieAlert />
    </ScrollView>
  );
};

export default FinalPickupScreen;
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
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  image: {
    width: 90,
    height: 90,
    resizeMode: 'cover',
    backgroundColor: 'lightgray',
    overflow: 'hidden',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBox: {
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    padding: 6,
  },
  removeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addBox: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 12,
  },
  addText: {
    fontSize: 30,
    color: Colors.primary,
    fontWeight: 'bold',
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
  itemName: {
    flex: 2,
    fontSize: 14,
    fontWeight: '500',
  },
  itemQuantity: {
    flex: 1,
    fontSize: 12,
    textAlign: 'center',
  },
  itemPrice: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  removeItemText: {
    color: Colors.redColor,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  resendBtn: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.darkBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginTop: 8,
  },
  resendText: {
    color: Colors.whiteColor,
    fontSize: 12,
    fontWeight: '500',
  },
  disabledBtn: {
    backgroundColor: Colors.grayColor,
  },
  disabledText: {
    color: Colors.extraLightGrayColor,
  },
});
