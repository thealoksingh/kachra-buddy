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

const FinalPickupScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { currentOrder } = route.params || {};
  const loading = useSelector(selectDriverLoader);
  const availableItems = useSelector(selectDriverItems);
  const [otpLoading, setOtpLoading] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);
  const [succesAlertVisible, setSuccessAlertVisible] = useState(false);
  const [givenAmount, setGivenAmount] = useState(null);
  const [remark, setRemark] = useState(null);
  const [images, setImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [updatedQuantities, setUpdatedQuantities] = useState({});
  const [additionalItems, setAdditionalItems] = useState([
    {
      id: 1,
      name: 'Plastic Bottles',
      category: 'Plastic',
      price: 5,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1572776685600-aca8c3456337?w=150',
      quantity: 0
    },
    {
      id: 2,
      name: 'Metal Cans',
      category: 'Metal', 
      price: 15,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150',
      quantity: 0
    }
  ]);


  //removable in future
  const [fullImageModalVisible, setFullImageModalVisible] = useState(false);
  const [pickerSheetVisible, setPickerSheetVisible] = useState(false);

  const { openCamera, openGallery } = useImagePicker();

  React.useEffect(() => {
    dispatch(fetchAllItems());
  }, [dispatch]);

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
    setUpdatedQuantities(prev => ({
      ...prev,
      [orderItemId]: parseFloat(newQuantity) || 0,
    }));
  };

  const calculateTotalPrice = () => {
    const originalTotal =
      currentOrder?.orderItems?.reduce((total, orderItem) => {
        const quantity = updatedQuantities[orderItem.id] ?? orderItem.quantity;
        return total + quantity * orderItem.item.pricePerUnit;
      }, 0) || 0;

    const additionalTotal = additionalItems.reduce((total, item) => {
      return total + item.price;
    }, 0);

    return originalTotal + additionalTotal;
  };

  const sendOtp = async () => {
    setOtpLoading(true);
    try {
      await sendPickupOtpAPI(currentOrder.id);
      setOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
      setFailureAlertVisible(true);
    } finally {
      setOtpLoading(false);
    }
  };

  const submitOrder = async () => {
    const updatedOrderItems = currentOrder.orderItems.map(item => ({
      ...item,
      quantity: updatedQuantities[item.id] ?? item.quantity,
    }));

    // Add additional items if any
    if (additionalItems.length > 0) {
      await dispatch(
        addItemsToOrder({
          orderId: currentOrder.id,
          items: additionalItems,
        }),
      );
    }

    const orderData = {
      orderItems: [...updatedOrderItems, ...additionalItems],
      finalPrice: calculateTotalPrice(),
      remark: remark,
    };

    const result = await dispatch(
      updateDriverOrder({
        orderId: currentOrder.id,
        orderData,
        postedBy: 'DRIVER',
        otp: otpInput,
        images,
      }),
    );

    if (updateDriverOrder.fulfilled.match(result)) {
      setSuccessAlertVisible(true);
      setTimeout(() => {
        navigation.pop(2); // Go back 2 steps
      }, 2000);
    } else {
      setFailureAlertVisible(true);
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
              type={orderItem.item.countable ? 'countable' : 'weighable'}
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

        <View style={styles.formCard}>
          <Text style={styles.sectionLabel}>Additional Items</Text>
       
          {additionalItems.map((item, index) => (
            <AdditionalItemCard
              key={index}
              item={item}
              onQuantityChange={(itemId, quantity) => {
                const updatedItems = [...additionalItems];
                updatedItems[index] = { ...updatedItems[index], quantity: parseFloat(quantity) || 0 };
                setAdditionalItems(updatedItems);
              }}
              onRemove={() => removeAdditionalItem(index)}
            />
          ))}
          <TouchableOpacity
            style={styles.addItemBtn}
              onPress={() =>
              navigation.navigate('selectAdditionalItemScreen', {
                
                onItemSelect: items => setAdditionalItems(items),
              })
            }
          >
            <Text style={styles.addItemText}>+ Add Items</Text>
          </TouchableOpacity>
        </View>

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
            Total Price: ₹{calculateTotalPrice().toFixed(2)}
          </Text>
        </View>
        {otpSent && !isVerified && (
          <View style={styles.formCard}>
            <Text style={styles.sectionLabel}>
              Enter OTP sent to Customer mobile number
              <Text style={{ color: Colors.secondary }}>*</Text>
            </Text>
            <OtpFields otpInput={otpInput} setOtpInput={setOtpInput} />
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
      {succesAlertVisible && (
        <LottieAlert
          type="success"
          message="Order Updated Successfully"
          loop={false}
          onClose={() => {
            setSuccessAlertVisible(false);
          }}
          autoClose={true}
        />
      )}
      {failureAlertVisible && (
        <LottieAlert
          type="failure"
          message="Operation Failed, Try Again"
          loop={false}
          onClose={() => {
            setFailureAlertVisible(false);
          }}
          autoClose={true}
        />
      )}

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
});
