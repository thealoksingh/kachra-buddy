import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Colors } from '../../styles/commonStyles';
import { updateOrder } from '../../store/thunks/userThunk';
import { showSnackbar } from '../../store/slices/snackbarSlice';
import { showLottieAlert } from '../../store/slices/lottieAlertSlice';
import {
  ButtonWithLoader,
  CommonAppBar,
  FaddedIcon,
  InputBox,
  TextArea,
} from '../../components/commonComponents';
import ImagePreviewModal from '../../components/ImagePreviewModal';
import { useImagePicker } from '../../components/useImagePicker';
import ImagePickerSheet from '../../components/ImagePickerSheet';
import { LottieAlert } from '../../components/lottie/LottieAlert';
import DateTimePickerField from '../../components/userComponents/DateTimePickerField';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Get order data from navigation params
  const { orderData } = route.params || {};
  console.log('Order Data received:', orderData);

  const [dateTime, setDateTime] = useState(null);
  const [name, setName] = useState(orderData?.user?.fullName || '');
  // console.log("date time is ",dateTime);
  const [mobNumber, setMobNUmber] = useState(
    orderData?.user?.contactNumber || '',
  );
  const [address, setAddress] = useState(orderData?.orderPickupAddress || '');
  const [coordinate, setCoordinate] = useState({
    latitude: orderData?.orderPickupLatitude || 0,
    longitude: orderData?.orderPickupLongitude || 0,
  });

  const validateForm = () => {
    if (!name.trim()) {
      dispatch(showLottieAlert({ type: 'warning', message: 'Name is required', autoClose: true }));
      return false;
    }
    if (!mobNumber.trim()) {
      dispatch(showLottieAlert({ type: 'warning', message: 'Mobile number is required', autoClose: true }));
      return false;
    }
    if (mobNumber.length !== 10) {
      dispatch(showLottieAlert({ type: 'warning', message: 'Mobile number must be 10 digits', autoClose: true }));
      return false;
    }
    if (!address.trim()) {
      dispatch(showLottieAlert({ type: 'warning', message: 'Address is required', autoClose: true }));
      return false;
    }
    if (!coordinate?.latitude || !coordinate?.longitude || (coordinate.latitude === 0 && coordinate.longitude === 0)) {
      dispatch(showLottieAlert({ type: 'warning', message: 'Please pick location from map', autoClose: true }));
      return false;
    }
    if (!dateTime) {
      dispatch(showLottieAlert({ type: 'warning', message: 'Pickup date & time is required', autoClose: true }));
      return false;
    }
    if (images.length === 0) {
      dispatch(showLottieAlert({ type: 'warning', message: 'At least one image is required', autoClose: true }));
      return false;
    }
    return true;
  };

  // Handle submit method
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const updateData = {
        orderId: orderData?.id,
        orderData: {
          sellerName: name,
          sellerContactNo: mobNumber,
          pickupDate: dateTime,
          orderPickupAddress: address,
          orderPickupLatitude: coordinate?.latitude,
          orderPickupLongitude: coordinate?.longitude,
        },
        images: images,
        postedBy: 'USER',
      };

      console.log("payload at checkout  updateData.orderData ==>",updateData.orderData);

      const response = await dispatch(updateOrder(updateData));

      if (updateOrder.fulfilled.match(response)) {
        dispatch(showLottieAlert({ type: 'success', message: 'Pickup Requested successfully!', autoClose: true }));
        setTimeout(() => {
          navigation.replace("userBottomNavBar");
        }, 2500);
      } else {
        dispatch(showLottieAlert({ type: 'failure', message: response?.payload?.message || 'Oops!! Request Failed', autoClose: true }));
      }
    } catch (error) {
      dispatch(showLottieAlert({ type: 'failure', message: 'Error updating order', autoClose: true }));
    } finally {
      setLoading(false);
    }
  };
  
  const [images, setImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [fullImageModalVisible, setFullImageModalVisible] = useState(false);
  const [pickerSheetVisible, setPickerSheetVisible] = useState(false);

  const { openCamera, openGallery } = useImagePicker();

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
    <ScrollView style={{ flex: 1, backgroundColor: Colors.whiteColor ,}}>
      <CommonAppBar navigation={navigation} label="Add More Detail" />

      <View style={{ flex: 1, marginBottom: 20, marginHorizontal: 10 }}>
        <View style={styles.formCard}>
          <InputBox
            value={name}
            setter={setName}
            placeholder={'Enter Your Name'}
            label={'Name'}
            optional={false}
            type={'default'}
          />
          <InputBox
            value={mobNumber}
            setter={setMobNUmber}
            placeholder={'Enter Mobile Number'}
            label={'Mobile'}
            optional={false}
            type={'phone-pad'}
          />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('locationPickerScreen', {
                onLocationSelected: (address, coordinate) => {
                  setAddress(address);
                  setCoordinate(coordinate);
                },
              })
            }
            style={styles.outlinedBtn}
          >
            <Text style={{ color: Colors.secondary, fontWeight: '600' }}>
              Pick Location
            </Text>
          </TouchableOpacity>

          <TextArea
            value={address}
            setter={setAddress}
            placeholder={'Enter Address'}
            label={'Address'}
            optional={false}
          />
          <DateTimePickerField
            value={dateTime}
            onChange={newDate => setDateTime(newDate)}
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
        <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
          <ButtonWithLoader
            name="Submit"
            loadingName="Processing..."
            isLoading={loading}
            method={handleSubmit}
          />
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
      <FaddedIcon/>
    </ScrollView>
  );
};

export default CheckoutScreen;
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
  outlinedBtn: {
    borderColor: Colors.secondary,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: Colors.whiteColor,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
